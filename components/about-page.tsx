"use client";

/* eslint-disable @next/next/no-img-element */
import { AnimatePresence, motion } from "framer-motion";
import { GripVertical, RotateCcw, ShieldCheck, X } from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import {
  aboutCards,
  captchaTiles,
  heroPhoto,
  myInterestsText,
  visualArchiveVideo,
  whoIAmText,
  whoAmIPhoto,
} from "@/lib/about-data";
import { handleImageFallback, PlaceholderMediaImage } from "@/components/media-placeholder";
import { isVideoMediaUrl } from "@/lib/supabase-media";

const titles = [
  "Software Engineer",
  "Embedded Software Developer",
  "Designer",
  "Reader",
  "Artist",
];

type RevealBox = { x: number; y: number; width: number; height: number };
type FocusRegionLabel = "EYES" | "FACE" | "HAIR" | "SHOULDER" | "SKY" | "BACKGROUND";
type FocusZone = {
  label: Exclude<FocusRegionLabel, "BACKGROUND">;
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
};

const desktopRevealBox: RevealBox = { x: 35, y: 18, width: 44, height: 24 };
const mobileRevealBox: RevealBox = { x: 7, y: 27, width: 86, height: 11 };
const focusZones: FocusZone[] = [
  { label: "EYES", xMin: 49, xMax: 69, yMin: 27, yMax: 38 },
  { label: "FACE", xMin: 43, xMax: 72, yMin: 20, yMax: 55 },
  { label: "HAIR", xMin: 39, xMax: 86, yMin: 3, yMax: 24 },
  { label: "HAIR", xMin: 37, xMax: 54, yMin: 21, yMax: 60 },
  { label: "HAIR", xMin: 68, xMax: 93, yMin: 18, yMax: 92 },
  { label: "SHOULDER", xMin: 40, xMax: 78, yMin: 55, yMax: 100 },
  { label: "SKY", xMin: 0, xMax: 100, yMin: 0, yMax: 54 },
];
const sideCardMotion = {
  progress: 0,
  distance: 0,
  scale: 1,
  opacity: 0.42,
  rotate: 0,
  y: 0,
};
const centerCardMotion = {
  progress: 1,
  distance: 0,
  scale: 1.08,
  opacity: 1,
  rotate: 0,
  y: 0,
};
const carouselCopyCount = 9;
const carouselMiddleCopy = Math.floor(carouselCopyCount / 2);
const carouselAutoScrollPixelsPerMs = 0.085;
const carouselManualPauseMs = 1300;
const aboutEditorialCards = [
  {
    issue: "Archive 01",
    date: "Profile Index",
    category: "LEARNING hardware and electronics",
    spine: "Builder / Systems / Interfaces",
    kicker: "I design. I code. I ship.",
    quote: "Ideas should leave the notebook.",
    focus: "FOCUSING on making projects",
    currently: "Building in public",
    location: "CURRENTLY picking up jewelry-making",
    crop: "center bottom",
    accent: "#5E1C23",
    backing: "#8f2b35",
  },
  {
    issue: "Archive 02",
    date: "People Index",
    category: "LEARNING new faces",
    spine: "Friend / People / Trust",
    kicker: "I value people, always.",
    quote: "The best work keeps people close.",
    focus: "FOCUSING on planning events",
    currently: "Listening first",
    location: "CURRENTLY hanging out in Mills",
    crop: "center bottom",
    accent: "#605246",
    backing: "#8f2b35",
  },
  {
    issue: "Archive 03",
    date: "Field Index",
    category: "LEARNING how to hike",
    spine: "Explorer / Questions / Motion",
    kicker: "I seek new places and perspectives.",
    quote: "New places reset perspective.",
    focus: "FOCUSING on attending hackathons",
    currently: "Following questions",
    location: "CURRENTLY exploring Orlando, Florida",
    crop: "center bottom",
    accent: "#8f2b35",
    backing: "#8f2b35",
  },
];
const carouselCards = Array.from({ length: carouselCopyCount }, (_, copyIndex) =>
  aboutCards.map((card, cardIndex) => ({
    ...card,
    ...aboutEditorialCards[cardIndex],
    cardIndex,
    copyIndex,
    renderKey: `${copyIndex}-${card.title}`,
  })),
).flat();
const captchaPositions = [
  "center top",
  "center 23%",
  "center 38%",
  "center 52%",
  "center 66%",
  "center 78%",
  "left center",
  "right center",
  "center bottom",
];

function getIsMobileViewport() {
  return typeof window !== "undefined" && window.matchMedia("(max-width: 639px)").matches;
}

export function AboutPage() {
  return (
    <main className="-mt-[72px] overflow-hidden bg-[var(--color-base)] text-[var(--color-text)]">
      <HeroSection />
      <WhoAmI />
      <ImageCarousel />
      <WonderCaptcha />
    </main>
  );
}

function getInitialRevealBox() {
  if (getIsMobileViewport()) {
    return mobileRevealBox;
  }

  return desktopRevealBox;
}

function getFocusRegionLabel(box: RevealBox): FocusRegionLabel {
  const centerX = box.x + box.width / 2;
  const centerY = box.y + box.height / 2;
  const zone = focusZones.find(
    ({ xMin, xMax, yMin, yMax }) =>
      centerX >= xMin && centerX <= xMax && centerY >= yMin && centerY <= yMax,
  );

  return zone?.label ?? "BACKGROUND";
}

function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const dragOffsetRef = useRef({
    x: desktopRevealBox.width / 2,
    y: desktopRevealBox.height / 2,
  });
  const [titleIndex, setTitleIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [box, setBox] = useState(getInitialRevealBox);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTitleIndex((current) => (current + 1) % titles.length);
    }, 1900);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 639px)");

    function syncRevealBox() {
      const nextBox = query.matches ? mobileRevealBox : desktopRevealBox;

      dragOffsetRef.current = {
        x: nextBox.width / 2,
        y: nextBox.height / 2,
      };
      setBox(nextBox);
    }

    syncRevealBox();
    query.addEventListener("change", syncRevealBox);

    return () => query.removeEventListener("change", syncRevealBox);
  }, []);

  function moveBox(clientX: number, clientY: number) {
    const rect = heroRef.current?.getBoundingClientRect();

    if (!rect) {
      return;
    }

    const pointerX = ((clientX - rect.left) / rect.width) * 100;
    const pointerY = ((clientY - rect.top) / rect.height) * 100;

    setBox((current) => {
      const nextX = pointerX - dragOffsetRef.current.x;
      const nextY = pointerY - dragOffsetRef.current.y;

      return {
        ...current,
        ...constrainRevealBox(nextX, nextY, current.width, current.height),
      };
    });
  }

  function constrainRevealBox(x: number, y: number, width: number, height: number) {
    return {
      x: Math.min(100 - width, Math.max(0, x)),
      y: Math.min(100 - height, Math.max(0, y)),
    };
  }

  const clipPath = `inset(${box.y}% ${100 - box.x - box.width}% ${
    100 - box.y - box.height
  }% ${box.x}%)`;
  const focusRegionLabel = getFocusRegionLabel(box);

  return (
    <section
      className="relative min-h-screen w-full overflow-hidden bg-[#111]"
      onPointerMove={(event) => {
        if (isDragging) {
          moveBox(event.clientX, event.clientY);
        }
      }}
      onPointerUp={() => setIsDragging(false)}
      ref={heroRef}
    >
      <img
        alt="Black-and-white portrait of Kai Sprunger"
        className="absolute inset-0 h-full w-full scale-[1.02] object-cover object-[center_45%] opacity-90 blur-[1.5px] brightness-[0.92] contrast-[1.08] grayscale"
        decoding="async"
        fetchPriority="high"
        onError={handleImageFallback}
        src={heroPhoto}
      />
      <img
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-[center_45%] contrast-[1.04] saturate-[1.16]"
        decoding="async"
        onError={handleImageFallback}
        src={heroPhoto}
        style={{ clipPath }}
      />
      <div
        aria-hidden="true"
        className="about-hero-colorwash absolute inset-0"
        style={{ clipPath }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(242,229,198,0.84)_0%,rgba(242,229,198,0.24)_34%,rgba(var(--color-deep-rgb),0.08)_60%,rgba(var(--color-deep-rgb),0.5)_100%)]" />
      <div aria-hidden="true" className="archive-scanlines absolute inset-0 opacity-20" />
      <div className="absolute left-4 right-4 top-24 z-10 flex items-center gap-2 text-[8px] font-bold uppercase leading-none text-[#5E1C23]/84 sm:gap-4 sm:text-[10px] lg:left-14 lg:right-14">
        <span>Issue I</span>
        <span className="h-px flex-1 bg-[#5E1C23]/26" />
        <span>About / Profile</span>
        <span className="h-px w-14 bg-[#5E1C23]/26" />
        <span className="hidden sm:inline">July 2026</span>
        <span>01</span>
      </div>
      <div className="absolute left-4 top-36 z-10 hidden w-[min(420px,44vw)] grid-cols-3 gap-3 border-y border-[#5E1C23]/22 py-3 text-[8px] font-bold uppercase leading-none text-[#5E1C23]/70 sm:grid lg:left-14">
        <span>
          Lens <span className="text-[#5E1C23]">85mm</span>
        </span>
        <span>
          ISO <span className="text-[#5E1C23]">200</span>
        </span>
        <span className="text-right">
          Light <span className="text-[#5E1C23]">Window</span>
        </span>
      </div>
      <p className="absolute right-4 top-1/2 z-10 hidden -translate-y-1/2 text-[10px] font-bold uppercase leading-none text-[var(--color-text)]/64 [writing-mode:vertical-rl] sm:block lg:right-14">
        Move the lens. Reveal the next detail.
      </p>
      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[var(--color-base)] to-transparent" />

      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="absolute bottom-[8%] left-4 z-10 flex max-w-[min(82vw,880px)] flex-col gap-4 text-[#5E1C23] sm:left-8 lg:left-14"
        initial={{ opacity: 0, y: 18 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <h1 className="font-headline flex flex-col gap-3 text-[58px] font-bold uppercase leading-[0.78] text-[#5E1C23] sm:gap-5 sm:text-[96px] lg:gap-6 lg:text-[96px] xl:gap-7 xl:text-[132px] 2xl:text-[156px]">
          <span>Kai</span>
          <span>Sprunger</span>
        </h1>
        <div className="font-subheading h-16 overflow-hidden text-[34px] uppercase leading-none text-[#5E1C23] sm:h-20 sm:text-[54px] lg:h-24 lg:text-[72px]">
          <AnimatePresence mode="wait">
            <motion.p
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -22 }}
              initial={{ opacity: 0, y: 24 }}
              key={titles[titleIndex]}
              transition={{ duration: 0.38, ease: "easeOut" }}
            >
              {titles[titleIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </motion.div>

      <button
        aria-label="Drag to reveal the color portrait"
        className="group absolute z-20 cursor-grab border border-white/95 bg-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.24),0_14px_34px_rgba(0,0,0,0.22)] backdrop-saturate-125 transition active:cursor-grabbing"
        onKeyDown={(event) => {
          const step = event.shiftKey ? 5 : 1.75;

          if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
            return;
          }

          event.preventDefault();
          setBox((current) => {
            const deltaX =
              event.key === "ArrowLeft" ? -step : event.key === "ArrowRight" ? step : 0;
            const deltaY =
              event.key === "ArrowUp" ? -step : event.key === "ArrowDown" ? step : 0;

            return {
              ...current,
              ...constrainRevealBox(
                current.x + deltaX,
                current.y + deltaY,
                current.width,
                current.height,
              ),
            };
          });
        }}
        onPointerDown={(event) => {
          const rect = heroRef.current?.getBoundingClientRect();

          if (rect) {
            const pointerX = ((event.clientX - rect.left) / rect.width) * 100;
            const pointerY = ((event.clientY - rect.top) / rect.height) * 100;
            dragOffsetRef.current = {
              x: pointerX - box.x,
              y: pointerY - box.y,
            };
          }

          event.currentTarget.setPointerCapture(event.pointerId);
          setIsDragging(true);
        }}
        onPointerUp={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
          }
          setIsDragging(false);
        }}
        style={{
          height: `${box.height}%`,
          left: `${box.x}%`,
          top: `${box.y}%`,
          touchAction: "none",
          width: `${box.width}%`,
        }}
        type="button"
      >
        <span className="absolute -left-px -top-8 flex items-center gap-2 border border-white/55 bg-[#111]/55 px-2.5 py-1.5 text-[9px] font-bold uppercase leading-none text-white/88 shadow-[0_8px_24px_rgba(0,0,0,0.18)] backdrop-blur-sm sm:-top-9 sm:text-[10px]">
          <span>Focus area</span>
          <span className="h-px w-6 bg-white/45" />
          <span>{focusRegionLabel}</span>
        </span>
        <span className="absolute -right-8 top-1/2 hidden -translate-y-1/2 items-center gap-1 border border-white/50 bg-[var(--color-text)]/82 px-1.5 py-2 text-[var(--color-drag-text)] shadow-[0_8px_22px_rgba(0,0,0,0.16)] backdrop-blur-sm sm:flex">
          <GripVertical aria-hidden="true" size={16} strokeWidth={1.8} />
          <span className="text-[8px] font-bold uppercase leading-none [writing-mode:vertical-rl]">
            Drag
          </span>
        </span>
        <span className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-[var(--color-text)]/86 px-2 py-1 text-[8px] font-bold uppercase leading-none text-[var(--color-drag-text)] shadow-[0_7px_18px_rgba(0,0,0,0.12)] sm:hidden">
          <GripVertical aria-hidden="true" size={13} strokeWidth={1.8} />
          DRAG
        </span>
        <span
          aria-hidden="true"
          className="absolute inset-1 border border-white/55 opacity-0 transition group-hover:opacity-100 group-active:opacity-100"
        />
      </button>
    </section>
  );
}

function WhoAmI() {
  const maskImageStyle = {
    "--who-mask-image": `url("${whoAmIPhoto}")`,
  } as CSSProperties;

  return (
    <motion.section
      className="group relative w-full overflow-hidden border-y border-[var(--color-text)]/12 bg-[var(--color-deep)] py-20 text-center md:py-24"
      initial={{ opacity: 0, y: 36 }}
      style={maskImageStyle}
      transition={{ duration: 0.65, ease: "easeOut" }}
      viewport={{ amount: 0.35, once: true }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <img
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-[center_46%] opacity-[0.24] grayscale saturate-[0.78] contrast-[1.05]"
        decoding="async"
        loading="lazy"
        onError={handleImageFallback}
        src={whoAmIPhoto}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(var(--color-deep-rgb),0.48)_0%,rgba(var(--color-deep-rgb),0.72)_48%,rgba(var(--color-deep-rgb),0.92)_100%)]"
      />
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-5 sm:px-8 lg:px-12">
        <div className="mb-5 flex w-full items-center gap-3 text-[9px] font-bold uppercase leading-none text-[#8f2b35]/86 sm:text-[10px]">
          <span>Profile Note</span>
          <span className="h-px flex-1 bg-[var(--color-text)]/14" />
          <span>02</span>
        </div>
        <div className="relative inline-block">
          <img
            alt=""
            aria-hidden="true"
            className="absolute inset-x-[-8%] top-1/2 h-[130%] w-[116%] -translate-y-1/2 object-cover object-[center_46%] opacity-20 grayscale saturate-[0.76] contrast-[1.08]"
            decoding="async"
            loading="lazy"
            onError={handleImageFallback}
            src={whoAmIPhoto}
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-[-8%] top-1/2 h-[130%] w-[116%] -translate-y-1/2 bg-[var(--color-deep)]/54"
          />
          <h2 className="who-mask-heading relative z-10 font-headline text-[54px] font-bold uppercase leading-[0.88] text-[var(--color-text)] sm:text-[86px] lg:text-[118px]">
            <span>Who I Am</span>
            <motion.span
              aria-hidden="true"
              className="who-mask-text absolute inset-0"
              initial={{ opacity: 0 }}
              transition={{ delay: 0.2, duration: 0.9, ease: "easeOut" }}
              viewport={{ amount: 0.7, once: true }}
              whileInView={{ opacity: 0.68 }}
            >
              Who I Am
            </motion.span>
            <span aria-hidden="true" className="who-mask-text who-mask-hover absolute inset-0">
              Who I Am
            </span>
          </h2>
        </div>
        <div className="relative z-10 mt-6 flex w-full max-w-5xl items-center gap-3 text-xs font-bold uppercase leading-5 text-[var(--color-text)]/66 sm:text-base sm:leading-6">
          <span className="h-px flex-1 bg-[var(--color-text)]/16" />
          <span className="text-center tracking-[0.18em]">
            2x @ NVIDIA <span className="text-[#8f2b35]">•</span> 2x @ BNY <span className="text-[#8f2b35]">•</span> Hack Lead @ Knight Hacks <span className="text-[#8f2b35]">•</span> Prev Software Chair @ IEEE
          </span>
          <span className="h-px flex-1 bg-[var(--color-text)]/16" />
        </div>
        <p className="relative z-10 mt-9 max-w-3xl text-lg font-light leading-9 text-[var(--color-text)]/70 sm:text-xl sm:leading-10">
          {whoIAmText}
        </p>
      </div>
    </motion.section>
  );
}

function ImageCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);
  const frameRef = useRef<number | null>(null);
  const autoFrameRef = useRef<number | null>(null);
  const lastAutoTickRef = useRef<number | null>(null);
  const autoPausedUntilRef = useRef(0);
  const initialScrollSetRef = useRef(false);
  const [isMobileCarousel, setIsMobileCarousel] = useState(getIsMobileViewport);
  const [cardMotion, setCardMotion] = useState(() =>
    carouselCards.map((_, index) =>
      index === carouselMiddleCopy * aboutCards.length + 1 ? centerCardMotion : sideCardMotion,
    ),
  );
  const [visualArchiveFailed, setVisualArchiveFailed] = useState(false);
  const showVisualArchiveVideo =
    !visualArchiveFailed && isVideoMediaUrl(visualArchiveVideo);
  const activeCardIndex = useMemo(
    () =>
      cardMotion.reduce(
        (bestIndex, motion, index) =>
          motion.progress > (cardMotion[bestIndex]?.progress ?? -1) ? index : bestIndex,
        carouselMiddleCopy * aboutCards.length + 1,
      ),
    [cardMotion],
  );
  const activeCard =
    carouselCards[activeCardIndex] ?? carouselCards[carouselMiddleCopy * aboutCards.length + 1];
  const activeImageNumber = (activeCard.cardIndex + 1).toString().padStart(2, "0");

  const getLoopWidth = useCallback(() => {
    const firstCard = cardRefs.current[0];
    const secondSetFirstCard = cardRefs.current[aboutCards.length];

    if (!firstCard || !secondSetFirstCard) {
      return 0;
    }

    return secondSetFirstCard.offsetLeft - firstCard.offsetLeft;
  }, []);

  const keepScrollInInfiniteMiddle = useCallback((scroller: HTMLDivElement) => {
    const loopWidth = getLoopWidth();

    if (loopWidth <= 0) {
      return;
    }

    const lowerBoundary = loopWidth * 2;
    const upperBoundary = loopWidth * (carouselCopyCount - 3);
    const loopShift = loopWidth * (carouselMiddleCopy - 1);

    if (scroller.scrollLeft < lowerBoundary) {
      scroller.scrollLeft += loopShift;
    } else if (scroller.scrollLeft > upperBoundary) {
      scroller.scrollLeft -= loopShift;
    }
  }, [getLoopWidth]);

  const updateCardMotion = useCallback(() => {
    const scroller = scrollRef.current;

    if (!scroller) {
      return;
    }

    keepScrollInInfiniteMiddle(scroller);

    const scrollerRect = scroller.getBoundingClientRect();
    const scrollerCenter = scrollerRect.left + scrollerRect.width / 2;
    const distanceBase = scrollerRect.width * (isMobileCarousel ? 0.5 : 0.46);
    const activeScale = isMobileCarousel ? 1.06 : 1.08;
    const sideOpacity = isMobileCarousel ? 0.42 : 0.55;
    const tilt = isMobileCarousel ? 13 : 9;

    setCardMotion(
      carouselCards.map((_, index) => {
        const card = cardRefs.current[index];

        if (!card) {
          return sideCardMotion;
        }

        const rect = card.getBoundingClientRect();
        const cardCenter = rect.left + rect.width / 2;
        const distance = Math.max(
          -1.45,
          Math.min(1.45, (cardCenter - scrollerCenter) / distanceBase),
        );
        const progress = Math.max(0, Math.min(1, 1 - Math.abs(distance)));
        const eased = progress * progress * (3 - 2 * progress);

        return {
          progress,
          distance,
          scale: 1 + eased * (activeScale - 1),
          opacity: sideOpacity + eased * (1 - sideOpacity),
          rotate: -distance * tilt,
          y: 0,
        };
      }),
    );
  }, [isMobileCarousel, keepScrollInInfiniteMiddle]);

  const scheduleCardMotionUpdate = useCallback(() => {
    if (frameRef.current !== null) {
      return;
    }

    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = null;
      updateCardMotion();
    });
  }, [updateCardMotion]);

  const pauseAutoScroll = useCallback(() => {
    autoPausedUntilRef.current = performance.now() + carouselManualPauseMs;
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 639px)");

    function syncMobileState() {
      setIsMobileCarousel(query.matches);
      scheduleCardMotionUpdate();
    }

    syncMobileState();
    query.addEventListener("change", syncMobileState);

    return () => query.removeEventListener("change", syncMobileState);
  }, [scheduleCardMotionUpdate]);

  useEffect(() => {
    const scroller = scrollRef.current;

    if (!scroller) {
      return undefined;
    }

    if (!initialScrollSetRef.current) {
      const initialCard = cardRefs.current[carouselMiddleCopy * aboutCards.length + 1];

      if (initialCard) {
        scroller.scrollLeft =
          initialCard.offsetLeft + initialCard.offsetWidth / 2 - scroller.clientWidth / 2;
        initialScrollSetRef.current = true;
      }
    }

    const resizeObserver = new ResizeObserver(scheduleCardMotionUpdate);

    resizeObserver.observe(scroller);
    cardRefs.current.forEach((card) => {
      if (card) {
        resizeObserver.observe(card);
      }
    });

    scheduleCardMotionUpdate();
    window.addEventListener("resize", scheduleCardMotionUpdate);

    function autoScroll(timestamp: number) {
      const activeScroller = scrollRef.current;

      if (!activeScroller) {
        return;
      }

      const previousTick = lastAutoTickRef.current ?? timestamp;
      const elapsed = Math.min(48, timestamp - previousTick);

      lastAutoTickRef.current = timestamp;

      if (timestamp >= autoPausedUntilRef.current && !document.hidden) {
        activeScroller.scrollLeft += elapsed * carouselAutoScrollPixelsPerMs;
        keepScrollInInfiniteMiddle(activeScroller);
      }

      updateCardMotion();
      autoFrameRef.current = window.requestAnimationFrame(autoScroll);
    }

    autoFrameRef.current = window.requestAnimationFrame(autoScroll);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", scheduleCardMotionUpdate);

      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }

      if (autoFrameRef.current !== null) {
        window.cancelAnimationFrame(autoFrameRef.current);
        autoFrameRef.current = null;
      }

      lastAutoTickRef.current = null;
    };
  }, [keepScrollInInfiniteMiddle, scheduleCardMotionUpdate, updateCardMotion]);

  return (
    <motion.section
      className="relative overflow-hidden bg-[var(--color-base)] px-5 py-16 text-[var(--color-text)] sm:px-8 sm:py-20 lg:px-12 lg:py-24"
      initial={{ opacity: 0, y: 44 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      viewport={{ amount: 0.22, once: true }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,var(--color-elevated),var(--color-low))]"
      />
      <div aria-hidden="true" className="editorial-film-grain absolute inset-0 opacity-24" />
      <div className="absolute inset-x-0 top-0 h-px bg-[var(--color-text)]/16" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-[var(--color-text)]/16" />

      <div className="relative z-10 mx-auto mb-7 grid max-w-[1500px] gap-6 border-b border-[var(--color-text)]/14 pb-6 md:grid-cols-[minmax(0,0.95fr)_minmax(260px,420px)] md:items-end lg:gap-8">
        <div>
          <div className="flex items-center gap-3 text-[10px] font-bold uppercase leading-none text-[#8f2b35] sm:text-[11px]">
            <span>Visual Archive</span>
            <span className="h-px flex-1 bg-[var(--color-text)]/20" />
          </div>
          <h2 className="mt-4 font-headline text-[38px] font-bold leading-[0.9] text-[var(--color-heading)] sm:text-[48px] md:text-[56px]">
            Me in Three Lenses
          </h2>
          <p className="mt-4 max-w-[40rem] text-base font-light leading-7 text-[var(--color-text)]/68 sm:text-lg sm:leading-8">
            The same story can be told an infinite amount of ways – it&apos;s all about the perspective that you look at it through. My journalism instructor taught me this lesson five years ago and despite the fact I no longer write stories, it&apos;s never left me. To fully understand the why and what behind a person, event, or place, you need to look at it through different lenses. 
            <br />
            <br />
            This is the way I see myself.
          </p>
        </div>
        <div className="editorial-proof-frame relative overflow-hidden p-2 md:justify-self-end md:w-full md:max-w-[420px]">
          <div className="relative aspect-square overflow-hidden border border-[var(--color-text)]/20 bg-[var(--color-elevated)]">
            {showVisualArchiveVideo ? (
              <video
                aria-label="Looping visual archive preview"
                autoPlay
                className="h-full w-full object-cover brightness-[0.82] contrast-[1.12] grayscale saturate-[0.62]"
                loop
                muted
                onError={() => setVisualArchiveFailed(true)}
                playsInline
                preload="metadata"
                src={visualArchiveVideo}
              />
            ) : (
              <PlaceholderMediaImage
                alt="Visual archive preview"
                className="h-full w-full object-cover brightness-[0.82] contrast-[1.12] grayscale saturate-[0.62]"
              />
            )}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_22%,rgba(143,43,53,0.16),transparent_34%),linear-gradient(180deg,rgba(var(--color-deep-rgb),0)_52%,rgba(var(--color-deep-rgb),0.62))]"
            />
            <span aria-hidden="true" className="archive-scanlines pointer-events-none absolute inset-0 opacity-[0.22]" />
            <div className="pointer-events-none absolute inset-x-3 top-3 flex items-center justify-between border-b border-[var(--color-text)]/18 pb-2 text-[9px] font-bold uppercase leading-none text-[var(--color-text)]/72">
              <span>Motion Plate</span>
              <span>01 / {aboutCards.length.toString().padStart(2, "0")}</span>
            </div>
            <div className="pointer-events-none absolute bottom-3 left-3 right-3 flex items-end gap-3 text-[9px] font-bold uppercase leading-none text-[var(--color-text)]/70">
              <span>Auto Loop</span>
              <span className="mb-0.5 h-px flex-1 bg-[var(--color-text)]/24" />
              <span>Color Proof</span>
            </div>
          </div>
        </div>
      </div>
      <div
        aria-label="Scroll horizontally through about cards"
        className="relative z-10 -mx-5 overflow-x-auto overflow-y-visible overscroll-x-contain px-[8vw] py-7 [perspective:1400px] [scrollbar-width:none] sm:-mx-8 sm:px-[calc(50vw-min(31vw,390px))] sm:py-9 lg:-mx-12 lg:px-[calc(50vw-min(29vw,420px))] [&::-webkit-scrollbar]:hidden"
        onPointerDown={pauseAutoScroll}
        onScroll={scheduleCardMotionUpdate}
        onTouchStart={pauseAutoScroll}
        onWheel={pauseAutoScroll}
        ref={scrollRef}
        role="region"
      >
        <div className="flex w-max items-center gap-0">
          {carouselCards.map((card, index) => {
            const motionState = cardMotion[index] ?? sideCardMotion;
            const isCenterish = motionState.progress > 0.58;
            const activeEmphasis = Math.max(0, Math.min(1, (motionState.progress - 0.42) / 0.58));
            const inactiveEmphasis = 1 - activeEmphasis;

            return (
              <article
                className="relative -ml-[30vw] h-[340px] w-[82vw] max-w-[480px] shrink-0 overflow-visible bg-transparent text-left first:ml-0 will-change-[transform,opacity] sm:-ml-[9vw] sm:h-[450px] sm:w-[min(58vw,640px)] sm:max-w-none md:h-[520px] lg:-ml-[6vw] lg:w-[min(50vw,700px)]"
                data-carousel-card={isCenterish ? "center" : "side"}
                key={card.renderKey}
                ref={(node) => {
                  cardRefs.current[index] = node;
                }}
                style={{
                  opacity: motionState.opacity,
                  transform: `translateY(${motionState.y}px) scale(${motionState.scale}) rotateY(${motionState.rotate}deg)`,
                  transformOrigin: "center bottom",
                  zIndex: Math.round(motionState.progress * 10),
                }}
              >
                <div
                  className="absolute bottom-0 left-1/2 h-[91%] w-[66%] -translate-x-1/2 overflow-visible border transition-[border-color,box-shadow] duration-150 ease-out sm:h-[93%] sm:w-[60%]"
                  data-carousel-frame
                  style={{
                    borderColor: `rgba(242, 229, 198, ${0.18 + activeEmphasis * 0.16})`,
                  }}
                >
                  <div
                    aria-hidden="true"
                    className="absolute bottom-[9%] left-[12%] right-[7%] h-[58%] sm:h-[62%]"
                    style={{
                      backgroundColor: card.backing,
                      opacity: activeEmphasis,
                    }}
                  />
                  <div className="editorial-proof-frame relative h-full overflow-hidden p-2">
                    <div className="relative h-full overflow-hidden border border-black/30 bg-[#d7d3c7]">
                      <div
                        aria-hidden="true"
                        className="absolute inset-0"
                        style={{
                          backgroundColor: card.backing,
                          opacity: activeEmphasis,
                        }}
                      />
                      <img
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-x-0 bottom-0 z-10 h-[112%] w-full max-w-none object-contain object-bottom transition-[filter] duration-150 ease-out sm:h-[116%]"
                        data-carousel-image
                        decoding="async"
                        loading="lazy"
                        onError={handleImageFallback}
                        src={card.image}
                        style={{
                          filter: `grayscale(${inactiveEmphasis}) brightness(${
                            0.72 + activeEmphasis * 0.34
                          }) contrast(${1.08 + activeEmphasis * 0.04}) saturate(${
                            0.18 + activeEmphasis * 0.94
                          })`,
                        }}
                      />
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 z-20 bg-[var(--color-deep)] transition-opacity duration-150 ease-out"
                        style={{ opacity: inactiveEmphasis * 0.32 }}
                      />
                      <span aria-hidden="true" className="archive-scanlines absolute inset-0 z-30 opacity-30" />
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
      <div className="relative z-10 mx-auto mt-5 grid max-w-[1200px] gap-4 border-t border-[var(--color-text)]/14 pt-5 md:grid-cols-[minmax(140px,0.3fr)_minmax(0,1fr)_minmax(140px,0.3fr)] md:items-center">
        <div className="flex items-center gap-3 text-[10px] font-bold uppercase leading-none text-[var(--color-text)]/52 md:grid md:justify-items-center md:gap-2 md:text-center">
          <span className="text-[#8f2b35]">Active Plate</span>
          <span>
            {activeImageNumber} / {aboutCards.length.toString().padStart(2, "0")}
          </span>
        </div>
        <div aria-live="polite" className="min-h-[112px] md:min-h-[104px]">
          <h3 className="font-headline text-[42px] font-bold uppercase leading-[0.9] text-[var(--color-text)] sm:text-[58px]">
            {activeCard.title}
          </h3>
          <p className="mt-3 max-w-2xl text-sm font-light leading-6 text-[var(--color-text)]/66 sm:text-base sm:leading-7">
            {activeCard.text}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-px border border-[var(--color-text)]/14 bg-[var(--color-text)]/14 text-[9px] font-bold uppercase leading-none text-[var(--color-text)]/58 md:grid-cols-1">
          {[activeCard.category, activeCard.focus, activeCard.location].map((item) => (
            <span className="bg-[var(--color-card)] px-3 py-2.5" key={item}>
              {item}
            </span>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function WonderCaptcha() {
  const [tiles, setTiles] = useState(captchaTiles);
  const [selected, setSelected] = useState<string[]>([]);
  const [flashing, setFlashing] = useState(false);
  const [showKoda, setShowKoda] = useState(false);
  const flashTimeoutRef = useRef<number | null>(null);
  const kodaTimeoutRef = useRef<number | null>(null);
  const selectedSet = useMemo(() => new Set(selected), [selected]);

  useEffect(() => {
    return () => {
      if (flashTimeoutRef.current !== null) {
        window.clearTimeout(flashTimeoutRef.current);
      }

      if (kodaTimeoutRef.current !== null) {
        window.clearTimeout(kodaTimeoutRef.current);
      }
    };
  }, []);

  function shuffle() {
    setTiles((current) => {
      const next = [...current];

      for (let index = next.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(Math.random() * (index + 1));
        [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
      }

      return next;
    });
    setSelected([]);
  }

  function verify() {
    if (flashTimeoutRef.current !== null) {
      window.clearTimeout(flashTimeoutRef.current);
    }

    if (kodaTimeoutRef.current !== null) {
      window.clearTimeout(kodaTimeoutRef.current);
    }

    setFlashing(true);
    setShowKoda(true);

    flashTimeoutRef.current = window.setTimeout(() => {
      setFlashing(false);
      flashTimeoutRef.current = null;
    }, 1000);
    kodaTimeoutRef.current = window.setTimeout(() => {
      setShowKoda(false);
      kodaTimeoutRef.current = null;
    }, 4000);
  }

  function dismissKoda() {
    if (kodaTimeoutRef.current !== null) {
      window.clearTimeout(kodaTimeoutRef.current);
      kodaTimeoutRef.current = null;
    }

    setShowKoda(false);
  }

  return (
    <>
      <motion.section
        className="relative overflow-hidden bg-[var(--color-section)] px-5 py-20 text-[var(--color-text)] sm:px-8 lg:px-12"
        initial={{ opacity: 0, y: 44 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        viewport={{ amount: 0.2, once: true }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--color-section-top),var(--color-section-bottom))]" />
        <div className="absolute left-[8%] right-[8%] top-16 h-px bg-[var(--color-text)]/16" />
        <div className="absolute left-[8%] right-[8%] bottom-16 h-px bg-[var(--color-text)]/12" />

        <div
          className={`relative mx-auto max-w-[920px] overflow-hidden rounded-[34px] border border-white/52 bg-[var(--color-paper)]/94 text-[var(--color-ink)] shadow-[0_22px_58px_rgba(0,0,0,0.22)] backdrop-blur-xl ${
            flashing ? "captcha-flash" : ""
          }`}
        >
        <div className="px-4 py-4 sm:px-6 sm:py-5">
          <div className="flex items-center gap-3 border-b border-[var(--color-ink)]/12 pb-3 text-[9px] font-bold uppercase leading-none text-[var(--color-ink)]/50 sm:text-[10px]">
            <span>Human Check</span>
            <span className="h-px flex-1 bg-[var(--color-ink)]/10" />
            <span>09 Images</span>
            <span>{selected.length.toString().padStart(2, "0")} Selected</span>
          </div>
          <div className="pt-5">
            <h2 className="max-w-2xl font-display text-[30px] font-medium leading-[1.02] text-[var(--color-ink)] sm:text-[42px]">
              Select all images that make you wonder.
            </h2>
            <p className="mt-3 text-xs font-medium leading-5 text-[var(--color-ink)]/58 sm:text-sm">
              Click verify once your curiosity is satisfied.
            </p>
            <p className="mt-5 max-w-3xl border-l border-[#8f2b35]/38 pl-4 text-sm font-light leading-6 text-[var(--color-ink)]/68 sm:text-base sm:leading-7">
              {myInterestsText}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-1 border-y border-[var(--color-ink)]/10 bg-[var(--color-ink)]/8 p-1.5">
          {tiles.map((tile, index) => {
            const active = selectedSet.has(tile.id);

            return (
              <button
                aria-pressed={active}
                className={`group relative aspect-square overflow-hidden rounded-[18px] bg-[var(--color-base)] outline-none transition focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-[#8f2b35] ${
                  active
                    ? "shadow-[inset_0_0_0_2px_#8f2b35,inset_0_0_0_6px_rgba(248,244,235,0.9)]"
                    : "hover:shadow-[inset_0_0_0_1px_rgba(23,19,17,0.28)]"
                }`}
                key={tile.id}
                onClick={() => {
                  setSelected((current) =>
                    current.includes(tile.id)
                      ? current.filter((id) => id !== tile.id)
                      : [...current, tile.id],
                  );
                }}
                type="button"
              >
                <img
                  alt=""
                  aria-hidden="true"
                  className={`h-full w-full object-cover transition duration-300 ${
                    active
                      ? "scale-[1.02] opacity-[0.76] saturate-[0.78]"
                      : "opacity-95 group-hover:scale-[1.02] group-hover:opacity-[0.72]"
                  }`}
                  decoding="async"
                  loading="lazy"
                  onError={handleImageFallback}
                  src={tile.image}
                  style={{ objectPosition: captchaPositions[index % captchaPositions.length] }}
                />
                <span
                  className={`absolute inset-0 transition ${
                    active ? "bg-[#8f2b35]/10" : "bg-black/0 group-hover:bg-black/22"
                  }`}
                />
                <span
                  className={`absolute inset-x-2 bottom-2 border-t border-[var(--color-text)]/40 pt-1.5 text-left text-[9px] font-bold uppercase leading-tight text-[var(--color-text)] transition duration-300 ${
                    active ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  }`}
                >
                  {tile.caption}
                </span>
                <span
                  className={`absolute left-2 top-2 inline-flex h-5 w-5 items-center justify-center border text-[var(--color-text)] transition ${
                    active
                      ? "border-[#8f2b35] bg-[#8f2b35] text-[var(--color-text)]"
                      : "border-white/60 bg-black/18"
                  }`}
                >
                  {active ? <X aria-hidden="true" size={13} strokeWidth={2.6} /> : null}
                </span>
                <span className="absolute right-2 top-2 text-[9px] font-bold uppercase leading-none text-[var(--color-text)]/50">
                  {(index + 1).toString().padStart(2, "0")}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div className="hidden items-center gap-3 text-[9px] font-bold uppercase leading-none text-[var(--color-ink)]/42 sm:flex">
            <span>Choose by feel</span>
            <span className="h-px w-16 bg-[var(--color-ink)]/12" />
            <span>There is no answer key</span>
          </div>
          <button
            aria-label="Undo and shuffle images"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-ink)]/12 bg-white/64 text-[var(--color-ink)]/62 transition hover:border-[#8f2b35]/40 hover:text-[#8f2b35]"
            onClick={shuffle}
            type="button"
          >
            <RotateCcw aria-hidden="true" size={17} strokeWidth={1.9} />
          </button>
          <button
            className="inline-flex h-9 items-center gap-2 rounded-full border border-[var(--color-ink)]/14 bg-[var(--color-ink)] px-4 text-[9px] font-bold uppercase leading-none text-[var(--color-paper)] transition hover:bg-[#5E1C23]"
            onClick={verify}
            type="button"
          >
            <ShieldCheck aria-hidden="true" size={15} strokeWidth={1.9} />
            Verify
          </button>
        </div>
        </div>
      </motion.section>

      {showKoda ? (
        <motion.div
          animate={{ opacity: 1 }}
          aria-label="Koda photo confirmation"
          aria-live="polite"
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/58 p-5 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          role="status"
          transition={{ duration: 0.22 }}
        >
          <motion.figure
            animate={{ scale: 1, y: 0 }}
            className="relative w-full max-w-[430px] overflow-hidden rounded-[28px] border border-white/45 bg-[var(--color-paper)] p-2.5 text-[var(--color-ink)] shadow-[0_28px_90px_rgba(0,0,0,0.55)]"
            initial={{ scale: 0.92, y: 24 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            <button
              aria-label="Close Koda photo"
              className="absolute right-5 top-5 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/70 bg-[var(--color-ink)]/76 text-[var(--color-paper)] backdrop-blur-sm transition hover:bg-[#8f2b35] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              onClick={dismissKoda}
              type="button"
            >
              <X aria-hidden="true" size={16} strokeWidth={2.2} />
            </button>
            <img
              alt="Koda, Kai's dog"
              className="max-h-[68vh] w-full rounded-[20px] object-cover"
              decoding="async"
              onError={handleImageFallback}
              src="https://qcxeyxinrhwjmmwhguqg.supabase.co/storage/v1/object/public/portfoliomedia/photos/koda.JPG"
            />
            <figcaption className="px-3 py-4 text-center font-body text-lg font-medium leading-snug sm:text-xl">
              {"My cute dog Koda <3"}
            </figcaption>
          </motion.figure>
        </motion.div>
      ) : null}
    </>
  );
}
