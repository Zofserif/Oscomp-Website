import type { MetadataRoute } from "next";
import { services } from "./lib/services";
import { routes, siteUrl } from "./lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routeEntries = routes.map((route) => ({
    url: `${siteUrl}${route.path === "/" ? "" : route.path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: route.priority
  }));

  const serviceEntries = services.map((service) => ({
    url: `${siteUrl}/services/${service.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7
  }));

  return [...routeEntries, ...serviceEntries];
}
