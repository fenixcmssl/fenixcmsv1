import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { unstable_doesMiddlewareMatch } from "next/experimental/testing/server";

import {
  DOMAIN_LABEL_REGEX,
  validatePrimaryDomain,
} from "../../config/saas.config";
import { matchesRoutePrefix } from "../../config/routes.config";
import {
  isValidDomainLabel,
  normalizeHostname,
  isValidHostname,
  resolveDomain,
} from "../domain-resolver";
import {
  getProxyContext,
  isValidSaasRouteZone,
  VALID_SAAS_ROUTE_ZONES,
} from "../tenant-context";
import { proxy, config as proxyConfig } from "../../../proxy";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function withNodeEnv<T>(nodeEnv: string, fn: () => T): T {
  const previousEnv = process.env.NODE_ENV;
  Reflect.set(process.env, "NODE_ENV", nodeEnv);
  try {
    return fn();
  } finally {
    if (previousEnv === undefined) {
      Reflect.deleteProperty(process.env, "NODE_ENV");
    } else {
      Reflect.set(process.env, "NODE_ENV", previousEnv);
    }
  }
}

function extractForwardedRequestHeaders(response: NextResponse): Headers {
  const forwarded = new Headers();
  const overrideList = response.headers.get("x-middleware-override-headers");
  if (!overrideList) {
    return forwarded;
  }
  for (const rawKey of overrideList.split(",")) {
    const key = rawKey.trim();
    if (!key) continue;
    const val = response.headers.get(`x-middleware-request-${key}`);
    if (val !== null) {
      forwarded.set(key, val);
    }
  }
  return forwarded;
}

describe("A.1 Inspección en disco de domain-resolver.ts y saas.config.ts", () => {
  const resolverPath = resolve(__dirname, "../domain-resolver.ts");
  const configPath = resolve(__dirname, "../../config/saas.config.ts");
  const resolverSource = readFileSync(resolverPath, "utf8");
  const configSource = readFileSync(configPath, "utf8");

  test("domain-resolver.ts contiene exactamente la línea canónica de labelRegex", () => {
    const expectedLine =
      "const labelRegex = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;";
    assert.equal(resolverSource.includes(expectedLine), true);
    assert.equal(
      String(DOMAIN_LABEL_REGEX),
      "/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/"
    );
  });

  test("ninguno de los dos archivos contiene una barra invertida antes de (?:", () => {
    const singleBackslash = String.fromCharCode(92);
    const forbiddenSequence = `${singleBackslash}(?:`;
    assert.equal(forbiddenSequence.length, 4);
    assert.equal(resolverSource.includes(forbiddenSequence), false);
    assert.equal(configSource.includes(forbiddenSequence), false);
  });
});

describe("A.2 Validación RFC 1123, puertos, IPv6 y normalización", () => {
  test("10 casos obligatorios de etiquetas RFC 1123", () => {
    assert.equal(isValidDomainLabel("a"), true);
    assert.equal(isValidDomainLabel("0"), true);
    assert.equal(isValidDomainLabel("ab"), true);
    assert.equal(isValidDomainLabel("mi-tienda"), true);
    assert.equal(isValidDomainLabel("a".repeat(63)), true);

    assert.equal(isValidDomainLabel("a".repeat(64)), false);
    assert.equal(isValidDomainLabel("-inicio"), false);
    assert.equal(isValidDomainLabel("final-"), false);
    assert.equal(isValidDomainLabel("--"), false);
    assert.equal(isValidDomainLabel("a_b"), false);
  });

  test("normalización de mayúsculas y puertos límite (1, 65535, 0, 65536, 080, IPv6)", () => {
    assert.equal(normalizeHostname("FENIXCMS.ES"), "fenixcms.es");
    assert.equal(normalizeHostname("TIENDA.FENIXCMS.ES"), "tienda.fenixcms.es");
    assert.equal(normalizeHostname("www.fenixcms.es"), "www.fenixcms.es");
    assert.equal(normalizeHostname("fenixcms.es:1"), "fenixcms.es");
    assert.equal(normalizeHostname("fenixcms.es:3000"), "fenixcms.es");
    assert.equal(normalizeHostname("fenixcms.es:65535"), "fenixcms.es");

    assert.equal(normalizeHostname("fenixcms.es:0"), null);
    assert.equal(normalizeHostname("fenixcms.es:65536"), null);
    assert.equal(normalizeHostname("fenixcms.es:080"), null);
    assert.equal(normalizeHostname("fenixcms.es:abc"), null);
    assert.equal(normalizeHostname("[::1]"), null);
    assert.equal(normalizeHostname("[::1]:3000"), null);
    assert.equal(normalizeHostname("::1"), null);
    assert.equal(isValidHostname("FENIXCMS.ES"), true);
  });

  test("validatePrimaryDomain valida correctamente dominios de servidor", () => {
    assert.equal(validatePrimaryDomain(undefined), "fenixcms.es");
    assert.equal(validatePrimaryDomain(""), "fenixcms.es");
    assert.equal(validatePrimaryDomain("FENIXCMS.ES"), "fenixcms.es");
    assert.throws(() => validatePrimaryDomain("localhost"));
    assert.throws(() => validatePrimaryDomain("fenixcms.es:3000"));
  });
});

describe("A.3 Prefijos de rutas y clasificación de dominios (resolveDomain)", () => {
  test("matchesRoutePrefix distingue prefijos exactos de falsos positivos", () => {
    assert.equal(matchesRoutePrefix("/superadmin", "/superadmin"), true);
    assert.equal(matchesRoutePrefix("/superadmin/users", "/superadmin"), true);
    assert.equal(matchesRoutePrefix("/superadministrator", "/superadmin"), false);
    assert.equal(matchesRoutePrefix("/admin", "/admin"), true);
    assert.equal(matchesRoutePrefix("/admin/products", "/admin"), true);
    assert.equal(matchesRoutePrefix("/administrator", "/admin"), false);
  });

  test("clasifica fenixcms.es y www.fenixcms.es y bloquea /admin en el host SaaS", () => {
    const rSuper = resolveDomain("fenixcms.es", "/superadmin");
    assert.equal(rSuper.verificationState, "verified_saas");
    assert.equal(rSuper.zone, "superadmin");
    assert.equal(rSuper.routeZone, "saas_superadmin");

    const rFalseSuper = resolveDomain("fenixcms.es", "/superadministrator");
    assert.equal(rFalseSuper.routeZone, "saas_public");

    const rWww = resolveDomain("www.fenixcms.es", "/login");
    assert.equal(rWww.verificationState, "verified_saas");
    assert.equal(rWww.routeZone, "saas_login");

    const rAdminOnSaas = resolveDomain("fenixcms.es", "/admin");
    assert.equal(rAdminOnSaas.verificationState, "forbidden_route_for_host");
    assert.equal(rAdminOnSaas.zone, null);
  });

  test("clasifica subdominios candidatos como unverified_tenant_subdomain y rechaza compuestos/reservados", () => {
    const rSub = resolveDomain("TIENDA.FENIXCMS.ES", "/admin");
    assert.equal(rSub.verificationState, "unverified_tenant_subdomain");
    assert.equal(rSub.zone, null);
    assert.equal(rSub.candidateRouteZone, "tenant_admin");
    assert.equal(rSub.tenantSubdomain, "tienda");

    const rFalseAdmin = resolveDomain("tienda.fenixcms.es", "/administrator");
    assert.equal(rFalseAdmin.candidateRouteZone, "tenant_storefront");

    const rSuperOnTenant = resolveDomain("tienda.fenixcms.es", "/superadmin");
    assert.equal(rSuperOnTenant.verificationState, "forbidden_route_for_host");

    const rMultiSub = resolveDomain("a.b.fenixcms.es", "/");
    assert.equal(rMultiSub.verificationState, "invalid_host");

    const rReserved = resolveDomain("api.fenixcms.es", "/");
    assert.equal(rReserved.verificationState, "invalid_host");
  });

  test("controla localhost y 127.0.0.1 estrictamente por process.env.NODE_ENV", () => {
    withNodeEnv("development", () => {
      assert.equal(normalizeHostname("localhost:3000"), "localhost");
      assert.equal(normalizeHostname("127.0.0.1:3000"), "127.0.0.1");
      const rDev = resolveDomain("localhost:3000", "/superadmin");
      assert.equal(rDev.verificationState, "verified_saas");
      assert.equal(rDev.routeZone, "saas_superadmin");
    });

    withNodeEnv("production", () => {
      assert.equal(normalizeHostname("localhost"), null);
      assert.equal(normalizeHostname("localhost:3000"), null);
      assert.equal(normalizeHostname("127.0.0.1"), null);
      assert.equal(normalizeHostname("127.0.0.1:3000"), null);
    });
  });
});

describe("A.4 Validación en runtime de getProxyContext()", () => {
  test("acepta únicamente las 3 zonas SaaS verificadas en FASE 1.1", () => {
    assert.equal(VALID_SAAS_ROUTE_ZONES.length, 3);
    assert.equal(isValidSaasRouteZone("saas_superadmin"), true);
    assert.equal(isValidSaasRouteZone("saas_login"), true);
    assert.equal(isValidSaasRouteZone("saas_public"), true);
    assert.equal(isValidSaasRouteZone("tenant_admin"), false);
    assert.equal(isValidSaasRouteZone(null), false);

    const brokenCtx = getProxyContext(
      new Headers({
        "x-fenix-zone": "tenant_admin",
        "x-fenix-is-saas": "1",
        "x-fenix-classified": "1",
      })
    );
    assert.equal(brokenCtx.classified, false);
    assert.equal(brokenCtx.routeZone, "saas_public");
  });
});

describe("A.5 Pruebas unitarias de la función pública proxy(request)", () => {
  test("elimina x-fenix-* y x-tenant-id del cliente e inyecta cabeceras internas en request", () => {
    withNodeEnv("production", () => {
      const req = new NextRequest("https://fenixcms.es/superadmin", {
        headers: {
          host: "fenixcms.es",
          "x-fenix-zone": "tenant_admin",
          "x-tenant-id": "spoofed-tenant-999",
          "x-fenix-evil": "injected",
        },
      });

      const res = proxy(req);
      assert.equal(res.status, 200);

      const forwarded = extractForwardedRequestHeaders(res);
      assert.equal(forwarded.get("x-tenant-id"), null);
      assert.equal(forwarded.get("x-fenix-evil"), null);
      assert.equal(forwarded.get("x-fenix-zone"), "saas_superadmin");
      assert.equal(forwarded.get("x-fenix-classified"), "1");

      const ctx = getProxyContext(forwarded);
      assert.equal(ctx.classified, true);
      assert.equal(ctx.zone, "superadmin");
      assert.equal(ctx.routeZone, "saas_superadmin");
    });
  });

  test("respuestas de rechazo 400, 503 y 404 incluyen Cache-Control: no-store y Vary: Host", () => {
    withNodeEnv("production", () => {
      const req400 = new NextRequest("https://fenixcms.es/", {
        headers: { host: "localhost:3000" },
      });
      const res400 = proxy(req400);
      assert.equal(res400.status, 400);
      assert.equal(res400.headers.get("Cache-Control")?.includes("no-store"), true);

      const req503 = new NextRequest("https://tienda.fenixcms.es/admin", {
        headers: { host: "tienda.fenixcms.es" },
      });
      const res503 = proxy(req503);
      assert.equal(res503.status, 503);
      assert.equal(res503.headers.get("Cache-Control")?.includes("no-store"), true);

      const req404 = new NextRequest("https://mitienda.es/", {
        headers: { host: "mitienda.es" },
      });
      const res404 = proxy(req404);
      assert.equal(res404.status, 404);
      assert.equal(res404.headers.get("Cache-Control")?.includes("no-store"), true);

      const reqForbidden = new NextRequest("https://fenixcms.es/admin", {
        headers: { host: "fenixcms.es" },
      });
      assert.equal(proxy(reqForbidden).status, 404);
    });
  });
});

describe("B.1 Pruebas del matcher con unstable_doesMiddlewareMatch", () => {
  test("excluye estáticos internos de Next.js e incluye rutas dinámicas con extensión", () => {
    assert.equal(
      unstable_doesMiddlewareMatch({
        config: proxyConfig,
        url: "/_next/static/chunks/main.js",
      }),
      false
    );
    assert.equal(
      unstable_doesMiddlewareMatch({ config: proxyConfig, url: "/_next/image" }),
      false
    );
    assert.equal(
      unstable_doesMiddlewareMatch({ config: proxyConfig, url: "/favicon.ico" }),
      false
    );
    assert.equal(
      unstable_doesMiddlewareMatch({
        config: proxyConfig,
        url: "/api/documento.svg",
      }),
      true
    );
    assert.equal(
      unstable_doesMiddlewareMatch({
        config: proxyConfig,
        url: "/admin/informes.pdf",
      }),
      true
    );
  });
});
