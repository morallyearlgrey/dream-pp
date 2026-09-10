import type { Metadata, Viewport } from "next";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import type { AudioTrack } from "@/components/audio-player";
import { SiteShell } from "@/components/site-shell";
import {
  portfolioLogoUrl,
  portfolioOgImageUrl,
  portfolioSiteUrl,
} from "@/lib/site-assets";
import { siteStructuredData } from "@/lib/seo";
import "./globals.css";

const siteTitle = "Kai Sprunger | Software Engineer Portfolio";
const siteDescription =
  "Kai Sprunger's high-contrast editorial portfolio for embedded systems, AI tooling, full-stack products, computer vision projects, field notes, and technical archive work.";

export const metadata: Metadata = {
  applicationName: "Kai Sprunger Portfolio",
  authors: [{ name: "Kai Sprunger", url: portfolioSiteUrl }],
  category: "technology",
  creator: "Kai Sprunger",
  description: siteDescription,
  keywords: [
    "Kai Sprunger",
    "software engineer portfolio",
    "embedded software engineer",
    "RISC-V",
    "AI tooling",
    "full-stack developer",
    "computer vision",
    "OpenCV",
    "Next.js",
    "React",
    "Supabase",
    "Drizzle",
    "PostgreSQL",
    "technical portfolio",
    "fashion editorial portfolio",
  ],
  metadataBase: new URL(portfolioSiteUrl),
  publisher: "Kai Sprunger",
  title: {
    default: siteTitle,
    template: "%s | Kai Sprunger",
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    apple: [{ type: "image/png", url: portfolioLogoUrl }],
    icon: [{ type: "image/png", url: portfolioLogoUrl }],
    shortcut: [{ type: "image/png", url: portfolioLogoUrl }],
  },
  openGraph: {
    description: siteDescription,
    images: [
      {
        alt: "Kai Sprunger portfolio editorial cover",
        height: 630,
        url: portfolioOgImageUrl,
        width: 1200,
      },
    ],
    locale: "en_US",
    siteName: "Kai Sprunger Portfolio",
    title: siteTitle,
    type: "website",
    url: "/",
  },
  robots: {
    follow: true,
    googleBot: {
      follow: true,
      index: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
    index: true,
  },
  twitter: {
    card: "summary_large_image",
    description: siteDescription,
    images: [portfolioOgImageUrl],
    title: siteTitle,
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#080807",
};

function formatTrackTitle(filename: string) {
  const title = filename
    .replace(/\.mp3$/i, "")
    .replace(/^\d+[\s._-]*/, "")
    .replace(/[_-]+/g, " ")
    .trim();

  if (!title) {
    return "Untitled Track";
  }

  return title.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getAudioTracks(): AudioTrack[] {
  const audioDirectory = join(process.cwd(), "public", "audio");

  if (!existsSync(audioDirectory)) {
    return [];
  }

  return readdirSync(audioDirectory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".mp3"))
    .sort((first, second) => first.name.localeCompare(second.name, undefined, { numeric: true }))
    .map((entry) => ({
      src: `/audio/${encodeURIComponent(entry.name)}`,
      title: formatTrackTitle(entry.name),
    }));
}

const audioTracks = getAudioTracks();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(siteStructuredData),
          }}
          type="application/ld+json"
        />
        <SiteShell audioTracks={audioTracks}>{children}</SiteShell>
      </body>
    </html>
  );
}
