"use client";

import { usePathname } from "next/navigation";
import {
  BookOpen,
  Briefcase,
  GraduationCap,
  Home,
  Library,
  Mail,
  Moon,
  Quote,
  Sun,
} from "lucide-react";
import { NAV } from "@/lib/site";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { BackControl } from "@/components/layout/BackControl";
import { useTheme } from "@/components/providers/ThemeProvider";
import { FloatingDock } from "@/components/ui/floating-dock";

const iconClass = "h-full w-full text-[var(--text-muted)]";

const DOCK_ICONS: Record<string, React.ReactNode> = {
  "/": <Home className={iconClass} />,
  "/about": <BookOpen className={iconClass} />,
  "/services": <Briefcase className={iconClass} />,
  "/academy": <GraduationCap className={iconClass} />,
  "/stories": <Quote className={iconClass} />,
  "/resources": <Library className={iconClass} />,
  "/contact": <Mail className={iconClass} />,
};

function ThemeButton() {
  const { theme, toggle } = useTheme();
  const dark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to paper theme" : "Switch to ink theme"}
      className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface)] hover:text-[var(--text-primary)]"
    >
      {dark ? <Sun size={16} strokeWidth={1.75} /> : <Moon size={16} strokeWidth={1.75} />}
    </button>
  );
}

export function SiteHeader() {
  const pathname = usePathname();

  const dockItems = [
    {
      title: "Home",
      href: "/",
      icon: DOCK_ICONS["/"],
      active: pathname === "/",
    },
    ...NAV.map((link) => ({
      title: link.label,
      href: link.href,
      icon: DOCK_ICONS[link.href] ?? <Library className={iconClass} />,
      active: pathname === link.href || pathname.startsWith(`${link.href}/`),
    })),
  ];

  return (
    <>
      <header
        aria-label="Site identity"
        className="pointer-events-none fixed inset-x-0 top-0 z-50 bg-gradient-to-b from-[var(--bg-primary)] from-40% to-transparent"
      >
        <div className="pointer-events-auto mx-auto flex h-14 max-w-[1400px] items-center justify-between gap-3 px-4 pt-[env(safe-area-inset-top)] sm:h-16 sm:px-5 md:px-10">
          <div className="flex min-w-0 items-center gap-0.5">
            <BackControl />
            <BrandLogo size="sm" showName />
          </div>
          <ThemeButton />
        </div>
      </header>

      <nav
        aria-label="Primary"
        className="pointer-events-none fixed inset-x-0 bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-[55] flex justify-end px-4 md:bottom-6 md:justify-center md:px-0"
      >
        <div className="pointer-events-auto">
          <FloatingDock items={dockItems} />
        </div>
      </nav>
    </>
  );
}
