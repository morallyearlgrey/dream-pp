import type { Metadata } from "next";
import {
  portfolioLogoUrl,
  portfolioOgImageUrl,
  portfolioSiteUrl,
} from "@/lib/site-assets";

const siteName = "Kai Sprunger Portfolio";

type PageMetadataOptions = {
  title: string;
  description: string;
  path?: string;
  images?: NonNullable<Metadata["openGraph"]>["images"];
};

export function createPageMetadata({
  title,
  description,
  path = "/",
  images,
}: PageMetadataOptions): Metadata {
  const url = new URL(path, portfolioSiteUrl).toString();
  const openGraphImages =
    images ??
    [
      {
        alt: `${title} - Kai Sprunger portfolio`,
        height: 630,
        url: portfolioOgImageUrl,
        width: 1200,
      },
    ];

  return {
    alternates: {
      canonical: path,
    },
    description,
    openGraph: {
      description,
      images: openGraphImages,
      siteName,
      title,
      type: "website",
      url,
    },
    title,
    twitter: {
      card: "summary_large_image",
      description,
      images: [portfolioOgImageUrl],
      title,
    },
  };
}

export const siteStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@id": `${portfolioSiteUrl}/#person`,
      "@type": "Person",
      image: portfolioOgImageUrl,
      jobTitle: "Software Engineer",
      knowsAbout: [
        "Embedded systems",
        "RISC-V firmware",
        "Computer vision",
        "AI tooling",
        "Full-stack web development",
        "Observability",
        "PostgreSQL",
        "Next.js",
      ],
      logo: portfolioLogoUrl,
      name: "Kai Sprunger",
      url: portfolioSiteUrl,
    },
    {
      "@id": `${portfolioSiteUrl}/#website`,
      "@type": "WebSite",
      description:
        "A high-contrast editorial portfolio covering embedded systems, AI tooling, full-stack products, computer vision, and technical field notes.",
      image: portfolioOgImageUrl,
      name: siteName,
      publisher: {
        "@id": `${portfolioSiteUrl}/#person`,
      },
      url: portfolioSiteUrl,
    },
    {
      "@id": `${portfolioSiteUrl}/#portfolio`,
      "@type": "CreativeWork",
      creator: {
        "@id": `${portfolioSiteUrl}/#person`,
      },
      genre: "Software engineering portfolio",
      image: portfolioOgImageUrl,
      name: "Kai Sprunger Portfolio Archive",
      url: portfolioSiteUrl,
    },
  ],
};
