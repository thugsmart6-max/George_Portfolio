"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/providers/ThemeProvider";
import { BRAND } from "@/lib/brand";

const links = [
  { href: "/about", label: "About" },
  { href: "/group", label: "Group" },
  { href: "/books", label: "Books" },
  { href: "/calculators", label: "Tools" },
  { href: "/advice", label: "Advice" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300",
          scrolled
            ? "border-[var(--border)] bg-[var(--bg-primary)]/88 backdrop-blur-md"
            : "border-transparent bg-[var(--bg-primary)]/55 backdrop-blur-[2px]"
        )}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-3 px-4 py-3.5 sm:px-5 sm:py-4 md:px-10">
          <div className="flex min-w-0 items-center gap-3 sm:gap-6">
            <Link
              href="/"
              className="truncate text-[10px] font-semibold uppercase tracking-[0.18em] sm:text-[11px] sm:tracking-[0.22em]"
              data-cursor="link"
            >
              <span className="sm:hidden">{BRAND.shortName}</span>
              <span className="hidden sm:inline">{BRAND.name}</span>
            </Link>
            <span className="binary-strip hidden md:inline">0 1 0 1 0 1</span>
          </div>

          <nav className="hidden items-center gap-5 xl:gap-6 lg:flex">
            {links.map((link) => {
              const active =
                pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  data-cursor="link"
                  className={cn(
                    "text-[11px] font-semibold uppercase tracking-[0.18em] transition-opacity",
                    active ? "opacity-100" : "opacity-45 hover:opacity-100"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={toggle}
              className="text-[10px] font-semibold uppercase tracking-[0.18em] opacity-50 hover:opacity-100"
            >
              {theme === "dark" ? "Paper" : "Ink"}
            </button>
            <Link
              href="/contact"
              data-cursor="cta"
              className="btn-primary hidden px-3.5 py-2 text-[10px] sm:inline-flex"
            >
              Say hi
            </Link>
            <button
              type="button"
              className="grid h-9 w-9 place-items-center lg:hidden"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
            >
              <Menu size={18} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] overflow-y-auto bg-[var(--bg-primary)] lg:hidden"
          >
            <div className="flex items-center justify-between px-4 py-5 sm:px-5">
              <span className="text-[11px] uppercase tracking-[0.22em]">
                {BRAND.brand}
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="grid h-9 w-9 place-items-center"
              >
                <X size={22} />
              </button>
            </div>
            <div className="px-4 pb-16 pt-4 sm:px-5">
              {links.map((link, i) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="display block border-b border-[var(--border)] py-4 text-[clamp(2rem,10vw,3.25rem)] uppercase"
                >
                  <span className="mr-3 font-mono text-sm text-[var(--text-muted)]">
                    0{i + 1}
                  </span>
                  {link.label}
                </Link>
              ))}
              <Link
                href="/contact"
                className="btn-primary mt-8 inline-flex px-6 py-3 text-[11px]"
              >
                Say hi
              </Link>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
