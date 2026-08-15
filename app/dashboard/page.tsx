import { desc } from "drizzle-orm";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { getDb } from "@/db";
import {
  endorsements as endorsementsTable,
  experiences as experiencesTable,
} from "@/db/schema";
import { EndorsementControls } from "@/components/endorsement-controls";
import { authOptions } from "@/lib/auth";
import {
  blogSeed,
  endorsementsSeed,
  experiencesSeed,
  projectsSeed,
} from "@/lib/portfolio-data";

type DashboardExperience = {
  id: string;
  companyName: string;
};

type DashboardEndorsement = {
  id: string;
  experienceId: string;
  authorName: string;
  note: string;
  approved: boolean;
  featured: boolean;
  createdAt: string;
};

type DashboardData = {
  databaseBacked: boolean;
  endorsements: DashboardEndorsement[];
  experiences: DashboardExperience[];
};

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <main className="mx-auto min-h-[72vh] w-full max-w-5xl px-4 py-20 text-[#f2e5c6] sm:px-6 lg:px-8">
        <section className="grid gap-8 border border-[#f2e5c6]/18 bg-[#0f0e0d]/88 p-6 shadow-[12px_12px_0_rgba(94,28,35,0.28),0_28px_80px_rgba(0,0,0,0.36)] md:grid-cols-[1fr_0.8fr] md:p-10">
          <div>
            <p className="flex items-center gap-3 text-[10px] font-bold uppercase leading-none text-[#d7b82d]">
              Protected dashboard
              <span className="h-px flex-1 bg-[#f2e5c6]/16" />
            </p>
            <h1 className="font-display mt-4 text-[52px] font-semibold uppercase leading-[0.88] text-[#f2e5c6] sm:text-[76px]">
              Sign in with Discord
            </h1>
            <p className="mt-5 max-w-xl border-l border-[#d7b82d]/40 pl-4 text-sm font-light leading-7 text-[#f2e5c6]/66 sm:text-base">
              The admin surface is ready for Discord OAuth. Add the Discord
              client credentials to the environment before using the live
              sign-in flow.
            </p>
            <Link
              className="mt-8 inline-flex items-center justify-center border border-[#d7b82d]/55 px-5 py-3 text-[10px] font-bold uppercase leading-none text-[#d7b82d] transition hover:bg-[#d7b82d] hover:text-[#111]"
              href="/api/auth/signin/discord"
            >
              Continue with Discord
            </Link>
          </div>
          <div className="border border-[#f2e5c6]/18 bg-[#f2e5c6]/8 p-5">
            <p className="font-display text-3xl font-semibold uppercase leading-none text-[#f2e5c6]">
              Admin tools
            </p>
            <ul className="mt-5 space-y-3 text-sm font-light leading-6 text-[#f2e5c6]/64">
              <li>Create and publish blog posts.</li>
              <li>Upload media to object storage and save URLs.</li>
              <li>Review endorsements and feature the top three.</li>
              <li>Manage seed data for portfolio sections.</li>
            </ul>
          </div>
        </section>
      </main>
    );
  }

  const dashboardData = await getDashboardData();
  const endorsementsByExperience = groupEndorsementsByExperience(dashboardData);
  const featuredCount = dashboardData.endorsements.filter((endorsement) => endorsement.featured).length;

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-12 text-[#f2e5c6] sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 border-b border-[#f2e5c6]/18 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase leading-none text-[#d7b82d]">
            Signed in as {session.user?.name ?? session.user?.email}
          </p>
          <h1 className="font-display mt-2 text-[56px] font-semibold uppercase leading-[0.88] text-[#f2e5c6]">
            Dashboard
          </h1>
        </div>
        <Link
          className="inline-flex items-center justify-center border border-[#f2e5c6]/22 px-4 py-2 text-[10px] font-bold uppercase leading-none text-[#f2e5c6]/70 transition hover:border-[#d7b82d] hover:text-[#d7b82d]"
          href="/api/auth/signout"
        >
          Sign out
        </Link>
      </div>

      <section className="grid gap-5 md:grid-cols-4">
        <Metric label="Experiences" value={dashboardData.experiences.length} />
        <Metric label="Projects" value={projectsSeed.length} />
        <Metric label="Blogs" value={blogSeed.length} />
        <Metric label="Top endorsements" value={featuredCount} />
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.85fr]">
        <form className="border border-[#f2e5c6]/18 bg-[#0f0e0d]/88 p-5">
          <p className="font-display text-3xl font-semibold uppercase leading-none text-[#f2e5c6]">
            New blog post
          </p>
          <div className="mt-5 grid gap-4">
            <label className="grid gap-2 text-[10px] font-bold uppercase leading-none text-[#f2e5c6]/62">
              Title
              <input
                className="border border-[#f2e5c6]/18 bg-[#f2e5c6]/8 px-3 py-2 text-sm font-light normal-case leading-6 text-[#f2e5c6] outline-none placeholder:text-[#f2e5c6]/38 focus:border-[#d7b82d]"
                name="title"
                placeholder="Working title"
              />
            </label>
            <label className="grid gap-2 text-[10px] font-bold uppercase leading-none text-[#f2e5c6]/62">
              Object storage media URLs
              <input
                className="border border-[#f2e5c6]/18 bg-[#f2e5c6]/8 px-3 py-2 text-sm font-light normal-case leading-6 text-[#f2e5c6] outline-none placeholder:text-[#f2e5c6]/38 focus:border-[#d7b82d]"
                name="photos"
                placeholder="https://..."
              />
            </label>
            <label className="grid gap-2 text-[10px] font-bold uppercase leading-none text-[#f2e5c6]/62">
              Writing
              <textarea
                className="min-h-44 border border-[#f2e5c6]/18 bg-[#f2e5c6]/8 px-3 py-2 text-sm font-light normal-case leading-6 text-[#f2e5c6] outline-none placeholder:text-[#f2e5c6]/38 focus:border-[#d7b82d]"
                name="content"
                placeholder="Draft..."
              />
            </label>
            <button
              className="border border-[#d7b82d]/55 px-4 py-3 text-[10px] font-bold uppercase leading-none text-[#d7b82d] transition hover:bg-[#d7b82d] hover:text-[#111]"
              type="button"
            >
              Save draft
            </button>
          </div>
        </form>

        <div className="border border-[#f2e5c6]/18 bg-[#080807] p-5 text-[#F2E5C6]">
          <div className="flex items-start justify-between gap-4 border-b border-[#f2e5c6]/14 pb-4">
            <div>
              <p className="font-display text-3xl font-semibold uppercase leading-none">
                Endorsement queue
              </p>
              <p className="mt-2 text-xs font-light leading-5 text-[#f2e5c6]/54">
                Select up to three featured endorsements per experience for the public page.
              </p>
            </div>
            <span className="border border-[#d7b82d]/35 px-2 py-1 text-[9px] font-bold uppercase leading-none text-[#d7b82d]">
              {dashboardData.databaseBacked ? "Live DB" : "Seed preview"}
            </span>
          </div>
          <div className="mt-5 space-y-6">
            {endorsementsByExperience.map(({ endorsements: groupedEndorsements, experience }) => {
              const groupFeaturedCount = groupedEndorsements.filter(
                (endorsement) => endorsement.featured,
              ).length;

              return (
                <section className="border border-[#F2E5C6]/15 bg-[#F2E5C6]/5 p-4" key={experience.id}>
                  <div className="flex items-center justify-between gap-3 border-b border-[#f2e5c6]/12 pb-3">
                    <p className="text-[10px] font-bold uppercase leading-none text-[#d7b82d]">
                      {experience.companyName}
                    </p>
                    <span className="text-[9px] font-bold uppercase leading-none text-[#f2e5c6]/44">
                      Featured {groupFeaturedCount} / 3
                    </span>
                  </div>
                  <div className="mt-4 space-y-4">
                    {groupedEndorsements.length > 0 ? (
                      groupedEndorsements.map((endorsement) => (
                        <article
                          className="border border-[#F2E5C6]/15 bg-[#080807]/74 p-4"
                          key={endorsement.id}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-[10px] font-bold uppercase leading-none text-[#d7b82d]">
                              {endorsement.authorName}
                            </p>
                            <span className="border border-[#d7b82d]/45 px-2 py-1 text-[9px] font-bold uppercase leading-none text-[#d7b82d]">
                              {endorsement.featured
                                ? "Top 3"
                                : endorsement.approved
                                  ? "Approved"
                                  : "Queued"}
                            </span>
                          </div>
                          <p className="mt-2 text-sm leading-6 text-[#F2E5C6]/80">
                            {endorsement.note}
                          </p>
                          <p className="mt-3 text-[9px] font-bold uppercase leading-none text-[#f2e5c6]/34">
                            {endorsement.createdAt}
                          </p>
                          <EndorsementControls
                            approved={endorsement.approved}
                            disabled={!dashboardData.databaseBacked}
                            featured={endorsement.featured}
                            id={endorsement.id}
                          />
                        </article>
                      ))
                    ) : (
                      <p className="text-xs font-light leading-5 text-[#f2e5c6]/46">
                        No endorsements submitted yet.
                      </p>
                    )}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <article className="border border-[#f2e5c6]/18 bg-[#f2e5c6]/8 p-5">
      <p className="text-[10px] font-bold uppercase leading-none text-[#f2e5c6]/54">
        {label}
      </p>
      <p className="font-display mt-2 text-5xl font-semibold leading-none text-[#d7b82d]">
        {value}
      </p>
    </article>
  );
}

async function getDashboardData(): Promise<DashboardData> {
  if (!process.env.DATABASE_URL) {
    return getSeedDashboardData();
  }

  try {
    const db = getDb();
    const experienceRows = await db.select().from(experiencesTable).orderBy(desc(experiencesTable.fromDate));
    const endorsementRows = await db
      .select()
      .from(endorsementsTable)
      .orderBy(desc(endorsementsTable.createdAt));

    return {
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
      experiences: experienceRows.map((experience) => ({
        companyName: experience.companyName,
        id: experience.id,
      })),
    };
  } catch {
    return getSeedDashboardData();
  }
}

function getSeedDashboardData(): DashboardData {
  return {
    databaseBacked: false,
    endorsements: endorsementsSeed.map((endorsement) => ({
      approved: endorsement.approved,
      authorName: endorsement.authorName,
      createdAt: endorsement.createdAt,
      experienceId: endorsement.experienceId,
      featured: endorsement.featured,
      id: endorsement.id,
      note: endorsement.note,
    })),
    experiences: experiencesSeed.map((experience) => ({
      companyName: experience.companyName,
      id: experience.id,
    })),
  };
}

function groupEndorsementsByExperience({ endorsements, experiences }: DashboardData) {
  const grouped = experiences.map((experience) => ({
    endorsements: endorsements.filter((endorsement) => endorsement.experienceId === experience.id),
    experience,
  }));
  const knownExperienceIds = new Set(experiences.map((experience) => experience.id));
  const orphanedEndorsements = endorsements.filter(
    (endorsement) => !knownExperienceIds.has(endorsement.experienceId),
  );

  if (orphanedEndorsements.length > 0) {
    grouped.push({
      endorsements: orphanedEndorsements,
      experience: {
        companyName: "Unmatched experience",
        id: "unmatched",
      },
    });
  }

  return grouped;
}

function formatDashboardDate(value: Date) {
  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(value);
}
