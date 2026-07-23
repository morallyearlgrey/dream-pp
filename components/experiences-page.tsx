"use client";

import type { CSSProperties } from "react";
import { useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { Send } from "lucide-react";
import { endorsementsSeed, experiencesSeed } from "@/lib/portfolio-data";

export function ExperiencesPage() {
  const { scrollY } = useScroll();
  const posterY = useTransform(scrollY, [0, 900], [0, -30]);

  return (
    <main className="overflow-hidden">
      <section className="mx-auto grid w-full max-w-7xl px-3 pb-16 pt-6 sm:px-6 lg:grid-cols-[minmax(360px,461px)_minmax(420px,1fr)] lg:items-start lg:gap-0 lg:px-8">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="relative mx-auto w-full max-w-[461px] lg:justify-self-end"
          initial={{ opacity: 0, y: 18 }}
          style={{ y: posterY }}
          transition={{ duration: 0.65, ease: "easeOut" }}
        >
          <ExperiencePoster />
        </motion.div>

        <motion.aside
          animate={{ opacity: 1, x: 0 }}
          className="relative z-20 mx-auto -mt-14 w-[calc(100%-1.5rem)] max-w-xl border border-[#5E1C23]/25 bg-[#F2E5C6]/94 p-5 shadow-[12px_12px_0_rgba(132,154,173,0.28)] backdrop-blur lg:sticky lg:top-32 lg:-ml-9 lg:mt-24 lg:w-full lg:p-7"
          initial={{ opacity: 0, x: 28 }}
          transition={{ delay: 0.1, duration: 0.65, ease: "easeOut" }}
        >
          <p className="text-xs font-black uppercase text-[#5E1C23]">
            Work, teams, responsibility
          </p>
          <h1 className="font-display mt-3 text-5xl font-semibold leading-none text-[#211b18] sm:text-7xl">
            Experiences
          </h1>
          <p className="mt-5 text-sm leading-7 text-[#605246] sm:text-base sm:leading-8">
            This page collects the roles that shaped how I think, debug,
            collaborate, and ship. Each experience is written as a small
            artifact: part timeline, part field note, part thank-you letter to
            the people who made the work sharper.
          </p>
        </motion.aside>
      </section>
    </main>
  );
}

function ExperiencePoster() {
  return (
    <div className="reference-phone relative aspect-[461/1472] overflow-hidden bg-[#f6f1e4]">
      <div className="absolute inset-0 bg-[#f8f5ee]" />
      <div className="absolute left-[8%] right-[7%] top-[5.5%] flex justify-between text-[clamp(8px,1.8vw,11px)] font-semibold uppercase text-[#605246]">
        <span>Bright work archive</span>
        <span>Ami</span>
      </div>
      <div className="absolute left-[8%] top-[10.5%] text-[#211b18]">
        <p className="text-[clamp(8px,1.8vw,11px)] font-semibold uppercase">
          Amiaris Spring Show
        </p>
        <h2 className="mt-3 text-[clamp(42px,12vw,78px)] font-black leading-[0.88]">
          Airport
          <br />
          looks
        </h2>
      </div>
      <div className="absolute left-[7%] right-[7%] top-[18.5%] grid rotate-[-6deg] grid-cols-3 gap-1 border-y-[7px] border-black bg-black p-1">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            className="abstract-photo aspect-video border border-white/35 grayscale"
            key={index}
            style={
              {
                "--photo-a": index % 2 ? "#849AAD" : "#605246",
                "--photo-b": index % 3 ? "#F2E5C6" : "#211b18",
              } as CSSProperties
            }
          />
        ))}
      </div>
      <div className="figure-cutout absolute right-[5%] top-[13%] h-[31%] w-[34%]" />
      <div className="absolute left-[9%] right-[9%] top-[40.5%] text-center text-[clamp(8px,1.8vw,11px)] leading-[1.7] text-[#605246]">
        Building thoughtful systems from prototype signal to polished interface.
      </div>

      <div className="absolute left-[7%] right-[7%] top-[45.3%]">
        <ExperienceSceneCard experience={experiencesSeed[0]} />
      </div>
      <div className="absolute left-[7%] right-[7%] top-[67.8%]">
        <ExperienceSceneCard experience={experiencesSeed[1]} reversed />
      </div>
    </div>
  );
}

function ExperienceSceneCard({
  experience,
  reversed = false,
}: {
  experience: (typeof experiencesSeed)[number];
  reversed?: boolean;
}) {
  const [flipped, setFlipped] = useState(false);
  const [notes, setNotes] = useState(
    endorsementsSeed.filter((note) => note.featured),
  );
  const [draft, setDraft] = useState("");

  return (
    <article className="relative min-h-[260px] overflow-hidden rounded-[18px] border border-white/85 bg-[#849AAD]/65 p-[5%] shadow-[0_10px_24px_rgba(0,0,0,0.25)] backdrop-blur-sm">
      <div className="absolute inset-[4%] rounded-[16px] border border-white/75">
        <div className="abstract-photo h-full w-full rounded-[16px] opacity-75" />
      </div>
      <div
        className={`relative grid gap-3 ${
          reversed
            ? "grid-cols-[0.72fr_1fr] items-end"
            : "grid-cols-[1fr_0.72fr] items-start"
        }`}
      >
        <button
          aria-label={`Flip ${experience.companyName} responsibilities`}
          className={`relative z-10 min-h-32 rounded-[16px] border border-white/70 bg-[#849AAD]/85 p-4 text-left text-white shadow-lg backdrop-blur transition ${
            reversed ? "order-2" : ""
          }`}
          onClick={() => setFlipped((current) => !current)}
          type="button"
        >
          <AnimatePresence mode="wait">
            {flipped ? (
              <motion.ul
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2 text-[11px] leading-4"
                exit={{ opacity: 0, y: 8 }}
                initial={{ opacity: 0, y: 8 }}
                key="back"
              >
                {experience.responsibilities.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </motion.ul>
            ) : (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                initial={{ opacity: 0, y: -8 }}
                key="front"
              >
                <p className="font-display text-2xl font-semibold">
                  {experience.companyName}
                </p>
                <p className="mt-1 text-[10px] font-black uppercase">
                  {experience.positionName}
                </p>
                <p className="mt-2 text-[10px] leading-4 opacity-90">
                  {experience.summary}
                </p>
                <span className="mt-3 inline-block text-[10px] font-black uppercase">
                  Click to flip
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        <div className="relative z-10 grid gap-3">
          <div
            className="abstract-photo aspect-square w-full rounded-[14px] border border-white/80 shadow-md"
            style={
              {
                "--photo-a": reversed ? "#5E1C23" : "#849AAD",
                "--photo-b": reversed ? "#F2E5C6" : "#A1947F",
              } as CSSProperties
            }
          />
          <form
            className="rounded-[12px] bg-white p-3 shadow-lg"
            onSubmit={(event) => {
              event.preventDefault();
              if (!draft.trim()) {
                return;
              }
              setNotes((current) => [
                {
                  id: `local-${Date.now()}`,
                  experienceId: experience.id,
                  authorName: "Visitor",
                  note: draft.trim(),
                  approved: false,
                  featured: false,
                  createdAt: "Now",
                },
                ...current,
              ]);
              setDraft("");
            }}
          >
            <p className="text-[10px] font-black text-[#5E1C23]">
              Submit endorsement
            </p>
            <input
              className="mt-2 w-full rounded-md bg-[#eee] px-2 py-2 text-[10px] text-[#605246] outline-none focus:ring-1 focus:ring-[#5E1C23]"
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Write a note..."
              value={draft}
            />
            <button
              className="mt-2 inline-flex items-center gap-1 rounded-md bg-[#849AAD] px-2 py-1 text-[10px] font-black text-white"
              type="submit"
            >
              <Send aria-hidden="true" size={12} />
              Send
            </button>
          </form>
        </div>
      </div>

      <div className="relative z-10 mt-3 grid gap-2">
        {notes.slice(0, 2).map((note) => (
          <p
            className="rounded-md bg-white/88 px-3 py-2 text-[10px] leading-4 text-[#605246]"
            key={note.id}
          >
            <strong className="text-[#5E1C23]">{note.authorName}:</strong>{" "}
            {note.note}
          </p>
        ))}
      </div>
    </article>
  );
}
