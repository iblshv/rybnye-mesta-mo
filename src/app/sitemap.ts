import type { MetadataRoute } from "next";
import { distanceSeoPages, fishSeoPages, featureSeoPages } from "@/data/seo-pages";
import { getPublishedPonds } from "@/data/ponds";
import { CONTENT_LAST_MODIFIED } from "@/lib/seo";
import { canonicalUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const ponds = getPublishedPonds();
  const staticRoutes = ["", "/ponds", "/for-owners"].map((route) => ({
    url: canonicalUrl(route),
    lastModified: new Date(CONTENT_LAST_MODIFIED)
  }));

  const pondRoutes = ponds.map((pond) => ({
    url: canonicalUrl(`/ponds/${pond.slug}`),
    lastModified: new Date(CONTENT_LAST_MODIFIED)
  }));

  const fishRoutes = fishSeoPages.map((page) => ({
    url: canonicalUrl(`/fish/${page.slug}`),
    lastModified: new Date(CONTENT_LAST_MODIFIED)
  }));

  const featureRoutes = featureSeoPages.map((page) => ({
    url: canonicalUrl(`/features/${page.slug}`),
    lastModified: new Date(CONTENT_LAST_MODIFIED)
  }));

  const distanceRoutes = distanceSeoPages.map((page) => ({
    url: canonicalUrl(`/distance/${page.slug}`),
    lastModified: new Date(CONTENT_LAST_MODIFIED)
  }));

  return [
    ...staticRoutes,
    ...pondRoutes,
    ...fishRoutes,
    ...featureRoutes,
    ...distanceRoutes
  ];
}
