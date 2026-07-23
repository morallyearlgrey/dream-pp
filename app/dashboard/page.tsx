import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import {
  blogSeed,
  endorsementsSeed,
  experiencesSeed,
  projectsSeed,
  skillsSeed,
} from "@/lib/portfolio-data";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <main className="mx-auto min-h-[72vh] w-full max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
        <section className="grid gap-8 border border-[#605246]/25 bg-[#F2E5C6]/80 p-6 shadow-[12px_12px_0_rgba(94,28,35,0.12)] md:grid-cols-[1fr_0.8fr] md:p-10">
          <div>
            <p className="text-xs font-semibold uppercase text-[#5E1C23]">
              Protected dashboard
            </p>
            <h1 className="font-display mt-4 text-5xl font-semibold text-[#211b18] sm:text-6xl">
              Sign in with Discord
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-[#605246]">
              The admin surface is ready for Discord OAuth. Add the Discord
              client credentials to the environment before using the live
              sign-in flow.
            </p>
            <Link
              className="mt-8 inline-flex items-center justify-center rounded-md bg-[#5E1C23] px-5 py-3 text-sm font-semibold text-[#F2E5C6] transition hover:bg-[#211b18]"
              href="/api/auth/signin/discord"
            >
              Continue with Discord
            </Link>
          </div>
          <div className="border border-[#211b18]/20 bg-white/45 p-5">
            <p className="font-display text-3xl font-semibold text-[#5E1C23]">
              Admin tools
            </p>
            <ul className="mt-5 space-y-3 text-sm leading-6 text-[#605246]">
              <li>Create and publish blog posts.</li>
              <li>Upload media to object storage and save URLs.</li>
              <li>Review endorsements and feature the top two.</li>
              <li>Manage seed data for portfolio sections.</li>
            </ul>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 border-b border-[#605246]/25 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase text-[#5E1C23]">
            Signed in as {session.user?.name ?? session.user?.email}
          </p>
          <h1 className="font-display mt-2 text-5xl font-semibold text-[#211b18]">
            Dashboard
          </h1>
        </div>
        <Link
          className="inline-flex items-center justify-center rounded-md border border-[#605246]/35 px-4 py-2 text-sm font-semibold text-[#5E1C23] transition hover:bg-[#5E1C23] hover:text-[#F2E5C6]"
          href="/api/auth/signout"
        >
          Sign out
        </Link>
      </div>

      <section className="grid gap-5 md:grid-cols-4">
        <Metric label="Experiences" value={experiencesSeed.length} />
        <Metric label="Projects" value={projectsSeed.length} />
        <Metric label="Blogs" value={blogSeed.length} />
        <Metric label="Skills" value={skillsSeed.length} />
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.85fr]">
        <form className="border border-[#605246]/25 bg-white/50 p-5">
          <p className="font-display text-3xl font-semibold text-[#211b18]">
            New blog post
          </p>
          <div className="mt-5 grid gap-4">
            <label className="grid gap-2 text-sm font-semibold text-[#605246]">
              Title
              <input
                className="rounded-md border border-[#605246]/25 bg-[#F2E5C6] px-3 py-2 text-[#211b18] outline-none focus:border-[#5E1C23]"
                name="title"
                placeholder="Working title"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-[#605246]">
              Object storage media URLs
              <input
                className="rounded-md border border-[#605246]/25 bg-[#F2E5C6] px-3 py-2 text-[#211b18] outline-none focus:border-[#5E1C23]"
                name="photos"
                placeholder="https://..."
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-[#605246]">
              Writing
              <textarea
                className="min-h-44 rounded-md border border-[#605246]/25 bg-[#F2E5C6] px-3 py-2 text-[#211b18] outline-none focus:border-[#5E1C23]"
                name="content"
                placeholder="Draft..."
              />
            </label>
            <button
              className="rounded-md bg-[#5E1C23] px-4 py-3 text-sm font-semibold text-[#F2E5C6] transition hover:bg-[#211b18]"
              type="button"
            >
              Save draft
            </button>
          </div>
        </form>

        <div className="border border-[#605246]/25 bg-[#211b18] p-5 text-[#F2E5C6]">
          <p className="font-display text-3xl font-semibold">
            Endorsement queue
          </p>
          <div className="mt-5 space-y-4">
            {endorsementsSeed.map((endorsement) => (
              <article
                className="border border-[#F2E5C6]/15 bg-[#F2E5C6]/5 p-4"
                key={endorsement.id}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold">{endorsement.authorName}</p>
                  <span className="rounded-sm bg-[#849AAD] px-2 py-1 text-xs font-semibold text-[#211b18]">
                    {endorsement.featured ? "Featured" : "Queued"}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-[#F2E5C6]/80">
                  {endorsement.note}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <article className="border border-[#605246]/25 bg-[#F2E5C6]/80 p-5">
      <p className="text-sm font-semibold text-[#605246]">{label}</p>
      <p className="font-display mt-2 text-5xl font-semibold text-[#5E1C23]">
        {value}
      </p>
    </article>
  );
}
