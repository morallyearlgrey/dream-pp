import type { Metadata } from "next";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import type { AudioTrack } from "@/components/audio-player";
import { SiteShell } from "@/components/site-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: "Personal Portfolio",
  description:
    "An editorial portfolio for software engineering, embedded development, design, writing, and projects.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const audioTracks = getAudioTracks();

  return (
    <html lang="en">
      <body>
        <SiteShell audioTracks={audioTracks}>{children}</SiteShell>
      </body>
    </html>
  );
}
