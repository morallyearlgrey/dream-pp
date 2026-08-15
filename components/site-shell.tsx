"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PersistentAudioProvider, type AudioTrack } from "@/components/audio-player";
import {
  BadgeCheck,
  BookOpen,
  BriefcaseBusiness,
  FolderKanban,
  Grid2X2,
  Home,
  LayoutDashboard,
} from "lucide-react";

const links = [
  { href: "/", label: "Home", icon: Home },
  { href: "/experiences", label: "Experiences", icon: BriefcaseBusiness },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/blog", label: "Blog", icon: BookOpen },
  { href: "/skills", label: "Skills", icon: Grid2X2 },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

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
      <div className="min-h-screen">
      <header className="sticky top-5 z-50 mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
        <nav
          aria-label="Primary navigation"
          className="mx-auto flex max-w-[48rem] items-center justify-between gap-0.5 border border-[#f2e5c6]/28 bg-[#080807]/72 px-1.5 py-1 text-[#f2e5c6] shadow-[0_8px_22px_rgba(0,0,0,0.2)] backdrop-blur-md sm:px-2"
        >
          {links.map((link) => {
            const active =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href));
            const Icon = link.icon;

            return (
              <Link
                aria-label={link.label}
                className={`group relative inline-flex h-8 min-w-8 items-center justify-center gap-1.5 border px-2 text-[8px] font-bold uppercase leading-none transition sm:min-w-0 sm:px-2.5 ${
                  active
                    ? "border-[#f2e5c6]/40 text-[#f2e5c6]"
                    : "border-transparent text-[#f2e5c6]/62 hover:border-[#f2e5c6]/20 hover:text-[#f2e5c6]"
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
                    active ? "bg-[#8f2b35]" : "bg-transparent group-hover:bg-[#f2e5c6]/28"
                  }`}
                />
              </Link>
            );
          })}
        </nav>
      </header>

      {children}

      <footer className="relative w-full overflow-hidden bg-[#080807] px-5 py-8 text-[#f2e5c6] sm:px-6 lg:px-8">
        <div aria-hidden="true" className="archive-scanlines absolute inset-0 opacity-[0.18]" />
        <div className="relative mx-auto max-w-7xl border border-[#f2e5c6]/18">
          <div className="grid lg:grid-cols-[1.25fr_0.62fr_0.78fr_0.72fr]">
            <div className="border-b border-[#f2e5c6]/16 p-5 sm:p-6 lg:border-b-0 lg:border-r">
              <div className="flex items-center gap-3 text-[9px] font-bold uppercase leading-none text-[#8f2b35]">
                <span>Colophon</span>
                <span className="h-px flex-1 bg-[#f2e5c6]/16" />
                <span>2026</span>
              </div>
              <Link
                className="font-display mt-4 block text-[62px] font-semibold uppercase leading-[0.78] text-[#f2e5c6] sm:text-[88px] lg:text-[112px]"
                href="/"
              >
                Kai
              </Link>
              <p className="mt-4 max-w-sm text-xs font-light leading-5 text-[#f2e5c6]/62">
                Software, embedded systems, design experiments, notes, and the
                occasional beautiful detour.
              </p>
            </div>

            <div className="border-b border-[#f2e5c6]/16 p-5 sm:p-6 lg:border-b-0 lg:border-r">
              <p className="border-b border-[#f2e5c6]/16 pb-2 text-[9px] font-bold uppercase leading-none text-[#8f2b35]">
                Index
              </p>
              <div className="mt-4 grid gap-2 text-[10px] font-bold uppercase leading-none text-[#f2e5c6]/62">
                {links.map((link) => (
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

            <div className="border-b border-[#f2e5c6]/16 p-5 sm:p-6 lg:border-b-0 lg:border-r">
              <p className="border-b border-[#f2e5c6]/16 pb-2 text-[9px] font-bold uppercase leading-none text-[#8f2b35]">
                Contact
              </p>
              <div className="mt-4 space-y-2 text-xs font-light leading-5 text-[#f2e5c6]/64">
                <a
                  className="block font-bold uppercase transition hover:text-[#8f2b35]"
                  href="mailto:portfolio@example.com"
                >
                  portfolio@example.com
                </a>
                <p>Open to thoughtful software, embedded, and design work.</p>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <p className="border-b border-[#f2e5c6]/16 pb-2 text-[9px] font-bold uppercase leading-none text-[#8f2b35]">
                Social
              </p>
              <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-[10px] font-bold uppercase leading-none text-[#f2e5c6]/62">
                {["GitHub", "LinkedIn", "Dribbble", "CV"].map((item) => (
                  <a className="transition hover:text-[#8f2b35]" href="#" key={item}>
                    {item}
                  </a>
                ))}
              </div>
              <div className="mt-5 inline-flex items-center gap-2 border-t border-[#f2e5c6]/16 pt-3 text-[9px] font-bold uppercase leading-none text-[#f2e5c6]/50">
                <BadgeCheck aria-hidden="true" size={13} strokeWidth={1.8} />
                Selected Collaborations
              </div>
            </div>
          </div>

          <div className="grid gap-px border-t border-[#f2e5c6]/18 bg-[#f2e5c6]/18 text-[9px] font-bold uppercase leading-none text-[#111] sm:grid-cols-3">
            <span className="bg-[#f2e5c6] px-4 py-2.5">Issue 01 / July 2026</span>
            <span className="bg-[#f2e5c6] px-4 py-2.5">Built in Next.js</span>
            <span className="bg-[#f2e5c6] px-4 py-2.5 sm:text-right">
              End Matter / Personal Edition
            </span>
          </div>
        </div>
      </footer>
      </div>
    </PersistentAudioProvider>
  );
}
