import { ExperiencesPage } from "@/components/experiences-page";
import { getCachedExperiencesFromDb } from "@/lib/portfolio-db";
import { createPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const metadata = createPageMetadata({
  description:
    "Kai Sprunger's experience archive across NVIDIA, BNY Mellon, IEEE at UCF, embedded software, observability, firmware, and full-stack product engineering.",
  path: "/experiences",
  title: "Experiences",
});

export default async function Experiences() {
  const experienceData = await getExperiencesForPage();

  return <ExperiencesPage experiences={experienceData} />;
}

async function getExperiencesForPage() {
  try {
    return await getCachedExperiencesFromDb();
  } catch (error) {
    console.error("Experiences page database read failed.", error);

    return [];
  }
}
