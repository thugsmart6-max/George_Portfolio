"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { BRAND } from "@/lib/brand";
import { FOUNDER } from "@/lib/media";
import { EditorialPortrait } from "@/components/brand/EditorialPortrait";
import { SiteCutout } from "@/components/brand/ThemeDoodles";

export function EditorialHero() {
  return (
    <section className="relative min-h-[100svh] px-4 pb-28 pt-20 sm:px-5 sm:pb-32 sm:pt-24 md:px-10 md:pb-40 md:pt-28">
      <SiteCutout
        id="moneyBag"
        rotate={-10}
        className="absolute bottom-16 right-4 hidden w-[64px] lg:block xl:right-10 xl:w-[76px]"
      />
      <div className="relative z-10 mx-auto flex min-h-[70svh] max-w-[1400px] flex-col justify-between sm:min-h-[75svh]">
        <div className="flex items-start justify-between gap-6">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--accent-2)]"
          >
            {BRAND.mark}
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-right text-[10px] uppercase tracking-[0.28em] text-[var(--text-muted)]"
          >
            {BRAND.location}
            <br />
            {BRAND.brand}
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
              {BRAND.name}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="display mt-4 text-[clamp(2.4rem,7vw,5.6rem)] uppercase leading-[0.9]"
            >
              Build wealth.
              <br />
              Create freedom.
              <br />
              <span className="display-italic normal-case">Leave a legacy.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8 max-w-lg text-sm leading-relaxed text-[var(--text-secondary)] md:text-base"
            >
              {BRAND.heroLine}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.45, duration: 0.8 }}
            className="max-w-md justify-self-end lg:max-w-none"
          >
            <EditorialPortrait
              src={FOUNDER.portrait}
              alt={BRAND.name}
              caption="Founder"
              meta={BRAND.mark}
              index="01"
              variant="hero"
              objectPosition="center 8%"
            />
          </motion.div>
        </div>

        <div className="mt-10 flex flex-col gap-6 pb-16 sm:mt-16 sm:pb-20">
          <div className="flex flex-wrap gap-3">
            <Link
              href="/contact"
              data-cursor="cta"
              className="btn-primary px-5 py-3 text-[11px] font-semibold"
            >
              Schedule a Consultation
            </Link>
            <Link
              href="/academy"
              className="btn-ghost px-5 py-3 text-[11px] font-semibold"
            >
              Join a Wealth Workshop
            </Link>
            <Link
              href="/services"
              className="btn-ghost px-5 py-3 text-[11px] font-semibold"
            >
              Start Your Journey
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
