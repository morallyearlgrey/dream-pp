"use client";

/* eslint-disable @next/next/no-img-element */
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, RotateCcw, ShieldCheck, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { aboutCards, captchaTiles } from "@/lib/portfolio-data";

const titles = [
  "Software Engineer",
  "Embedded Software Developer",
  "Designer",
  "Reader",
  "Artist",
];

const heroPhoto = "/references/goal.png";
const revealSize = { width: 46, height: 31 };
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

export function AboutPage() {
  return (
    <main className="-mt-[72px] overflow-hidden bg-[#f7f7f7] text-[#111]">
      <HeroSection />
      <WhoAmI />
      <ImageCarousel />
      <WonderCaptcha />
    </main>
  );
}

function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const dragOffsetRef = useRef({ x: revealSize.width / 2, y: revealSize.height / 2 });
  const [titleIndex, setTitleIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [box, setBox] = useState({
    x: 44,
    y: 40,
    width: revealSize.width,
    height: revealSize.height,
  });

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTitleIndex((current) => (current + 1) % titles.length);
    }, 1900);

    return () => window.clearInterval(timer);
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

  function getTitleBarrier() {
    const heroRect = heroRef.current?.getBoundingClientRect();
    const copyRect = copyRef.current?.getBoundingClientRect();

    if (!heroRect || !copyRect) {
      return null;
    }

    const padding = Math.min(heroRect.width, heroRect.height) * 0.035;
    const x = ((copyRect.left - heroRect.left - padding) / heroRect.width) * 100;
    const y = ((copyRect.top - heroRect.top - padding) / heroRect.height) * 100;
    const width = ((copyRect.width + padding * 2) / heroRect.width) * 100;
    const height = ((copyRect.height + padding * 2) / heroRect.height) * 100;

    return {
      x: Math.max(0, x),
      y: Math.max(0, y),
      width: Math.min(100, width),
      height: Math.min(100, height),
    };
  }

  function overlaps(
    x: number,
    y: number,
    width: number,
    height: number,
    barrier: { x: number; y: number; width: number; height: number },
  ) {
    return (
      x < barrier.x + barrier.width &&
      x + width > barrier.x &&
      y < barrier.y + barrier.height &&
      y + height > barrier.y
    );
  }

  function constrainRevealBox(x: number, y: number, width: number, height: number) {
    const clamped = {
      x: Math.min(100 - width, Math.max(0, x)),
      y: Math.min(100 - height, Math.max(0, y)),
    };
    const barrier = getTitleBarrier();

    if (!barrier || !overlaps(clamped.x, clamped.y, width, height, barrier)) {
      return clamped;
    }

    const candidates = [
      { x: clamped.x, y: barrier.y - height },
      { x: clamped.x, y: barrier.y + barrier.height },
      { x: barrier.x - width, y: clamped.y },
      { x: barrier.x + barrier.width, y: clamped.y },
    ]
      .map((candidate) => ({
        x: Math.min(100 - width, Math.max(0, candidate.x)),
        y: Math.min(100 - height, Math.max(0, candidate.y)),
      }))
      .filter((candidate) => !overlaps(candidate.x, candidate.y, width, height, barrier))
      .sort(
        (first, second) =>
          Math.hypot(first.x - x, first.y - y) - Math.hypot(second.x - x, second.y - y),
      );

    return candidates[0] ?? clamped;
  }

  const clipPath = `inset(${box.y}% ${100 - box.x - box.width}% ${
    100 - box.y - box.height
  }% ${box.x}%)`;

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
        className="absolute inset-0 h-full w-full object-cover grayscale"
        src={heroPhoto}
      />
      <img
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
        src={heroPhoto}
        style={{ clipPath }}
      />
      <div
        aria-hidden="true"
        className="about-hero-colorwash absolute inset-0"
        style={{ clipPath }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.82)_0%,rgba(0,0,0,0.2)_32%,rgba(0,0,0,0.08)_64%,rgba(0,0,0,0.58)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#f7f7f7] to-transparent" />

      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="absolute left-4 top-[14%] z-10 flex max-w-[min(82vw,880px)] flex-col gap-4 text-white sm:left-8 lg:left-14"
        initial={{ opacity: 0, y: 18 }}
        ref={copyRef}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <h1 className="font-headline flex flex-col text-[58px] font-bold uppercase leading-[0.78] text-white sm:text-[96px] lg:text-[156px]">
          <span>Kai</span>
          <span>Sprunger</span>
        </h1>
        <div className="font-subheading h-12 overflow-hidden text-[22px] uppercase leading-none text-[#f4d240] sm:h-14 sm:text-[36px] lg:text-[48px]">
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
        className="absolute z-20 cursor-grab border border-white/90 bg-white/5 shadow-[0_0_0_1px_rgba(0,0,0,0.72),0_16px_44px_rgba(0,0,0,0.34)] backdrop-blur-[1px] active:cursor-grabbing"
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
      />
    </section>
  );
}

function WhoAmI() {
  return (
    <motion.section
      className="mx-auto flex w-full max-w-5xl flex-col items-center px-5 py-20 text-center sm:px-8 md:py-24 lg:px-12"
      initial={{ opacity: 0, y: 36 }}
      transition={{ duration: 0.65, ease: "easeOut" }}
      viewport={{ amount: 0.35, once: true }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <h2 className="font-headline text-[54px] font-bold uppercase leading-[0.88] sm:text-[86px] lg:text-[118px]">
        Who Am I
      </h2>
      <p className="mt-9 max-w-3xl text-xl font-light leading-9 text-[#282522] sm:text-2xl sm:leading-10">
        I build thoughtful systems where code, hardware, and design can meet.
        This placeholder text leaves room for the fuller story about process,
        curiosity, and craft. I am happiest when a question turns into something
        people can hold, use, or revisit.
      </p>
    </motion.section>
  );
}

function ImageCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const visibleCards = [
    aboutCards[(activeIndex - 1 + aboutCards.length) % aboutCards.length],
    aboutCards[activeIndex],
    aboutCards[(activeIndex + 1) % aboutCards.length],
  ];

  function go(direction: -1 | 1) {
    setActiveIndex((current) => (current + direction + aboutCards.length) % aboutCards.length);
    setHoveredCard(null);
    setSelectedCard(null);
  }

  return (
    <motion.section
      className="relative overflow-hidden bg-[#121212] px-5 py-20 text-white sm:px-8 lg:px-12"
      initial={{ opacity: 0, y: 44 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      viewport={{ amount: 0.22, once: true }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <div className="halftone absolute inset-0 opacity-25" />
      <div className="relative mx-auto grid max-w-7xl gap-5 md:grid-cols-[0.82fr_1.08fr_0.82fr] md:items-center">
        {visibleCards.map((card, index) => {
          const centered = index === 1;
          const revealed = hoveredCard === card.title || selectedCard === card.title;

          return (
            <div className="flex min-w-0 flex-col items-stretch" key={card.title}>
              <button
                aria-pressed={selectedCard === card.title}
                className={`group relative min-w-0 overflow-hidden border bg-black text-left transition duration-500 ${
                  centered
                    ? "h-[430px] border-[#f4d240] shadow-[0_30px_90px_rgba(244,210,64,0.22)] sm:h-[500px] md:h-[620px]"
                    : "h-[320px] border-white/18 sm:h-[380px] md:h-[460px]"
                }`}
                onBlur={() => setHoveredCard(null)}
                onClick={() =>
                  setSelectedCard((current) => (current === card.title ? null : card.title))
                }
                onFocus={() => setHoveredCard(card.title)}
                onMouseEnter={() => setHoveredCard(card.title)}
                onMouseLeave={() => setHoveredCard(null)}
                type="button"
              >
                <img
                  alt=""
                  aria-hidden="true"
                  className={`h-full w-full object-cover transition duration-500 ${
                    revealed ? "opacity-45" : "opacity-100 group-hover:opacity-45"
                  }`}
                  src={card.image}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/84 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <p
                    className={`font-headline font-bold uppercase leading-none ${
                      centered
                        ? "text-[40px] sm:text-[58px] lg:text-[70px]"
                        : "text-[30px] sm:text-[40px] lg:text-[46px]"
                    }`}
                  >
                    {card.title}
                  </p>
                  <p
                    className={`mt-4 max-w-sm text-base font-light leading-6 text-white transition duration-300 ${
                      revealed ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {card.text}
                  </p>
                </div>
              </button>

              {centered ? (
                <div className="mt-5 flex justify-center gap-4">
                  <button
                    aria-label="Previous carousel image"
                    className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/70 text-white transition hover:border-[#f4d240] hover:text-[#f4d240] sm:h-14 sm:w-14"
                    onClick={() => go(-1)}
                    type="button"
                  >
                    <ChevronLeft aria-hidden="true" size={28} />
                  </button>
                  <button
                    aria-label="Next carousel image"
                    className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/70 text-white transition hover:border-[#f4d240] hover:text-[#f4d240] sm:h-14 sm:w-14"
                    onClick={() => go(1)}
                    type="button"
                  >
                    <ChevronRight aria-hidden="true" size={28} />
                  </button>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </motion.section>
  );
}

function WonderCaptcha() {
  const [tiles, setTiles] = useState(captchaTiles);
  const [selected, setSelected] = useState<string[]>([]);
  const [flashing, setFlashing] = useState(false);
  const selectedSet = useMemo(() => new Set(selected), [selected]);

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
    setFlashing(true);
    window.setTimeout(() => setFlashing(false), 1000);
  }

  return (
    <motion.section
      className="relative overflow-hidden bg-[#0a1220] px-4 py-20 text-white sm:px-8 lg:px-12"
      initial={{ opacity: 0, y: 44 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      viewport={{ amount: 0.2, once: true }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(244,210,64,0.18),transparent_24%),radial-gradient(circle_at_80%_18%,rgba(63,149,223,0.32),transparent_28%),linear-gradient(160deg,#070b12,#17385d_52%,#05070b)]" />
      <div className="halftone absolute inset-0 opacity-60" />

      <div
        className={`relative mx-auto max-w-[720px] border-[8px] border-white bg-white text-[#111] shadow-[0_24px_0_rgba(0,0,0,0.38)] ${
          flashing ? "captcha-flash" : ""
        }`}
      >
        <div className="bg-[#3f95df] px-5 py-5 text-white sm:px-7 sm:py-6">
          <h2 className="max-w-2xl text-3xl font-bold leading-8 sm:text-4xl sm:leading-10">
            Select all the images that make you wonder
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-1 bg-white p-1">
          {tiles.map((tile, index) => {
            const active = selectedSet.has(tile.id);

            return (
              <button
                aria-pressed={active}
                className="group relative aspect-square overflow-hidden bg-[#111] outline-none"
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
                    active ? "opacity-[0.42]" : "opacity-100 group-hover:opacity-[0.42]"
                  }`}
                  src={tile.image}
                  style={{ objectPosition: captchaPositions[index % captchaPositions.length] }}
                />
                <span
                  className={`absolute inset-x-1 bottom-1 bg-black/78 px-2 py-1 text-[11px] font-black leading-tight text-white transition duration-300 ${
                    active ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  }`}
                >
                  {tile.caption}
                </span>
                <span
                  className={`absolute left-2 top-2 inline-flex h-5 w-5 items-center justify-center border-2 border-white bg-black/20 transition ${
                    active ? "bg-[#f4d240] text-black" : ""
                  }`}
                >
                  {active ? <X aria-hidden="true" size={14} strokeWidth={3} /> : null}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between border-t border-[#cfd6de] bg-white px-5 py-4">
          <button
            aria-label="Undo and shuffle images"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#545454] transition hover:bg-[#eef3f8] hover:text-[#111]"
            onClick={shuffle}
            type="button"
          >
            <RotateCcw aria-hidden="true" size={20} />
          </button>
          <button
            className="inline-flex items-center gap-2 rounded-sm bg-[#3f95df] px-5 py-3 text-xs font-black uppercase text-white transition hover:bg-[#111]"
            onClick={verify}
            type="button"
          >
            <ShieldCheck aria-hidden="true" size={16} />
            Verify
          </button>
        </div>
      </div>
    </motion.section>
  );
}
