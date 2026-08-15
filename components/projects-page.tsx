"use client";

/* eslint-disable @next/next/no-img-element */
import type { CSSProperties, Dispatch, SetStateAction } from "react";
import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { projectsSeed } from "@/lib/portfolio-data";

type ProjectFeature = (typeof projectsSeed)[number];

type ProjectVideoAsset = {
  frameClassName: string;
  meta: string;
  src: string;
};

type ProjectMediaAsset = {
  alt: string;
  src: string;
  type: "image" | "video";
};

const projectVideoAssets: ProjectVideoAsset[] = [
  {
    frameClassName:
      "left-[16%] top-[7%] h-[22%] w-[68%] rotate-[0.8deg] lg:left-[5%] lg:top-[11%] lg:h-[30%] lg:w-[35%] lg:rotate-[-1.2deg]",
    meta: "Frame 01",
    src: "/projects/IMG_1775 2.MOV",
  },
  {
    frameClassName:
      "left-[9%] top-[34%] h-[12%] w-[47%] rotate-[-0.8deg] lg:left-[31%] lg:top-[20%] lg:h-[22%] lg:w-[26%] lg:rotate-[1.1deg]",
    meta: "Frame 02",
    src: "/projects/IMG_1967.MOV",
  },
  {
    frameClassName:
      "right-[4%] top-[68%] h-[18%] w-[44%] rotate-[0.6deg] lg:right-[6%] lg:top-[64%] lg:h-[24%] lg:w-[25%] lg:rotate-[1.2deg]",
    meta: "Frame 03",
    src: "/projects/IMG_2431.MOV",
  },
  {
    frameClassName:
      "left-[8%] bottom-[12%] h-[21%] w-[62%] rotate-[-0.5deg] lg:left-[14%] lg:bottom-[4%] lg:h-[28%] lg:w-[32%] lg:rotate-[-0.7deg]",
    meta: "Frame 04",
    src: "/projects/IMG_2443.MOV",
  },
];
const stripSlots = [-2, -1, 0, 1, 2] as const;

function getProjectMedia(project: ProjectFeature): ProjectMediaAsset {
  const src = project.mainVideo ?? project.photos[0] ?? "/references/projects.jpg";

  return {
    alt: `${project.name} project media`,
    src,
    type: /\.(mov|mp4|webm)$/i.test(src) ? "video" : "image",
  };
}

function formatDateRange(project: ProjectFeature) {
  if (project.fromDate && project.toDate) {
    return `${project.fromDate} - ${project.toDate}`;
  }

  return project.fromDate || project.toDate || "Date pending";
}

function getWrappedProjectIndex(index: number) {
  return (index + projectsSeed.length) % projectsSeed.length;
}

function hasProjectLink(project: ProjectFeature) {
  return Boolean(project.projectLink && project.projectLink !== "#");
}

export function ProjectsPage() {
  const [selected, setSelected] = useState(0);

  return (
    <main className="overflow-hidden bg-[#0b0b0a] text-[#f2e5c6]">
      <ProjectHero selected={selected} setSelected={setSelected} />
      <EditorialSpreadSection selected={selected} setSelected={setSelected} />
    </main>
  );
}

function ProjectHero({
  selected,
  setSelected,
}: {
  selected: number;
  setSelected: Dispatch<SetStateAction<number>>;
}) {
  const { scrollY } = useScroll();
  const coverY = useTransform(scrollY, [0, 900], [0, -30]);

  return (
    <section className="relative isolate min-h-[calc(100svh-72px)] overflow-hidden bg-[#0b0b0a] px-5 pb-12 pt-6 text-[#f2e5c6] sm:px-8 lg:min-h-screen lg:px-12">
      <ProjectBackgroundTexture selected={selected} />

      <div className="relative z-30 mx-auto flex max-w-7xl items-center justify-between gap-4 border-b border-[#f2e5c6]/18 pb-2 text-[8px] font-bold uppercase leading-none text-[#f2e5c6]/58 sm:text-[10px]">
        <span>Project Cover Archive</span>
        <span className="hidden text-center sm:block">Interactive Systems / Motion Proof</span>
        <span>Issue 03</span>
      </div>

      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="relative z-20 mx-auto mt-5 h-[760px] max-w-[440px] overflow-visible sm:h-[860px] lg:mt-8 lg:h-[650px] lg:max-w-7xl"
        initial={{ opacity: 0, y: 18 }}
        style={{ y: coverY }}
        transition={{ duration: 0.65, ease: "easeOut" }}
      >
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-[6%] h-[86%] w-[78%] -translate-x-1/2 border border-[#f2e5c6]/10 bg-[#f2e5c6]/[0.015] lg:top-[8%] lg:h-[78%] lg:w-[66%]"
        />
        <div
          aria-hidden="true"
          className="absolute left-[7%] right-[7%] top-[14%] h-px bg-[#f2e5c6]/16 lg:left-0 lg:right-0 lg:top-[52%]"
        />
        <div
          aria-hidden="true"
          className="absolute bottom-[16%] left-[12%] right-[4%] h-px bg-[#5E1C23]/55 lg:bottom-[18%] lg:left-[42%] lg:right-[6%]"
        />

        <h1 className="pointer-events-none absolute left-1/2 top-[52%] z-50 -translate-x-1/2 whitespace-nowrap font-display text-[64px] font-semibold uppercase leading-[0.82] text-[#f2e5c6] mix-blend-screen sm:text-[104px] lg:left-[50%] lg:top-[42%] lg:text-[148px] xl:text-[176px] 2xl:text-[202px]">
          Projects
        </h1>

        <div className="absolute left-[6%] top-[24%] z-10 h-[46%] w-[72%] rotate-[-4deg] opacity-25 blur-[1px] lg:left-[26%] lg:top-[16%] lg:h-[58%] lg:w-[36%]">
          <video
            aria-hidden="true"
            autoPlay
            className="h-full w-full object-cover grayscale brightness-[0.42] contrast-[1.28]"
            loop
            muted
            playsInline
            preload="metadata"
            src={projectVideoAssets[(selected + 1) % projectVideoAssets.length].src}
          />
        </div>

        {projectVideoAssets.map((asset, index) => (
          <ProjectVideoFrame
            asset={asset}
            index={index}
            key={asset.src}
            selected={selected}
            setSelected={setSelected}
          />
        ))}

        <div className="absolute right-[9%] top-[29%] z-40 border border-[#f2e5c6]/28 bg-[#5E1C23] px-2 py-1 text-[10px] font-black uppercase leading-none text-[#f2e5c6] lg:right-[36%] lg:top-[10%]">
          Active
        </div>
        <div className="absolute left-[5%] top-[62%] z-40 border border-[#f2e5c6]/28 bg-[#d7b82d] px-2 py-1 text-[10px] font-black uppercase leading-none text-[#111] lg:left-[2%] lg:top-[58%]">
          Proof
        </div>
      </motion.div>
    </section>
  );
}

function ProjectBackgroundTexture({ selected }: { selected: number }) {
  const activeVideo = projectVideoAssets[selected % projectVideoAssets.length];

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      <video
        autoPlay
        className="absolute inset-[-12%] h-[124%] w-[124%] object-cover opacity-70 blur-2xl grayscale brightness-[0.42] contrast-[1.25]"
        loop
        muted
        playsInline
        preload="metadata"
        src={activeVideo.src}
      />
      <div className="absolute inset-0 grid grid-cols-2 opacity-[0.18] blur-[1.5px] grayscale">
        {projectVideoAssets.map((asset) => (
          <video
            autoPlay
            className="h-full w-full object-cover brightness-[0.58] contrast-[1.2]"
            key={asset.src}
            loop
            muted
            playsInline
            preload="metadata"
            src={asset.src}
          />
        ))}
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,8,7,0.58)_0%,rgba(8,8,7,0.2)_44%,rgba(8,8,7,0.74)_100%),radial-gradient(ellipse_at_50%_42%,rgba(242,229,198,0.18),transparent_44%),linear-gradient(90deg,rgba(8,8,7,0.74),rgba(8,8,7,0.12),rgba(8,8,7,0.72))]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(242,229,198,0.055)_1px,transparent_1px),linear-gradient(180deg,rgba(242,229,198,0.04)_1px,transparent_1px)] [background-size:46px_46px]" />
      <div className="archive-scanlines absolute inset-0 opacity-35" />
      <div className="editorial-film-grain absolute inset-0 opacity-70" />
    </div>
  );
}

function ProjectVideoFrame({
  asset,
  index,
  selected,
  setSelected,
}: {
  asset: ProjectVideoAsset;
  index: number;
  selected: number;
  setSelected: Dispatch<SetStateAction<number>>;
}) {
  const project = projectsSeed[index % projectsSeed.length];
  const active = selected === index;

  return (
    <motion.button
      animate={{ y: index % 2 ? [0, -4, 0] : [0, 4, 0] }}
      aria-label={`Select ${project.name}`}
      aria-pressed={active}
      className={`absolute z-20 overflow-visible text-left transition ${asset.frameClassName}`}
      onClick={() => setSelected(index)}
      transition={{
        duration: 5.8 + index,
        ease: "easeInOut",
        repeat: Infinity,
      }}
      type="button"
      whileHover={{ scale: 1.015 }}
    >
      <span
        className={`absolute inset-0 overflow-hidden border bg-[#080807] shadow-[0_18px_44px_rgba(0,0,0,0.24)] transition ${
          active
            ? "border-[#d7b82d]/90"
            : "border-[#f2e5c6]/36 hover:border-[#f2e5c6]/72"
        }`}
      >
        <video
          autoPlay
          className={`h-full w-full object-cover transition duration-500 ${
            active
              ? "brightness-[0.88] contrast-[1.14] saturate-[0.85]"
              : "grayscale brightness-[0.62] contrast-[1.2] saturate-[0.55]"
          }`}
          loop
          muted
          playsInline
          preload="metadata"
          src={asset.src}
        />
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,8,7,0.04)_0%,rgba(8,8,7,0.12)_52%,rgba(8,8,7,0.42)_100%)]"
        />
        <span aria-hidden="true" className="archive-scanlines absolute inset-0 opacity-20" />
      </span>
      <span
        className={`absolute -bottom-3 left-2 z-20 border px-2 py-1 text-[9px] font-black uppercase leading-none shadow-[0_8px_18px_rgba(0,0,0,0.26)] sm:text-[10px] ${
          active
            ? "border-[#f2e5c6]/36 bg-[#d7b82d] text-[#111]"
            : "border-[#f2e5c6]/28 bg-[#5E1C23] text-[#f2e5c6]"
        }`}
      >
        {project.name}
      </span>
      <span className="absolute right-2 top-2 z-20 border-t border-[#f2e5c6]/38 pt-1 text-[8px] font-bold uppercase leading-none text-[#f2e5c6]/68">
        {asset.meta}
      </span>
    </motion.button>
  );
}

function EditorialSpreadSection({
  selected,
  setSelected,
}: {
  selected: number;
  setSelected: Dispatch<SetStateAction<number>>;
}) {
  const project = projectsSeed[selected];

  return (
    <section className="relative isolate overflow-hidden bg-[#080807] px-5 py-10 text-[#f2e5c6] sm:px-8 sm:py-12 lg:min-h-[1080px] lg:px-12 lg:py-14">
      <ProjectSpreadBackground project={project} />

      <div className="relative z-20 mx-auto max-w-[1500px] overflow-visible">
        <div className="flex items-center justify-between gap-4 border-y border-[#f2e5c6]/20 py-2 text-[9px] font-bold uppercase leading-none text-[#f2e5c6]/58">
          <span>Project {String(selected + 1).padStart(2, "0")}</span>
          <span className="hidden text-center sm:block">{formatDateRange(project)}</span>
          <span>{projectsSeed.length} Works</span>
        </div>

        <div className="mt-8 grid gap-6 lg:min-h-[650px] lg:grid-cols-[minmax(250px,0.82fr)_minmax(470px,1.36fr)_minmax(250px,0.82fr)] lg:items-start lg:gap-8 xl:grid-cols-[minmax(300px,0.86fr)_minmax(520px,1.42fr)_minmax(290px,0.86fr)]">
          <ProjectInfoPanel
            project={project}
            selected={selected}
          />

          <ActiveProjectFeature
            project={project}
            selected={selected}
          />

          <ProjectWorkPanel project={project} />
        </div>

        <DesktopProjectStrip
          selected={selected}
          setSelected={setSelected}
        />

        <MobileProjectStrip
          selected={selected}
          setSelected={setSelected}
        />
      </div>
    </section>
  );
}

function ActiveProjectFeature({
  project,
  selected,
}: {
  project: ProjectFeature;
  selected: number;
}) {
  return (
    <figure className="order-1 relative z-20 mx-auto w-full max-w-[520px] lg:order-none lg:max-w-[590px]">
      <div
        aria-hidden="true"
        className="absolute left-[-12%] right-[-12%] top-[14%] hidden h-px bg-[#f2e5c6]/18 lg:block"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-[18%] left-[-6%] right-[-6%] hidden h-px bg-[#5E1C23]/58 lg:block"
      />
      <div className="relative mx-auto aspect-[4/5] w-full max-w-[430px] overflow-hidden border border-[#f2e5c6]/40 bg-[#050505] lg:h-[560px] lg:max-w-[440px] xl:h-[590px]">
        <ProjectMedia
          className="h-full w-full object-cover brightness-[0.9] contrast-[1.14] saturate-[0.92]"
          project={project}
        />
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,8,7,0.02)_0%,rgba(8,8,7,0.08)_46%,rgba(8,8,7,0.5)_100%)]"
        />
        <span aria-hidden="true" className="archive-scanlines absolute inset-0 opacity-20" />
        <div className="absolute left-3 right-3 top-3 flex items-center justify-between border-b border-[#f2e5c6]/24 pb-2 text-[9px] font-bold uppercase leading-none text-[#f2e5c6]/74">
          <span>Feature Frame</span>
          <span>{String(selected + 1).padStart(2, "0")}</span>
        </div>
      </div>
      <figcaption className="mx-auto mt-3 flex max-w-[430px] items-center justify-between gap-4 border-y border-[#f2e5c6]/18 py-2 text-[9px] font-bold uppercase leading-none text-[#f2e5c6]/54 lg:max-w-[440px]">
        <span>{project.id}</span>
        <span className="text-right text-[#d7b82d]">{formatDateRange(project)}</span>
      </figcaption>
    </figure>
  );
}

function ProjectSpreadBackground({ project }: { project: ProjectFeature }) {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-[-12%]">
        <ProjectMedia
          className="h-full w-full scale-110 object-cover opacity-70 blur-2xl grayscale brightness-[0.34] contrast-[1.22]"
          decorative
          project={project}
        />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,8,7,0.72)_0%,rgba(8,8,7,0.34)_40%,rgba(8,8,7,0.9)_100%),linear-gradient(90deg,rgba(8,8,7,0.86)_0%,rgba(8,8,7,0.3)_46%,rgba(8,8,7,0.86)_100%),radial-gradient(ellipse_at_50%_56%,rgba(242,229,198,0.13),transparent_46%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(242,229,198,0.06)_1px,transparent_1px),linear-gradient(180deg,rgba(242,229,198,0.045)_1px,transparent_1px)] [background-size:46px_46px]" />
      <div className="archive-scanlines absolute inset-0 opacity-40" />
      <div className="editorial-film-grain absolute inset-0 opacity-75" />
    </div>
  );
}

function ProjectInfoPanel({
  project,
  selected,
}: {
  project: ProjectFeature;
  selected: number;
}) {
  const displayRange = formatDateRange(project);
  const tools = project.toolsUsed?.join(", ");

  return (
    <section
      aria-live="polite"
      className="order-2 relative z-30 border-y border-[#f2e5c6]/22 bg-[#080807]/32 px-0 py-4 text-[#f2e5c6] backdrop-blur-[2px] lg:order-none lg:mt-16 lg:border-y-0 lg:border-l lg:bg-transparent lg:py-0 lg:pl-4"
    >
      <div className="flex items-center justify-between gap-4 border-b border-[#f2e5c6]/16 pb-3 text-[9px] font-bold uppercase leading-none text-[#f2e5c6]/54">
        <span>Active Project</span>
        <span>{String(selected + 1).padStart(2, "0")}</span>
      </div>
      <h3 className="mt-5 font-display text-[44px] font-semibold uppercase leading-[0.82] text-[#f2e5c6] sm:text-[64px] lg:text-[70px] xl:text-[86px]">
        {project.name}
      </h3>
      <dl className="mt-5 grid gap-2 border-y border-[#f2e5c6]/14 py-4 text-[10px] leading-5 sm:text-xs">
        <div className="grid grid-cols-[82px_1fr] gap-3">
          <dt className="font-bold uppercase text-[#d7b82d]">Dates</dt>
          <dd className="text-[#f2e5c6]/72">{displayRange}</dd>
        </div>
        {tools ? (
          <div className="grid grid-cols-[82px_1fr] gap-3">
            <dt className="font-bold uppercase text-[#d7b82d]">Tools</dt>
            <dd className="text-[#f2e5c6]/72">{tools}</dd>
          </div>
        ) : null}
      </dl>
      <p className="mt-4 text-sm font-light leading-6 text-[#f2e5c6]/70">
        {project.summary}
      </p>
      <ProjectLink project={project} />
    </section>
  );
}

function ProjectLink({ project }: { project: ProjectFeature }) {
  if (!hasProjectLink(project)) {
    return (
      <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#f2e5c6]/14 pt-3 text-[10px] font-bold uppercase leading-none text-[#f2e5c6]/42">
        <span>Project Link</span>
        <span>Pending</span>
      </div>
    );
  }

  const external = /^https?:\/\//i.test(project.projectLink);

  return (
    <a
      className="mt-5 inline-flex h-10 items-center gap-2 border border-[#f2e5c6]/28 bg-[#f2e5c6] px-3 text-[10px] font-bold uppercase leading-none text-[#080807] transition hover:border-[#d7b82d] hover:bg-[#d7b82d] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[#d7b82d]"
      href={project.projectLink}
      rel={external ? "noreferrer" : undefined}
      target={external ? "_blank" : undefined}
    >
      View Project
      <ExternalLink aria-hidden="true" size={14} strokeWidth={1.8} />
    </a>
  );
}

function ProjectWorkPanel({ project }: { project: ProjectFeature }) {
  return (
    <section className="order-3 relative z-30 border-l border-[#f2e5c6]/24 bg-[#080807]/26 py-4 pl-4 text-[#f2e5c6] backdrop-blur-[2px] sm:pl-5 lg:order-none lg:mt-28 lg:bg-transparent lg:py-0">
      <div className="flex items-center gap-3 border-b border-[#f2e5c6]/16 pb-3 text-[9px] font-bold uppercase leading-none text-[#f2e5c6]/58">
        <span>What I Did</span>
        <span className="h-px flex-1 bg-[#f2e5c6]/16" />
      </div>
      <p className="mt-5 text-sm font-light leading-6 text-[#f2e5c6]/72">
        {project.whatIDid}
      </p>
      <div className="mt-6 grid grid-cols-2 border-y border-[#f2e5c6]/14 py-3 text-[9px] font-bold uppercase leading-4 text-[#f2e5c6]/44">
        <span>Archive ID</span>
        <span className="text-right text-[#d7b82d]">{project.id}</span>
      </div>
    </section>
  );
}

function DesktopProjectStrip({
  selected,
  setSelected,
}: {
  selected: number;
  setSelected: Dispatch<SetStateAction<number>>;
}) {
  const project = projectsSeed[selected];

  return (
    <div className="relative z-40 -mx-5 mt-[-72px] hidden overflow-visible px-5 lg:block xl:mt-[-94px]">
      <div className="mx-auto w-[min(96vw,1320px)] overflow-visible">
        <div className="relative h-[402px] overflow-visible xl:h-[438px]">
          <div
            aria-hidden="true"
            className="absolute bottom-[29px] left-0 right-0 h-px bg-[#f2e5c6]/28"
          />
          <div
            aria-hidden="true"
            className="absolute bottom-[6px] left-[5%] right-[5%] h-px bg-[#5E1C23]/70"
          />
          <div className="absolute bottom-[30px] left-1/2 flex w-max -translate-x-1/2 items-end overflow-visible border-y border-[#f2e5c6]/38 bg-[#050505]">
            {stripSlots.map((slot) => {
              const projectIndex = getWrappedProjectIndex(selected + slot);
              const stripProject = projectsSeed[projectIndex];

              return (
                <DesktopStripFrame
                  key={`${slot}-${stripProject.id}`}
                  project={stripProject}
                  projectIndex={projectIndex}
                  setSelected={setSelected}
                  slot={slot}
                />
              );
            })}
          </div>
          <ProjectArrowControls
            className="pointer-events-none absolute bottom-[174px] left-1/2 z-50 w-[min(58vw,700px)] -translate-x-1/2 justify-between xl:bottom-[192px]"
            controlClassName="pointer-events-auto border-[#f2e5c6]/42 bg-[#050505]/92 backdrop-blur"
            setSelected={setSelected}
          />
          <div className="absolute bottom-0 left-1/2 flex w-[min(86vw,1040px)] -translate-x-1/2 items-center justify-between border-y border-[#f2e5c6]/16 py-2 text-[9px] font-bold uppercase leading-none text-[#f2e5c6]/48">
            <span>{project.id}</span>
            <span>{project.toolsUsed?.slice(0, 2).join(" / ") ?? "Project Media"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function DesktopStripFrame({
  project,
  projectIndex,
  setSelected,
  slot,
}: {
  project: ProjectFeature;
  projectIndex: number;
  setSelected: Dispatch<SetStateAction<number>>;
  slot: (typeof stripSlots)[number];
}) {
  const active = slot === 0;
  const distance = Math.abs(slot);
  const width = active ? 410 : distance === 1 ? 252 : 186;
  const height = active ? 348 : distance === 1 ? 250 : 178;
  const frameStyle: CSSProperties = {
    height,
    marginLeft: slot === stripSlots[0] ? 0 : -1,
    opacity: active ? 1 : 0.76,
    transform: active
      ? "perspective(900px) rotateY(0deg) skewY(0deg)"
      : `perspective(900px) rotateY(${slot < 0 ? 7 : -7}deg) skewY(${slot * -0.6}deg)`,
    transformOrigin: "bottom center",
    width,
    zIndex: active ? 44 : 34 - distance,
  };

  return (
    <motion.button
      animate={{
        height,
        opacity: active ? 1 : 0.76,
        width,
      }}
      aria-label={`Select ${project.name}`}
      aria-pressed={active}
      className="group relative shrink-0 overflow-hidden border border-[#f2e5c6]/36 bg-[#050505] text-left transition-[border-color,filter,transform] duration-500 ease-out hover:border-[#d7b82d]/70 hover:opacity-100 hover:z-50 focus-visible:z-50 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[#d7b82d]"
      onClick={() => setSelected(projectIndex)}
      style={frameStyle}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      type="button"
    >
      <ProjectMedia
        className={`h-full w-full object-cover transition duration-500 ${
          active
            ? "brightness-[0.94] contrast-[1.14] saturate-[0.95]"
            : "grayscale brightness-[0.54] contrast-[1.24] saturate-[0.28]"
        }`}
        decorative
        project={project}
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,8,7,0.03)_0%,rgba(8,8,7,0.08)_48%,rgba(8,8,7,0.58)_100%)]"
      />
      <span aria-hidden="true" className="archive-scanlines absolute inset-0 opacity-20" />
      <span aria-hidden="true" className="absolute inset-y-0 right-0 w-px bg-black/60" />
      <span aria-hidden="true" className="absolute inset-y-0 left-0 w-px bg-[#f2e5c6]/22" />
      <span
        className={`absolute bottom-2 left-2 right-2 z-20 border-t pt-2 text-[9px] font-bold uppercase leading-3 transition ${
          active
            ? "border-[#d7b82d]/70 text-[#d7b82d]"
            : "border-[#f2e5c6]/22 text-[#f2e5c6]/54"
        }`}
      >
        {project.name}
        <span className="block text-[#f2e5c6]/38">
          {formatDateRange(project)}
        </span>
      </span>
      <span className="absolute right-2 top-2 z-20 border-t border-[#f2e5c6]/36 pt-1 text-[8px] font-bold uppercase leading-none text-[#f2e5c6]/64">
        {String(projectIndex + 1).padStart(2, "0")}
      </span>
    </motion.button>
  );
}

function MobileProjectStrip({
  selected,
  setSelected,
}: {
  selected: number;
  setSelected: Dispatch<SetStateAction<number>>;
}) {
  return (
    <div className="relative z-30 mt-7 lg:hidden">
      <div className="flex items-center justify-between gap-3 border-y border-[#f2e5c6]/18 py-2">
        <span className="text-[9px] font-bold uppercase leading-none text-[#f2e5c6]/52">
          Project {String(selected + 1).padStart(2, "0")}
        </span>
        <ProjectArrowControls
          className="gap-2"
          controlClassName="h-9 w-9 bg-[#050505]/92"
          setSelected={setSelected}
        />
      </div>
      <div className="-mx-5 mt-4 flex items-end overflow-x-auto px-5 pb-3 sm:-mx-8 sm:px-8">
        {projectsSeed.map((project, index) => {
          const active = selected === index;

          return (
            <button
              aria-label={`Select ${project.name}`}
              aria-pressed={active}
              className={`group relative shrink-0 overflow-hidden border border-[#f2e5c6]/30 bg-[#050505] text-left transition focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[#d7b82d] ${
                active ? "z-10 h-[158px] w-[196px] border-[#d7b82d]/74" : "-ml-px h-[112px] w-[132px]"
              }`}
              key={project.id}
              onClick={() => setSelected(index)}
              type="button"
            >
              <ProjectMedia
                className={`h-full w-full object-cover transition duration-500 ${
                  active
                    ? "brightness-[0.88] contrast-[1.12] saturate-[0.86]"
                    : "grayscale brightness-[0.58] contrast-[1.18] saturate-[0.45]"
                }`}
                decorative
                project={project}
              />
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,8,7,0.02),rgba(8,8,7,0.62))]"
              />
              <span className="absolute bottom-2 left-2 right-2 text-[9px] font-bold uppercase leading-3 text-[#f2e5c6]">
                {project.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ProjectArrowControls({
  className = "",
  controlClassName = "",
  setSelected,
}: {
  className?: string;
  controlClassName?: string;
  setSelected: Dispatch<SetStateAction<number>>;
}) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <button
        aria-label="Previous project"
        className={`inline-flex h-11 w-11 items-center justify-center border border-[#f2e5c6]/30 bg-[#080807]/72 text-[#f2e5c6] transition hover:border-[#d7b82d] hover:text-[#d7b82d] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[#d7b82d] ${controlClassName}`}
        onClick={() =>
          setSelected((current) =>
            current === 0 ? projectsSeed.length - 1 : current - 1,
          )
        }
        type="button"
      >
        <ArrowLeft aria-hidden="true" size={18} strokeWidth={1.8} />
      </button>
      <button
        aria-label="Next project"
        className={`inline-flex h-11 w-11 items-center justify-center border border-[#f2e5c6]/30 bg-[#080807]/72 text-[#f2e5c6] transition hover:border-[#d7b82d] hover:text-[#d7b82d] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[#d7b82d] ${controlClassName}`}
        onClick={() => setSelected((current) => (current + 1) % projectsSeed.length)}
        type="button"
      >
        <ArrowRight aria-hidden="true" size={18} strokeWidth={1.8} />
      </button>
    </div>
  );
}

function ProjectMedia({
  className,
  decorative = false,
  project,
}: {
  className: string;
  decorative?: boolean;
  project: ProjectFeature;
}) {
  const media = getProjectMedia(project);

  if (media.type === "video") {
    return decorative ? (
      <video
        aria-hidden="true"
        autoPlay
        className={className}
        loop
        muted
        playsInline
        preload="metadata"
        src={media.src}
      />
    ) : (
      <video
        aria-label={media.alt}
        autoPlay
        className={className}
        loop
        muted
        playsInline
        preload="metadata"
        src={media.src}
      />
    );
  }

  return (
    <img
      alt={decorative ? "" : media.alt}
      aria-hidden={decorative ? "true" : undefined}
      className={className}
      src={media.src}
    />
  );
}
