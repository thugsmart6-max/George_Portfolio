"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BOOKS, TOPICS } from "@/lib/brand";

const BLOCKS = [
  {
    n: "01",
    eyebrow: "Library",
    title: "Books",
    line: "Three manuscripts in development — mindset, enterprise, and the builder's day.",
    href: "/books",
    cta: "Open library",
    items: BOOKS.map((b) => b.title),
  },
  {
    n: "02",
    eyebrow: "Practice",
    title: "Advice",
    line: "Six pillars for Tamil Nadu & India builders — assets, cash flow, skills, tools.",
    href: "/advice",
    cta: "Read pillars",
    items: TOPICS.slice(0, 4),
  },
  {
    n: "03",
    eyebrow: "Tools",
    title: "Calculators",
    line: "SIP, Lumpsum, SWP, GST, EMI, Brokerage, Margin — Groww-style clarity.",
    href: "/calculators",
    cta: "Run numbers",
    items: ["SIP", "Lumpsum", "Brokerage", "Margin"],
  },
] as const;

export function ContentShowcase() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 py-16 sm:px-5 sm:py-20 md:px-10 md:py-28">
      <div className="grid gap-6 border-b border-[var(--border)] pb-8 md:grid-cols-[88px_1fr] md:items-end">
        <p className="font-mono text-[11px] tracking-[0.2em] text-[var(--text-muted)]">
          02B
        </p>
        <div>
          <p className="eyebrow">Content system</p>
          <h2 className="display mt-3 text-4xl uppercase sm:text-5xl md:text-6xl">
            Showcase
          </h2>
          <p className="mt-3 max-w-xl text-sm text-[var(--text-secondary)]">
            Teaching, tools, and titles — the public layer of Wealth By George.
          </p>
        </div>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {BLOCKS.map((b, i) => (
          <motion.article
            key={b.n}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: i * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="group flex flex-col border border-[var(--border)] bg-[var(--bg-primary)] p-5 transition-colors hover:bg-[var(--surface)] sm:p-7"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="font-mono text-[11px] text-[var(--text-muted)]">
                {b.n}
              </p>
              <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--accent-2)]">
                {b.eyebrow}
              </p>
            </div>
            <h3 className="display mt-6 text-3xl uppercase sm:text-4xl">
              {b.title}
            </h3>
            <p className="mt-4 flex-1 text-sm leading-relaxed text-[var(--text-secondary)]">
              {b.line}
            </p>
            <ul className="mt-6 space-y-2 border-t border-[var(--border)] pt-5">
              {b.items.map((item) => (
                <li
                  key={item}
                  className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]"
                >
                  <span className="truncate">{item}</span>
                  <span className="h-px w-6 bg-[var(--border-strong)]" />
                </li>
              ))}
            </ul>
            <Link
              href={b.href}
              data-cursor="link"
              className="btn-ghost mt-7 w-full justify-center px-4 py-3 text-[11px] font-semibold sm:w-auto"
            >
              {b.cta}
            </Link>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
