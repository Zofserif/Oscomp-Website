import type { MetadataRoute } from "next";
import { routes, siteUrl } from "./lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${siteUrl}${route.path === "/" ? "" : route.path}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route.priority
  }));
}
