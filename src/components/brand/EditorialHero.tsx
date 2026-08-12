"use client";

import { motion } from "framer-motion";
import { BRAND } from "@/lib/brand";
import { EditorialPortrait } from "@/components/brand/EditorialPortrait";

export function EditorialHero() {
  return (
    <section className="relative min-h-[100svh] px-4 pb-12 pt-24 sm:px-5 sm:pb-16 sm:pt-28 md:px-10 md:pb-24 md:pt-36">
      <div className="mx-auto flex min-h-[70svh] max-w-[1400px] flex-col justify-between sm:min-h-[75svh]">
        <div className="flex items-start justify-between gap-6">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="binary-strip"
          >
            0&nbsp;1&nbsp;0&nbsp;1&nbsp;0&nbsp;1
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-right text-[10px] uppercase tracking-[0.28em] text-[var(--text-muted)]"
          >
            {BRAND.location}
            <br />
            {BRAND.visionYear}
          </motion.p>
        </div>

        <div className="mt-10 grid items-end gap-10 sm:mt-16 sm:gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-[11px] uppercase tracking-[0.28em] text-[var(--text-muted)]"
            >
              Wealth mindset
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="hero-giant mt-4 text-[clamp(2.6rem,10vw,8.5rem)] uppercase"
            >
              {BRAND.name}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8 flex flex-wrap items-end gap-x-8 gap-y-3"
            >
              <p className="text-[11px] uppercase tracking-[0.24em]">
                {BRAND.roles[0]}
              </p>
              <p className="display text-3xl md:text-4xl">A Founder</p>
              <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--text-muted)]">
                {BRAND.brand}
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.45, duration: 0.8 }}
            className="max-w-md justify-self-end lg:max-w-none"
          >
            <EditorialPortrait
              src="/images/george-antony.jpg"
              alt={BRAND.name}
              caption="Single frame expression"
              meta={BRAND.shortName}
              index="01"
              variant="hero"
              objectPosition="center top"
            />
          </motion.div>
        </div>

        <div className="mt-10 flex items-end justify-between gap-4 sm:mt-16 sm:gap-6">
          <p className="max-w-sm text-sm leading-relaxed text-[var(--text-secondary)]">
            {BRAND.heroLine}
          </p>
          <p className="scroll-cue hidden sm:block">scroll down</p>
        </div>
      </div>
    </section>
  );
}
