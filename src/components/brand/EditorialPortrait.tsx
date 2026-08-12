"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  src: string;
  alt: string;
  caption?: string;
  meta?: string;
  index?: string;
  className?: string;
  /** hero = tall offset frame · about = stacked dossier · film = wide strip */
  variant?: "hero" | "about" | "film";
  objectPosition?: string;
};

export function EditorialPortrait({
  src,
  alt,
  caption = "Single frame expression",
  meta,
  index = "01",
  className = "",
  variant = "hero",
  objectPosition = "center 18%",
}: Props) {
  if (variant === "film") {
    return (
      <figure className={cn("group relative", className)}>
        <div className="relative overflow-hidden border border-[var(--border)] bg-[var(--bg-secondary)]">
          <div className="absolute inset-x-0 top-0 z-20 flex justify-between px-3 py-2 font-mono text-[10px] text-[var(--bg-primary)] mix-blend-difference">
            <span>{index}</span>
            <span>FRAME</span>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className="aspect-[16/11] w-full object-cover grayscale transition duration-700 group-hover:grayscale-0"
            style={{ objectPosition }}
          />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(0,0,0,0.45))]" />
        </div>
        {(caption || meta) && (
          <figcaption className="mt-3 flex justify-between gap-4 text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
            <span>{caption}</span>
            {meta ? <span className="font-mono">{meta}</span> : null}
          </figcaption>
        )}
      </figure>
    );
  }

  const tall = variant === "about" || variant === "hero";

  return (
    <motion.figure
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={cn("group relative", className)}
    >
      {/* Offset ink plate behind the photo */}
      <div
        className={cn(
          "absolute inset-0 translate-x-3 translate-y-3 bg-[var(--text-primary)]",
          variant === "about" && "translate-x-4 translate-y-4"
        )}
        aria-hidden
      />

      <div
        className={cn(
          "relative overflow-hidden border border-[var(--border-strong)] bg-[var(--bg-secondary)]",
          tall && "aspect-[4/5]"
        )}
      >
        {/* Corner brackets */}
        <span className="pointer-events-none absolute left-3 top-3 z-20 h-5 w-5 border-l border-t border-[var(--bg-primary)] mix-blend-difference" />
        <span className="pointer-events-none absolute right-3 top-3 z-20 h-5 w-5 border-r border-t border-[var(--bg-primary)] mix-blend-difference" />
        <span className="pointer-events-none absolute bottom-3 left-3 z-20 h-5 w-5 border-b border-l border-[var(--bg-primary)] mix-blend-difference" />
        <span className="pointer-events-none absolute bottom-3 right-3 z-20 h-5 w-5 border-b border-r border-[var(--bg-primary)] mix-blend-difference" />

        {/* Top film strip */}
        <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between bg-[var(--bg-primary)]/85 px-3 py-2 backdrop-blur-sm">
          <p className="binary-strip !tracking-[0.28em]">0 1 0 1</p>
          <p className="font-mono text-[10px] text-[var(--text-muted)]">
            {index} / EXP
          </p>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover grayscale-[40%] transition duration-[900ms] ease-out group-hover:scale-[1.03] group-hover:grayscale-0"
          style={{ objectPosition }}
        />

        {/* Diagonal cut overlay */}
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(235,234,228,0.12)_0%,transparent_42%,transparent_58%,rgba(0,0,0,0.28)_100%)]"
          aria-hidden
        />

        {/* Vertical side label */}
        <p className="pointer-events-none absolute bottom-14 left-0 z-20 origin-left -rotate-90 translate-y-full pl-4 text-[9px] uppercase tracking-[0.35em] text-white/80">
          {caption}
        </p>

        {/* Bottom caption bar */}
        <div className="absolute inset-x-0 bottom-0 z-20 flex items-end justify-between gap-3 border-t border-white/20 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-4 pb-4 pt-16 text-white">
          <div>
            <p className="text-[9px] uppercase tracking-[0.22em] opacity-70">
              Portrait
            </p>
            {meta ? (
              <p className="display mt-1 text-2xl md:text-3xl">{meta}</p>
            ) : null}
          </div>
          <p className="font-mono text-[10px] opacity-70">F/{index}</p>
        </div>
      </div>

      <figcaption className="relative z-10 mt-5 flex items-start justify-between gap-4 pr-3 text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
        <span>Held in frame</span>
        <span className="font-mono">Δ style</span>
      </figcaption>
    </motion.figure>
  );
}
