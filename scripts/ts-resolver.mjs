const NEXT_SUBPATH_MAP = new Map([
  ["next/server", "next/server.js"],
  ["next/experimental/testing/server", "next/experimental/testing/server.js"],
]);

export async function resolve(specifier, context, nextResolve) {
  if (NEXT_SUBPATH_MAP.has(specifier)) {
    return nextResolve(NEXT_SUBPATH_MAP.get(specifier), context);
  }
  const parentURL = context.parentURL ?? "";
  const isFromNodeModules = parentURL.includes("/node_modules/");
  if (!isFromNodeModules && (specifier.startsWith("./") || specifier.startsWith("../"))) {
    const hasExtension = specifier.endsWith(".ts") || specifier.endsWith(".js") || specifier.endsWith(".mjs") || specifier.endsWith(".cjs") || specifier.endsWith(".json");
    if (!hasExtension) {
      try {
        return await nextResolve(`${specifier}.ts`, context);
      } catch {
        return nextResolve(specifier, context);
      }
    }
  }
  return nextResolve(specifier, context);
}
