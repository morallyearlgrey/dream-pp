"use client";

/* eslint-disable @next/next/no-img-element */
import type { CSSProperties, Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { handleImageFallback, PlaceholderMediaImage } from "@/components/media-placeholder";
import type { ProjectRecord } from "@/lib/portfolio-records";
import { isVideoMediaUrl } from "@/lib/supabase-media";

type ProjectFeature = ProjectRecord;

type ProjectVideoAsset = {
  frameClassName: string;
  meta: string;
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
  },
  {
    frameClassName:
      "left-[9%] top-[34%] h-[12%] w-[47%] rotate-[-0.8deg] lg:left-[31%] lg:top-[20%] lg:h-[22%] lg:w-[26%] lg:rotate-[1.1deg]",
    meta: "Frame 02",
  },
  {
    frameClassName:
      "right-[4%] top-[68%] h-[18%] w-[44%] rotate-[0.6deg] lg:right-[6%] lg:top-[64%] lg:h-[24%] lg:w-[25%] lg:rotate-[1.2deg]",
    meta: "Frame 03",
  },
  {
    frameClassName:
      "left-[8%] bottom-[12%] h-[21%] w-[62%] rotate-[-0.5deg] lg:left-[14%] lg:bottom-[4%] lg:h-[28%] lg:w-[32%] lg:rotate-[-0.7deg]",
    meta: "Frame 04",
  },
];
const highlightedProjectNames = [
  "A.N.R / Agentic Nuclear Reactor",
  "SignHero",
  "CappuConnect",
  "Tariffix",
] as const;
const stripSlots = [-2, -1, 0, 1, 2] as const;
const mobileStripSlots = [-1, 0, 1] as const;

function getMediaAsset(src: string | null | undefined, alt: string): ProjectMediaAsset | null {
  if (!src) {
    return null;
  }

  return {
    alt,
    src,
    type: isVideoMediaUrl(src) ? "video" : "image",
  };
}

function getProjectCarouselMedia(project: ProjectFeature): ProjectMediaAsset | null {
  const src = project.carouselMedia ?? project.mainVideo ?? project.photos[0];

  return getMediaAsset(src, `${project.name} carousel media`);
}

function getProjectBackgroundMedia(project: ProjectFeature): ProjectMediaAsset | null {
  const src = project.backgroundMedia ?? project.mainVideo ?? project.photos[0];

  return getMediaAsset(src, `${project.name} background media`);
}

function getHighlightedProjects(projects: ProjectFeature[]) {
  return highlightedProjectNames
    .map((name) => {
      const projectIndex = projects.findIndex((project) => project.name === name);

      return projectIndex === -1
        ? null
        : { project: projects[projectIndex], projectIndex };
    })
    .filter(
      (
        item,
      ): item is { project: ProjectFeature; projectIndex: number } => item !== null,
    );
}

function formatDateRange(project: ProjectFeature) {
  if (project.fromDate && project.toDate) {
    return `${formatProjectDate(project.fromDate)} - ${formatProjectDate(project.toDate)}`;
  }

  return formatProjectDate(project.fromDate || project.toDate) || "Date pending";
}

function formatProjectDate(value: string | null) {
  if (!value) {
    return "";
  }

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(date);
}

function getWrappedProjectIndex(index: number, projectCount: number) {
  return (index + projectCount) % projectCount;
}

function getDesktopStripItems(selected: number, projects: ProjectFeature[]) {
  return stripSlots.map((slot) => {
    const projectIndex = getWrappedProjectIndex(selected + slot, projects.length);

    return {
      key: `desktop-slot-${slot}`,
      project: projects[projectIndex],
      projectIndex,
      slot,
    };
  });
}

function getMobileStripItems(selected: number, projects: ProjectFeature[]) {
  return mobileStripSlots.map((slot) => {
    const projectIndex = getWrappedProjectIndex(selected + slot, projects.length);

    return {
      key: `mobile-slot-${slot}`,
      project: projects[projectIndex],
      projectIndex,
      slot,
    };
  });
}

function hasProjectLink(project: ProjectFeature) {
  return Boolean(project.projectLink && project.projectLink !== "#");
}

export function ProjectsPage({ projects }: { projects: ProjectFeature[] }) {
  const [selected, setSelected] = useState(0);
  const safeSelected = projects[selected] ? selected : 0;

  useEffect(() => {
    const imageSources = new Set<string>();

    for (const project of projects) {
      const carouselMedia = getProjectCarouselMedia(project);
      const backgroundMedia = getProjectBackgroundMedia(project);

      if (carouselMedia?.type === "image") {
        imageSources.add(carouselMedia.src);
      }

      if (backgroundMedia?.type === "image") {
        imageSources.add(backgroundMedia.src);
      }
    }

    for (const src of imageSources) {
      const image = new window.Image();
      image.decoding = "async";
      image.src = src;
    }
  }, [projects]);

  if (projects.length === 0) {
    return <ProjectsEmptyState />;
  }

  return (
    <main className="overflow-x-clip bg-[#0b0b0a] text-[#f2e5c6]">
      <ProjectHero projects={projects} selected={safeSelected} setSelected={setSelected} />
      <EditorialSpreadSection
        projects={projects}
        selected={safeSelected}
        setSelected={setSelected}
      />
    </main>
  );
}

function ProjectsEmptyState() {
  return (
    <main className="editorial-shell flex min-h-[calc(100svh-72px)] w-full items-center px-5 py-20 text-[#f2e5c6] sm:px-8 lg:px-12">
      <section className="mx-auto w-full max-w-6xl border-y border-[#f2e5c6]/18 py-12">
        <p className="flex items-center gap-3 text-[10px] font-bold uppercase leading-none text-[#8f2b35]">
          Project Archive
          <span className="h-px flex-1 bg-[#f2e5c6]/16" />
          No Frames Yet
        </p>
        <h1 className="font-display mt-5 text-[64px] font-semibold uppercase leading-[0.84] text-[#f2e5c6] sm:text-[112px] lg:text-[148px]">
          Projects
        </h1>
        <p className="mt-6 max-w-xl border-l border-[#8f2b35]/45 pl-4 text-sm font-light leading-7 text-[#f2e5c6]/66">
          No project records are published from the database yet. Add rows to
          the projects table with project bucket object keys to populate this spread.
        </p>
      </section>
    </main>
  );
}

function ProjectHero({
  projects,
  selected,
  setSelected,
}: {
  projects: ProjectFeature[];
  selected: number;
  setSelected: Dispatch<SetStateAction<number>>;
}) {
  const { scrollY } = useScroll();
  const coverY = useTransform(scrollY, [0, 900], [0, -30]);
  const highlightedProjects = getHighlightedProjects(projects);
  const accentProject = projects[selected];

  return (
    <section className="relative isolate min-h-[calc(100svh-72px)] overflow-hidden bg-[#0b0b0a] px-5 pb-12 pt-6 text-[#f2e5c6] sm:px-8 lg:min-h-screen lg:px-12">
      <ProjectBackgroundTexture
        highlightedProjects={highlightedProjects.map(({ project }) => project)}
        projects={projects}
        selected={selected}
      />

      <div className="relative z-30 mx-auto flex max-w-7xl items-center justify-between gap-4 border-b border-[#f2e5c6]/18 pb-2 text-[8px] font-bold uppercase leading-none text-[#f2e5c6]/58 sm:text-[10px]">
        <span>Project Cover Archive</span>
        <span className="hidden text-center sm:block">Projects / Contact Sheet / Notes</span>
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

        <p className="pointer-events-none absolute left-1/2 top-[62%] z-50 w-[min(88vw,42rem)] -translate-x-1/2 border-l border-[#8f2b35]/48 bg-[#080807]/42 px-4 py-2 text-sm font-light leading-6 text-[#f2e5c6]/78 backdrop-blur-[2px] sm:text-base sm:leading-7 lg:top-[66%]">
          I build projects because I like seeing strange ideas become real. From an
          agentic nuclear reactor to an ASL rhythm game and a pipelined RISC-V
          processor, each one records what I was curious enough to learn next.
        </p>

        {accentProject ? (
          <div className="absolute left-[6%] top-[24%] z-10 h-[46%] w-[72%] rotate-[-4deg] opacity-25 blur-[1px] lg:left-[26%] lg:top-[16%] lg:h-[58%] lg:w-[36%]">
            <ProjectMedia
              className="h-full w-full object-cover grayscale brightness-[0.42] contrast-[1.28]"
              decorative
              project={accentProject}
            />
          </div>
        ) : null}

        {projectVideoAssets.map((asset, index) => {
          const highlightedProject = highlightedProjects[index];

          if (!highlightedProject) {
            return null;
          }

          return (
          <ProjectVideoFrame
            asset={asset}
            active={highlightedProject.projectIndex === selected}
            index={index}
            key={highlightedProject.project.id}
            project={highlightedProject.project}
            projectIndex={highlightedProject.projectIndex}
            setSelected={setSelected}
          />
          );
        })}

        <div className="absolute right-[9%] top-[29%] z-40 border border-[#f2e5c6]/28 bg-[#5E1C23] px-2 py-1 text-[10px] font-black uppercase leading-none text-[#f2e5c6] lg:right-[36%] lg:top-[10%]">
          In Frame
        </div>
        <div className="absolute left-[5%] top-[62%] z-40 border border-[#f2e5c6]/28 bg-[#8f2b35] px-2 py-1 text-[10px] font-black uppercase leading-none text-[#f2e5c6] lg:left-[2%] lg:top-[58%]">
          Look
        </div>
      </motion.div>
    </section>
  );
}

function ProjectBackgroundTexture({
  highlightedProjects,
  projects,
  selected,
}: {
  highlightedProjects: ProjectFeature[];
  projects: ProjectFeature[];
  selected: number;
}) {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-[-12%]">
        {projects.map((project, index) => (
          <div
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === selected ? "opacity-70" : "pointer-events-none opacity-0"
            }`}
            key={project.id}
          >
            <ProjectMedia
              className="h-full w-full object-cover blur-2xl grayscale brightness-[0.42] contrast-[1.25]"
              decorative
              media={getProjectBackgroundMedia(project)}
              project={project}
            />
          </div>
        ))}
      </div>
      <div className="absolute inset-0 grid grid-cols-2 opacity-[0.18] blur-[1.5px] grayscale">
        {highlightedProjects.map((item) => (
          <ProjectMedia
            className="h-full w-full object-cover brightness-[0.58] contrast-[1.2]"
            decorative
            key={item.id}
            project={item}
          />
        ))}
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,8,7,0.58)_0%,rgba(8,8,7,0.2)_44%,rgba(8,8,7,0.74)_100%),radial-gradient(ellipse_at_50%_42%,rgba(242,229,198,0.18),transparent_44%),linear-gradient(90deg,rgba(8,8,7,0.74),rgba(8,8,7,0.12),rgba(8,8,7,0.72))]" />
      <div className="absolute inset-0 bg-[#0b0b0a]/42" />
      <div className="editorial-film-grain absolute inset-0 opacity-34" />
    </div>
  );
}

function ProjectVideoFrame({
  active,
  asset,
  index,
  project,
  projectIndex,
  setSelected,
}: {
  active: boolean;
  asset: ProjectVideoAsset;
  index: number;
  project: ProjectFeature;
  projectIndex: number;
  setSelected: Dispatch<SetStateAction<number>>;
}) {
  return (
    <motion.button
      animate={{ y: index % 2 ? [0, -4, 0] : [0, 4, 0] }}
      aria-label={`Select ${project.name}`}
      aria-pressed={active}
      className={`absolute z-20 overflow-visible text-left transition ${asset.frameClassName}`}
      onClick={() => setSelected(projectIndex)}
      transition={{
        duration: 5.8 + index,
        ease: "easeInOut",
        repeat: Infinity,
      }}
      type="button"
      whileHover={{ scale: 1.015 }}
    >
      <span
        className={`absolute inset-0 overflow-hidden border bg-[#080807] shadow-[0_10px_28px_rgba(0,0,0,0.22)] transition ${
          active
            ? "border-[#8f2b35]/90"
            : "border-[#f2e5c6]/36 hover:border-[#f2e5c6]/72"
        }`}
      >
        <ProjectMedia
          className={`h-full w-full object-cover transition duration-500 ${
            active
              ? "brightness-[0.88] contrast-[1.14] saturate-[0.85]"
              : "grayscale brightness-[0.62] contrast-[1.2] saturate-[0.55]"
          }`}
          decorative
          project={project}
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
            ? "border-[#f2e5c6]/36 bg-[#8f2b35] text-[#f2e5c6]"
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
  projects,
  selected,
  setSelected,
}: {
  projects: ProjectFeature[];
  selected: number;
  setSelected: Dispatch<SetStateAction<number>>;
}) {
  const project = projects[selected];

  return (
    <section className="relative isolate overflow-visible bg-[#080807] px-5 pb-14 pt-8 text-[#f2e5c6] sm:px-8 sm:pb-16 sm:pt-10 lg:px-10 lg:pb-20 lg:pt-12 xl:px-12">
      <ProjectSpreadBackground projects={projects} selected={selected} />

      <div className="relative z-20 mx-auto w-full max-w-[1120px] overflow-visible">
        <DesktopProjectStrip
          projects={projects}
          selected={selected}
          setSelected={setSelected}
        />

        <MobileProjectStrip
          projects={projects}
          selected={selected}
          setSelected={setSelected}
        />

        <div className="mt-4 grid min-w-0 overflow-visible border-y border-[#f2e5c6]/22 bg-[#080807]/48 lg:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.72fr)]">
          <ProjectInfoPanel
            projectCount={projects.length}
            project={project}
            selected={selected}
          />

          <ProjectWorkPanel project={project} />
        </div>
      </div>
    </section>
  );
}

function ProjectSpreadBackground({
  projects,
  selected,
}: {
  projects: ProjectFeature[];
  selected: number;
}) {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-[-12%]">
        {projects.map((project, index) => (
          <div
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === selected ? "opacity-30" : "pointer-events-none opacity-0"
            }`}
            key={project.id}
          >
            <ProjectMedia
              className="h-full w-full scale-110 object-cover blur-2xl grayscale brightness-[0.3] contrast-[1.28]"
              decorative
              media={getProjectBackgroundMedia(project)}
              project={project}
            />
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,8,7,0.9)_0%,rgba(8,8,7,0.76)_48%,rgba(8,8,7,0.94)_100%),linear-gradient(90deg,rgba(8,8,7,0.9)_0%,rgba(8,8,7,0.6)_48%,rgba(8,8,7,0.9)_100%)]" />
      <div className="absolute inset-0 bg-[#0b0b0a]/36" />
      <div className="editorial-film-grain absolute inset-0 opacity-30" />
    </div>
  );
}

function ProjectInfoPanel({
  projectCount,
  project,
  selected,
}: {
  projectCount: number;
  project: ProjectFeature;
  selected: number;
}) {
  const displayRange = formatDateRange(project);
  const tools = project.toolsUsed?.join(", ");

  return (
    <section
      aria-live="polite"
      className="relative z-30 min-w-0 overflow-visible p-4 text-[#f2e5c6] sm:p-5 lg:border-r lg:border-[#f2e5c6]/18 lg:p-6 xl:p-7"
    >
      <div className="flex items-center justify-between gap-4 border-b border-[#f2e5c6]/16 pb-3 text-[9px] font-bold uppercase leading-none text-[#f2e5c6]/54">
        <span>Project {String(selected + 1).padStart(2, "0")}</span>
        <span>{projectCount} Works</span>
      </div>
      <h3 className="mt-5 max-w-full break-words font-display text-[42px] font-semibold uppercase leading-[0.86] text-[#f2e5c6] sm:text-[56px] lg:text-[64px] xl:text-[76px]">
        {project.name}
      </h3>
      <dl className="mt-5 grid border-y border-[#f2e5c6]/14 text-[10px] leading-5 sm:text-xs">
        <div className="grid grid-cols-[82px_1fr] gap-3 border-b border-[#f2e5c6]/10 py-3 last:border-b-0">
          <dt className="font-bold uppercase text-[#8f2b35]">Dates</dt>
          <dd className="min-w-0 break-words text-[#f2e5c6]/72">{displayRange}</dd>
        </div>
        {tools ? (
          <div className="grid grid-cols-[82px_1fr] gap-3 border-b border-[#f2e5c6]/10 py-3 last:border-b-0">
            <dt className="font-bold uppercase text-[#8f2b35]">Materials</dt>
            <dd className="min-w-0 break-words text-[#f2e5c6]/72">{tools}</dd>
          </div>
        ) : null}
      </dl>
      <p className="mt-5 max-w-[64ch] border-l border-[#8f2b35]/48 pl-4 text-sm font-light leading-6 text-[#f2e5c6]/70">
        {project.summary}
      </p>
      <div className="mt-5 grid grid-cols-3 gap-3 border-y border-[#f2e5c6]/12 py-3 text-[8px] font-bold uppercase leading-none text-[#f2e5c6]/46">
        <span>
          Lens <span className="text-[#8f2b35]">50mm</span>
        </span>
        <span>
          ISO <span className="text-[#8f2b35]">400</span>
        </span>
        <span className="text-right">
          WB <span className="text-[#8f2b35]">5200K</span>
        </span>
      </div>
      <ProjectLink project={project} />
    </section>
  );
}

function ProjectLink({ project }: { project: ProjectFeature }) {
  if (!hasProjectLink(project)) {
    return (
      <div className="mt-5 flex min-h-10 flex-wrap items-center justify-between gap-3 border-t border-[#f2e5c6]/14 pt-3 text-[10px] font-bold uppercase leading-4 text-[#f2e5c6]/42">
        <span>Project Link</span>
        <span>Pending</span>
      </div>
    );
  }

  const projectLink = project.projectLink ?? "";
  const external = /^https?:\/\//i.test(projectLink);

  return (
    <a
      className="mt-5 inline-flex min-h-10 max-w-full items-center gap-2 border border-[#f2e5c6]/28 bg-[#f2e5c6] px-3 py-2 text-[10px] font-bold uppercase leading-4 text-[#080807] transition hover:border-[#8f2b35] hover:bg-[#8f2b35] hover:text-[#f2e5c6] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[#8f2b35]"
      href={projectLink}
      rel={external ? "noreferrer" : undefined}
      target={external ? "_blank" : undefined}
    >
      View Project
      <ExternalLink aria-hidden="true" size={14} strokeWidth={1.8} />
    </a>
  );
}

function ProjectWorkPanel({ project }: { project: ProjectFeature }) {
  const workItems = project.whatIDid
    .split(/\n+/)
    .map((item) => item.replace(/^[•*-]\s*/, "").trim())
    .filter(Boolean);

  return (
    <section className="relative z-30 flex min-w-0 flex-col overflow-visible border-t border-[#f2e5c6]/18 p-4 text-[#f2e5c6] sm:p-5 lg:border-t-0 lg:p-6 xl:p-7">
      <div className="flex items-center gap-3 border-b border-[#f2e5c6]/16 pb-3 text-[9px] font-bold uppercase leading-4 text-[#f2e5c6]/58">
        <span>What I Did</span>
        <span className="h-px flex-1 bg-[#f2e5c6]/16" />
      </div>
      <ul className="mt-5 grid max-w-[58ch] gap-3 text-sm font-light leading-6 text-[#f2e5c6]/72">
        {workItems.map((item, index) => (
          <li className="grid grid-cols-[auto_1fr] gap-3" key={`${project.id}-work-${index}`}>
            <span aria-hidden="true" className="mt-[0.68rem] h-1.5 w-1.5 bg-[#8f2b35]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <div className="mt-auto grid grid-cols-2 border-y border-[#f2e5c6]/14 py-3 text-[9px] font-bold uppercase leading-4 text-[#f2e5c6]/44 lg:mt-8">
        <span>Frame ID</span>
        <span className="text-right text-[#8f2b35]">{project.id}</span>
      </div>
    </section>
  );
}

function DesktopProjectStrip({
  projects,
  selected,
  setSelected,
}: {
  projects: ProjectFeature[];
  selected: number;
  setSelected: Dispatch<SetStateAction<number>>;
}) {
  const project = projects[selected];

  return (
    <div className="relative z-20 hidden w-full overflow-visible lg:block">
      <div className="mx-auto w-full overflow-visible">
        <div className="relative min-h-[410px] overflow-visible pb-10 pt-1 xl:min-h-[450px] xl:pb-12">
          <div className="relative z-20 mx-auto flex min-h-[330px] w-full max-w-[1120px] min-w-0 items-end justify-center overflow-visible xl:min-h-[365px]">
            {getDesktopStripItems(selected, projects).map((item) => (
              <DesktopStripFrame
                key={projects.length >= stripSlots.length ? item.project.id : item.key}
                project={item.project}
                projectIndex={item.projectIndex}
                setSelected={setSelected}
                slot={item.slot}
              />
            ))}
            <ProjectArrowControls
              className="pointer-events-none absolute left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-[700px] -translate-x-1/2 -translate-y-1/2 justify-between"
              controlClassName="pointer-events-auto border-[#f2e5c6]/42 bg-[#050505]/92 backdrop-blur"
              projectCount={projects.length}
              setSelected={setSelected}
            />
          </div>
          <div
            aria-hidden="true"
            className="relative z-30 mx-auto h-px w-full bg-[#f2e5c6]/28"
          />
          <div
            aria-hidden="true"
            className="relative z-30 mx-auto mt-5 h-px w-[90%] bg-[#5E1C23]/70"
          />
          <div className="relative z-40 mx-auto mt-6 flex w-[min(86vw,1040px)] items-center justify-between border-y border-[#f2e5c6]/16 py-2 text-[9px] font-bold uppercase leading-none text-[#f2e5c6]/48">
            <span>{project.id}</span>
            <span>{project.toolsUsed?.slice(0, 2).join(" / ") ?? "Project Media"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function getDesktopStripGeometry(slot: (typeof stripSlots)[number]) {
  const active = slot === 0;
  const distance = Math.abs(slot);
  const width = active ? "29.5%" : distance === 1 ? "19.75%" : "15.5%";
  let topLeft = 12;
  let topRight = 12;
  let bottomLeft = 88;
  let bottomRight = 88;

  if (slot < 0) {
    topLeft = distance === 2 ? 0 : 6;
    topRight = distance === 2 ? 6 : 12;
    bottomLeft = distance === 2 ? 100 : 94;
    bottomRight = distance === 2 ? 94 : 88;
  }

  if (slot > 0) {
    topLeft = distance === 2 ? 6 : 12;
    topRight = distance === 2 ? 0 : 6;
    bottomLeft = distance === 2 ? 94 : 88;
    bottomRight = distance === 2 ? 100 : 94;
  }

  const clipPath = `polygon(0 ${topLeft}%, 100% ${topRight}%, 100% ${bottomRight}%, 0 ${bottomLeft}%)`;

  return {
    bottomLeft,
    bottomRight,
    clipPath,
    opacity: active ? 1 : distance === 1 ? 0.82 : 0.64,
    width,
    zIndex: active ? 44 : 34 - distance,
  };
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
  const frame = getDesktopStripGeometry(slot);
  const labelBottom = active
    ? 10
    : `${100 - Math.min(frame.bottomLeft, frame.bottomRight) + 6}%`;
  const frameStyle: CSSProperties = {
    marginLeft: slot === stripSlots[0] ? 0 : -1,
    opacity: frame.opacity,
    width: frame.width,
    zIndex: frame.zIndex,
  };

  return (
    <motion.button
      aria-label={`Select ${project.name}`}
      aria-pressed={active}
      className="group relative h-[300px] shrink-0 overflow-visible text-left transition-[filter] duration-500 ease-out hover:opacity-100 hover:z-50 focus-visible:z-50 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[#8f2b35] xl:h-[340px]"
      onClick={() => setSelected(projectIndex)}
      style={frameStyle}
      transition={{
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
      }}
      type="button"
    >
      <span
        aria-hidden="true"
        className={`absolute inset-0 block transition-colors duration-500 ${
          active ? "bg-[#8f2b35]/86" : "bg-[#f2e5c6]/48 group-hover:bg-[#8f2b35]/70"
        }`}
        style={{ clipPath: frame.clipPath }}
      />
      <span
        className="absolute inset-px block overflow-visible bg-[#050505]"
        style={{ clipPath: frame.clipPath }}
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
      </span>
      <span
        className={`absolute left-2 right-2 z-20 border-t pt-2 text-[9px] font-bold uppercase leading-3 transition ${
          active
            ? "border-[#8f2b35]/70 text-[#8f2b35]"
            : "border-[#f2e5c6]/22 text-[#f2e5c6]/54"
        }`}
        style={{ bottom: labelBottom }}
      >
        {project.name}
      </span>
    </motion.button>
  );
}

function getMobileStripGeometry(slot: (typeof mobileStripSlots)[number]) {
  const active = slot === 0;
  let topLeft = 12;
  let topRight = 12;
  let bottomLeft = 88;
  let bottomRight = 88;

  if (slot < 0) {
    topLeft = 3;
    topRight = 12;
    bottomLeft = 99;
    bottomRight = 88;
  }

  if (slot > 0) {
    topLeft = 12;
    topRight = 3;
    bottomLeft = 88;
    bottomRight = 99;
  }

  const clipPath = `polygon(0 ${topLeft}%, 100% ${topRight}%, 100% ${bottomRight}%, 0 ${bottomLeft}%)`;

  return {
    bottomLeft,
    bottomRight,
    clipPath,
    opacity: active ? 1 : 0.68,
    width: active ? "42%" : "29%",
    zIndex: active ? 34 : 26,
  };
}

function MobileStripFrame({
  project,
  projectIndex,
  setSelected,
  slot,
}: {
  project: ProjectFeature;
  projectIndex: number;
  setSelected: Dispatch<SetStateAction<number>>;
  slot: (typeof mobileStripSlots)[number];
}) {
  const active = slot === 0;
  const frame = getMobileStripGeometry(slot);
  const labelBottom = active
    ? 22
    : `${100 - Math.min(frame.bottomLeft, frame.bottomRight) + 6}%`;
  const frameStyle: CSSProperties = {
    marginLeft: slot === mobileStripSlots[0] ? 0 : -1,
    opacity: frame.opacity,
    width: frame.width,
    zIndex: frame.zIndex,
  };

  return (
    <motion.button
      aria-label={`Select ${project.name}`}
      aria-pressed={active}
      className="group relative h-[260px] shrink-0 overflow-visible text-left transition-[filter] duration-500 ease-out hover:opacity-100 hover:z-40 focus-visible:z-50 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[#8f2b35] sm:h-[320px]"
      onClick={() => setSelected(projectIndex)}
      style={frameStyle}
      transition={{
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
      }}
      type="button"
    >
      <span
        aria-hidden="true"
        className={`absolute inset-0 block transition-colors duration-500 ${
          active ? "bg-[#8f2b35]/86" : "bg-[#f2e5c6]/46 group-hover:bg-[#8f2b35]/66"
        }`}
        style={{ clipPath: frame.clipPath }}
      />
      <span
        className="absolute inset-px block overflow-visible bg-[#050505]"
        style={{ clipPath: frame.clipPath }}
      >
        <ProjectMedia
          className={`h-full w-full object-cover transition duration-500 ${
            active
              ? "brightness-[0.92] contrast-[1.14] saturate-[0.9]"
              : "grayscale brightness-[0.5] contrast-[1.26] saturate-[0.24]"
          }`}
          decorative
          project={project}
        />
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,8,7,0.04)_0%,rgba(8,8,7,0.08)_50%,rgba(8,8,7,0.64)_100%)]"
        />
        <span aria-hidden="true" className="archive-scanlines absolute inset-0 opacity-20" />
      </span>
      <span
        className={`absolute left-2 right-2 z-20 border-t pt-2 text-[8px] font-bold uppercase leading-3 transition sm:text-[9px] ${
          active
            ? "border-[#8f2b35]/74 text-[#8f2b35]"
            : "border-[#f2e5c6]/24 text-[#f2e5c6]/56"
        }`}
        style={{ bottom: labelBottom }}
      >
        {project.name}
      </span>
    </motion.button>
  );
}

function MobileProjectStrip({
  projects,
  selected,
  setSelected,
}: {
  projects: ProjectFeature[];
  selected: number;
  setSelected: Dispatch<SetStateAction<number>>;
}) {
  const project = projects[selected];

  return (
    <div className="relative z-30 overflow-visible lg:hidden">
      <div className="flex items-center justify-between gap-3 border-y border-[#f2e5c6]/18 py-2">
        <span className="text-[9px] font-bold uppercase leading-none text-[#f2e5c6]/52">
          Project {String(selected + 1).padStart(2, "0")}
        </span>
        <span className="max-w-[48vw] truncate text-right text-[9px] font-bold uppercase leading-none text-[#8f2b35]">
          {project.name}
        </span>
      </div>

      <div className="relative mx-auto mt-3 w-full max-w-[560px] overflow-visible pb-10 pt-3">
        <div className="relative z-20 mx-auto flex min-h-[288px] w-full min-w-0 items-end justify-center overflow-visible sm:min-h-[348px]">
          {getMobileStripItems(selected, projects).map((item) => (
            <MobileStripFrame
              key={projects.length >= mobileStripSlots.length ? item.project.id : item.key}
              project={item.project}
              projectIndex={item.projectIndex}
              setSelected={setSelected}
              slot={item.slot}
            />
          ))}
          <ProjectArrowControls
            className="pointer-events-none absolute left-1/2 top-1/2 z-50 w-[calc(100%-0.75rem)] -translate-x-1/2 -translate-y-1/2 justify-between"
            controlClassName="pointer-events-auto h-9 w-9 border-[#f2e5c6]/42 bg-[#050505]/90 backdrop-blur"
            projectCount={projects.length}
            setSelected={setSelected}
          />
        </div>
        <div
          aria-hidden="true"
          className="relative z-30 mx-auto h-px w-full bg-[#f2e5c6]/24"
        />
        <div
          aria-hidden="true"
          className="relative z-30 mx-auto mt-5 h-px w-[88%] bg-[#5E1C23]/70"
        />
        <div className="relative z-40 mx-auto mt-6 flex w-full items-center justify-between gap-3 border-y border-[#f2e5c6]/16 py-2 text-[8px] font-bold uppercase leading-none text-[#f2e5c6]/48">
          <span>{project.id}</span>
          <span className="min-w-0 truncate text-right">
            {project.toolsUsed?.slice(0, 2).join(" / ") ?? "Project Media"}
          </span>
        </div>
      </div>
    </div>
  );
}

function ProjectArrowControls({
  className = "",
  controlClassName = "",
  projectCount,
  setSelected,
}: {
  className?: string;
  controlClassName?: string;
  projectCount: number;
  setSelected: Dispatch<SetStateAction<number>>;
}) {
  if (projectCount < 2) {
    return null;
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <button
        aria-label="Previous project"
        className={`inline-flex h-11 w-11 items-center justify-center border border-[#f2e5c6]/30 bg-[#080807]/72 text-[#f2e5c6] transition hover:border-[#8f2b35] hover:text-[#8f2b35] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[#8f2b35] ${controlClassName}`}
        onClick={() =>
          setSelected((current) =>
            current === 0 ? projectCount - 1 : current - 1,
          )
        }
        type="button"
      >
        <ArrowLeft aria-hidden="true" size={18} strokeWidth={1.8} />
      </button>
      <button
        aria-label="Next project"
        className={`inline-flex h-11 w-11 items-center justify-center border border-[#f2e5c6]/30 bg-[#080807]/72 text-[#f2e5c6] transition hover:border-[#8f2b35] hover:text-[#8f2b35] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[#8f2b35] ${controlClassName}`}
        onClick={() => setSelected((current) => (current + 1) % projectCount)}
        type="button"
      >
        <ArrowRight aria-hidden="true" size={18} strokeWidth={1.8} />
      </button>
    </div>
  );
}

function ProjectVideoMedia({
  alt,
  className,
  decorative,
  onError,
  src,
}: {
  alt: string;
  className: string;
  decorative: boolean;
  onError: () => void;
  src: string;
}) {
  const [ready, setReady] = useState(false);

  return (
    <span className="relative block h-full w-full overflow-hidden bg-[#080807]">
      <PlaceholderMediaImage
        alt={decorative ? undefined : alt}
        className={`absolute inset-0 ${className}`}
        decorative={decorative}
      />
      <video
        aria-hidden={decorative ? "true" : undefined}
        aria-label={decorative ? undefined : alt}
        autoPlay
        className={`${className} absolute inset-0 transition-opacity duration-300 ${
          ready ? "opacity-100" : "opacity-0"
        }`}
        loop
        muted
        onError={onError}
        onLoadedData={() => setReady(true)}
        playsInline
        preload="auto"
        src={src}
      />
    </span>
  );
}

function ProjectMedia({
  className,
  decorative = false,
  media,
  project,
}: {
  className: string;
  decorative?: boolean;
  media?: ProjectMediaAsset | null;
  project: ProjectFeature;
}) {
  const resolvedMedia = media ?? getProjectCarouselMedia(project);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const loadFailed = failedSrc === resolvedMedia?.src;

  if (!resolvedMedia || loadFailed) {
    return (
      <PlaceholderMediaImage
        alt={resolvedMedia?.alt}
        className={className}
        decorative={decorative}
      />
    );
  }

  if (resolvedMedia.type === "video") {
    return (
      <ProjectVideoMedia
        alt={resolvedMedia.alt}
        className={className}
        decorative={decorative}
        key={resolvedMedia.src}
        onError={() => setFailedSrc(resolvedMedia.src)}
        src={resolvedMedia.src}
      />
    );
  }

  return (
    <img
      alt={decorative ? "" : resolvedMedia.alt}
      aria-hidden={decorative ? "true" : undefined}
      className={className}
      decoding="async"
      onError={handleImageFallback}
      src={resolvedMedia.src}
    />
  );
}
