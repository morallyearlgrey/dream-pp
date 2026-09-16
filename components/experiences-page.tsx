"use client";

/* eslint-disable @next/next/no-img-element */
import type { FormEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useScroll,
  useTransform,
} from "framer-motion";
import { AlertCircle, CheckCircle2, Images, RefreshCw, Send } from "lucide-react";
import { handleImageFallback, PlaceholderMediaImage } from "@/components/media-placeholder";
import type {
  ExperienceRecord,
  FeaturedEndorsementRecord,
} from "@/lib/portfolio-records";
import {
  getPhotoUrl,
  isVideoMediaUrl,
  mediaPlaceholderImageUrl,
  withMediaPlaceholder,
} from "@/lib/supabase-media";

type FilmFrame = {
  src: string | null;
  label: string;
  meta: string;
  frameClassName: string;
};

export type ExperienceFeatureData = ExperienceRecord;
export type FeaturedEndorsementData = FeaturedEndorsementRecord;

const experienceVideoBaseUrl =
  "https://qcxeyxinrhwjmmwhguqg.supabase.co/storage/v1/object/public/portfoliomedia/experience-videos";
const filmFrames: FilmFrame[] = [
  {
    src: `${experienceVideoBaseUrl}/frame1.mp4`,
    label: "Campus Frame",
    meta: "Field 01",
    frameClassName: "",
  },
  {
    src: `${experienceVideoBaseUrl}/frame2.mp4`,
    label: "Team Frame",
    meta: "Field 02",
    frameClassName: "",
  },
  {
    src: `${experienceVideoBaseUrl}/frame3.mp4`,
    label: "Briefing Frame",
    meta: "Field 03",
    frameClassName: "",
  },
  {
    src: `${experienceVideoBaseUrl}/frame4.mp4`,
    label: "Public Crowd",
    meta: "Frame 04",
    frameClassName: "",
  },
  {
    src: `${experienceVideoBaseUrl}/frame5.mp4`,
    label: "Motion Field One",
    meta: "Frame 05",
    frameClassName: "",
  },
  {
    src: `${experienceVideoBaseUrl}/frame6.mp4`,
    label: "Motion Field Two",
    meta: "Frame 06",
    frameClassName: "",
  },
];
const upperFilmFrames = filmFrames.slice(0, 3);
const lowerFilmFrames = filmFrames.slice(3);
const experienceSubjectPhoto = withMediaPlaceholder(getPhotoUrl("/photos/experiences.png"));
const experiencePageText =
  "My experiences are the places where curiosity became responsibility. Across NVIDIA, BNY, IEEE @ UCF, and Knight Hacks, I have learned how to build reliable systems, ask better questions, and help teams turn ambitious ideas into work people can depend on.";

export function ExperiencesPage({
  experiences,
}: {
  experiences: ExperienceFeatureData[];
}) {
  const uniqueExperiences = useMemo(
    () =>
      Array.from(
        new Map(experiences.map((experience) => [experience.id, experience])).values(),
      ),
    [experiences],
  );

  return (
    <main className="overflow-hidden bg-[var(--color-base)] text-[var(--color-text)]">
      <ExperienceCoverHero experiences={uniqueExperiences} />
      <ExperienceRoleArchive experiences={uniqueExperiences} />
    </main>
  );
}

function ExperienceCoverHero({ experiences }: { experiences: ExperienceFeatureData[] }) {
  const { scrollY } = useScroll();
  const coverY = useTransform(scrollY, [0, 900], [0, -28]);
  const leadExperience = experiences[0];

  return (
    <section className="relative isolate min-h-[calc(100svh-72px)] overflow-hidden bg-[radial-gradient(ellipse_at_76%_8%,rgba(var(--color-text-rgb),0.12),transparent_34%),linear-gradient(180deg,var(--color-elevated)_0%,var(--color-panel)_100%)] text-[var(--color-text)] lg:min-h-screen">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="relative min-h-[860px] overflow-hidden bg-transparent pb-10 pt-6 sm:min-h-[940px] lg:min-h-[calc(100vh-72px)] lg:pb-8"
        initial={{ opacity: 0, y: 18 }}
        style={{ y: coverY }}
        transition={{ duration: 0.65, ease: "easeOut" }}
      >
        <div className="relative z-50 mx-5 flex items-center justify-between gap-4 border-b border-[var(--color-text)]/18 pb-2 text-[8px] font-bold uppercase leading-none text-[var(--color-text)]/56 sm:mx-8 sm:text-[10px] lg:mx-12">
          <span>Work Contact Sheet</span>
          <span className="hidden text-center sm:block">Frames / Roles / Notes</span>
          <span>Issue 02</span>
        </div>

        <div className="relative z-40 mx-5 mt-10 max-w-[82%] sm:mx-8 sm:mt-12 sm:max-w-[62%] lg:mx-12 lg:mt-12 lg:max-w-[54%]">
          <p className="mb-3 flex items-center gap-2 text-[8px] font-bold uppercase leading-none text-[var(--color-text)]/58 sm:text-[10px]">
            Field Work
            <span className="h-px w-12 bg-[var(--color-text)]/24" />
            {experiences.length > 0 ? `${experiences.length} Frames` : "No Frames Yet"}
          </p>
          <h1 className="font-display text-[52px] font-semibold uppercase leading-[0.9] text-[var(--color-text)] sm:text-[78px] lg:text-[104px] xl:text-[120px]">
            Experiences
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-[9px] font-bold uppercase leading-none text-[var(--color-text)]/48 sm:text-[10px]">
            <span>{leadExperience?.companyName ?? "No Roles Loaded"}</span>
            <span className="h-px w-5 bg-[var(--color-text)]/24" />
            <span>{leadExperience?.positionName ?? "Awaiting Role Frames"}</span>
          </div>
          <div className="mt-5 grid max-w-md grid-cols-3 gap-3 border-y border-[var(--color-text)]/12 py-3 text-[8px] font-bold uppercase leading-none text-[var(--color-text)]/44 sm:text-[9px]">
            <span>
              Lens <span className="text-[#8f2b35]">35mm</span>
            </span>
            <span>
              ISO <span className="text-[#8f2b35]">800</span>
            </span>
            <span className="text-right">
              Tone <span className="text-[#8f2b35]">Color</span>
            </span>
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
          />

          <ExperienceSubject />

          <div className="absolute inset-x-0 top-[-22px] z-10 h-px bg-[var(--color-text)]/10" />
          <div className="absolute inset-x-0 bottom-[-22px] z-10 h-px bg-[var(--color-text)]/10" />
        </div>

        <div className="relative z-40 mx-5 mt-8 border-t border-[var(--color-text)]/18 pt-5 sm:mx-8 lg:mx-12 lg:mt-9">
          <p className="max-w-4xl text-base font-light leading-7 text-[var(--color-text)]/72 sm:text-lg sm:leading-8 lg:text-xl lg:leading-9">
            {experiencePageText}
          </p>
        </div>
      </motion.div>
    </section>
  );
}

function FilmStrip({
  className,
  frames,
}: {
  className: string;
  frames: FilmFrame[];
}) {
  return (
    <div className={`absolute z-20 ${className}`}>
      <div className="relative overflow-hidden border-y border-[var(--color-text)]/24 bg-[var(--color-panel)] py-3 shadow-[0_12px_32px_rgba(0,0,0,0.34)]">
        <div
          aria-hidden="true"
          className="editorial-film-sprockets absolute inset-x-0 top-0 h-3 border-b border-[var(--color-text)]/12 opacity-65"
        />
        <div
          aria-hidden="true"
          className="editorial-film-sprockets absolute inset-x-0 bottom-0 h-3 border-t border-[var(--color-text)]/12 opacity-55"
        />
        <div className="grid grid-cols-3 gap-px border-y border-[var(--color-text)]/12 bg-[var(--color-text)]/12">
          {frames.map((frame, index) => (
            <div
              className={`relative aspect-[4/3] min-w-0 overflow-hidden bg-[var(--color-deep)] ring-1 ring-inset ring-[var(--color-text)]/10 sm:aspect-[16/7] lg:aspect-[3/1] ${frame.frameClassName}`}
              key={`${frame.src}-${frame.meta}`}
            >
              <FilmFrameMedia frame={frame} />
              <span
                aria-hidden="true"
                className="absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(var(--color-deep-rgb),0.16)_0%,rgba(var(--color-deep-rgb),0.04)_48%,rgba(var(--color-deep-rgb),0.44)_100%)]"
              />
              <span aria-hidden="true" className="editorial-film-grain absolute inset-0 z-20" />
              <span aria-hidden="true" className="absolute inset-y-0 left-0 z-20 w-px bg-[var(--color-text)]/16" />
              <span aria-hidden="true" className="absolute inset-y-0 right-0 z-20 w-px bg-black/45" />
              <span className="absolute bottom-2 left-2 z-30 border-t border-[var(--color-text)]/34 pt-1 text-[8px] font-bold uppercase leading-none text-[var(--color-text)]/66">
                {frame.meta}
              </span>
              <span className="absolute right-2 top-2 z-30 text-[8px] font-bold uppercase leading-none text-[var(--color-text)]/44">
                {(index + 1).toString().padStart(2, "0")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FilmFrameMedia({ frame }: { frame: FilmFrame }) {
  const [loadFailed, setLoadFailed] = useState(false);
  const className =
    "h-full w-full object-cover contrast-[1.08] saturate-100 brightness-[0.9]";

  if (!loadFailed && isVideoMediaUrl(frame.src)) {
    return (
      <DeferredExperienceVideo
        className={className}
        label={frame.label}
        onError={() => setLoadFailed(true)}
        src={frame.src ?? ""}
      />
    );
  }

  return (
    <img
      alt=""
      aria-hidden="true"
      className={className}
      decoding="async"
      loading="lazy"
      onError={handleImageFallback}
      src={loadFailed || !frame.src ? mediaPlaceholderImageUrl : frame.src}
    />
  );
}

function DeferredExperienceVideo({
  className,
  label,
  onError,
  src,
}: {
  className: string;
  label: string;
  onError: () => void;
  src: string;
}) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const shouldLoad = useInView(containerRef, { margin: "240px 0px", once: true });
  const [ready, setReady] = useState(false);

  return (
    <span className="relative block h-full w-full overflow-hidden bg-[var(--color-deep)]" ref={containerRef}>
      <PlaceholderMediaImage
        className={`absolute inset-0 ${className}`}
        decorative
      />
      {shouldLoad ? (
        <video
          aria-label={label}
          autoPlay
          className={`${className} absolute inset-0 transition-opacity duration-300 ${
            ready ? "opacity-100" : "opacity-0"
          }`}
          loop
          muted
          onError={onError}
          onLoadedData={() => setReady(true)}
          playsInline
          preload="metadata"
          src={src}
        />
      ) : null}
    </span>
  );
}

function ExperienceSubject() {
  return (
    <div className="pointer-events-none absolute bottom-0 right-[-34%] z-30 h-[104%] w-[112%] sm:right-[-21%] sm:h-[112%] sm:w-[80%] md:right-[-12%] md:h-[116%] md:w-[68%] lg:right-[-1%] lg:h-[122%] lg:w-[46%] xl:right-[1%] xl:w-[44%]">
      <div
        aria-hidden="true"
        className="absolute bottom-[7%] left-[18%] z-20 h-[74%] w-[60%] bg-[var(--color-text)]/12 blur-[32px]"
      />
      <img
        alt="Kai Sprunger standing portrait cutout"
        className="relative z-30 h-full w-full object-contain object-bottom drop-shadow-[0_28px_34px_rgba(0,0,0,0.48)]"
        onError={handleImageFallback}
        src={experienceSubjectPhoto}
      />
    </div>
  );
}

function ExperienceRoleArchive({ experiences }: { experiences: ExperienceFeatureData[] }) {
  return (
    <section className="relative min-w-0 overflow-x-clip px-5 py-16 sm:px-8 lg:px-12">
      <div className="mx-auto min-w-0 max-w-7xl border-t border-[var(--color-text)]/16 pt-8">
        {experiences.length > 0 ? (
          <div className="grid gap-12 lg:gap-16">
            {experiences.map((experience, index) => (
              <ExperienceFeature
                experience={experience}
                key={experience.id}
                sequence={index + 1}
              />
            ))}
          </div>
        ) : (
          <ExperienceEmptyState />
        )}
      </div>
    </section>
  );
}

function ExperienceEmptyState() {
  return (
    <section className="border-y border-[var(--color-text)]/18 py-12">
      <h3 className="font-display text-[46px] font-semibold uppercase leading-[0.86] text-[var(--color-text)] sm:text-[72px]">
        No Experience Records
      </h3>
      <p className="mt-5 max-w-xl border-l border-[#8f2b35]/45 pl-4 text-sm font-light leading-7 text-[var(--color-text)]/64">
        Add rows to the experiences table to populate this work archive.
        Approved featured endorsements will attach automatically.
      </p>
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
  const mainMedia = experience.mainVideo ?? experience.photos[0] ?? null;

  return (
    <article className="group relative isolate min-w-0 max-w-full overflow-hidden border-t border-[var(--color-text)]/14 pt-10 first:border-t-0 first:pt-0 lg:overflow-visible">
      <div className="relative grid min-w-0 gap-5 lg:grid-cols-[minmax(280px,0.44fr)_minmax(0,0.86fr)] lg:items-center lg:gap-0 lg:pr-[150px] xl:pr-[170px]">
        <InfoPanel
          className="lg:w-[116%]"
          displayRange={displayRange}
          experience={experience}
          sequence={sequence}
        />

        <MediaProofPanel experience={experience} mainMedia={mainMedia} sequence={sequence} />
      </div>
    </article>
  );
}

function MediaProofPanel({
  experience,
  mainMedia,
  sequence,
}: {
  experience: ExperienceFeatureData;
  mainMedia: string | null;
  sequence: number;
}) {
  const [loadFailed, setLoadFailed] = useState(false);
  const mainMediaIsVideo = !loadFailed && isVideoMediaUrl(mainMedia);
  const mediaClassName =
    "h-full w-full object-cover brightness-[0.74] contrast-[1.16] saturate-[0.72]";

  return (
    <section className="relative z-10 min-w-0 max-w-full overflow-visible lg:aspect-square lg:min-h-[660px]">
      <div className="relative aspect-[4/5] w-full min-w-0 overflow-hidden border border-[var(--color-text)]/18 bg-[var(--color-panel)] sm:aspect-square sm:min-h-[540px] lg:h-full lg:min-h-0">
        {mainMedia && !loadFailed ? (
          mainMediaIsVideo ? (
            <DeferredExperienceVideo
              className={mediaClassName}
              label={`${experience.companyName} feature motion`}
              onError={() => setLoadFailed(true)}
              src={mainMedia}
            />
          ) : (
            <img
              alt=""
              aria-hidden="true"
              className={mediaClassName}
              decoding="async"
              loading="lazy"
              onError={handleImageFallback}
              src={mainMedia}
            />
          )
        ) : (
          <PlaceholderMediaImage className={mediaClassName} decorative />
        )}
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(var(--color-deep-rgb),0.08),rgba(var(--color-deep-rgb),0.5)),radial-gradient(circle_at_22%_18%,rgba(143,43,53,0.1),transparent_30%)]"
        />
        <span aria-hidden="true" className="archive-scanlines absolute inset-0 opacity-20" />
        <div className="absolute left-3 right-3 top-3 flex items-center justify-between border-b border-[var(--color-text)]/18 pb-2 text-[9px] font-bold uppercase leading-none text-[var(--color-text)]/66">
          <span>Motion Plate</span>
          <span>{sequence.toString().padStart(2, "0")}</span>
        </div>
        <div className="absolute bottom-3 left-3 hidden max-w-[42%] items-center gap-3 text-[9px] font-bold uppercase leading-none text-[var(--color-text)]/54 sm:flex">
          <span className="h-px flex-1 bg-[var(--color-text)]/18" />
          <span>Looping Study</span>
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
      className={`editorial-panel relative z-30 min-w-0 max-w-full overflow-hidden p-4 text-[var(--color-text)] sm:p-5 lg:overflow-visible ${className}`}
    >
      <div className="relative z-10 flex flex-col lg:pr-[16%]">
        <div className="flex items-center justify-between gap-4 border-b border-[var(--color-text)]/16 pb-3 text-[9px] font-bold uppercase leading-none text-[var(--color-text)]/50">
          <span>Experience {sequence.toString().padStart(2, "0")}</span>
          <span>{displayRange}</span>
        </div>
        <div className="mt-5 flex items-center gap-3 text-[9px] font-bold uppercase leading-none text-[#8f2b35]">
          <span>Role Note</span>
          <span className="h-px flex-1 bg-[#5E1C23]/70" />
        </div>
        <div className="mt-7">
          <h3 className="font-display text-[clamp(36px,8vw,62px)] font-semibold uppercase leading-[0.86] text-[var(--color-text)]">
            {experience.companyName}
          </h3>
          <p className="mt-4 border-t border-[var(--color-text)]/16 pt-3 text-[10px] font-bold uppercase leading-none text-[#8f2b35]">
            {experience.positionName}
          </p>
          <p className="mt-4 text-sm font-light leading-6 text-[var(--color-text)]/68">
            {experience.summary}
          </p>
        </div>
      </div>
      <div className="relative z-10 mt-4 border-t border-[var(--color-text)]/16 pt-3">
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
  const photos = experience.photos;
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
    <div
      className={`group/panel relative block w-full overflow-hidden border border-[var(--color-text)]/20 bg-[var(--color-card-surface)] text-left transition-[height,border-color] hover:border-[#8f2b35]/75 lg:h-[220px] xl:h-[230px] ${
        flipped ? "h-[340px] sm:h-[300px]" : "h-[180px] sm:h-[200px]"
      }`}
    >
      <AnimatePresence initial={false} mode="wait">
        {flipped ? (
          <motion.div
            animate={{ opacity: 1, rotateY: 0 }}
            className="absolute inset-0 flex min-h-0 flex-col overflow-hidden bg-[var(--color-text)] p-4 text-[var(--color-ink)] sm:p-5"
            exit={{ opacity: 0, rotateY: -8 }}
            initial={{ opacity: 0, rotateY: 8 }}
            key="responsibilities"
            transition={{ duration: 0.24, ease: "easeOut" }}
          >
            <div className="flex shrink-0 items-center justify-between border-b border-[var(--color-ink)]/14 pb-3 text-[9px] font-bold uppercase leading-none text-[#5E1C23]">
              <span>Responsibilities</span>
              <RefreshCw aria-hidden="true" size={14} strokeWidth={1.8} />
            </div>
            <ul
              aria-label={`${experience.companyName} responsibilities`}
              className="experience-responsibilities-scroll mt-3 min-h-0 flex-1 touch-pan-y overflow-y-auto overscroll-y-auto pr-3 text-xs font-light leading-5 text-[var(--color-ink)]/72 sm:mt-4 sm:text-sm sm:leading-6"
            >
              {experience.responsibilities.map((item) => (
                <li className="mb-3 border-l border-[#5E1C23]/60 pl-3 last:mb-0" key={item}>
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-3 shrink-0">
              <PhotoFlipAction label="Return to photo" onClick={() => setFlipped(false)} />
            </div>
          </motion.div>
        ) : photos.length > 0 ? (
          <motion.button
            animate={{ opacity: 1, scale: 1 }}
            aria-label={`Flip ${experience.companyName} card for responsibilities`}
            className="absolute inset-0 w-full text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#8f2b35]"
            exit={{ opacity: 0, scale: 1.015 }}
            initial={{ opacity: 0, scale: 1.015 }}
            key={photos[photoIndex]}
            onClick={() => setFlipped(true)}
            transition={{ duration: 0.35, ease: "easeOut" }}
            type="button"
          >
            <img
              alt=""
              aria-hidden="true"
              className="h-full w-full object-cover brightness-[0.84] contrast-[1.08] saturate-[0.72] transition duration-500 group-hover/panel:scale-[1.03]"
              decoding="async"
              loading="lazy"
              onError={handleImageFallback}
              src={photos[photoIndex]}
            />
            <span aria-hidden="true" className="archive-scanlines absolute inset-0 opacity-25" />
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(180deg,rgba(var(--color-deep-rgb),0.04),rgba(var(--color-deep-rgb),0.58))]"
            />
            <div className="absolute left-3 right-3 top-3 flex items-center justify-between border-b border-[var(--color-text)]/22 pb-2 text-[9px] font-bold uppercase leading-none text-[var(--color-text)]/74">
              <span>Photo Index</span>
              <span>
                {(photoIndex + 1).toString().padStart(2, "0")} /{" "}
                {photos.length.toString().padStart(2, "0")}
              </span>
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <PhotoFlipAction label="Flip for responsibilities" />
            </div>
          </motion.button>
        ) : (
          <motion.button
            animate={{ opacity: 1, scale: 1 }}
            aria-label={`Flip ${experience.companyName} card for responsibilities`}
            className="absolute inset-0 w-full bg-[var(--color-card-surface)] text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#8f2b35]"
            exit={{ opacity: 0, scale: 1.015 }}
            initial={{ opacity: 0, scale: 1.015 }}
            key="empty-photo-index"
            onClick={() => setFlipped(true)}
            transition={{ duration: 0.35, ease: "easeOut" }}
            type="button"
          >
            <PlaceholderMediaImage className="h-full w-full object-cover brightness-[0.84] contrast-[1.08] saturate-[0.72]" decorative />
            <div className="absolute bottom-4 left-4 right-4">
              <PhotoFlipAction label="Flip for responsibilities" />
            </div>
          </motion.button>
        )}
      </AnimatePresence>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-2 border border-[var(--color-text)]/0 transition group-hover/panel:border-[var(--color-text)]/35"
      />
      <span aria-live="polite" className="sr-only">
        {flipped ? "Showing responsibilities" : `Showing photo ${photoIndex + 1} of ${photos.length}`}
      </span>
    </div>
  );
}

const photoFlipActionClassName =
  "flex min-h-9 w-full items-center gap-2 border border-[var(--color-text)]/24 bg-[var(--color-card-surface)]/88 px-3 py-2 text-[9px] font-bold uppercase leading-none text-[var(--color-text)]/76 backdrop-blur-sm transition hover:border-[#8f2b35]/75 hover:bg-[var(--color-card-surface)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[#8f2b35]";

function PhotoFlipAction({
  label,
  onClick,
}: {
  label: string;
  onClick?: () => void;
}) {
  const content = (
    <>
      <Images aria-hidden="true" size={14} strokeWidth={1.8} />
      <span className="min-w-0 flex-1 text-left text-[9px]">{label}</span>
      <RefreshCw aria-hidden="true" size={13} strokeWidth={1.8} />
    </>
  );

  if (onClick) {
    return (
      <button className={photoFlipActionClassName} onClick={onClick} type="button">
        {content}
      </button>
    );
  }

  return <div className={photoFlipActionClassName}>{content}</div>;
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
    <section className="relative z-40 mt-3 w-full min-w-0 max-w-full overflow-hidden rounded-[26px] border border-[var(--color-text)]/18 bg-[var(--color-card-surface)]/96 p-2 text-[var(--color-text)] shadow-none backdrop-blur-xl sm:ml-auto sm:w-[min(360px,78%)] lg:absolute lg:bottom-auto lg:right-0 lg:top-1/2 lg:mt-0 lg:w-[320px] lg:-translate-y-1/2 lg:translate-x-1/2 xl:w-[340px]">
      <div className="rounded-[22px] border border-white/16 bg-[var(--color-paper)]/92 p-2 text-[var(--color-ink)]">
        <div className="flex items-center gap-2 border-b border-[var(--color-ink)]/10 pb-2">
          <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--color-ink),#5E1C23)] text-[9px] font-bold uppercase leading-none text-[var(--color-paper)]">
            {experienceInitials}
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border border-[var(--color-paper)] bg-[#8f2b35]" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2 text-[7px] font-bold uppercase leading-none">
              <span className="truncate text-[#5E1C23]">
                {experience.companyName} - {experience.positionName}
              </span>
              <span className="text-[var(--color-ink)]/42">
                {featuredEndorsements.length.toString().padStart(2, "0")} / 03
              </span>
            </div>
            <p className="mt-1 text-[8px] font-bold uppercase leading-none text-[var(--color-ink)]/38">
              Notes active now / replies held for review
            </p>
          </div>
        </div>

        <div
          aria-label={`${experience.companyName} endorsement messages`}
          className="experience-responsibilities-scroll mt-3 grid max-h-[180px] touch-pan-y gap-2 overflow-y-auto overscroll-y-contain pr-1 [scrollbar-gutter:stable]"
        >
          {featuredEndorsements.length > 0 ? (
            featuredEndorsements.map((endorsement, index) => (
              <blockquote className="flex items-end gap-2" key={endorsement.id}>
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#5E1C23] text-[8px] font-bold uppercase leading-none text-[var(--color-paper)]">
                  {getInitials(endorsement.authorName)}
                </span>
                <div className="min-w-0 flex-1 rounded-[19px] rounded-bl-md border border-[var(--color-ink)]/8 bg-white/78 px-3 py-2">
                  <div className="flex items-center justify-between gap-2 text-[8px] font-bold uppercase leading-none text-[var(--color-ink)]/42">
                    <span className="truncate">{endorsement.authorName}</span>
                    <span>Seen {(index + 1).toString().padStart(2, "0")}</span>
                  </div>
                  <p className="mt-1.5 break-words text-[10px] font-light leading-[15px] text-[var(--color-ink)]/74">
                    {endorsement.note}
                  </p>
                </div>
              </blockquote>
            ))
          ) : (
            <div className="flex items-end gap-2">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#5E1C23] text-[8px] font-bold uppercase leading-none text-[var(--color-paper)]">
                KS
              </span>
              <p className="min-w-0 flex-1 rounded-[19px] rounded-bl-md border border-[var(--color-ink)]/8 bg-white/72 px-3 py-2 text-[10px] font-light leading-[15px] text-[var(--color-ink)]/58">
                No endorsements selected yet.
              </p>
            </div>
          )}
        </div>

        <form
          className="mt-3 border-t border-[var(--color-ink)]/10 pt-2"
          onSubmit={submitEndorsement}
        >
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#8f2b35] text-[8px] font-bold uppercase leading-none text-[var(--color-paper)]">
              Me
            </span>
            <input
              className="min-w-0 flex-1 rounded-full border border-[var(--color-ink)]/8 bg-[var(--color-ink)]/5 px-3 py-2 text-[9px] font-light leading-none text-[var(--color-ink)] outline-none transition placeholder:text-[7px] placeholder:text-[var(--color-ink)]/36 focus:border-[#8f2b35]/70 focus:bg-white/70"
              maxLength={120}
              onChange={(event) =>
                setForm((current) => ({ ...current, authorName: event.target.value }))
              }
              placeholder="Your name"
              required
              value={form.authorName}
            />
          </div>

          <div className="mt-2 flex items-end gap-2 rounded-[22px] border border-[var(--color-ink)]/8 bg-white/70 px-2 py-2">
            <textarea
              aria-label={`Message ${experience.companyName} - ${experience.positionName}`}
              className="editorial-y-scroll min-h-24 max-h-40 min-w-0 flex-1 touch-pan-y resize-none overflow-y-auto overscroll-y-contain bg-transparent px-1 text-xs font-light leading-5 text-[var(--color-ink)] outline-none [scrollbar-gutter:stable] placeholder:text-[9px] placeholder:text-[var(--color-ink)]/36 sm:min-h-16 sm:max-h-28 sm:text-[10px] sm:leading-4 sm:placeholder:text-[8px]"
              maxLength={500}
              minLength={1}
              onChange={(event) => setForm((current) => ({ ...current, note: event.target.value }))}
              placeholder={`Message ${experience.companyName} - ${experience.positionName}`}
              required
              rows={2}
              value={form.note}
            />
            <button
              aria-label={status === "submitting" ? "Sending endorsement" : "Send endorsement"}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--color-ink)] text-[var(--color-paper)] transition hover:bg-[#5E1C23] disabled:cursor-not-allowed disabled:opacity-45"
              disabled={status === "submitting"}
              type="submit"
            >
              <Send aria-hidden="true" size={14} strokeWidth={2} />
            </button>
          </div>

          <p
            aria-live="polite"
            className={`mt-2 flex min-h-4 min-w-0 items-center gap-1.5 px-1 text-[8px] font-bold uppercase leading-none ${
              status === "success"
                ? "text-[#5E1C23]"
                : status === "error"
                  ? "text-[#9b3026]"
                  : "text-[var(--color-ink)]/38"
            }`}
          >
            {status === "success" ? <CheckCircle2 aria-hidden="true" size={12} /> : null}
            {status === "error" ? <AlertCircle aria-hidden="true" size={12} /> : null}
            <span className="truncate">
              {message || (status === "submitting" ? "Sending reply." : "Hold to archive review.")}
            </span>
          </p>
        </form>
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
