"use client";

/* eslint-disable @next/next/no-img-element */
import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { AlertCircle, CheckCircle2, Images, RefreshCw, Send } from "lucide-react";
import { endorsementsSeed, experiencesSeed } from "@/lib/portfolio-data";

type FilmFrame = {
  src: string;
  label: string;
  meta: string;
  frameClassName: string;
};

export type ExperienceFeatureData = {
  id: string;
  companyName: string;
  positionName: string;
  fromDate: string;
  toDate: string | null;
  summary: string;
  responsibilities: string[];
  photos: string[];
  mainVideo: string | null;
  endorsements?: FeaturedEndorsementData[];
};

export type FeaturedEndorsementData = {
  id: string;
  authorName: string;
  note: string;
  createdAt?: string;
};

const filmFrames: FilmFrame[] = [
  {
    src: "/experiences/IMG_0118.mov",
    label: "NVIDIA Campus",
    meta: "Field 01",
    frameClassName: "",
  },
  {
    src: "/experiences/IMG_4279.MOV",
    label: "Team Signal",
    meta: "Field 02",
    frameClassName: "",
  },
  {
    src: "/experiences/IMG_1143.MOV",
    label: "Briefing Room",
    meta: "Field 03",
    frameClassName: "",
  },
  {
    src: "/experiences/IMG_7889.MOV",
    label: "Public Crowd",
    meta: "Frame 04",
    frameClassName: "",
  },
  {
    src: "/experiences/behind1.MOV",
    label: "Motion Field One",
    meta: "Frame 05",
    frameClassName: "",
  },
  {
    src: "/experiences/behind2.mov",
    label: "Motion Field Two",
    meta: "Frame 06",
    frameClassName: "",
  },
];
const upperFilmFrames = filmFrames.slice(0, 3);
const lowerFilmFrames = filmFrames.slice(3);
const fallbackExperiences = experiencesSeed.map((experience) => ({
  ...experience,
  endorsements: endorsementsSeed
    .filter(
      (endorsement) =>
        endorsement.experienceId === experience.id &&
        endorsement.approved &&
        endorsement.featured,
    )
    .slice(0, 3),
}));

export function ExperiencesPage({
  experiences = fallbackExperiences,
}: {
  experiences?: ExperienceFeatureData[];
}) {
  return (
    <main className="overflow-hidden bg-[#0b0b0a] text-[#f2e5c6]">
      <ExperienceCoverHero />
      <ExperienceRoleArchive experiences={experiences} />
    </main>
  );
}

function ExperienceCoverHero() {
  const { scrollY } = useScroll();
  const coverY = useTransform(scrollY, [0, 900], [0, -28]);

  return (
    <section className="relative isolate min-h-[calc(100svh-72px)] overflow-hidden bg-[radial-gradient(ellipse_at_76%_8%,rgba(242,229,198,0.12),transparent_34%),linear-gradient(180deg,#11100f_0%,#050505_100%)] text-[#f2e5c6] lg:min-h-screen">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="relative min-h-[860px] overflow-hidden bg-transparent pb-10 pt-6 sm:min-h-[940px] lg:min-h-[calc(100vh-72px)] lg:pb-8"
        initial={{ opacity: 0, y: 18 }}
        style={{ y: coverY }}
        transition={{ duration: 0.65, ease: "easeOut" }}
      >
        <div className="relative z-50 mx-5 flex items-center justify-between gap-4 border-b border-[#f2e5c6]/18 pb-2 text-[8px] font-bold uppercase leading-none text-[#f2e5c6]/56 sm:mx-8 sm:text-[10px] lg:mx-12">
          <span>Work Proof Archive</span>
          <span className="hidden text-center sm:block">Software / Systems / Teams</span>
          <span>Issue 02</span>
        </div>

        <div className="relative z-40 mx-5 mt-10 max-w-[82%] sm:mx-8 sm:mt-12 sm:max-w-[62%] lg:mx-12 lg:mt-12 lg:max-w-[54%]">
          <p className="mb-3 flex items-center gap-2 text-[8px] font-bold uppercase leading-none text-[#f2e5c6]/58 sm:text-[10px]">
            Field Work
            <span className="h-px w-12 bg-[#f2e5c6]/24" />
            2024-2026
          </p>
          <h1 className="font-display text-[52px] font-semibold uppercase leading-[0.9] text-[#f2e5c6] sm:text-[78px] lg:text-[104px] xl:text-[120px]">
            Experiences
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-[9px] font-bold uppercase leading-none text-[#f2e5c6]/48 sm:text-[10px]">
            <span>Current @ NVIDIA</span>
            <span className="h-px w-5 bg-[#f2e5c6]/24" />
            <span>Returning @ BNY</span>
          </div>
        </div>

        <div className="relative z-20 mt-8 h-[390px] sm:mt-10 sm:h-[460px] lg:mt-8 lg:h-[520px] xl:h-[540px]">
          <FilmStrip
            className="left-[-8vw] right-[-8vw] top-0 rotate-[-1.4deg] lg:left-[-6vw] lg:right-[-6vw]"
            frames={upperFilmFrames}
          />
          <FilmStrip
            className="bottom-0 left-[-8vw] right-[-8vw] rotate-[1.2deg] lg:left-[-6vw] lg:right-[-6vw]"
            frames={lowerFilmFrames}
            mutedTone
          />

          <ExperienceSubject />

          <div className="absolute inset-x-0 top-[-22px] z-10 h-px bg-[#f2e5c6]/10" />
          <div className="absolute inset-x-0 bottom-[-22px] z-10 h-px bg-[#f2e5c6]/10" />
        </div>

        <div className="relative z-40 mx-5 mt-8 grid gap-5 border-t border-[#f2e5c6]/18 pt-4 text-[10px] font-light leading-5 text-[#f2e5c6]/62 sm:mx-8 sm:grid-cols-[minmax(0,0.62fr)_minmax(190px,0.28fr)] sm:items-start sm:text-xs sm:leading-6 lg:mx-12 lg:mt-9">
          <p>
            A cover note for the rooms, prototypes, releases, and handoffs that
            sharpened my engineering practice. I care about the field texture of
            work: the messy first signal, the calm debugging pass, and the team
            rhythm that makes something real ship.
          </p>
          <div className="border-t border-[#f2e5c6]/18 pt-3 text-[9px] font-bold uppercase leading-4 text-[#f2e5c6]/42 sm:border-t-0 sm:pt-0 sm:text-right">
            <p>Looping field frames from the local archive.</p>
            <p className="mt-2 text-[#f2e5c6]/68">Autoplay / Muted / Continuous</p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function FilmStrip({
  className,
  frames,
  mutedTone = false,
}: {
  className: string;
  frames: FilmFrame[];
  mutedTone?: boolean;
}) {
  return (
    <div className={`absolute z-20 ${className}`}>
      <div className="relative overflow-hidden border-y border-[#f2e5c6]/24 bg-[#050505] py-3 shadow-[0_26px_70px_rgba(0,0,0,0.5)]">
        <div
          aria-hidden="true"
          className="editorial-film-sprockets absolute inset-x-0 top-0 h-3 border-b border-[#f2e5c6]/12 opacity-65"
        />
        <div
          aria-hidden="true"
          className="editorial-film-sprockets absolute inset-x-0 bottom-0 h-3 border-t border-[#f2e5c6]/12 opacity-55"
        />
        <div className="grid grid-cols-3 gap-px border-y border-[#f2e5c6]/12 bg-[#f2e5c6]/12">
          {frames.map((frame, index) => (
            <div
              className={`relative aspect-[4/3] min-w-0 overflow-hidden bg-[#080807] ring-1 ring-inset ring-[#f2e5c6]/10 sm:aspect-[16/7] lg:aspect-[3/1] ${frame.frameClassName}`}
              key={`${frame.src}-${frame.meta}`}
            >
              <video
                aria-label={frame.label}
                autoPlay
                className={`h-full w-full object-cover ${
                  mutedTone
                    ? "grayscale contrast-[1.18] brightness-[0.68]"
                    : "contrast-[1.1] saturate-[0.82] brightness-[0.88]"
                }`}
                loop
                muted
                playsInline
                preload="metadata"
                src={frame.src}
              />
              <span
                aria-hidden="true"
                className="absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(8,8,7,0.16)_0%,rgba(8,8,7,0.04)_48%,rgba(8,8,7,0.44)_100%)]"
              />
              <span aria-hidden="true" className="editorial-film-grain absolute inset-0 z-20" />
              <span aria-hidden="true" className="absolute inset-y-0 left-0 z-20 w-px bg-[#f2e5c6]/16" />
              <span aria-hidden="true" className="absolute inset-y-0 right-0 z-20 w-px bg-black/45" />
              <span className="absolute bottom-2 left-2 z-30 border-t border-[#f2e5c6]/34 pt-1 text-[8px] font-bold uppercase leading-none text-[#f2e5c6]/66">
                {frame.meta}
              </span>
              <span className="absolute right-2 top-2 z-30 text-[8px] font-bold uppercase leading-none text-[#f2e5c6]/44">
                {(index + 1).toString().padStart(2, "0")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ExperienceSubject() {
  return (
    <div className="pointer-events-none absolute bottom-0 right-[-34%] z-30 h-[104%] w-[112%] sm:right-[-21%] sm:h-[112%] sm:w-[80%] md:right-[-12%] md:h-[116%] md:w-[68%] lg:right-[-1%] lg:h-[122%] lg:w-[46%] xl:right-[1%] xl:w-[44%]">
      <div
        aria-hidden="true"
        className="absolute bottom-[7%] left-[18%] z-20 h-[74%] w-[60%] bg-[#f2e5c6]/12 blur-[32px]"
      />
      <img
        alt="Kai Sprunger standing portrait cutout"
        className="relative z-30 h-full w-full object-contain object-bottom drop-shadow-[0_28px_34px_rgba(0,0,0,0.48)]"
        src="/experiences/me.png"
      />
    </div>
  );
}

function ExperienceRoleArchive({ experiences }: { experiences: ExperienceFeatureData[] }) {
  return (
    <section className="relative px-5 py-16 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl border-t border-[#f2e5c6]/16 pt-8">
        <div className="mb-7 grid gap-4 md:grid-cols-[minmax(220px,0.45fr)_1fr] md:items-end">
          <div>
            <p className="flex items-center gap-3 text-[10px] font-bold uppercase leading-none text-[#d7b82d]">
              Role Archive
              <span className="h-px flex-1 bg-[#f2e5c6]/16" />
            </p>
            <h2 className="mt-4 font-display text-[46px] font-semibold uppercase leading-[0.86] text-[#f2e5c6] sm:text-[68px]">
              Work Notes
            </h2>
          </div>
          <p className="max-w-xl text-sm font-light leading-6 text-[#f2e5c6]/58 md:justify-self-end">
            Each feature pairs role context with moving proof, rotating stills,
            selected endorsements, and a submission box. Media remains URL-driven
            so the archive can move from local files to stored records without
            changing the interface.
          </p>
        </div>
        <div className="grid gap-12 lg:gap-16">
          {experiences.map((experience, index) => (
            <ExperienceFeature
              experience={experience}
              key={experience.id}
              sequence={index + 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ExperienceFeature({
  experience,
  sequence,
}: {
  experience: ExperienceFeatureData;
  sequence: number;
}) {
  const displayRange = formatDateRange(experience.fromDate, experience.toDate);
  const mainVideo = experience.mainVideo ?? filmFrames[(sequence - 1) % filmFrames.length].src;

  return (
    <article className="group relative isolate overflow-visible border-t border-[#f2e5c6]/14 pt-10 first:border-t-0 first:pt-0">
      <div
        aria-hidden="true"
        className="absolute right-0 top-10 hidden h-px w-[42%] bg-[#5E1C23]/45 lg:block"
      />
      <div className="relative grid gap-5 lg:grid-cols-[minmax(280px,0.44fr)_minmax(0,0.86fr)] lg:items-center lg:gap-0 lg:pr-[150px] xl:pr-[170px]">
        <InfoPanel
          className="lg:w-[116%]"
          displayRange={displayRange}
          experience={experience}
          sequence={sequence}
        />

        <MediaProofPanel experience={experience} mainVideo={mainVideo} sequence={sequence} />
      </div>
    </article>
  );
}

function MediaProofPanel({
  experience,
  mainVideo,
  sequence,
}: {
  experience: ExperienceFeatureData;
  mainVideo: string;
  sequence: number;
}) {
  return (
    <section className="relative z-10 overflow-visible lg:aspect-square lg:min-h-[660px]">
      <div className="relative aspect-square min-h-[460px] overflow-hidden border border-[#f2e5c6]/18 bg-[#050505] sm:min-h-[540px] lg:h-full lg:min-h-0">
        <video
          aria-label={`${experience.companyName} feature motion`}
          autoPlay
          className="h-full w-full object-cover brightness-[0.74] contrast-[1.16] saturate-[0.72]"
          loop
          muted
          playsInline
          preload="metadata"
          src={mainVideo}
        />
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,8,7,0.08),rgba(8,8,7,0.5)),radial-gradient(circle_at_22%_18%,rgba(215,184,45,0.1),transparent_30%)]"
        />
        <span aria-hidden="true" className="archive-scanlines absolute inset-0 opacity-20" />
        <div className="absolute left-3 right-3 top-3 flex items-center justify-between border-b border-[#f2e5c6]/18 pb-2 text-[9px] font-bold uppercase leading-none text-[#f2e5c6]/66">
          <span>Motion Proof</span>
          <span>{sequence.toString().padStart(2, "0")}</span>
        </div>
        <div className="absolute bottom-3 left-3 hidden max-w-[42%] items-center gap-3 text-[9px] font-bold uppercase leading-none text-[#f2e5c6]/54 sm:flex">
          <span className="h-px flex-1 bg-[#f2e5c6]/18" />
          <span>Autoplay / Muted</span>
        </div>
      </div>
      <EndorsementPanel experience={experience} />
    </section>
  );
}

function InfoPanel({
  className = "",
  displayRange,
  experience,
  sequence,
}: {
  className?: string;
  displayRange: string;
  experience: ExperienceFeatureData;
  sequence: number;
}) {
  return (
    <section
      className={`relative z-30 overflow-hidden border border-[#f2e5c6]/20 bg-[#0d0c0b] p-4 text-[#f2e5c6] sm:p-5 ${className}`}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-5 top-5 right-[13.8%] z-20 hidden w-px bg-[#f2e5c6]/24 lg:block"
      />
      <div className="relative z-10 flex flex-col lg:pr-[16%]">
        <div className="flex items-center justify-between gap-4 border-b border-[#f2e5c6]/16 pb-3 text-[9px] font-bold uppercase leading-none text-[#f2e5c6]/50">
          <span>Experience {sequence.toString().padStart(2, "0")}</span>
          <span>{displayRange}</span>
        </div>
        <div className="mt-5 flex items-center gap-3 text-[9px] font-bold uppercase leading-none text-[#d7b82d]">
          <span>Role Note</span>
          <span className="h-px flex-1 bg-[#5E1C23]/70" />
        </div>
        <div className="mt-7">
          <h3 className="font-display text-[clamp(36px,8vw,62px)] font-semibold uppercase leading-[0.86] text-[#f2e5c6]">
            {experience.companyName}
          </h3>
          <p className="mt-4 border-t border-[#f2e5c6]/16 pt-3 text-[10px] font-bold uppercase leading-none text-[#d7b82d]">
            {experience.positionName}
          </p>
          <p className="mt-4 text-sm font-light leading-6 text-[#f2e5c6]/68">
            {experience.summary}
          </p>
        </div>
      </div>
      <div className="relative z-10 mt-4 border-t border-[#f2e5c6]/16 pt-3">
        <PhotoFlipPanel experience={experience} />
      </div>
    </section>
  );
}

function PhotoFlipPanel({
  experience,
}: {
  experience: ExperienceFeatureData;
}) {
  const photos = experience.photos.length > 0 ? experience.photos : ["/references/experiences.jpg"];
  const [photoIndex, setPhotoIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    if (flipped || photos.length < 2) {
      return;
    }

    const timer = window.setInterval(() => {
      setPhotoIndex((current) => (current + 1) % photos.length);
    }, 4000);

    return () => window.clearInterval(timer);
  }, [flipped, photos.length]);

  return (
    <button
      aria-label={`Flip ${experience.companyName} media panel to responsibilities`}
      aria-pressed={flipped}
      className="group/panel relative block h-[220px] w-full overflow-hidden border border-[#f2e5c6]/20 bg-[#080807] text-left transition hover:border-[#d7b82d]/75 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[#d7b82d] sm:h-[250px] lg:h-[280px] xl:h-[300px]"
      onClick={() => setFlipped((current) => !current)}
      type="button"
    >
      <AnimatePresence mode="wait">
        {flipped ? (
          <motion.div
            animate={{ opacity: 1, rotateY: 0 }}
            className="absolute inset-0 overflow-y-auto bg-[#f2e5c6] p-5 text-[#171311]"
            exit={{ opacity: 0, rotateY: -8 }}
            initial={{ opacity: 0, rotateY: 8 }}
            key="responsibilities"
            transition={{ duration: 0.24, ease: "easeOut" }}
          >
            <div className="flex items-center justify-between border-b border-[#171311]/14 pb-3 text-[9px] font-bold uppercase leading-none text-[#5E1C23]">
              <span>Responsibilities</span>
              <RefreshCw aria-hidden="true" size={14} strokeWidth={1.8} />
            </div>
            <ul className="mt-5 grid gap-3 text-xs font-light leading-5 text-[#171311]/72 sm:text-sm sm:leading-6">
              {experience.responsibilities.map((item) => (
                <li className="border-l border-[#5E1C23]/60 pl-3" key={item}>
                  {item}
                </li>
              ))}
            </ul>
            <span className="absolute bottom-4 left-5 text-[9px] font-bold uppercase leading-none text-[#171311]/42">
              Click to return
            </span>
          </motion.div>
        ) : (
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0"
            exit={{ opacity: 0, scale: 1.015 }}
            initial={{ opacity: 0, scale: 1.015 }}
            key={photos[photoIndex]}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <img
              alt=""
              aria-hidden="true"
              className="h-full w-full object-cover brightness-[0.84] contrast-[1.08] saturate-[0.72] transition duration-500 group-hover/panel:scale-[1.03]"
              src={photos[photoIndex]}
            />
            <span aria-hidden="true" className="archive-scanlines absolute inset-0 opacity-25" />
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,8,7,0.04),rgba(8,8,7,0.58))]"
            />
            <div className="absolute left-3 right-3 top-3 flex items-center justify-between border-b border-[#f2e5c6]/22 pb-2 text-[9px] font-bold uppercase leading-none text-[#f2e5c6]/74">
              <span>Photo Index</span>
              <span>
                {(photoIndex + 1).toString().padStart(2, "0")} /{" "}
                {photos.length.toString().padStart(2, "0")}
              </span>
            </div>
            <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 border border-[#f2e5c6]/24 bg-[#080807]/70 px-3 py-2 text-[9px] font-bold uppercase leading-none text-[#f2e5c6]/76 backdrop-blur-sm">
              <Images aria-hidden="true" size={14} strokeWidth={1.8} />
              <span className="min-w-0 flex-1">Click to flip</span>
              <RefreshCw aria-hidden="true" size={13} strokeWidth={1.8} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <span
        aria-hidden="true"
        className="absolute inset-2 border border-[#f2e5c6]/0 transition group-hover/panel:border-[#f2e5c6]/35"
      />
      <span className="sr-only">
        {flipped ? "Showing responsibilities" : `Showing photo ${photoIndex + 1} of ${photos.length}`}
      </span>
    </button>
  );
}

function EndorsementPanel({ experience }: { experience: ExperienceFeatureData }) {
  const featuredEndorsements = (experience.endorsements ?? []).slice(0, 3);
  const [form, setForm] = useState({ authorName: "", note: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const experienceInitials = getInitials(experience.companyName);

  async function submitEndorsement(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 12000);

    try {
      const response = await fetch("/api/endorsements", {
        body: JSON.stringify({
          authorName: form.authorName,
          experienceId: experience.id,
          note: form.note,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        signal: controller.signal,
      });
      const payload = (await response.json()) as { error?: string; message?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "Endorsement could not be submitted.");
      }

      setForm({ authorName: "", note: "" });
      setStatus("success");
      setMessage(payload.message ?? "Endorsement submitted for review.");
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error && error.name === "AbortError"
          ? "Endorsement timed out. Please try again."
          : error instanceof Error
            ? error.message
            : "Endorsement could not be submitted.",
      );
    } finally {
      window.clearTimeout(timeoutId);
    }
  }

  return (
    <section className="relative z-40 mt-3 max-h-none w-full overflow-y-auto rounded-[24px] border border-white/70 bg-[#f8f4eb]/92 p-3 text-[#171311] shadow-[0_10px_28px_rgba(0,0,0,0.14)] backdrop-blur-md sm:ml-auto sm:w-[min(360px,78%)] lg:absolute lg:bottom-auto lg:right-0 lg:top-1/2 lg:mt-0 lg:max-h-[72%] lg:w-[320px] lg:-translate-y-1/2 lg:translate-x-1/2 xl:w-[340px]">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#171311] text-[10px] font-bold uppercase leading-none text-[#f8f4eb]">
          {experienceInitials}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3 border-b border-[#171311]/12 pb-2">
            <p className="text-[9px] font-bold uppercase leading-none text-[#5E1C23]">
              Endorsements
            </p>
            <span className="text-[9px] font-bold uppercase leading-none text-[#171311]/42">
              {featuredEndorsements.length.toString().padStart(2, "0")} / 03
            </span>
          </div>

          <div className="mt-2 grid gap-1.5">
            {featuredEndorsements.length > 0 ? (
              featuredEndorsements.map((endorsement, index) => (
                <blockquote
                  className="rounded-[18px] border border-[#171311]/10 bg-white/62 px-3 py-2"
                  key={endorsement.id}
                >
                  <div className="flex items-start gap-2">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#5E1C23] text-[8px] font-bold uppercase leading-none text-[#f8f4eb]">
                      {getInitials(endorsement.authorName)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2 text-[8px] font-bold uppercase leading-none text-[#171311]/48">
                        <span className="truncate">{endorsement.authorName}</span>
                        <span>{(index + 1).toString().padStart(2, "0")}</span>
                      </div>
                      <p className="mt-1 text-[11px] font-light leading-4 text-[#171311]/72">
                        {endorsement.note}
                      </p>
                    </div>
                  </div>
                </blockquote>
              ))
            ) : (
              <p className="rounded-[18px] border border-[#171311]/10 bg-white/55 px-3 py-2 text-[11px] font-light leading-4 text-[#171311]/58">
                No endorsements selected yet.
              </p>
            )}
          </div>

          <form
            className="mt-2 rounded-[20px] border border-[#171311]/10 bg-white/55 p-2.5"
            onSubmit={submitEndorsement}
          >
            <div className="flex items-center gap-2 border-b border-[#171311]/10 pb-2">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#d7b82d] text-[8px] font-bold uppercase leading-none text-[#171311]">
                Me
              </span>
              <input
                className="min-w-0 flex-1 bg-transparent text-xs font-light leading-5 text-[#171311] outline-none placeholder:text-[#171311]/36"
                maxLength={120}
                onChange={(event) =>
                  setForm((current) => ({ ...current, authorName: event.target.value }))
                }
                placeholder="Name"
                required
                value={form.authorName}
              />
            </div>
            <textarea
              className="mt-2 min-h-16 w-full resize-none rounded-[16px] bg-[#171311]/5 px-3 py-2 text-xs font-light leading-5 text-[#171311] outline-none placeholder:text-[#171311]/36 focus:bg-[#171311]/8"
              maxLength={1000}
              onChange={(event) => setForm((current) => ({ ...current, note: event.target.value }))}
              placeholder={`Endorse ${experience.companyName}`}
              required
              value={form.note}
            />
            <div className="mt-2 flex items-center justify-between gap-2 border-t border-[#171311]/10 pt-2">
              <p
                aria-live="polite"
                className={`flex min-h-4 min-w-0 items-center gap-1.5 text-[8px] font-bold uppercase leading-none ${
                  status === "success"
                    ? "text-[#5E1C23]"
                    : status === "error"
                      ? "text-[#9b3026]"
                      : "text-[#171311]/38"
                }`}
              >
                {status === "success" ? <CheckCircle2 aria-hidden="true" size={12} /> : null}
                {status === "error" ? <AlertCircle aria-hidden="true" size={12} /> : null}
                <span className="truncate">
                  {message || "Reviewed before it appears."}
                </span>
              </p>
              <button
                className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full bg-[#171311] px-3 text-[9px] font-bold uppercase leading-none text-[#f8f4eb] transition hover:bg-[#5E1C23] disabled:cursor-not-allowed disabled:opacity-45"
                disabled={status === "submitting"}
                type="submit"
              >
                <Send aria-hidden="true" size={12} strokeWidth={1.9} />
                {status === "submitting" ? "Sending" : "Send"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

function getInitials(value: string) {
  const initials = value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return initials || "KS";
}

function formatDateRange(fromDate: string, toDate: string | null) {
  return `${formatDisplayDate(fromDate)} - ${toDate ? formatDisplayDate(toDate) : "Present"}`;
}

function formatDisplayDate(value: string) {
  const dateMatch = /^\d{4}-\d{2}-\d{2}$/.test(value);

  if (!dateMatch) {
    return value;
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}
