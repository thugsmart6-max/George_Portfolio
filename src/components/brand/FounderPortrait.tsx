"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/brand";

type Props = {
  className?: string;
  variant?: "hero" | "about";
};

const VIDEO_ID = process.env.NEXT_PUBLIC_FOUNDER_VIDEO_ID;

const PHOTO_BY_VARIANT = {
  hero: "/images/george-antony.jpg",
  about: "/images/george-antony-office.jpg",
} as const;

const FALLBACKS = [
  "/images/george-antony.jpg",
  "/images/george-antony-office.jpg",
  "/images/george-antony-alt.jpg",
];

export function FounderPortrait({ className = "", variant = "hero" }: Props) {
  const preferred = PHOTO_BY_VARIANT[variant];
  const [src, setSrc] = useState<string | null>(null);
  const tall = variant === "about";

  useEffect(() => {
    if (VIDEO_ID) return;
    let cancelled = false;
    const candidates = [preferred, ...FALLBACKS.filter((p) => p !== preferred)];

    const tryNext = (i: number) => {
      if (cancelled || i >= candidates.length) {
        if (!cancelled) setSrc(null);
        return;
      }
      const img = new window.Image();
      img.onload = () => {
        if (!cancelled) setSrc(candidates[i]);
      };
      img.onerror = () => tryNext(i + 1);
      img.src = candidates[i];
    };

    tryNext(0);
    return () => {
      cancelled = true;
    };
  }, [preferred]);

  if (VIDEO_ID) {
    return (
      <div
        className={cn(
          "relative overflow-hidden border border-[var(--glass-border)] bg-[var(--bg-secondary)] shadow-[var(--shadow-glow)]",
          "aspect-[4/5]",
          className
        )}
      >
        <iframe
          title={`${BRAND.name} — introduction`}
          src={`https://www.youtube.com/embed/${VIDEO_ID}?rel=0&modestbranding=1`}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <motion.figure
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "group relative overflow-hidden border border-[var(--glass-border)] bg-[linear-gradient(160deg,#1a0c0a,#0a0708_55%,#241808)] shadow-[var(--shadow-glow)]",
        "aspect-[4/5] w-full",
        !tall && "max-w-sm",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 z-10 ring-1 ring-inset ring-white/10" />
      <div className="pointer-events-none absolute -left-10 top-8 z-20 rotate-[-90deg] text-[10px] uppercase tracking-[0.35em] text-[var(--accent)]">
        {BRAND.brand}
      </div>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={BRAND.name}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]",
            variant === "hero" ? "object-[center_18%]" : "object-[center_20%]"
          )}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8 text-center">
          <span className="grid h-28 w-28 place-items-center rounded-full bg-[linear-gradient(135deg,var(--accent-2),var(--accent))] text-3xl font-bold text-[#0a0708]">
            GA
          </span>
          <p className="display text-2xl text-[var(--text-primary)]">
            {BRAND.name}
          </p>
        </div>
      )}
      <figcaption className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-5 pb-5 pt-20">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
          Founder
        </p>
        <p className="display mt-1 text-2xl text-white md:text-3xl">
          {BRAND.shortName}
        </p>
        <p className="mt-1 text-xs text-white/70">{BRAND.location}</p>
      </figcaption>
    </motion.figure>
  );
}
