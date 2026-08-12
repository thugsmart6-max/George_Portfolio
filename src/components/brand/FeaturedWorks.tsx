"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { VERTICALS } from "@/lib/brand";

const WORKS = VERTICALS.filter((v) => v.slug !== "fourth").map((v, i) => ({
  n: String(i + 1).padStart(2, "0"),
  mark: v.mark,
  title: v.name,
  role: v.role,
  tags: v.sector.split("·").map((t) => t.trim()),
  summary: v.summary,
  href: "/group",
  image:
    i % 2 === 0
      ? "/images/george-antony-office.jpg"
      : "/images/george-antony.jpg",
  accent:
    i === 0
      ? "Holding"
      : i === 1
        ? "Talent"
        : i === 2
          ? "Tech"
          : i === 3
            ? "Assets"
            : "Brand",
}));

export function FeaturedWorks() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const current = WORKS[index];
  const total = WORKS.length;

  const prev = useCallback(
    () => setIndex((i) => (i - 1 + total) % total),
    [total]
  );
  const next = useCallback(() => setIndex((i) => (i + 1) % total), [total]);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % total);
    }, 6500);
    return () => window.clearInterval(id);
  }, [paused, total]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]);

  return (
    <section
      className="mx-auto max-w-[1400px] px-4 py-16 sm:px-5 sm:py-20 md:px-10 md:py-28"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="flex flex-col gap-6 border-b border-[var(--border)] pb-8 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="eyebrow">Curated showcase</p>
          <h2 className="display mt-3 text-4xl uppercase sm:text-5xl md:text-6xl">
            Project
          </h2>
          <p className="mt-3 max-w-md text-sm text-[var(--text-secondary)]">
            Advanced visual index of Thanith narratives — holding, talent, tech,
            assets, and brand trust.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <p className="font-mono text-[11px] text-[var(--text-muted)]">
            {current.n} / {String(total).padStart(2, "0")}
          </p>
          <button
            type="button"
            onClick={prev}
            className="btn-ghost btn-no-arrow px-4 py-2 text-[10px] font-semibold"
            data-cursor="link"
          >
            Prev
          </button>
          <button
            type="button"
            onClick={next}
            className="btn-primary btn-no-arrow px-4 py-2 text-[10px]"
            data-cursor="link"
          >
            Next
          </button>
        </div>
      </div>

      {/* Progress ticks */}
      <div className="mt-6 flex gap-1.5">
        {WORKS.map((w, i) => (
          <button
            key={w.n}
            type="button"
            aria-label={`Show ${w.title}`}
            onClick={() => setIndex(i)}
            className="relative h-1 flex-1 overflow-hidden bg-[var(--border)]"
          >
            <span
              className={`absolute inset-y-0 left-0 bg-[var(--accent-2)] transition-all duration-500 ${
                i === index ? "w-full" : i < index ? "w-full opacity-40" : "w-0"
              }`}
            />
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch">
        <AnimatePresence mode="wait">
          <motion.figure
            key={current.n}
            initial={{ opacity: 0, scale: 0.985 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="group relative overflow-hidden border border-[var(--border)] bg-[var(--bg-secondary)]"
          >
            <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-4 py-3">
              <span className="bg-[var(--bg-primary)]/90 px-2.5 py-1 font-mono text-[10px] backdrop-blur-sm">
                {current.n} · {current.mark}
              </span>
              <span className="bg-[var(--text-primary)] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-[var(--bg-primary)]">
                {current.accent}
              </span>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current.image}
              alt={current.title}
              className="aspect-[16/11] w-full object-cover grayscale-[35%] transition duration-700 group-hover:scale-[1.03] group-hover:grayscale-0 sm:aspect-[16/10]"
            />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(0,0,0,0.55))]" />
            <figcaption className="absolute inset-x-0 bottom-0 z-20 p-4 text-white sm:p-6">
              <p className="text-[10px] uppercase tracking-[0.2em] opacity-75">
                Single frame expression
              </p>
              <p className="display mt-1 text-2xl sm:text-3xl">{current.mark}</p>
            </figcaption>
          </motion.figure>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${current.n}-copy`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.45 }}
            className="flex flex-col justify-between border border-[var(--border)] bg-[var(--bg-secondary)]/50 p-5 sm:p-8"
          >
            <div>
              <p className="font-mono text-[11px] text-[var(--text-muted)]">
                {current.n} · {current.role}
              </p>
              <h3 className="display mt-4 text-3xl leading-[0.95] sm:text-4xl md:text-5xl">
                {current.title}
              </h3>
              <div className="mt-5 flex flex-wrap gap-2">
                {current.tags.map((t) => (
                  <span key={t} className="tag-pill">
                    {t}
                  </span>
                ))}
              </div>
              <p className="mt-6 max-w-md text-sm leading-relaxed text-[var(--text-secondary)] md:text-base">
                {current.summary}
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border)] pt-6">
              <Link
                href={current.href}
                className="btn-primary px-5 py-3 text-[11px]"
                data-cursor="cta"
              >
                View ecosystem
              </Link>
              <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
                ← → keys · autoplay
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Advanced index list */}
      <ul className="mt-14 sm:mt-20">
        {WORKS.map((w, i) => (
          <li key={w.n}>
            <button
              type="button"
              onClick={() => setIndex(i)}
              data-cursor="explore"
              className={`work-row w-full items-center text-left transition-opacity ${
                index === i ? "opacity-100" : "opacity-50 hover:opacity-100"
              }`}
            >
              <div className="grid w-full grid-cols-[40px_1fr] gap-3 sm:grid-cols-[56px_1fr_auto] md:grid-cols-[72px_1.3fr_1fr_auto] md:gap-4">
                <span className="font-mono text-[11px] text-[var(--text-muted)]">
                  {w.n}
                </span>
                <span className="display min-w-0 text-xl leading-tight sm:text-2xl md:text-3xl">
                  {w.title}
                </span>
                <span className="col-span-2 hidden text-xs uppercase tracking-[0.14em] text-[var(--text-muted)] sm:col-span-1 sm:block md:block">
                  {w.tags.slice(0, 2).join(" · ")}
                </span>
                <span className="hidden text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted)] md:block">
                  {w.role}
                </span>
              </div>
            </button>
          </li>
        ))}
        <li className="border-t border-[var(--border)]" />
      </ul>
    </section>
  );
}
