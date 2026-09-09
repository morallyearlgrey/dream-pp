import type { MetadataRoute } from "next";
import { portfolioLogoUrl, portfolioSiteUrl } from "@/lib/site-assets";

export default function manifest(): MetadataRoute.Manifest {
  return {
    background_color: "#080807",
    description:
      "Kai Sprunger's editorial software engineering portfolio archive.",
    display: "standalone",
    icons: [
      {
        sizes: "192x192",
        src: portfolioLogoUrl,
        type: "image/png",
      },
      {
        sizes: "512x512",
        src: portfolioLogoUrl,
        type: "image/png",
      },
    ],
    name: "Kai Sprunger Portfolio",
    short_name: "Kai Sprunger",
    start_url: portfolioSiteUrl,
    theme_color: "#080807",
  };
}
