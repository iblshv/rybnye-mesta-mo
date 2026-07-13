export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://iblshv.github.io/rybnye-mesta-mo";

export function withBasePath(path: string) {
  if (!path.startsWith("/")) {
    return path;
  }

  return `${basePath}${path}`;
}

export function absoluteUrl(path = "") {
  if (!path) {
    return siteUrl;
  }

  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
