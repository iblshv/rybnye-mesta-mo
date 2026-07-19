export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://fishno.ru";

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

export function canonicalUrl(path = "") {
  if (!path || path === "/") {
    return `${siteUrl}/`;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl}${normalizedPath.endsWith("/") ? normalizedPath : `${normalizedPath}/`}`;
}
