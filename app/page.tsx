import { AboutPage } from "@/components/about-page";
import { createPageMetadata } from "@/lib/seo";

const pageTitle = "Kai Sprunger";

export const metadata = {
  ...createPageMetadata({
    description:
      "Kai Sprunger's cinematic portfolio homepage with personal proof-sheet imagery, engineering work, and a high-contrast editorial archive feel.",
    path: "/",
    title: pageTitle,
  }),
  title: { absolute: pageTitle },
};

export default function Home() {
  return <AboutPage />;
}
