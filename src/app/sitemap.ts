import type { MetadataRoute } from "next";
import { fishSeoPages, featureSeoPages } from "@/data/seo-pages";
import { ponds } from "@/data/ponds";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/ponds", "/for-owners"].map((route) => ({
    url: absoluteUrl(route),
    lastModified: new Date()
  }));

  const pondRoutes = ponds.map((pond) => ({
    url: absoluteUrl(`/ponds/${pond.slug}`),
    lastModified: pond.lastStocking ? new Date(pond.lastStocking.date) : new Date()
  }));

  const fishRoutes = fishSeoPages.map((page) => ({
    url: absoluteUrl(`/fish/${page.slug}`),
    lastModified: new Date()
  }));

  const featureRoutes = featureSeoPages.map((page) => ({
    url: absoluteUrl(`/features/${page.slug}`),
    lastModified: new Date()
  }));

  return [...staticRoutes, ...pondRoutes, ...fishRoutes, ...featureRoutes];
}
