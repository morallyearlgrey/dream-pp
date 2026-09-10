"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo, useState } from "react";
import { Bookmark, X } from "lucide-react";
import { handleImageFallback } from "@/components/media-placeholder";
import type { BlogRecord } from "@/lib/portfolio-records";
import { getPhotoUrl, withMediaPlaceholder } from "@/lib/supabase-media";

const filters = ["ALL", "CAREER", "ENTERTAINMENT", "OPINION"] as const;
const blogBackgroundImage = withMediaPlaceholder(
  getPhotoUrl("public/portfoliomedia/photos/blog.png"),
);

type BlogFilter = (typeof filters)[number];
type SavedNote = {
  category: Exclude<BlogFilter, "ALL">;
  content: string;
  date: string;
  featured?: boolean;
  heightClassName: string;
  id: string;
  image: string | null;
  readTime: string;
  title: string;
};

const noteHeightClassNames = [
  "h-[430px] sm:h-[520px]",
  "h-[340px] sm:h-[390px]",
  "h-[390px] sm:h-[470px]",
  "h-[300px] sm:h-[350px]",
  "h-[380px] sm:h-[440px]",
  "h-[320px] sm:h-[410px]",
  "h-[350px] sm:h-[460px]",
] as const;

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getReadTime(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 220));

  return `${minutes.toString().padStart(2, "0")} min read`;
}

function getBlogCategory(blog: BlogRecord): SavedNote["category"] {
  const searchable = `${blog.title} ${blog.slug} ${blog.content}`.toLowerCase();

  if (/\b(career|work|job|intern|engineering|leadership|team|professional)\b/.test(searchable)) {
    return "CAREER";
  }

  if (/\b(entertainment|film|movie|music|book|game|show|art|cosplay)\b/.test(searchable)) {
    return "ENTERTAINMENT";
  }

  return "OPINION";
}

function mapBlogsToSavedNotes(blogs: BlogRecord[]): SavedNote[] {
  return blogs.map((blog, index) => ({
    category: getBlogCategory(blog),
    content: blog.content,
    date: formatDate(blog.createdAt),
    featured: index === 0,
    heightClassName: noteHeightClassNames[index % noteHeightClassNames.length],
    id: blog.slug || blog.id,
    image: blog.photos[0] ?? null,
    readTime: getReadTime(blog.content),
    title: blog.title,
  }));
}

export function BlogSavedArchive({ blogs }: { blogs: BlogRecord[] }) {
  const savedNotes = useMemo(() => mapBlogsToSavedNotes(blogs), [blogs]);
  const [selectedFilter, setSelectedFilter] = useState<BlogFilter>("ALL");
  const [openNoteId, setOpenNoteId] = useState<string | null>(null);
  const openNote = savedNotes.find((note) => note.id === openNoteId) ?? null;
  const visibleNotes = useMemo(
    () =>
      savedNotes.filter(
        (note) => !note.featured && (selectedFilter === "ALL" || note.category === selectedFilter),
      ),
    [savedNotes, selectedFilter],
  );
  const featuredNote = savedNotes.find((note) => note.featured) ?? savedNotes[0];

  useEffect(() => {
    if (!openNote) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenNoteId(null);
      }
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [openNote]);

  return (
    <main className="relative isolate min-h-[calc(100svh-72px)] overflow-x-clip bg-[var(--color-deep)] px-4 pb-16 pt-20 text-[var(--color-text)] sm:px-6 lg:px-8">
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
        <img
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center opacity-[0.38] grayscale brightness-[0.42] contrast-[1.18]"
          decoding="async"
          onError={handleImageFallback}
          src={blogBackgroundImage}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(var(--color-deep-rgb),0.92),rgba(var(--color-deep-rgb),0.78)_46%,rgba(var(--color-deep-rgb),0.96)),linear-gradient(90deg,rgba(var(--color-deep-rgb),0.95),rgba(var(--color-deep-rgb),0.62),rgba(var(--color-deep-rgb),0.95))]" />
        <div className="absolute inset-0 bg-[var(--color-base)]/44" />
        <div className="editorial-film-grain absolute inset-0 opacity-28" />
      </div>

      <section className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="flex flex-col items-center gap-5 border-y border-[var(--color-text)]/20 py-5">
          <div className="w-full text-center">
            <div className="mx-auto flex max-w-xl items-center gap-3 text-[10px] font-bold uppercase leading-none text-[#8f2b35]">
              <span>Saved Folder</span>
              <span className="h-px flex-1 bg-[var(--color-text)]/14" />
              <span>Index 04</span>
            </div>
            <h1 className="font-display mt-4 text-[58px] font-semibold uppercase leading-[0.82] text-[var(--color-text)] sm:text-[98px] lg:text-[124px]">
              Saved Notes
            </h1>
          </div>
          <p className="w-full max-w-2xl border-l border-[#8f2b35]/45 pl-4 text-left text-sm font-light leading-7 text-[var(--color-text)]/66 sm:text-base">
            I used to write for my school newspaper, and I still return to writing
            whenever I want to understand an idea more fully. This is where I save
            what I am learning, building, reading, and noticing along the way.
          </p>
        </div>

        <div className="mt-5 flex w-full gap-px overflow-x-auto border-y border-[var(--color-text)]/18 bg-[var(--color-text)]/12 py-px [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {filters.map((filter) => {
            const active = selectedFilter === filter;
            const count =
              filter === "ALL"
                ? savedNotes.length
                : savedNotes.filter((note) => note.category === filter).length;

            return (
              <button
                aria-pressed={active}
                className={`shrink-0 bg-[var(--color-card-surface)] px-4 py-3 text-[10px] font-bold uppercase leading-none transition focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[#8f2b35] ${
                  active
                    ? "text-[var(--color-text)] shadow-[inset_0_-3px_0_#8f2b35]"
                    : "text-[var(--color-text)]/52 hover:text-[#8f2b35]"
                }`}
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                type="button"
              >
                {filter} <span className="ml-2 text-[#8f2b35]">{count.toString().padStart(2, "0")}</span>
              </button>
            );
          })}
        </div>

        <section className="mt-6 grid gap-5 xl:grid-cols-[minmax(300px,0.42fr)_minmax(0,1fr)]">
          {featuredNote ? (
            <FeaturedNote note={featuredNote} onOpen={setOpenNoteId} />
          ) : (
            <BlogEmptyState />
          )}

          <div className="columns-1 gap-5 sm:columns-2 xl:columns-3">
            {visibleNotes.map((note) => (
              <BlogTile key={note.id} note={note} onOpen={setOpenNoteId} />
            ))}
          </div>
        </section>
      </section>

      {openNote ? <ReadingDrawer note={openNote} onClose={() => setOpenNoteId(null)} /> : null}
    </main>
  );
}

function BlogEmptyState() {
  return (
    <section className="min-h-[420px] border border-[var(--color-text)]/18 bg-[var(--color-panel)]/86 p-5 text-[var(--color-text)] xl:sticky xl:top-24">
      <div className="flex items-center gap-3 border-b border-[var(--color-text)]/16 pb-3 text-[9px] font-bold uppercase leading-none text-[#8f2b35]">
        <Bookmark aria-hidden="true" size={12} strokeWidth={2} />
        No Notes Yet
      </div>
      <h2 className="font-display mt-6 text-[44px] font-semibold uppercase leading-[0.88] sm:text-[58px]">
        No Notes Saved
      </h2>
      <p className="mt-5 max-w-sm border-l border-[#8f2b35]/45 pl-4 text-sm font-light leading-7 text-[var(--color-text)]/64">
        No blogs published.
      </p>
    </section>
  );
}

function NoteImage({
  className,
  image,
}: {
  className: string;
  image: string | null;
}) {
  if (!image) {
    return (
      <div className={`${className} grid place-items-center bg-[var(--color-deep)]`}>
        <span className="border-y border-[var(--color-text)]/18 px-3 py-2 text-[9px] font-bold uppercase leading-none text-[var(--color-text)]/42">
          Media Pending
        </span>
      </div>
    );
  }

  return (
    <img
      alt=""
      aria-hidden="true"
      className={className}
      decoding="async"
      loading="lazy"
      src={image}
    />
  );
}

function FeaturedNote({
  note,
  onOpen,
}: {
  note: SavedNote;
  onOpen: (id: string) => void;
}) {
  return (
    <button
      aria-label={`Open featured note ${note.title}`}
      className="group relative min-h-[520px] overflow-hidden border border-[var(--color-text)]/24 bg-[var(--color-panel)] text-left transition hover:border-[#8f2b35]/76 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[#8f2b35] xl:sticky xl:top-24 xl:min-h-[620px]"
      onClick={() => onOpen(note.id)}
      type="button"
    >
      <NoteImage
        className="absolute inset-0 h-full w-full object-cover brightness-[0.72] contrast-[1.16] saturate-[0.72] transition duration-500 group-hover:scale-[1.025] group-hover:brightness-[0.48]"
        image={note.image}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(var(--color-deep-rgb),0.12),rgba(var(--color-deep-rgb),0.38)_44%,rgba(var(--color-deep-rgb),0.88))]" />
      <div className="archive-scanlines absolute inset-0 opacity-20" />
      <div className="absolute left-4 right-4 top-4 flex items-center justify-between border-b border-[var(--color-text)]/24 pb-2 text-[9px] font-bold uppercase leading-none text-[var(--color-text)]/62">
        <span className="inline-flex items-center gap-2 text-[#8f2b35]">
          <Bookmark aria-hidden="true" size={12} strokeWidth={2} />
          Pinned
        </span>
        <span>{note.readTime}</span>
      </div>
      <div className="absolute bottom-5 left-5 right-5">
        <p className="text-[9px] font-bold uppercase leading-none text-[#8f2b35]">
          {note.category} / {note.date}
        </p>
        <h2 className="font-display mt-3 text-[46px] font-semibold uppercase leading-[0.88] text-[var(--color-text)] sm:text-[60px]">
          {note.title}
        </h2>
        <p className="mt-4 max-w-sm border-l border-[#8f2b35]/45 pl-4 text-sm font-light leading-6 text-[var(--color-text)]/68">
          {note.content}
        </p>
      </div>
      <span className="absolute right-4 top-14 border border-[#8f2b35]/65 bg-[var(--color-deep)]/80 px-3 py-2 text-[9px] font-bold uppercase leading-none text-[var(--color-text)] opacity-0 transition group-hover:opacity-100">
        Open Note
      </span>
    </button>
  );
}

function BlogTile({
  note,
  onOpen,
}: {
  note: SavedNote;
  onOpen: (id: string) => void;
}) {
  return (
    <button
      aria-label={`Open note ${note.title}`}
      className={`group mb-5 inline-block w-full break-inside-avoid overflow-hidden border border-[var(--color-text)]/18 bg-[var(--color-panel)] text-left transition hover:border-[#8f2b35]/76 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[#8f2b35] ${note.heightClassName}`}
      onClick={() => onOpen(note.id)}
      type="button"
    >
      <div className="relative h-full">
        <NoteImage
          className="h-full w-full object-cover brightness-[0.68] contrast-[1.18] saturate-[0.62] transition duration-500 group-hover:scale-[1.03] group-hover:brightness-[0.44]"
          image={note.image}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(var(--color-deep-rgb),0.06),rgba(var(--color-deep-rgb),0.28)_46%,rgba(var(--color-deep-rgb),0.84))]" />
        <div className="archive-scanlines absolute inset-0 opacity-[0.18]" />
        <div className="absolute left-3 right-3 top-3 flex items-center justify-between border-b border-[var(--color-text)]/22 pb-2 text-[8px] font-bold uppercase leading-none text-[var(--color-text)]/58">
          <span>{note.category}</span>
          <span>{note.readTime}</span>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-[8px] font-bold uppercase leading-none text-[#8f2b35]">
            {note.date}
          </p>
          <h3 className="font-display mt-2 text-[30px] font-semibold uppercase leading-[0.9] text-[var(--color-text)] sm:text-[36px]">
            {note.title}
          </h3>
        </div>
        <span className="absolute left-4 top-12 border border-[#8f2b35]/65 bg-[var(--color-deep)]/84 px-3 py-2 text-[9px] font-bold uppercase leading-none text-[var(--color-text)] opacity-0 transition group-hover:opacity-100">
          Open Note
        </span>
      </div>
    </button>
  );
}

function ReadingDrawer({
  note,
  onClose,
}: {
  note: SavedNote;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[80] bg-[var(--color-deep)]/78 backdrop-blur-sm">
      <button
        aria-label="Close note overlay"
        className="absolute inset-0 hidden cursor-default md:block"
        onClick={onClose}
        type="button"
      />
      <aside className="absolute inset-0 overflow-y-auto border-l border-[var(--color-text)]/18 bg-[var(--color-deep)] text-[var(--color-text)] md:left-auto md:w-[min(540px,44vw)]">
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-[var(--color-text)]/16 bg-[var(--color-deep)]/92 px-4 py-3 backdrop-blur">
          <div className="min-w-0 text-[9px] font-bold uppercase leading-none text-[var(--color-text)]/54">
            <span className="text-[#8f2b35]">Reading Drawer</span>
            <span className="mx-2 text-[var(--color-text)]/24">/</span>
            <span>{note.category}</span>
          </div>
          <button
            aria-label="Close note"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center border border-[var(--color-text)]/22 text-[var(--color-text)]/68 transition hover:border-[#8f2b35] hover:text-[#8f2b35] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[#8f2b35]"
            onClick={onClose}
            type="button"
          >
            <X aria-hidden="true" size={17} strokeWidth={1.9} />
          </button>
        </div>

        <div className="relative h-[46vh] min-h-[320px] overflow-hidden border-b border-[var(--color-text)]/16">
          <NoteImage
            className="h-full w-full object-cover brightness-[0.72] contrast-[1.16] saturate-[0.7]"
            image={note.image}
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(var(--color-deep-rgb),0.08),rgba(var(--color-deep-rgb),0.68))]" />
          <div className="absolute bottom-4 left-4 right-4">
            <p className="text-[9px] font-bold uppercase leading-none text-[#8f2b35]">
              {note.date} / {note.readTime}
            </p>
            <h2 className="font-display mt-2 text-[46px] font-semibold uppercase leading-[0.86] text-[var(--color-text)] sm:text-[58px]">
              {note.title}
            </h2>
          </div>
        </div>

        <article className="px-4 py-6 sm:px-6">
          <div className="grid grid-cols-2 border-y border-[var(--color-text)]/14 py-3 text-[9px] font-bold uppercase leading-4 text-[var(--color-text)]/46">
            <span>Saved Artifact</span>
            <span className="text-right text-[#8f2b35]">{note.category}</span>
          </div>
          <p className="mt-6 text-base font-light leading-8 text-[var(--color-text)]/74">
            {note.content}
          </p>
          <p className="mt-5 border-l border-[#8f2b35]/45 pl-4 text-sm font-light leading-7 text-[var(--color-text)]/58">
            This note is kept as a visual reading-room fragment: image first,
            metadata visible, and ready to expand into a longer entry.
          </p>
        </article>
      </aside>
    </div>
  );
}
