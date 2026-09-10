import { getServerSession } from "next-auth";
import Link from "next/link";
import { EndorsementControls } from "@/components/endorsement-controls";
import {
  authOptions,
  hasDiscordAuthConfiguration,
  isAuthorizedAdminSession,
} from "@/lib/auth";
import { getDashboardPortfolioData } from "@/lib/portfolio-db";
import type { DashboardPortfolioData } from "@/lib/portfolio-records";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const authConfigured = hasDiscordAuthConfiguration();
  const session = authConfigured ? await getServerSession(authOptions) : null;

  if (!session) {
    return (
      <main className="editorial-shell min-h-[72vh] w-full px-4 py-20 text-[var(--color-text)] sm:px-6 lg:px-8">
        <section className="mx-auto grid w-full max-w-5xl gap-8 border border-[var(--color-text)]/18 bg-[var(--color-card)]/88 p-6 md:grid-cols-[1fr_0.8fr] md:p-10">
          <div>
            <p className="flex items-center gap-3 text-[10px] font-bold uppercase leading-none text-[#8f2b35]">
              Protected dashboard
              <span className="h-px flex-1 bg-[var(--color-text)]/16" />
            </p>
            <h1 className="font-display mt-4 text-[52px] font-semibold uppercase leading-[0.88] text-[var(--color-text)] sm:text-[76px]">
              {authConfigured ? "Sign in with Discord" : "Discord setup required"}
            </h1>
            <p className="mt-5 max-w-xl border-l border-[#8f2b35]/40 pl-4 text-sm font-light leading-7 text-[var(--color-text)]/66 sm:text-base">
              {authConfigured ? (
                <>The admin surface requires a fresh Discord authorization and only accepts the configured admin account.</>
              ) : (
                <>
                  Add <span className="font-bold text-[var(--color-text)]">DISCORD_CLIENT_ID</span>,{" "}
                  <span className="font-bold text-[var(--color-text)]">DISCORD_CLIENT_SECRET</span>, and{" "}
                  <span className="font-bold text-[var(--color-text)]">ADMIN_DISCORD_ID</span> to the Vercel production environment, then redeploy.
                </>
              )}
            </p>
            {authConfigured ? (
              <Link
                className="mt-8 inline-flex items-center justify-center border border-[#8f2b35]/55 px-5 py-3 text-[10px] font-bold uppercase leading-none text-[#8f2b35] transition hover:bg-[#8f2b35] hover:text-[var(--color-text)]"
                href="/api/auth/signin/discord?callbackUrl=%2Fdashboard"
              >
                Continue with Discord
              </Link>
            ) : null}
          </div>
          <div className="border border-[var(--color-text)]/18 bg-[var(--color-text)]/8 p-5">
            <p className="font-display text-3xl font-semibold uppercase leading-none text-[var(--color-text)]">
              Admin tools
            </p>
            <ul className="mt-5 space-y-3 text-sm font-light leading-6 text-[var(--color-text)]/64">
              <li>Create and publish blog posts.</li>
              <li>Upload media to object storage and save URLs.</li>
              <li>Review endorsements and feature the top three.</li>
              <li>Manage database records for portfolio sections.</li>
            </ul>
          </div>
        </section>
      </main>
    );
  }

  if (!isAuthorizedAdminSession(session)) {
    return (
      <main className="editorial-shell min-h-[72vh] w-full px-4 py-20 text-[var(--color-text)] sm:px-6 lg:px-8">
        <section className="mx-auto grid w-full max-w-5xl gap-8 border border-[var(--color-text)]/18 bg-[var(--color-card)]/88 p-6 md:grid-cols-[1fr_0.8fr] md:p-10">
          <div>
            <p className="flex items-center gap-3 text-[10px] font-bold uppercase leading-none text-[#8f2b35]">
              Admin restricted
              <span className="h-px flex-1 bg-[var(--color-text)]/16" />
            </p>
            <h1 className="font-display mt-4 text-[52px] font-semibold uppercase leading-[0.88] text-[var(--color-text)] sm:text-[76px]">
              Access denied
            </h1>
            <p className="mt-5 max-w-xl border-l border-[#8f2b35]/40 pl-4 text-sm font-light leading-7 text-[var(--color-text)]/66 sm:text-base">
              This dashboard only accepts the Discord account whose numeric user
              ID matches <span className="font-bold text-[var(--color-text)]">ADMIN_DISCORD_ID</span>.
            </p>
            <Link
              className="mt-8 inline-flex items-center justify-center border border-[var(--color-text)]/22 px-5 py-3 text-[10px] font-bold uppercase leading-none text-[var(--color-text)]/70 transition hover:border-[#8f2b35] hover:text-[#8f2b35]"
              href="/api/auth/signout"
            >
              Sign out
            </Link>
          </div>
          <div className="border border-[var(--color-text)]/18 bg-[var(--color-text)]/8 p-5">
            <p className="font-display text-3xl font-semibold uppercase leading-none text-[var(--color-text)]">
              Locked admin
            </p>
            <p className="mt-5 text-sm font-light leading-6 text-[var(--color-text)]/64">
              The admin check is enforced in both the dashboard route and the
              endorsement moderation API.
            </p>
          </div>
        </section>
      </main>
    );
  }

  const dashboardData = await getDashboardData();
  const endorsementsByExperience = groupEndorsementsByExperience(dashboardData);
  const featuredCount = dashboardData.endorsements.filter((endorsement) => endorsement.featured).length;

  return (
    <main className="editorial-shell w-full px-4 py-12 text-[var(--color-text)] sm:px-6 lg:px-8">
      <div className="mx-auto mb-8 flex w-full max-w-7xl flex-col gap-4 border-b border-[var(--color-text)]/18 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase leading-none text-[#8f2b35]">
            Signed in as {session.user?.name ?? session.user?.email}
          </p>
          <h1 className="font-display mt-2 text-[56px] font-semibold uppercase leading-[0.88] text-[var(--color-text)]">
            Dashboard
          </h1>
        </div>
        <Link
          className="inline-flex items-center justify-center border border-[var(--color-text)]/22 px-4 py-2 text-[10px] font-bold uppercase leading-none text-[var(--color-text)]/70 transition hover:border-[#8f2b35] hover:text-[#8f2b35]"
          href="/api/auth/signout"
        >
          Sign out
        </Link>
      </div>

      <section className="mx-auto grid w-full max-w-7xl gap-5 md:grid-cols-4">
        <Metric label="Experiences" value={dashboardData.counts.experiences} />
        <Metric label="Projects" value={dashboardData.counts.projects} />
        <Metric label="Blogs" value={dashboardData.counts.blogs} />
        <Metric label="Top endorsements" value={featuredCount} />
      </section>

      <section className="mx-auto mt-8 grid w-full max-w-7xl gap-6 lg:grid-cols-[1fr_0.85fr]">
        <form className="border border-[var(--color-text)]/18 bg-[var(--color-card)]/88 p-5">
          <p className="font-display text-3xl font-semibold uppercase leading-none text-[var(--color-text)]">
            New blog post
          </p>
          <div className="mt-5 grid gap-4">
            <label className="grid gap-2 text-[10px] font-bold uppercase leading-none text-[var(--color-text)]/62">
              Title
              <input
                className="border border-[var(--color-text)]/18 bg-[var(--color-text)]/8 px-3 py-2 text-sm font-light normal-case leading-6 text-[var(--color-text)] outline-none placeholder:text-[var(--color-text)]/38 focus:border-[#8f2b35]"
                name="title"
                placeholder="Working title"
              />
            </label>
            <label className="grid gap-2 text-[10px] font-bold uppercase leading-none text-[var(--color-text)]/62">
              Object storage media keys
              <input
                className="border border-[var(--color-text)]/18 bg-[var(--color-text)]/8 px-3 py-2 text-sm font-light normal-case leading-6 text-[var(--color-text)] outline-none placeholder:text-[var(--color-text)]/38 focus:border-[#8f2b35]"
                name="photos"
                placeholder="notes/cover.png or https://..."
              />
            </label>
            <label className="grid gap-2 text-[10px] font-bold uppercase leading-none text-[var(--color-text)]/62">
              Writing
              <textarea
                className="min-h-44 border border-[var(--color-text)]/18 bg-[var(--color-text)]/8 px-3 py-2 text-sm font-light normal-case leading-6 text-[var(--color-text)] outline-none placeholder:text-[var(--color-text)]/38 focus:border-[#8f2b35]"
                name="content"
                placeholder="Draft..."
              />
            </label>
            <button
              className="border border-[#8f2b35]/55 px-4 py-3 text-[10px] font-bold uppercase leading-none text-[#8f2b35] transition hover:bg-[#8f2b35] hover:text-[var(--color-text)]"
              type="button"
            >
              Save draft
            </button>
          </div>
        </form>

        <div className="border border-[var(--color-text)]/18 bg-[var(--color-deep)] p-5 text-[var(--color-text)]">
          <div className="flex items-start justify-between gap-4 border-b border-[var(--color-text)]/14 pb-4">
            <div>
              <p className="font-display text-3xl font-semibold uppercase leading-none">
                Endorsement queue
              </p>
              <p className="mt-2 text-xs font-light leading-5 text-[var(--color-text)]/54">
                Select up to three featured endorsements per experience for the public page.
              </p>
            </div>
            <span className="border border-[#8f2b35]/35 px-2 py-1 text-[9px] font-bold uppercase leading-none text-[#8f2b35]">
              {dashboardData.databaseBacked ? "Live DB" : "DB unavailable"}
            </span>
          </div>
          <div className="mt-5 space-y-6">
            {endorsementsByExperience.map(({ endorsements: groupedEndorsements, experience }) => {
              const groupFeaturedCount = groupedEndorsements.filter(
                (endorsement) => endorsement.featured,
              ).length;

              return (
                <section className="border border-[var(--color-text)]/15 bg-[var(--color-text)]/5 p-4" key={experience.id}>
                  <div className="flex items-center justify-between gap-3 border-b border-[var(--color-text)]/12 pb-3">
                    <p className="text-[10px] font-bold uppercase leading-none text-[#8f2b35]">
                      {experience.companyName}
                    </p>
                    <span className="text-[9px] font-bold uppercase leading-none text-[var(--color-text)]/44">
                      Featured {groupFeaturedCount} / 3
                    </span>
                  </div>
                  <div className="mt-4 space-y-4">
                    {groupedEndorsements.length > 0 ? (
                      groupedEndorsements.map((endorsement) => (
                        <article
                          className="border border-[var(--color-text)]/15 bg-[var(--color-deep)]/74 p-4"
                          key={endorsement.id}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-[10px] font-bold uppercase leading-none text-[#8f2b35]">
                              {endorsement.authorName}
                            </p>
                            <span className="border border-[#8f2b35]/45 px-2 py-1 text-[9px] font-bold uppercase leading-none text-[#8f2b35]">
                              {endorsement.featured
                                ? "Top 3"
                                : endorsement.approved
                                  ? "Approved"
                                  : "Queued"}
                            </span>
                          </div>
                          <p className="mt-2 text-sm leading-6 text-[var(--color-text)]/80">
                            {endorsement.note}
                          </p>
                          <p className="mt-3 text-[9px] font-bold uppercase leading-none text-[var(--color-text)]/34">
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
                      <p className="text-xs font-light leading-5 text-[var(--color-text)]/46">
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
    <article className="border border-[var(--color-text)]/18 bg-[var(--color-text)]/8 p-5">
      <p className="text-[10px] font-bold uppercase leading-none text-[var(--color-text)]/54">
        {label}
      </p>
      <p className="font-display mt-2 text-5xl font-semibold leading-none text-[#8f2b35]">
        {value}
      </p>
    </article>
  );
}

async function getDashboardData(): Promise<DashboardPortfolioData> {
  return getDashboardPortfolioData();
}

function groupEndorsementsByExperience({ endorsements, experiences }: DashboardPortfolioData) {
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
