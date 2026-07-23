"use client";

import type { CSSProperties, Dispatch, SetStateAction } from "react";
import { useMemo, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { projectsSeed } from "@/lib/portfolio-data";

export function ProjectsPage() {
  const [selected, setSelected] = useState(0);
  const { scrollY } = useScroll();
  const posterY = useTransform(scrollY, [0, 900], [0, -34]);
  const project = projectsSeed[selected];

  return (
    <main className="overflow-hidden">
      <section className="mx-auto grid w-full max-w-7xl px-3 pb-16 pt-6 sm:px-6 lg:grid-cols-[minmax(380px,580px)_minmax(420px,1fr)] lg:items-start lg:gap-0 lg:px-8">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="relative mx-auto w-full max-w-[580px] lg:justify-self-end"
          initial={{ opacity: 0, y: 18 }}
          style={{ y: posterY }}
          transition={{ duration: 0.65, ease: "easeOut" }}
        >
          <ProjectPoster selected={selected} setSelected={setSelected} />
        </motion.div>

        <motion.aside
          animate={{ opacity: 1, x: 0 }}
          className="relative z-20 mx-auto -mt-14 w-[calc(100%-1.5rem)] max-w-xl border border-[#5E1C23]/25 bg-[#F2E5C6]/94 p-5 shadow-[12px_12px_0_rgba(94,28,35,0.14)] backdrop-blur lg:sticky lg:top-32 lg:-ml-12 lg:mt-28 lg:w-full lg:p-7"
          initial={{ opacity: 0, x: 28 }}
          transition={{ delay: 0.1, duration: 0.65, ease: "easeOut" }}
        >
          <p className="text-xs font-black uppercase text-[#5E1C23]">
            Selected works
          </p>
          <h1 className="font-display mt-3 text-5xl font-semibold leading-none text-[#211b18] sm:text-7xl">
            Projects
          </h1>
          <p className="mt-5 text-sm leading-7 text-[#605246] sm:text-base sm:leading-8">
            These projects are proof-of-work postcards from the places where
            engineering, hardware thinking, and visual design overlap.
          </p>
          <div className="mt-6 border-l-4 border-[#5E1C23] pl-4">
            <p className="font-display text-3xl font-semibold text-[#211b18]">
              {project.name}
            </p>
            <a
              className="mt-2 inline-flex items-center gap-2 text-sm font-black text-[#5E1C23] underline-offset-4 hover:underline"
              href={project.projectLink}
            >
              View project
              <ExternalLink aria-hidden="true" size={15} />
            </a>
            <p className="mt-4 text-sm leading-7 text-[#605246]">
              {project.summary}
            </p>
          </div>
        </motion.aside>
      </section>
    </main>
  );
}

function ProjectPoster({
  selected,
  setSelected,
}: {
  selected: number;
  setSelected: Dispatch<SetStateAction<number>>;
}) {
  const project = projectsSeed[selected];
  const panels = useMemo(
    () => [
      {
        className: "left-[20%] top-[9%] h-[17%] w-[56%]",
        label: "who's this?",
      },
      {
        className: "left-[22%] top-[30.5%] h-[9%] w-[36%]",
        label: "her eyes",
      },
      {
        className: "right-[7%] top-[28.7%] h-[22%] w-[30%]",
        label: project.name,
      },
      {
        className: "left-[8%] top-[46%] h-[17%] w-[44%]",
        label: "2002 girl",
      },
    ],
    [project.name],
  );

  return (
    <div className="reference-phone relative aspect-[580/1721] overflow-hidden bg-[#f7f5ef]">
      <div className="absolute inset-0 bg-[#f7f5ef]" />
      <div className="poster-sketch absolute inset-x-[5%] top-[4%] h-[58%]" />
      <div className="absolute inset-x-[5%] top-[5%] h-[58%]">
        {panels.map((panel, index) => (
          <motion.button
            animate={{ y: index % 2 ? [0, -5, 0] : [0, 5, 0] }}
            aria-label={panel.label}
            className={`abstract-photo absolute border-2 border-[#5E1C23] shadow-[6px_6px_0_rgba(94,28,35,0.16)] ${panel.className}`}
            key={panel.label}
            style={
              {
                "--photo-a": index % 2 ? "#849AAD" : "#5E1C23",
                "--photo-b": index % 3 ? "#F2E5C6" : "#A1947F",
              } as CSSProperties
            }
            transition={{
              duration: 5 + index,
              ease: "easeInOut",
              repeat: Infinity,
            }}
            type="button"
          >
            <span className="absolute -bottom-3 left-2 bg-[#5E1C23] px-2 py-1 text-[clamp(9px,2.1vw,13px)] font-black text-white">
              {panel.label}
            </span>
          </motion.button>
        ))}
        <span className="absolute right-[13%] top-[22%] bg-[#5E1C23] px-2 text-[clamp(12px,3vw,18px)] font-black text-white">
          ?
        </span>
        <span className="absolute bottom-[22%] left-[2%] bg-[#5E1C23] px-2 text-[clamp(12px,3vw,18px)] font-black text-white">
          !
        </span>
      </div>

      <div className="absolute inset-x-[6%] bottom-[14%]">
        <div className="grid grid-cols-[0.72fr_0.95fr_0.72fr] items-center gap-[3%]">
          <AnimatePresence mode="wait">
            <motion.div
              animate={{ opacity: 1, x: 0 }}
              className="text-[#111]"
              exit={{ opacity: 0, x: -8 }}
              initial={{ opacity: 0, x: -8 }}
              key={`${project.id}-left`}
            >
              <p className="font-display text-[clamp(28px,8vw,46px)] font-black leading-none">
                {project.name.slice(0, 2)}
              </p>
              <p className="font-display text-[clamp(12px,3.2vw,18px)] font-semibold italic">
                Pinned Post
              </p>
              <p className="mt-3 text-[clamp(7px,1.7vw,10px)] font-semibold leading-[1.55]">
                {project.summary}
              </p>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              animate={{ opacity: 1, scale: 1 }}
              className="abstract-photo aspect-[4/5] border-2 border-black"
              exit={{ opacity: 0, scale: 1.03 }}
              initial={{ opacity: 0, scale: 1.03 }}
              key={`${project.id}-media`}
              style={
                {
                  "--photo-a": "#5E1C23",
                  "--photo-b": "#F2E5C6",
                } as CSSProperties
              }
            />
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              animate={{ opacity: 1, x: 0 }}
              className="text-[#111]"
              exit={{ opacity: 0, x: 8 }}
              initial={{ opacity: 0, x: 8 }}
              key={`${project.id}-right`}
            >
              <p className="text-[clamp(7px,1.7vw,10px)] font-black uppercase text-[#5E1C23]">
                What I did
              </p>
              <p className="mt-2 text-[clamp(7px,1.7vw,10px)] font-semibold leading-[1.55]">
                {project.whatIDid}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-[5%] grid grid-cols-4 gap-1">
          {projectsSeed.map((item, index) => {
            const active = selected === index;

            return (
              <button
                aria-label={item.name}
                aria-pressed={active}
                className={`abstract-photo aspect-[3/4] border-2 border-black transition ${
                  active ? "grayscale-0" : "grayscale"
                }`}
                key={item.id}
                onClick={() => setSelected(index)}
                style={
                  {
                    "--photo-a": index % 2 ? "#849AAD" : "#605246",
                    "--photo-b": index % 3 ? "#F2E5C6" : "#A1947F",
                  } as CSSProperties
                }
                type="button"
              />
            );
          })}
        </div>

        <div className="mt-3 flex justify-center gap-3">
          <button
            aria-label="Previous project"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#211b18] text-[#F2E5C6] transition hover:bg-[#5E1C23]"
            onClick={() =>
              setSelected((current) =>
                current === 0 ? projectsSeed.length - 1 : current - 1,
              )
            }
            type="button"
          >
            <ArrowLeft aria-hidden="true" size={18} />
          </button>
          <button
            aria-label="Next project"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#211b18] text-[#F2E5C6] transition hover:bg-[#5E1C23]"
            onClick={() =>
              setSelected((current) => (current + 1) % projectsSeed.length)
            }
            type="button"
          >
            <ArrowRight aria-hidden="true" size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
