-- 1. Habilitar bypass de RLS para insercion administrativa de prueba
SET app.bypass_rls = 'on';

-- 2. Insercion del Tenant principal
INSERT INTO "public"."tenants" (
  "id",
  "name",
  "slug",
  "subdomain",
  "status",
  "planTier",
  "activeModules",
  "defaultLocale",
  "supportedLocales",
  "createdAt",
  "updatedAt"
) VALUES (
  'c0a80101-0001-4000-8000-000000000001',
  'Fenix Store Demo',
  'fenix-demo',
  'demo',
  'active',
  'starter',
  ARRAY['core', 'ecommerce']::text[],
  'es',
  ARRAY['es']::text[],
  NOW(),
  NOW()
) ON CONFLICT ("slug") DO UPDATE SET "name" = EXCLUDED."name";

-- 3. Insercion del dominio 'localhost' asociado al Tenant
INSERT INTO "public"."tenant_domains" (
  "id",
  "domain",
  "isPrimary",
  "isVerified",
  "sslActive",
  "tenantId",
  "createdAt",
  "updatedAt"
) VALUES (
  'd0a80101-0001-4000-8000-000000000002',
  'localhost',
  true,
  true,
  false,
  'c0a80101-0001-4000-8000-000000000001',
  NOW(),
  NOW()
) ON CONFLICT ("domain") DO NOTHING;