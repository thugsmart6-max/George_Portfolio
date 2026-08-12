"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/providers/ThemeProvider";
import { Menu, X } from "lucide-react";

const items = [
  { href: "/dashboard", label: "Overview" },
  { href: "/finance", label: "Money" },
  { href: "/wealth-map", label: "Map" },
  { href: "/goals", label: "Goals" },
  { href: "/coach", label: "Coach" },
  { href: "/profile", label: "Profile" },
];

export function AppNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--bg-primary)]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-4 md:px-8">
          <Link href="/dashboard" className="font-mono text-[11px] tracking-[0.18em]">
            WEALTH CREATOR
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {items.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  data-cursor="link"
                  className={cn(
                    "link-underline font-mono text-[11px] uppercase tracking-[0.16em]",
                    active
                      ? "text-[var(--text-primary)]"
                      : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
            <button
              type="button"
              onClick={toggle}
              className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)]"
            >
              Theme[{theme === "light" ? "A" : "B"}]
            </button>
            <button
              type="button"
              onClick={logout}
              className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)] hover:text-[var(--danger)]"
            >
              Exit
            </button>
          </nav>

          <button
            type="button"
            className="md:hidden"
            aria-label="Menu"
            onClick={() => setOpen(true)}
          >
            <Menu size={18} />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[var(--bg-primary)] md:hidden"
          >
            <div className="flex items-center justify-between px-5 py-4">
              <span className="font-mono text-[11px] tracking-[0.18em]">
                MENU
              </span>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close">
                <X size={18} />
              </button>
            </div>
            <div className="flex flex-col gap-2 px-5 pt-8">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="display border-b border-[var(--border)] py-4 text-4xl"
                >
                  {item.label}
                </Link>
              ))}
              <button
                type="button"
                onClick={logout}
                className="mt-8 text-left font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--danger)]"
              >
                Exit system
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
