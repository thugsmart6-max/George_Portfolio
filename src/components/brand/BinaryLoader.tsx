"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { BRAND } from "@/lib/brand";
import { LOGOS } from "@/lib/media";

const SESSION_KEY = "wbg-loader-seen-v2";

function alreadySeen() {
  try {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

export function BinaryLoader() {
  const [show, setShow] = useState(false);
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    if (alreadySeen()) {
      setShow(false);
      document.documentElement.style.removeProperty("overflow");
      document.body.style.removeProperty("overflow");
      return;
    }

    setShow(true);

    const tick = setInterval(() => {
      setProgress((p) => Math.min(100, p + Math.random() * 14 + 6));
    }, 120);

    const done = setTimeout(() => {
      setProgress(100);
      setShow(false);
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        /* ignore */
      }
      window.__lenis?.resize?.();
      window.__lenis?.start?.();
    }, 2200);

    return () => {
      clearInterval(tick);
      clearTimeout(done);
    };
  }, []);

  const pct = Math.min(100, Math.max(1, Math.round(progress)));

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          className="loader-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(var(--grid-line)_1px,transparent_1px),linear-gradient(90deg,var(--grid-line)_1px,transparent_1px)] [background-size:56px_56px]" />

          <div className="relative z-10 w-full max-w-md px-6 text-center">
            <div className="relative mx-auto flex h-32 w-40 items-center justify-center md:h-40 md:w-52">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={LOGOS.mark}
                alt={BRAND.mark}
                className="h-28 w-40 object-contain md:h-36 md:w-48"
              />
            </div>

            <p className="mt-8 text-[10px] uppercase tracking-[0.35em] text-[var(--text-muted)]">
              {BRAND.brand}
            </p>
            <p className="display mt-3 text-2xl uppercase md:text-3xl">
              {BRAND.mark}
            </p>

            <div className="mx-auto mt-10 h-px w-full max-w-[220px] overflow-hidden bg-[var(--border)]">
              <motion.div
                className="h-full bg-[var(--text-primary)]"
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.2 }}
              />
            </div>
            <p className="mt-3 font-mono text-[10px] tracking-[0.2em] text-[var(--text-muted)]">
              {pct}%
            </p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
