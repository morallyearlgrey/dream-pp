import { ContactNoteForm } from "@/components/contact-note-form";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  description:
    "Send Kai Sprunger a note for collaboration, software engineering opportunities, technical questions, or follow-up conversations.",
  path: "/contact",
  title: "Contact",
});

export default function Contact() {
  return (
    <main className="relative isolate min-h-[calc(100svh-72px)] overflow-hidden bg-[#080807] px-4 pb-16 pt-20 text-[#f2e5c6] sm:px-6 lg:px-8">
      <div aria-hidden="true" className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_68%_24%,rgba(143,43,53,0.18),transparent_34%),linear-gradient(180deg,rgba(8,8,7,0.72),rgba(8,8,7,0.96))]" />
        <div className="editorial-film-grain absolute inset-0 opacity-26" />
      </div>

      <section className="relative z-10 mx-auto grid min-h-[72vh] w-full max-w-7xl gap-10 border-y border-[#f2e5c6]/20 py-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(360px,0.58fr)] lg:items-center lg:gap-20 xl:gap-28">
        <div className="min-w-0">
          <div className="flex items-center gap-3 text-[10px] font-bold uppercase leading-none text-[#8f2b35]">
            <span>Send A Note</span>
            <span className="h-px flex-1 bg-[#f2e5c6]/14" />
            <span>Contact Form</span>
          </div>
          <h1 className="font-display mt-5 max-w-4xl text-[68px] font-semibold uppercase leading-[0.8] text-[#f2e5c6] sm:text-[108px] lg:text-[136px]">
            Contact
          </h1>
          <p className="mt-6 max-w-2xl border-l border-[#8f2b35]/45 pl-4 text-sm font-light leading-7 text-[#f2e5c6]/68 sm:text-base">
            Leave a note, question, collaboration idea, or anything worth
            following up on.
          </p>
        </div>

        <ContactNoteForm />
      </section>
    </main>
  );
}
