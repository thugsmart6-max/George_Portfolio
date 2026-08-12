"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { BRAND } from "@/lib/brand";

export function HomeHero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const yImg = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.35]);
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);

  return (
    <section
      ref={ref}
      className="relative min-h-[100svh] overflow-hidden noise-layer"
    >
      {/* Full-bleed visual plane */}
      <motion.div style={{ y: yImg }} className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/george-antony-office.jpg"
          alt=""
          className="h-[115%] w-full object-cover object-[center_18%] opacity-55"
        />
        <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(10,7,8,0.92)_0%,rgba(10,7,8,0.72)_42%,rgba(10,7,8,0.35)_70%,rgba(10,7,8,0.75)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,rgba(255,90,42,0.22),transparent_55%)]" />
        <div className="hero-beam" />
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1500px] flex-col justify-end px-5 pb-16 pt-28 md:px-10 md:pb-24"
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6 inline-flex w-fit items-center gap-3 border-l-2 border-[var(--accent-2)] pl-4"
        >
          <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--text-secondary)]">
            {BRAND.holding}
          </span>
          <span className="h-1 w-1 rounded-full bg-[var(--accent)]" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
            {BRAND.location}
          </span>
        </motion.div>

        <motion.div style={{ y: titleY }}>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="display max-w-[12ch] text-[clamp(4.2rem,12vw,9.5rem)] leading-[0.82]"
          >
            <span className="block">Wealth</span>
            <span className="display-italic block text-[var(--accent-2)]">
              By George
            </span>
          </motion.h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.8 }}
          className="mt-6 max-w-md text-base leading-relaxed text-[var(--text-secondary)] md:text-lg"
        >
          {BRAND.heroLine}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <Link
            href="/calculators"
            data-cursor="cta"
            className="btn-primary magnetic-btn rounded-full px-7 py-3.5 text-[11px] uppercase tracking-[0.2em]"
          >
            Open tools
          </Link>
          <Link
            href="/contact"
            data-cursor="link"
            className="group inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--text-primary)]"
          >
            Connect
            <span className="inline-block h-px w-10 bg-[var(--accent)] transition-all group-hover:w-16" />
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85 }}
          className="display-italic mt-12 max-w-xl text-2xl text-[var(--accent)] md:text-3xl"
        >
          “{BRAND.philosophy}”
        </motion.p>
      </motion.div>

      {/* Floating identity chip */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.7, duration: 0.9 }}
        className="absolute bottom-[22%] right-6 z-20 hidden w-56 border border-[var(--glass-border)] bg-black/40 p-4 backdrop-blur-xl md:block lg:right-12"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/george-antony.jpg"
          alt={BRAND.name}
          className="mb-3 aspect-[4/5] w-full object-cover object-top"
        />
        <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--accent)]">
          Founder
        </p>
        <p className="display mt-1 text-xl">{BRAND.name}</p>
      </motion.div>

      <div className="absolute bottom-6 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex">
        <span className="text-[9px] uppercase tracking-[0.3em] text-[var(--text-muted)]">
          Scroll
        </span>
        <span className="scroll-line" />
      </div>
    </section>
  );
}
