import { ExperiencesPage } from "@/components/experiences-page";
import { getExperiencesFromDb } from "@/lib/portfolio-db";

export const dynamic = "force-dynamic";

export default async function Experiences() {
  const experienceData = await getExperiencesForPage();

  return <ExperiencesPage experiences={experienceData} />;
}

async function getExperiencesForPage() {
  try {
    return await getExperiencesFromDb();
  } catch (error) {
    console.error("Experiences page database read failed.", error);

    return [];
  }
}
