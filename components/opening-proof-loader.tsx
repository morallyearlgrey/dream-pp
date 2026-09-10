"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { heroPhoto } from "@/lib/about-data";

const statusLabels = ["SETTING LIGHT", "SELECTING FRAME", "ISSUE OPEN"];

export function OpeningProofLoader() {
  const prefersReducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion) {
      const reducedTimer = window.setTimeout(() => setVisible(false), 850);

      return () => window.clearTimeout(reducedTimer);
    }

    const timers = [
      window.setTimeout(() => setStatusIndex(1), 610),
      window.setTimeout(() => setStatusIndex(2), 1260),
      window.setTimeout(() => setVisible(false), 2180),
    ];

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [prefersReducedMotion]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          aria-busy="true"
          aria-label="Opening Kai Sprunger portfolio"
          className="fixed inset-0 z-[100] isolate overflow-hidden bg-[var(--color-base)] text-[var(--color-text)]"
          exit={
            prefersReducedMotion
              ? { opacity: 0 }
              : { clipPath: "inset(0 0 0 100%)", opacity: 0.92 }
          }
          initial={false}
          transition={{ duration: prefersReducedMotion ? 0.3 : 0.58, ease: [0.76, 0, 0.24, 1] }}
        >
          <div aria-hidden="true" className="absolute inset-0 bg-[var(--color-base)]" />
          <motion.img
            alt=""
            aria-hidden="true"
            animate={
              prefersReducedMotion
                ? { opacity: 0.14 }
                : {
                    opacity: [0, 0.2, 0.16],
                    scale: [1.12, 1.03, 1.07],
                  }
            }
            className="absolute left-1/2 top-1/2 h-[78vh] w-[min(78vw,760px)] -translate-x-1/2 -translate-y-1/2 object-cover opacity-0 blur-2xl grayscale brightness-[0.42] contrast-[1.28]"
            initial={{ opacity: 0, scale: 1.12 }}
            src={heroPhoto}
            transition={{ delay: prefersReducedMotion ? 0 : 0.18, duration: 1.25, ease: "easeOut" }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_48%,rgba(var(--color-text-rgb),0.08),rgba(var(--color-base-rgb),0.72)_58%,var(--color-base)_100%)]" />
          <div className="editorial-film-grain absolute inset-0 opacity-28" />

          <div className="relative z-10 flex min-h-screen flex-col justify-between px-5 py-6 sm:px-8 sm:py-7 lg:px-12">
            <div className="flex items-center justify-between gap-4 border-y border-[var(--color-text)]/12 py-2 text-[9px] font-bold uppercase leading-none text-[var(--color-text)]/52">
              <span className="text-[#8f2b35]">Opening Look 01</span>
              <span className="hidden sm:inline">Kai Sprunger / Private Issue</span>
              <span>Soft Proof</span>
            </div>

            <div className="mx-auto grid w-full max-w-5xl place-items-center">
              <motion.div
                aria-hidden="true"
                className="relative h-[176px] w-[min(78vw,620px)] border-y border-[#8f2b35]/72 bg-[var(--color-text)]/[0.025] sm:h-[220px]"
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scaleX: 0.68 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: prefersReducedMotion ? 0.2 : 0.46, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="absolute -left-px -top-px h-8 w-8 border-l border-t border-[var(--color-text)]/58" />
                <span className="absolute -right-px -top-px h-8 w-8 border-r border-t border-[var(--color-text)]/58" />
                <span className="absolute -bottom-px -left-px h-8 w-8 border-b border-l border-[var(--color-text)]/58" />
                <span className="absolute -bottom-px -right-px h-8 w-8 border-b border-r border-[var(--color-text)]/58" />
                <motion.span
                  aria-hidden="true"
                  className="absolute inset-y-[-18px] left-0 w-[34%] border-x border-[#8f2b35]/64 bg-[#8f2b35]/10"
                  initial={{ x: "-115%" }}
                  animate={prefersReducedMotion ? { x: "34%" } : { x: ["-115%", "35%", "214%"] }}
                  transition={{ delay: 0.36, duration: 1.05, ease: [0.76, 0, 0.24, 1] }}
                />
                <motion.span
                  aria-hidden="true"
                  className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-[#8f2b35]/88"
                  initial={{ scaleX: 0, transformOrigin: "left" }}
                  animate={{ scaleX: prefersReducedMotion ? 1 : [0, 1, 0.84] }}
                  transition={{ delay: 0.18, duration: 0.9, ease: "easeOut" }}
                />
              </motion.div>

              <div className="mt-6 flex w-full max-w-[620px] items-center gap-3 text-[10px] font-bold uppercase leading-none text-[var(--color-text)]/58">
                <span className="h-px flex-1 bg-[var(--color-text)]/18" />
                <AnimatePresence mode="wait">
                  <motion.span
                    animate={{ opacity: 1, y: 0 }}
                    className="min-w-[120px] text-center text-[#8f2b35]"
                    exit={{ opacity: 0, y: -6 }}
                    initial={{ opacity: 0, y: 6 }}
                    key={statusLabels[statusIndex]}
                    transition={{ duration: prefersReducedMotion ? 0.15 : 0.22, ease: "easeOut" }}
                  >
                    {statusLabels[statusIndex]}
                  </motion.span>
                </AnimatePresence>
                <span className="h-px flex-1 bg-[var(--color-text)]/18" />
              </div>

              <motion.h1
                aria-hidden="true"
                animate={
                  prefersReducedMotion
                    ? { opacity: [0, 1, 0] }
                    : { opacity: [0, 0, 1, 1, 0], scale: [0.98, 0.98, 1, 1, 1.02] }
                }
                className="pointer-events-none absolute px-4 text-center font-display text-[54px] font-semibold uppercase leading-[0.78] text-[var(--color-text)] mix-blend-screen sm:text-[104px] lg:text-[142px]"
                initial={{ opacity: 0, scale: 0.98 }}
                transition={{
                  delay: prefersReducedMotion ? 0.16 : 1.34,
                  duration: prefersReducedMotion ? 0.52 : 0.64,
                  ease: "easeOut",
                  times: prefersReducedMotion ? [0, 0.45, 1] : [0, 0.2, 0.42, 0.72, 1],
                }}
              >
                Kai Sprunger
              </motion.h1>
            </div>

            <div className="grid gap-px border-y border-[var(--color-text)]/14 bg-transparent text-[8px] font-bold uppercase leading-none text-[var(--color-text)]/54 sm:grid-cols-3">
              <span className="px-3 py-2">Light / Low Contrast</span>
              <span className="px-3 py-2">Frame / Maroon Mark</span>
              <span className="px-3 py-2 sm:text-right">Issue / Personal Edition</span>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
