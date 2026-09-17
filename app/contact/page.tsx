/* eslint-disable @next/next/no-img-element */
import { ContactNoteForm } from "@/components/contact-note-form";
import { handleImageFallback } from "@/components/media-placeholder";
import { createPageMetadata } from "@/lib/seo";
import { getPhotoUrl, withMediaPlaceholder } from "@/lib/supabase-media";

const contactBackgroundImage = withMediaPlaceholder(
  getPhotoUrl("public/portfoliomedia/photos/contact.jpg"),
);

export const metadata = createPageMetadata({
  description:
    "Send Kai Sprunger a note for collaboration, software engineering opportunities, technical questions, or follow-up conversations.",
  path: "/contact",
  title: "Contact",
});

export default function Contact() {
  return (
    <main className="relative isolate min-h-[calc(100svh-72px)] overflow-hidden bg-[var(--color-deep)] px-4 pb-16 pt-0 text-[var(--color-text)] sm:px-6 sm:pt-20 lg:px-8">
      <div aria-hidden="true" className="absolute inset-0">
        <img
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-[center_58%] brightness-[0.72] contrast-[1.08] saturate-[0.92]"
          onError={handleImageFallback}
          src={contactBackgroundImage}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_68%_24%,rgba(143,43,53,0.14),transparent_38%),linear-gradient(180deg,rgba(var(--color-deep-rgb),0.4),rgba(var(--color-deep-rgb),0.7))]" />
        <div className="editorial-film-grain absolute inset-0 opacity-20" />
      </div>

      <section className="relative z-10 mx-auto grid w-full max-w-7xl gap-10 sm:min-h-[72vh] sm:border-y sm:border-[var(--color-text)]/20 sm:py-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(360px,0.58fr)] lg:items-center lg:gap-20 xl:gap-28">
        <div className="flex min-h-[calc(100svh-42px)] min-w-0 flex-col justify-center border-y border-[var(--color-text)]/20 sm:min-h-0 sm:border-y-0">
          <div className="flex items-center gap-3 text-[10px] font-bold uppercase leading-none text-[#8f2b35]">
            <span>Send A Note</span>
            <span className="h-px flex-1 bg-[var(--color-text)]/14" />
            <span>Contact Form</span>
          </div>
          <h1 className="font-display mt-5 max-w-4xl text-[68px] font-semibold uppercase leading-[0.8] text-[var(--color-text)] sm:text-[108px] lg:text-[136px]">
            Contact
          </h1>
          <p className="mt-6 max-w-2xl border-l border-[#8f2b35]/45 pl-4 text-sm font-light leading-7 text-[var(--color-text)]/68 sm:text-base">
            Leave a note, question, collaboration idea, or anything worth
            following up on.
          </p>
        </div>

        <ContactNoteForm />
      </section>
    </main>
  );
}
