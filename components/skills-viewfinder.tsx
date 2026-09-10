"use client";

/* eslint-disable @next/next/no-img-element */
import { useMemo, useState, type PointerEvent } from "react";
import {
  motion,
  type MotionValue,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { handleImageFallback } from "@/components/media-placeholder";
import type { SkillRecord } from "@/lib/portfolio-records";
import { getPhotoUrl, withMediaPlaceholder } from "@/lib/supabase-media";

const skillModes = [
  { id: "languages", label: "LANGUAGES", meter: "M01" },
  { id: "frameworks", label: "FRAMEWORKS", meter: "M02" },
  { id: "libraries", label: "LIBRARIES", meter: "M03" },
  { id: "tools", label: "TOOLS", meter: "M04" },
] as const;

type SkillMode = (typeof skillModes)[number];
type SkillCategory = SkillMode["id"];
type SkillItem = {
  category: SkillCategory;
  id: string;
  name: string;
  photo: string;
};

type FloatingBlockLayout = {
  className: string;
  depth: number;
  rotate: number;
  speed: "slow" | "fast";
};

type FloatingBlock = FloatingBlockLayout & {
  image: string;
  label: string;
  meta: string;
  status: string;
};

const floatingBlockLayouts: FloatingBlockLayout[] = [
  {
    className: "left-[3%] top-[14%] w-[188px] sm:w-[220px] md:left-[4%] md:top-[18%] md:w-[310px]",
    depth: 30,
    rotate: -13,
    speed: "slow",
  },
  {
    className: "right-[2%] top-[25%] w-[178px] sm:w-[215px] md:right-[6%] md:top-[15%] md:w-[300px]",
    depth: 42,
    rotate: 10,
    speed: "fast",
  },
  {
    className: "left-[4%] bottom-[14%] w-[190px] sm:w-[232px] md:left-[10%] md:bottom-[18%] md:w-[350px]",
    depth: 52,
    rotate: 8,
    speed: "fast",
  },
  {
    className: "right-[3%] bottom-[23%] w-[180px] sm:w-[224px] md:right-[10%] md:bottom-[12%] md:w-[330px]",
    depth: 36,
    rotate: -10,
    speed: "slow",
  },
];
const featuredSkillNames = [
  "React",
  "Pandas",
  "MongoDB",
  "PostgreSQL",
  "Python",
  "C",
  "Next.js",
] as const;
const fallbackSkillHeroImage = withMediaPlaceholder(
  getPhotoUrl("public/portfoliomedia/photos/skills.jpg"),
);

function isSkillCategory(value: string): value is SkillCategory {
  return skillModes.some((mode) => mode.id === value);
}

function getSkillMode(category: SkillCategory) {
  return skillModes.find((mode) => mode.id === category) ?? skillModes[0];
}

function getModeCount(skillItems: SkillItem[], category: SkillCategory) {
  return skillItems.filter((skill) => skill.category === category).length;
}

function normalizeSkillItems(skills: SkillRecord[]): SkillItem[] {
  return skills
    .map((skill) => ({
      ...skill,
      category: isSkillCategory(skill.category) ? skill.category : "tools",
    }))
    .sort((left, right) => {
      const leftIndex = featuredSkillNames.findIndex((name) => name === left.name);
      const rightIndex = featuredSkillNames.findIndex((name) => name === right.name);
      const leftRank = leftIndex === -1 ? Number.POSITIVE_INFINITY : leftIndex;
      const rightRank = rightIndex === -1 ? Number.POSITIVE_INFINITY : rightIndex;

      return leftRank - rightRank;
    });
}

function buildFloatingBlocks(skillItems: SkillItem[]): FloatingBlock[] {
  return floatingBlockLayouts.map((layout, index) => {
    const mode = skillModes[index % skillModes.length];
    const modeSkill =
      skillItems.find((skill) => skill.category === mode.id) ?? skillItems[index % skillItems.length];
    const count = getModeCount(skillItems, mode.id);

    return {
      ...layout,
      image: modeSkill?.photo ?? fallbackSkillHeroImage,
      label: mode.label,
      meta: modeSkill?.name ?? "Awaiting Capture",
      status: count > 0 ? `${count.toString().padStart(2, "0")} Saved` : "No Frame",
    };
  });
}

export function SkillsViewfinder({ skills }: { skills: SkillRecord[] }) {
  const skillItems = useMemo(() => normalizeSkillItems(skills), [skills]);
  const [selectedId, setSelectedId] = useState(skillItems[0]?.id ?? "");
  const activeSkill = skillItems.find((skill) => skill.id === selectedId) ?? skillItems[0];

  if (!activeSkill) {
    return (
      <main className="overflow-x-clip bg-[var(--color-deep)] text-[var(--color-text)]">
        <SkillsHero skillItems={skillItems} />
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-6xl border-y border-[var(--color-text)]/18 py-12">
            <p className="flex items-center gap-3 text-[10px] font-bold uppercase leading-none text-[#8f2b35]">
              Viewfinder Archive
              <span className="h-px flex-1 bg-[var(--color-text)]/16" />
              No Frames Yet
            </p>
            <h2 className="font-display mt-5 text-[46px] font-semibold uppercase leading-[0.86] text-[var(--color-text)] sm:text-[72px]">
              No Skills Captured
            </h2>
            <p className="mt-5 max-w-xl border-l border-[#8f2b35]/45 pl-4 text-sm font-light leading-7 text-[var(--color-text)]/64">
              Add rows to the skills table with a name, category, and skills
              bucket object key to populate the viewfinder and contact sheet.
            </p>
          </div>
        </section>
      </main>
    );
  }

  const activeMode = getSkillMode(activeSkill.category);
  const visibleSkillItems = skillItems.filter((skill) => skill.category === activeMode.id);
  const activeIndex = Math.max(
    0,
    visibleSkillItems.findIndex((skill) => skill.id === activeSkill.id),
  );

  function selectMode(category: SkillCategory) {
    const modeSkill = skillItems.find((skill) => skill.category === category);

    if (modeSkill) {
      setSelectedId(modeSkill.id);
    }
  }

  return (
    <main className="overflow-x-clip bg-[var(--color-deep)] text-[var(--color-text)]">
      <SkillsHero skillItems={skillItems} />
      <section className="relative isolate px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
        <img
          alt=""
          className="absolute inset-[-12%] h-[124%] w-[124%] object-cover opacity-20 blur-2xl brightness-[0.38] contrast-[1.18] saturate-100"
          decoding="async"
          loading="lazy"
          onError={handleImageFallback}
          src={activeSkill.photo}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(var(--color-deep-rgb),0.9),rgba(var(--color-deep-rgb),0.78)_48%,rgba(var(--color-deep-rgb),0.95)),linear-gradient(90deg,rgba(var(--color-deep-rgb),0.94),rgba(var(--color-deep-rgb),0.64),rgba(var(--color-deep-rgb),0.94))]" />
        <div className="absolute inset-0 bg-[var(--color-base)]/42" />
        <div className="editorial-film-grain absolute inset-0 opacity-28" />
      </div>

      <section className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="flex items-center justify-between gap-4 border-y border-[var(--color-text)]/20 py-3 text-[9px] font-bold uppercase leading-none text-[var(--color-text)]/58">
          <span className="text-[#8f2b35]">Viewfinder Archive</span>
          <span>Camera Modes / Contact Sheet</span>
          <span>Index 05</span>
        </div>

        <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_292px]">
          <section className="border border-[var(--color-text)]/22 bg-[var(--color-panel)]/88 p-2">
            <div className="flex items-center justify-between gap-3 border-b border-[var(--color-text)]/14 px-2 py-2 text-[9px] font-bold uppercase leading-none text-[var(--color-text)]/58 sm:px-3">
              <span className="inline-flex items-center gap-2 text-[#8f2b35]">
                <span className="h-1.5 w-1.5 bg-[#8f2b35]" />
                Rec
              </span>
              <span>{activeMode.label}</span>
              <span>
                Shot {(activeIndex + 1).toString().padStart(2, "0")} /{" "}
                {visibleSkillItems.length.toString().padStart(2, "0")}
              </span>
            </div>

            <div className="relative aspect-[4/5] overflow-hidden border border-[var(--color-text)]/18 bg-white sm:aspect-[16/10] lg:aspect-[16/9]">
              <img
                alt={`${activeSkill.name} skill reference`}
                className="h-full w-full bg-white object-contain p-8 sm:p-12"
                decoding="async"
                loading="lazy"
                onError={handleImageFallback}
                src={activeSkill.photo}
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(var(--color-deep-rgb),0.05)_48%,rgba(var(--color-deep-rgb),0.8)_100%)]" />
              <div className="archive-scanlines absolute inset-0 opacity-20" />

              <span className="absolute left-4 top-4 h-14 w-14 border-l border-t border-[var(--color-text)]/52" />
              <span className="absolute right-4 top-4 h-14 w-14 border-r border-t border-[var(--color-text)]/52" />
              <span className="absolute bottom-4 left-4 h-14 w-14 border-b border-l border-[var(--color-text)]/52" />
              <span className="absolute bottom-4 right-4 h-14 w-14 border-b border-r border-[var(--color-text)]/52" />
              <span className="absolute left-1/2 top-6 h-[calc(100%-3rem)] w-px -translate-x-1/2 bg-[var(--color-text)]/10" />
              <span className="absolute left-6 top-1/2 h-px w-[calc(100%-3rem)] -translate-y-1/2 bg-[var(--color-text)]/10" />
              <span className="absolute left-1/2 top-1/2 h-[34%] w-[42%] -translate-x-1/2 -translate-y-1/2 border border-[var(--color-text)]/16" />

              <div className="absolute left-4 right-4 top-4 flex items-start justify-between gap-4 text-[8px] font-bold uppercase leading-none text-[var(--color-text)]/58 sm:text-[9px]">
                <span>RAW / Manual</span>
                <span className="text-right">WB 5200K</span>
              </div>

              <div className="absolute bottom-5 left-5 right-5 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
                <div>
                  <p className="text-[9px] font-bold uppercase leading-none text-[#8f2b35]">
                    {activeMode.label}
                  </p>
                  <h2 className="font-display mt-2 max-w-full break-words text-[46px] font-semibold uppercase leading-[0.84] text-[var(--color-text)] sm:text-[68px] lg:text-[82px]">
                    {activeSkill.name}
                  </h2>
                </div>
                <div className="grid grid-cols-3 gap-px border border-[var(--color-text)]/16 bg-[var(--color-text)]/16 text-[8px] font-bold uppercase leading-none text-[var(--color-text)]/68 sm:w-[240px]">
                  <span className="bg-[var(--color-card-surface)]/92 px-2 py-2">ISO 400</span>
                  <span className="bg-[var(--color-card-surface)]/92 px-2 py-2">F 2.8</span>
                  <span className="bg-[var(--color-card-surface)]/92 px-2 py-2">1/125</span>
                </div>
              </div>
            </div>

            <div className="grid gap-px border-t border-[var(--color-text)]/14 bg-[var(--color-text)]/12 text-[9px] font-bold uppercase leading-none text-[var(--color-text)]/58 sm:grid-cols-4">
              <span className="bg-[var(--color-card-surface)] px-3 py-2.5">Focus / {activeSkill.name}</span>
              <span className="bg-[var(--color-card-surface)] px-3 py-2.5">Mode / {activeMode.meter}</span>
              <span className="bg-[var(--color-card-surface)] px-3 py-2.5">Light / Soft</span>
              <span className="bg-[var(--color-card-surface)] px-3 py-2.5 sm:text-right">State / Selected</span>
            </div>
          </section>

          <aside className="border-y border-[var(--color-text)]/16 bg-[var(--color-card-surface)]/92 p-4 xl:p-5">
            <div className="flex items-center gap-3 border-b border-[var(--color-text)]/14 pb-3 text-[9px] font-bold uppercase leading-none text-[var(--color-text)]/54">
              <span>Camera Modes</span>
              <span className="h-px flex-1 bg-[var(--color-text)]/14" />
            </div>
            <div
              aria-label="Skill category modes"
              className="mt-4 grid gap-px border-y border-[var(--color-text)]/14 bg-transparent"
              role="tablist"
            >
              {skillModes.map((mode) => {
                const active = activeMode.id === mode.id;
                const count = getModeCount(skillItems, mode.id);

                return (
                  <button
                    aria-selected={active}
                    className={`grid grid-cols-[1fr_auto] items-center gap-3 bg-[var(--color-card-surface)] px-3 py-3 text-left text-[10px] font-bold uppercase leading-none transition focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[#8f2b35] ${
                      active
                        ? "text-[var(--color-text)] shadow-[inset_3px_0_0_#8f2b35]"
                        : "text-[var(--color-text)]/50 hover:text-[#8f2b35]"
                    }`}
                    disabled={count === 0}
                    key={mode.id}
                    onClick={() => selectMode(mode.id)}
                    role="tab"
                    type="button"
                  >
                    <span>{mode.label}</span>
                    <span className={active ? "text-[#8f2b35]" : "text-[var(--color-text)]/34"}>
                      {count.toString().padStart(2, "0")}
                    </span>
                  </button>
                );
              })}
            </div>
            <dl className="mt-5 grid border-y border-[var(--color-text)]/14 text-[9px] font-bold uppercase leading-none">
              <div className="grid grid-cols-[92px_1fr] gap-3 border-b border-[var(--color-text)]/10 py-3">
                <dt className="text-[#8f2b35]">Capture</dt>
                <dd className="min-w-0 truncate text-[var(--color-text)]/64">{activeSkill.name}</dd>
              </div>
              <div className="grid grid-cols-[92px_1fr] gap-3 border-b border-[var(--color-text)]/10 py-3">
                <dt className="text-[#8f2b35]">Category</dt>
                <dd className="min-w-0 truncate text-[var(--color-text)]/64">{activeMode.label}</dd>
              </div>
              <div className="grid grid-cols-[92px_1fr] gap-3 py-3">
                <dt className="text-[#8f2b35]">Frame</dt>
                <dd className="min-w-0 truncate text-[var(--color-text)]/64">
                  {(activeIndex + 1).toString().padStart(2, "0")} of{" "}
                  {visibleSkillItems.length.toString().padStart(2, "0")}
                </dd>
              </div>
            </dl>
          </aside>
        </div>

        <section className="mt-5 border-y border-[var(--color-text)]/18 py-4">
          <div className="flex items-center gap-3 text-[9px] font-bold uppercase leading-none text-[var(--color-text)]/54">
            <span className="text-[#8f2b35]">Contact Sheet</span>
            <span className="h-px flex-1 bg-[var(--color-text)]/14" />
            <span>{visibleSkillItems.length.toString().padStart(2, "0")} Frames</span>
          </div>
          <div className="mt-4 flex w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {visibleSkillItems.map((skill, index) => {
              const active = skill.id === activeSkill.id;
              const mode = getSkillMode(skill.category);

              return (
                <button
                  aria-label={`Select ${skill.name}`}
                  aria-pressed={active}
                  className={`group relative h-[132px] w-[176px] shrink-0 overflow-hidden border bg-white text-left transition focus-visible:z-10 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[#8f2b35] sm:h-[152px] sm:w-[214px] ${
                    active
                      ? "z-10 border-[#8f2b35]/90"
                      : "-ml-px border-[var(--color-text)]/18 hover:border-[var(--color-text)]/44"
                  }`}
                  key={skill.id}
                  onClick={() => setSelectedId(skill.id)}
                  type="button"
                >
                  <img
                    alt=""
                    aria-hidden="true"
                    className={`h-full w-full bg-white object-contain p-4 transition duration-300 ${
                      active
                        ? "opacity-100"
                        : "opacity-80 group-hover:opacity-100"
                    }`}
                    decoding="async"
                    loading="lazy"
                    onError={handleImageFallback}
                    src={skill.photo}
                  />
                  <span className="absolute inset-0 bg-[linear-gradient(180deg,transparent_36%,rgba(var(--color-deep-rgb),0.76))]" />
                  {active ? <span className="absolute inset-x-0 top-0 h-1 bg-[#8f2b35]" /> : null}
                  <span className="absolute left-2 right-2 top-2 flex items-center justify-between border-b border-[var(--color-text)]/20 pb-1.5 text-[8px] font-bold uppercase leading-none text-[var(--color-text)]/56">
                    <span>{(index + 1).toString().padStart(2, "0")}</span>
                    <span>{mode.meter}</span>
                  </span>
                  <span className="absolute bottom-2 left-2 right-2 border-t border-[var(--color-text)]/24 pt-2 text-[9px] font-bold uppercase leading-3 text-[var(--color-text)]">
                    {skill.name}
                    <span className="block text-[#8f2b35]">{mode.label}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      </section>
      </section>
    </main>
  );
}

function SkillsHero({ skillItems }: { skillItems: SkillItem[] }) {
  const { scrollYProgress } = useScroll();
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const floatingBlocks = useMemo(() => buildFloatingBlocks(skillItems), [skillItems]);
  const slowY = useTransform(scrollYProgress, [0, 0.28], [0, -52]);
  const fastY = useTransform(scrollYProgress, [0, 0.28], [0, -92]);
  const titleY = useTransform(scrollYProgress, [0, 0.28], [0, -36]);

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect();

    cursorX.set((event.clientX - rect.left) / rect.width - 0.5);
    cursorY.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  function handlePointerLeave() {
    cursorX.set(0);
    cursorY.set(0);
  }

  return (
    <section
      className="relative isolate flex min-h-[calc(100svh-72px)] items-center justify-center overflow-hidden px-4 py-20 text-[var(--color-text)] sm:px-6 lg:min-h-screen lg:px-8"
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
    >
      <div aria-hidden="true" className="absolute inset-0">
        <img
          alt=""
          className="h-full w-full object-cover opacity-100 brightness-[0.64] contrast-[1.08] saturate-100"
          onError={handleImageFallback}
          src={fallbackSkillHeroImage}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_42%,rgba(var(--color-deep-rgb),0.06),rgba(var(--color-deep-rgb),0.56)_62%,rgba(var(--color-deep-rgb),0.78)),linear-gradient(180deg,rgba(var(--color-deep-rgb),0.08),rgba(var(--color-deep-rgb),0.64))]" />
        <div className="absolute inset-0 bg-[var(--color-base)]/15" />
      </div>

      {floatingBlocks.map((block) => (
        <FloatingSkillBlock
          block={block}
          cursorX={cursorX}
          cursorY={cursorY}
          key={block.label}
          scrollY={block.speed === "fast" ? fastY : slowY}
        />
      ))}

      <motion.div
        className="relative z-20 mx-auto max-w-5xl text-center"
        style={{ y: titleY }}
      >
        <div className="mx-auto mb-5 flex max-w-xl items-center gap-3 text-[10px] font-bold uppercase leading-none text-[#8f2b35]">
          <span>Capability Mix</span>
          <span className="h-px flex-1 bg-[var(--color-text)]/18" />
          <span>Live Set</span>
        </div>
        <h1 className="font-display text-[78px] font-semibold uppercase leading-[0.76] text-[var(--color-text)] sm:text-[132px] lg:text-[168px]">
          Skills
        </h1>
        <p className="mx-auto mt-8 max-w-2xl border-y border-[var(--color-text)]/18 bg-[var(--color-deep)]/88 px-5 py-4 text-sm font-light leading-7 text-[var(--color-text)] shadow-[0_18px_48px_rgba(0,0,0,0.28)] backdrop-blur-md sm:px-7 sm:text-base">
          My skills are less of a checklist and more of a record of the questions I
          have followed. They span low-level systems, AI, full-stack engineering,
          hardware, and design, with each one developed through something I
          genuinely wanted to build.
        </p>
      </motion.div>
    </section>
  );
}

function FloatingSkillBlock({
  block,
  cursorX,
  cursorY,
  scrollY,
}: {
  block: FloatingBlock;
  cursorX: MotionValue<number>;
  cursorY: MotionValue<number>;
  scrollY: MotionValue<number>;
}) {
  const smoothX = useSpring(cursorX, { damping: 24, mass: 0.35, stiffness: 95 });
  const smoothY = useSpring(cursorY, { damping: 24, mass: 0.35, stiffness: 95 });
  const x = useTransform(smoothX, [-0.5, 0.5], [-block.depth, block.depth]);
  const y = useTransform(smoothY, [-0.5, 0.5], [-block.depth * 0.62, block.depth * 0.62]);
  const rotate = useTransform(
    smoothX,
    [-0.5, 0.5],
    [block.rotate - 2.4, block.rotate + 2.4],
  );

  return (
    <motion.div
      aria-hidden="true"
      className={`pointer-events-none absolute hidden md:block ${block.className}`}
      style={{ y: scrollY }}
    >
      <motion.div
        animate={{
          scale: [1, 1.018, 1],
        }}
        className="relative overflow-hidden rounded-[22px] border border-white/70 bg-white/90 p-2 text-[var(--color-ink)] opacity-[0.92] shadow-[0_18px_48px_rgba(0,0,0,0.28)] ring-1 ring-[var(--color-ink)]/8 backdrop-blur-xl md:rounded-[28px] md:p-2.5 md:opacity-100 md:shadow-[0_24px_70px_rgba(0,0,0,0.32)]"
        style={{ rotate, x, y }}
        transition={{ duration: 7.5, ease: "easeInOut", repeat: Infinity }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.94),rgba(255,255,255,0.74)_54%,rgba(242,229,198,0.82))]" />
        <div className="absolute inset-x-0 top-0 h-px bg-white/90" />

        <div className="relative">
          <div className="flex items-center justify-between gap-2 border-b border-[var(--color-ink)]/10 pb-1.5 text-[7px] font-bold uppercase leading-none text-[var(--color-ink)]/44 md:gap-3 md:pb-2 md:text-[8px]">
            <span className="inline-flex items-center gap-1.5 text-[#8f2b35]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#8f2b35]" />
              {block.status}
            </span>
            <span>Skill Mix</span>
          </div>

          <div className="mt-2 grid grid-cols-[42px_1fr] items-center gap-2 md:mt-2.5 md:grid-cols-[58px_1fr] md:gap-3">
            <img
              alt=""
              className="h-[42px] w-[42px] rounded-[14px] bg-white object-contain p-1 md:h-[58px] md:w-[58px] md:rounded-[17px]"
              onError={handleImageFallback}
              src={block.image}
            />
            <div className="min-w-0">
              <p className="truncate text-[7px] font-bold uppercase leading-none text-[#8f2b35] md:text-[9px]">
                {block.label}
              </p>
              <p className="font-display mt-1 truncate text-[15px] font-semibold uppercase leading-none text-[var(--color-ink)] sm:text-[18px] md:text-2xl">
                {block.meta}
              </p>
              <p className="mt-1 truncate text-[7px] font-bold uppercase leading-none text-[var(--color-ink)]/42 md:text-[9px]">
                Portfolio Capture / Saved
              </p>
            </div>
          </div>

          <div className="mt-2.5 grid grid-cols-[22px_1fr_22px] items-center gap-2 md:mt-3.5 md:grid-cols-[28px_1fr_28px] md:gap-3">
            <span className="grid h-[22px] w-[22px] place-items-center rounded-full bg-[var(--color-ink)] md:h-7 md:w-7">
              <span className="ml-0.5 h-0 w-0 border-y-[5px] border-l-[8px] border-y-transparent border-l-white" />
            </span>
            <span className="relative h-[3px] overflow-hidden rounded-full bg-[var(--color-ink)]/14">
              <span className="absolute inset-y-0 left-0 w-[54%] rounded-full bg-[#8f2b35]" />
              <span className="absolute left-[54%] top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full border border-white bg-[#8f2b35]" />
            </span>
            <span className="grid h-[22px] w-[22px] place-items-center rounded-full bg-[var(--color-ink)]/8 md:h-7 md:w-7">
              <span className="h-3 w-3 rounded-full border border-[var(--color-ink)]/46" />
            </span>
          </div>

          <div className="mt-2 flex items-center justify-between border-t border-[var(--color-ink)]/10 pt-1.5 text-[7px] font-bold uppercase leading-none text-[var(--color-ink)]/42 md:mt-3 md:pt-2 md:text-[8px]">
            <span>00:15</span>
            <span className="inline-flex items-center gap-1">
              <span className="h-1 w-1 rounded-full bg-[#8f2b35]" />
              <span className="h-1 w-1 rounded-full bg-[var(--color-ink)]/28" />
              <span className="h-1 w-1 rounded-full bg-[var(--color-ink)]/28" />
            </span>
            <span>03:10</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
