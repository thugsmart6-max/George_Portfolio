"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type Props = {
  src: string;
  alt: string;
  caption?: string;
  meta?: string;
  index?: string;
  className?: string;
  /** hero = tall print · about = stacked dossier · film = wide still */
  variant?: "hero" | "about" | "film";
  objectPosition?: string;
};

export function EditorialPortrait({
  src,
  alt,
  caption = "Portrait",
  meta,
  index = "01",
  className = "",
  variant = "hero",
  objectPosition = "center 18%",
}: Props) {
  if (variant === "film") {
    return (
      <figure className={cn("group relative", className)}>
        <div className="relative border border-[var(--border)] bg-[var(--bg-primary)] p-2.5 sm:p-3">
          <div className="relative overflow-hidden bg-[var(--bg-secondary)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt}
              className="aspect-[16/11] w-full object-cover transition duration-700 ease-out group-hover:scale-[1.02]"
              style={{ objectPosition }}
            />
          </div>
        </div>
        {(caption || meta) && (
          <figcaption className="mt-3 flex items-baseline justify-between gap-4 text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
            <span>{caption}</span>
            {meta ? <span className="font-mono">{meta}</span> : null}
          </figcaption>
        )}
      </figure>
    );
  }

  return (
    <motion.figure
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={cn("group relative", className)}
    >
      <div
        className="absolute inset-[10px] translate-x-2.5 translate-y-2.5 bg-[var(--accent)]/55"
        aria-hidden
      />

      <div className="relative border border-[var(--border)] bg-[var(--bg-primary)] p-2.5 shadow-[0_18px_50px_rgba(0,0,0,0.18)] sm:p-3.5">
        <span
          className="pointer-events-none absolute left-2 top-2 h-3 w-3 border-l border-t border-[var(--accent)] sm:left-2.5 sm:top-2.5"
          aria-hidden
        />
        <span
          className="pointer-events-none absolute right-2 top-2 h-3 w-3 border-r border-t border-[var(--accent)] sm:right-2.5 sm:top-2.5"
          aria-hidden
        />
        <span
          className="pointer-events-none absolute bottom-2 left-2 h-3 w-3 border-b border-l border-[var(--accent)] sm:bottom-2.5 sm:left-2.5"
          aria-hidden
        />
        <span
          className="pointer-events-none absolute right-2 bottom-2 h-3 w-3 border-b border-r border-[var(--accent)] sm:right-2.5 sm:bottom-2.5"
          aria-hidden
        />

        <div className="relative overflow-hidden bg-[var(--bg-secondary)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className="aspect-[4/5] h-full w-full object-cover transition duration-[900ms] ease-out group-hover:scale-[1.025]"
            style={{ objectPosition }}
          />
        </div>

        <figcaption className="mt-3 flex items-end justify-between gap-3 px-0.5 pb-0.5">
          <div className="min-w-0">
            <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)]">
              {caption}
            </p>
            {meta ? (
              <p className="display mt-1 truncate text-xl leading-none text-[var(--text-primary)] sm:text-2xl">
                {meta}
              </p>
            ) : null}
          </div>
          <p className="shrink-0 font-mono text-[10px] tabular-nums text-[var(--text-muted)]">
            {index}
          </p>
        </figcaption>
      </div>
    </motion.figure>
  );
}
