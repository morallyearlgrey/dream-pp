"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BadgeCheck,
  BookOpen,
  BriefcaseBusiness,
  FolderKanban,
  Grid2X2,
  Home,
  LayoutDashboard,
  Sparkles,
} from "lucide-react";

const links = [
  { href: "/", label: "Home", icon: Home },
  { href: "/experiences", label: "Experiences", icon: BriefcaseBusiness },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/blog", label: "Blog", icon: BookOpen },
  { href: "/skills", label: "Skills", icon: Grid2X2 },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen">
      <header className="sticky top-3 z-50 mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8">
        <nav
          aria-label="Primary navigation"
          className="mx-auto flex max-w-3xl items-center justify-between gap-1 rounded-full bg-black px-3 py-3 shadow-2xl shadow-[#5E1C23]/20 ring-1 ring-white/10"
        >
          {links.map((link) => {
            const active =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href));
            const Icon = link.icon;

            return (
              <Link
                aria-label={link.label}
                className={`group inline-flex h-12 min-w-12 items-center justify-center gap-2 rounded-full px-3 text-sm font-semibold transition ${
                  active
                    ? "bg-white/15 text-white"
                    : "text-white/75 hover:bg-white/10 hover:text-white"
                }`}
                href={link.href}
                key={link.href}
                title={link.label}
              >
                <Icon aria-hidden="true" size={22} strokeWidth={2.2} />
                <span
                  className={`hidden sm:inline ${active ? "max-lg:inline" : "lg:hidden"}`}
                >
                  {link.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </header>

      {children}

      <footer className="mx-auto w-full max-w-7xl px-4 pb-8 pt-14 sm:px-6 lg:px-8">
        <div className="border-[12px] border-[#A1947F] bg-[#111] p-2">
          <div className="grid gap-8 rounded-md border border-white/10 px-6 py-8 text-[#F2E5C6] md:grid-cols-[1.4fr_0.7fr_1fr]">
            <div>
              <Link
                className="font-display inline-flex items-center gap-2 text-2xl font-semibold"
                href="/"
              >
                <Sparkles aria-hidden="true" size={20} />
                Portfolio
              </Link>
              <p className="mt-4 max-w-sm text-sm leading-6 text-[#F2E5C6]/70">
                Software, embedded systems, design experiments, notes, and the
                occasional beautiful detour.
              </p>
              <div className="mt-5 flex gap-2">
                {["GH", "IN", "DR", "CV"].map((item) => (
                  <a
                    aria-label={item}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#F2E5C6] text-xs font-bold text-[#111] transition hover:bg-[#849AAD]"
                    href="#"
                    key={item}
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold">Extra links</p>
              <div className="mt-4 grid gap-2 text-sm text-[#F2E5C6]/70">
                {links.slice(0, 5).map((link) => (
                  <Link className="transition hover:text-white" href={link.href} key={link.href}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold">Contact</p>
              <div className="mt-4 space-y-2 text-sm text-[#F2E5C6]/70">
                <p>portfolio@example.com</p>
                <p>Open to thoughtful software, embedded, and design work.</p>
              </div>
              <div className="mt-5 inline-flex items-center gap-2 rounded-md bg-[#F2E5C6]/10 px-3 py-2 text-xs font-semibold">
                <BadgeCheck aria-hidden="true" size={16} />
                Available for selected collaborations
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
