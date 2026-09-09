import { AboutPage } from "@/components/about-page";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  description:
    "Kai Sprunger's cinematic portfolio homepage with personal proof-sheet imagery, engineering work, and a high-contrast editorial archive feel.",
  path: "/",
  title: "Editorial Software Engineering Portfolio",
});

export default function Home() {
  return <AboutPage />;
}
