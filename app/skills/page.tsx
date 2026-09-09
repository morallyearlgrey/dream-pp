import { SkillsViewfinder } from "@/components/skills-viewfinder";
import { getCachedSkillsFromDb } from "@/lib/portfolio-db";
import { createPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const metadata = createPageMetadata({
  description:
    "A camera-viewfinder skills archive covering languages, frameworks, libraries, and tools used across Kai Sprunger's portfolio.",
  path: "/skills",
  title: "Skills",
});

export default async function Skills() {
  const skills = await getSkillsForPage();

  return <SkillsViewfinder skills={skills} />;
}

async function getSkillsForPage() {
  try {
    return await getCachedSkillsFromDb();
  } catch (error) {
    console.error("Skills page database read failed.", error);

    return [];
  }
}
