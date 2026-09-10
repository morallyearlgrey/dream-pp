import { and, asc, desc, eq, sql } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { getDb } from "@/db";
import {
  blogs as blogsTable,
  endorsements as endorsementsTable,
  experiences as experiencesTable,
  projects as projectsTable,
  skills as skillsTable,
} from "@/db/schema";
import type {
  BlogRecord,
  DashboardPortfolioData,
  ExperienceRecord,
  FeaturedEndorsementRecord,
  PortfolioCounts,
  ProjectRecord,
  SkillRecord,
} from "@/lib/portfolio-records";
import {
  getExperienceVideoUrl,
  getPhotoUrls,
  getProjectImageUrls,
  getProjectVideoUrl,
  getSkillImageUrl,
} from "@/lib/supabase-media";

const emptyCounts: PortfolioCounts = {
  blogs: 0,
  endorsements: 0,
  experiences: 0,
  projects: 0,
  skills: 0,
};

export async function getProjectsFromDb(): Promise<ProjectRecord[]> {
  const db = getDb();
  const rows = await db
    .select()
    .from(projectsTable)
    .orderBy(desc(projectsTable.fromDate), desc(projectsTable.createdAt));

  return rows.map((project): ProjectRecord => ({
    id: project.id,
    name: project.name,
    fromDate: serializeDateOnly(project.fromDate),
    toDate: serializeNullableDateOnly(project.toDate),
    summary: project.summary,
    whatIDid: project.whatIDid,
    photos: getProjectImageUrls(normalizeStringArray(project.photos)),
    mainVideo: getProjectVideoUrl(project.mainVideo),
    projectLink: project.projectLink,
    toolsUsed: normalizeStringArray(project.toolsUsed),
  }));
}

export async function getSkillsFromDb(): Promise<SkillRecord[]> {
  const db = getDb();
  const rows = await db
    .select()
    .from(skillsTable)
    .orderBy(asc(skillsTable.category), asc(skillsTable.name));

  return rows.map((skill): SkillRecord => ({
    category: skill.category,
    id: skill.id,
    name: skill.name,
    photo: getSkillImageUrl(skill.photo) ?? skill.photo,
  }));
}

export async function getPublishedBlogsFromDb(): Promise<BlogRecord[]> {
  const db = getDb();
  const rows = await db
    .select()
    .from(blogsTable)
    .where(eq(blogsTable.published, true))
    .orderBy(desc(blogsTable.createdAt));

  return rows.map((blog): BlogRecord => ({
    content: blog.content,
    createdAt: serializeTimestamp(blog.createdAt),
    id: blog.id,
    photos: getPhotoUrls(normalizeStringArray(blog.photos)),
    published: blog.published,
    slug: blog.slug,
    title: blog.title,
    updatedAt: serializeTimestamp(blog.updatedAt),
  }));
}

export async function getExperiencesFromDb(): Promise<ExperienceRecord[]> {
  const db = getDb();
  const experienceRowsPromise = db
    .select()
    .from(experiencesTable)
    .orderBy(desc(experiencesTable.fromDate));
  const endorsementRowsPromise = db
    .select()
    .from(endorsementsTable)
    .where(and(eq(endorsementsTable.approved, true), eq(endorsementsTable.featured, true)))
    .orderBy(desc(endorsementsTable.createdAt));
  const [experienceRows, endorsementRows] = await Promise.all([
    experienceRowsPromise,
    endorsementRowsPromise,
  ]);
  const endorsementsByExperience = new Map<string, FeaturedEndorsementRecord[]>();

  for (const endorsement of endorsementRows) {
    const current = endorsementsByExperience.get(endorsement.experienceId) ?? [];

    if (current.length >= 3) {
      continue;
    }

    current.push({
      authorName: endorsement.authorName,
      createdAt: serializeTimestamp(endorsement.createdAt),
      id: endorsement.id,
      note: endorsement.note,
    });
    endorsementsByExperience.set(endorsement.experienceId, current);
  }

  return experienceRows.map((experience): ExperienceRecord => ({
    companyName: experience.companyName,
    endorsements: endorsementsByExperience.get(experience.id) ?? [],
    fromDate: serializeDateOnly(experience.fromDate),
    id: experience.id,
    mainVideo: getExperienceVideoUrl(experience.mainVideo),
    photos: getPhotoUrls(normalizeStringArray(experience.photos)),
    positionName: experience.positionName,
    responsibilities: normalizeStringArray(experience.responsibilities),
    summary: experience.summary,
    toDate: serializeNullableDateOnly(experience.toDate),
  }));
}

export const getCachedProjectsFromDb = unstable_cache(
  getProjectsFromDb,
  ["portfolio-projects"],
  { revalidate: 300, tags: ["portfolio-projects"] },
);

export const getCachedSkillsFromDb = unstable_cache(
  getSkillsFromDb,
  ["portfolio-skills"],
  { revalidate: 300, tags: ["portfolio-skills"] },
);

export const getCachedPublishedBlogsFromDb = unstable_cache(
  getPublishedBlogsFromDb,
  ["portfolio-blogs"],
  { revalidate: 300, tags: ["portfolio-blogs"] },
);

export const getCachedExperiencesFromDb = unstable_cache(
  getExperiencesFromDb,
  ["portfolio-experiences"],
  { revalidate: 300, tags: ["portfolio-experiences"] },
);

export async function getDashboardPortfolioData(): Promise<DashboardPortfolioData> {
  try {
    const db = getDb();
    const [
      experienceRows,
      endorsementRows,
      [counts],
    ] = await Promise.all([
      db
        .select({
          companyName: experiencesTable.companyName,
          id: experiencesTable.id,
        })
        .from(experiencesTable)
        .orderBy(desc(experiencesTable.fromDate)),
      db.select().from(endorsementsTable).orderBy(desc(endorsementsTable.createdAt)),
      db.execute<{
        blogs: number;
        endorsements: number;
        experiences: number;
        projects: number;
        skills: number;
      }>(sql`
        select
          (select count(*)::int from ${blogsTable}) as "blogs",
          (select count(*)::int from ${endorsementsTable}) as "endorsements",
          (select count(*)::int from ${experiencesTable}) as "experiences",
          (select count(*)::int from ${projectsTable}) as "projects",
          (select count(*)::int from ${skillsTable}) as "skills"
      `),
    ]);

    return {
      counts: {
        blogs: Number(counts?.blogs ?? 0),
        endorsements: Number(counts?.endorsements ?? 0),
        experiences: Number(counts?.experiences ?? 0),
        projects: Number(counts?.projects ?? 0),
        skills: Number(counts?.skills ?? 0),
      },
      databaseBacked: true,
      endorsements: endorsementRows.map((endorsement) => ({
        approved: endorsement.approved,
        authorName: endorsement.authorName,
        createdAt: formatDashboardDate(endorsement.createdAt),
        experienceId: endorsement.experienceId,
        featured: endorsement.featured,
        id: endorsement.id,
        note: endorsement.note,
      })),
      experiences: experienceRows,
    };
  } catch (error) {
    console.error("Dashboard database read failed.", error);

    return {
      counts: emptyCounts,
      databaseBacked: false,
      endorsements: [],
      experiences: [],
    };
  }
}

export function getPortfolioDbErrorMessage(error: unknown) {
  if (error instanceof Error && error.message.includes("DATABASE_URL")) {
    return "A PostgreSQL connection URL is required before portfolio records can be read.";
  }

  return "Portfolio database records could not be read.";
}

function normalizeStringArray(value: string[] | null | undefined) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

function serializeDateOnly(value: Date | string) {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  return value;
}

function serializeNullableDateOnly(value: Date | string | null) {
  return value ? serializeDateOnly(value) : null;
}

function serializeTimestamp(value: Date | string) {
  if (value instanceof Date) {
    return value.toISOString();
  }

  return value;
}

function formatDashboardDate(value: Date | string | null | undefined) {
  if (value == null) {
    return "Date unavailable";
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return typeof value === "string" && value.trim() ? value : "Date unavailable";
  }

  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}
