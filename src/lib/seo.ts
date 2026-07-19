import type { Pond } from "@/data/ponds";
import { absoluteUrl, canonicalUrl, siteUrl } from "./site";

export const SITE_NAME = "Fishno — рыбные места Московской области";
export const CONTENT_LAST_MODIFIED = "2026-07-19";

export type BreadcrumbItem = {
  name: string;
  path: string;
};

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: canonicalUrl(item.path)
    }))
  };
}

export function pondListJsonLd(
  name: string,
  path: string,
  ponds: Pond[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    url: canonicalUrl(path),
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: canonicalUrl()
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: ponds.length,
      itemListElement: ponds.map((pond, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: pond.name,
        url: canonicalUrl(`/ponds/${pond.slug}`)
      }))
    }
  };
}

export function pondJsonLd(pond: Pond) {
  const image = pond.images[0] ?? "/images/placeholders/pond-1.svg";

  return {
    "@context": "https://schema.org",
    "@type": "Place",
    name: pond.name,
    description: pond.description,
    url: canonicalUrl(`/ponds/${pond.slug}`),
    image: absoluteUrl(image),
    telephone: pond.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: pond.address,
      addressRegion: "Московская область",
      addressCountry: "RU"
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: pond.coordinates[0],
      longitude: pond.coordinates[1]
    },
    hasMap: pond.mapUrl,
    ...(pond.websiteUrl ? { sameAs: [pond.websiteUrl] } : {}),
    mainEntityOfPage: canonicalUrl(`/ponds/${pond.slug}`)
  };
}

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  name: SITE_NAME,
  alternateName: "Fishno",
  url: canonicalUrl(),
  inLanguage: "ru-RU",
  description:
    "Независимый каталог платных водоёмов и рыбных мест Московской области."
};

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${siteUrl}/#organization`,
  name: "Fishno",
  url: canonicalUrl(),
  email: "ivan@blshv.ru"
};
