import type { MetadataRoute } from "next";
import { portfolioSiteUrl } from "@/lib/site-assets";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      allow: "/",
      disallow: ["/api/", "/dashboard"],
      userAgent: "*",
    },
    sitemap: `${portfolioSiteUrl}/sitemap.xml`,
  };
}
