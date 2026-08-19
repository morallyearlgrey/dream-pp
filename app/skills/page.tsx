import { SkillsViewfinder } from "@/components/skills-viewfinder";
import { getSkillsFromDb } from "@/lib/portfolio-db";

export const dynamic = "force-dynamic";

export default async function Skills() {
  const skills = await getSkillsForPage();

  return <SkillsViewfinder skills={skills} />;
}

async function getSkillsForPage() {
  try {
    return await getSkillsFromDb();
  } catch (error) {
    console.error("Skills page database read failed.", error);

    return [];
  }
}
