"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GlobalAudioDock,
  PersistentAudioProvider,
  type AudioTrack,
} from "@/components/audio-player";
import { OpeningProofLoader } from "@/components/opening-proof-loader";
import {
  BadgeCheck,
  BookOpen,
  BriefcaseBusiness,
  FolderKanban,
  Grid2X2,
  Home,
  LayoutDashboard,
  Mail,
} from "lucide-react";
import { portfolioLogoUrl } from "@/lib/site-assets";

const primaryLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/experiences", label: "Experiences", icon: BriefcaseBusiness },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/blog", label: "Blog", icon: BookOpen },
  { href: "/skills", label: "Skills", icon: Grid2X2 },
  { href: "/contact", label: "Contact Me", icon: Mail },
];

const footerLinks = [
  ...primaryLinks,
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

const footerSocialLinks = [
  { href: "#", label: "GitHub" },
  { href: "#", label: "LinkedIn" },
  { href: "/Kai_Sprunger_Resume_2027.pdf", label: "Resume" },
] as const;

export function SiteShell({
  audioTracks,
  children,
}: {
  audioTracks: AudioTrack[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <PersistentAudioProvider tracks={audioTracks}>
      <OpeningProofLoader />
      <div className="min-h-screen">
      <header className="sticky top-5 z-50 mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
        <nav
          aria-label="Primary navigation"
          className="mx-auto flex max-w-[62rem] items-center justify-between gap-0.5 border-y border-[var(--color-text)]/20 bg-[var(--color-deep)]/64 px-1.5 py-1 text-[var(--color-text)] backdrop-blur-md sm:px-2"
        >
          <Link
            aria-label="Kai Sprunger home"
            className="mr-1 inline-flex h-8 w-8 shrink-0 items-center justify-center border border-[var(--color-text)]/22 bg-[var(--color-text)]/8 p-1 transition hover:border-[#8f2b35]/70"
            href="/"
            title="Kai Sprunger"
          >
            <img
              alt=""
              aria-hidden="true"
              className="h-full w-full object-contain"
              src={portfolioLogoUrl}
            />
          </Link>
          {primaryLinks.map((link) => {
            const active =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href));
            const Icon = link.icon;

            return (
              <Link
                aria-label={link.label}
                className={`group relative inline-flex h-8 min-w-8 items-center justify-center gap-1.5 border px-2 text-[8px] font-bold uppercase leading-none transition sm:min-w-0 sm:px-2.5 ${
                  active
                    ? "border-[var(--color-text)]/40 text-[var(--color-text)]"
                    : "border-transparent text-[var(--color-text)]/62 hover:border-[var(--color-text)]/20 hover:text-[var(--color-text)]"
                }`}
                href={link.href}
                key={link.href}
                title={link.label}
              >
                <Icon aria-hidden="true" size={13} strokeWidth={1.65} />
                <span className="hidden sm:inline">{link.label}</span>
                <span
                  aria-hidden="true"
                  className={`absolute -bottom-[3px] left-2 right-2 h-px transition ${
                    active ? "bg-[#8f2b35]" : "bg-transparent group-hover:bg-[var(--color-text)]/28"
                  }`}
                />
              </Link>
            );
          })}
        </nav>
      </header>

      {children}
      <GlobalAudioDock />

      <footer className="relative w-full overflow-hidden bg-[var(--color-deep)] px-5 py-8 text-[var(--color-text)] sm:px-6 lg:px-8">
        <div aria-hidden="true" className="editorial-film-grain absolute inset-0 opacity-[0.12]" />
        <div className="relative mx-auto max-w-7xl border-y border-[var(--color-text)]/16">
          <div className="grid lg:grid-cols-[1.25fr_0.62fr_0.78fr_0.72fr]">
            <div className="border-b border-[var(--color-text)]/16 p-5 sm:p-6 lg:border-b-0 lg:border-r">
              <div className="flex items-center gap-3 text-[9px] font-bold uppercase leading-none text-[#8f2b35]">
                <span>Colophon</span>
                <span className="h-px flex-1 bg-[var(--color-text)]/16" />
                <span>2026</span>
              </div>
              <Link
                className="font-display mt-4 block text-[62px] font-semibold uppercase leading-[0.78] text-[var(--color-text)] sm:text-[88px] lg:text-[112px]"
                href="/"
              >
                Kai Sprunger
              </Link>
              <p className="mt-4 max-w-sm text-xs font-light leading-5 text-[var(--color-text)]/62">
                Selected projects, field notes, image-led experiments, and the
                occasional beautiful detour.
              </p>
            </div>

            <div className="border-b border-[var(--color-text)]/16 p-5 sm:p-6 lg:border-b-0 lg:border-r">
              <p className="border-b border-[var(--color-text)]/16 pb-2 text-[9px] font-bold uppercase leading-none text-[#8f2b35]">
                Index
              </p>
              <div className="mt-4 grid gap-2 text-[10px] font-bold uppercase leading-none text-[var(--color-text)]/62">
                {footerLinks.map((link) => (
                  <Link
                    className="transition hover:text-[#8f2b35]"
                    href={link.href}
                    key={link.href}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="border-b border-[var(--color-text)]/16 p-5 sm:p-6 lg:border-b-0 lg:border-r">
              <p className="border-b border-[var(--color-text)]/16 pb-2 text-[9px] font-bold uppercase leading-none text-[#8f2b35]">
                Contact
              </p>
              <div className="mt-4 space-y-2 text-xs font-light leading-5 text-[var(--color-text)]/64">
                <Link
                  className="block font-bold uppercase transition hover:text-[#8f2b35]"
                  href="/contact"
                >
                  Send A Note
                </Link>
                <p>Open to thoughtful software, embedded, and design work.</p>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <p className="border-b border-[var(--color-text)]/16 pb-2 text-[9px] font-bold uppercase leading-none text-[#8f2b35]">
                Social
              </p>
              <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-[10px] font-bold uppercase leading-none text-[var(--color-text)]/62">
                {footerSocialLinks.map((item) => (
                  <a
                    className="transition hover:text-[#8f2b35]"
                    href={item.href}
                    key={item.label}
                    rel={item.label === "Resume" ? "noreferrer" : undefined}
                    target={item.label === "Resume" ? "_blank" : undefined}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
              <div className="mt-5 inline-flex items-center gap-2 border-t border-[var(--color-text)]/16 pt-3 text-[9px] font-bold uppercase leading-none text-[var(--color-text)]/50">
                <BadgeCheck aria-hidden="true" size={13} strokeWidth={1.8} />
                Selected Collaborations
              </div>
            </div>
          </div>

          <div className="grid gap-px border-t border-[var(--color-text)]/18 bg-[var(--color-text)]/18 text-[9px] font-bold uppercase leading-none text-[#111] sm:grid-cols-3">
            <span className="bg-[var(--color-text)] px-4 py-2.5">Issue 01 / July 2026</span>
            <span className="bg-[var(--color-text)] px-4 py-2.5">BUILT WITH SWEAT, TEARS, AND LOVE</span>
            <span className="bg-[var(--color-text)] px-4 py-2.5 sm:text-right">
              End Matter / Personal Edition
            </span>
          </div>
        </div>
      </footer>
      </div>
    </PersistentAudioProvider>
  );
}
