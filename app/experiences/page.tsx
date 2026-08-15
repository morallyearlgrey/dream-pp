import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { endorsements, experiences } from "@/db/schema";
import { ExperiencesPage } from "@/components/experiences-page";
import type { ExperienceFeatureData, FeaturedEndorsementData } from "@/components/experiences-page";
import { endorsementsSeed, experiencesSeed } from "@/lib/portfolio-data";

export const dynamic = "force-dynamic";

export default async function Experiences() {
  const experienceData = await getExperienceData();

  return <ExperiencesPage experiences={experienceData} />;
}

async function getExperienceData(): Promise<ExperienceFeatureData[]> {
  if (!process.env.DATABASE_URL) {
    return getSeedExperienceData();
  }

  try {
    const db = getDb();
    const experienceRows = await db.select().from(experiences).orderBy(desc(experiences.fromDate));
    const endorsementRows = await db
      .select()
      .from(endorsements)
      .where(eq(endorsements.featured, true))
      .orderBy(desc(endorsements.createdAt));

    const endorsementsByExperience = new Map<string, FeaturedEndorsementData[]>();

    for (const endorsement of endorsementRows) {
      if (!endorsement.approved) {
        continue;
      }

      const current = endorsementsByExperience.get(endorsement.experienceId) ?? [];

      if (current.length >= 3) {
        continue;
      }

      current.push({
        authorName: endorsement.authorName,
        createdAt: endorsement.createdAt.toISOString(),
        id: endorsement.id,
        note: endorsement.note,
      });
      endorsementsByExperience.set(endorsement.experienceId, current);
    }

    return experienceRows.map((experience) => ({
      companyName: experience.companyName,
      endorsements: endorsementsByExperience.get(experience.id) ?? [],
      fromDate: experience.fromDate,
      id: experience.id,
      mainVideo: experience.mainVideo,
      photos: experience.photos,
      positionName: experience.positionName,
      responsibilities: experience.responsibilities,
      summary: experience.summary,
      toDate: experience.toDate,
    }));
  } catch {
    return getSeedExperienceData();
  }
}

function getSeedExperienceData(): ExperienceFeatureData[] {
  return experiencesSeed.map((experience) => ({
    ...experience,
    endorsements: endorsementsSeed
      .filter(
        (endorsement) =>
          endorsement.experienceId === experience.id &&
          endorsement.approved &&
          endorsement.featured,
      )
      .slice(0, 3),
  }));
}
