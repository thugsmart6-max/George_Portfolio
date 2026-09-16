"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { TextMorph } from "@/components/componentry";
import { BRAND } from "@/lib/brand";

type Crumb = { href?: string; label: string };

type Props = {
  index: string;
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  meta?: string;
  quote?: React.ReactNode;
  crumbs?: Crumb[];
  align?: "split" | "stack";
  action?: { href: string; label: string };
  titleVariant?: "display" | "quote";
};

export function EditorialPageHero({
  index,
  eyebrow,
  title,
  description,
  meta,
  quote,
  crumbs,
  align = "split",
  action,
  titleVariant = "display",
}: Props) {
  return (
    <header className="relative min-w-0 overflow-hidden border-b border-[var(--border)] pb-12 md:pb-16">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        {quote ? (
          <div className="min-w-0 flex-1 overflow-hidden">{quote}</div>
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--accent-2)]"
          >
            {BRAND.mark}
          </motion.p>
        )}
        {crumbs?.length ? (
          <nav className="flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
            <Link href="/" className="hover:text-[var(--text-primary)]">
              Home
            </Link>
            {crumbs.map((c) => (
              <span key={c.label} className="flex items-center gap-2">
                <span>/</span>
                {c.href ? (
                  <Link href={c.href} className="hover:text-[var(--text-primary)]">
                    {c.label}
                  </Link>
                ) : (
                  <span className="text-[var(--text-primary)]">{c.label}</span>
                )}
              </span>
            ))}
          </nav>
        ) : null}
      </div>

      <div
        className={
          align === "split"
            ? "grid gap-8 lg:grid-cols-[120px_1fr_auto] lg:gap-12"
            : "space-y-6"
        }
      >
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="font-mono text-sm tracking-[0.2em] text-[var(--text-muted)] lg:pt-3"
        >
          {index}
        </motion.p>
        <div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[11px] uppercase tracking-[0.28em] text-[var(--text-muted)]"
          >
            <TextMorph text={eyebrow} />
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className={
              titleVariant === "quote"
                ? "display mt-4 max-w-4xl normal-case leading-[1.15]"
                : "display mt-4 text-[clamp(2.8rem,8vw,6.5rem)] uppercase leading-[0.9]"
            }
          >
            {title}
          </motion.h1>
          {meta ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-5 text-[11px] uppercase tracking-[0.22em] text-[var(--accent-2)]"
            >
              {meta}
            </motion.p>
          ) : null}
          {description ? (
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)] md:text-lg"
            >
              {description}
            </motion.p>
          ) : null}
        </div>
        {action ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="lg:self-end lg:pb-2"
          >
            <Link
              href={action.href}
              data-cursor="cta"
              className="btn-ghost px-5 py-3 text-[11px] font-semibold"
            >
              {action.label}
            </Link>
          </motion.div>
        ) : null}
      </div>

      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.45, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="absolute bottom-0 left-0 h-px w-full origin-left bg-[var(--text-primary)]"
        style={{ transformOrigin: "left" }}
      />
    </header>
  );
}
