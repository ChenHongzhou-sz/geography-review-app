const absoluteUrlPattern = /^(?:[a-z][a-z\d+\-.]*:)?\/\//i;

export function resolvePublicAsset(assetPath?: string) {
  if (!assetPath) {
    return undefined;
  }

  if (absoluteUrlPattern.test(assetPath) || assetPath.startsWith("data:")) {
    return assetPath;
  }

  const baseUrl = import.meta.env.BASE_URL || "/";
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  const normalizedPath = assetPath.replace(/^\/+/, "");

  return `${normalizedBase}${normalizedPath}`;
}
