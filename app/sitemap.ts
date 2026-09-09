import type { MetadataRoute } from "next";
import { portfolioSiteUrl } from "@/lib/site-assets";

const routes = ["/", "/experiences", "/projects", "/skills", "/blog", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    changeFrequency: route === "/" ? "monthly" : "weekly",
    lastModified: new Date(),
    priority: route === "/" ? 1 : 0.8,
    url: new URL(route, portfolioSiteUrl).toString(),
  }));
}
