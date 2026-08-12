"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { BRAND } from "@/lib/brand";

const SESSION_KEY = "wbg-loader-seen";

export function BinaryLoader() {
  const [show, setShow] = useState(true);
  const [bit, setBit] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SESSION_KEY) === "1") {
        setShow(false);
        return;
      }
    } catch {
      /* ignore */
    }

    document.documentElement.style.overflow = "hidden";

    const flip = setInterval(() => setBit((b) => (b ? 0 : 1)), 80);
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
      document.documentElement.style.overflow = "";
    }, 2200);

    return () => {
      clearInterval(flip);
      clearInterval(tick);
      clearTimeout(done);
      document.documentElement.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          className="loader-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(var(--grid-line)_1px,transparent_1px),linear-gradient(90deg,var(--grid-line)_1px,transparent_1px)] [background-size:56px_56px]" />

          <div className="relative z-10 w-full max-w-md px-6 text-center">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="binary-strip mb-8"
            >
              0&nbsp;1&nbsp;0&nbsp;1&nbsp;0&nbsp;1
            </motion.p>

            <div className="relative mx-auto grid h-36 w-36 place-items-center border border-[var(--border-strong)] md:h-44 md:w-44">
              <span className="absolute -left-1 -top-1 h-3 w-3 border-l-2 border-t-2 border-[var(--text-primary)]" />
              <span className="absolute -right-1 -top-1 h-3 w-3 border-r-2 border-t-2 border-[var(--text-primary)]" />
              <span className="absolute -bottom-1 -left-1 h-3 w-3 border-b-2 border-l-2 border-[var(--text-primary)]" />
              <span className="absolute -bottom-1 -right-1 h-3 w-3 border-b-2 border-r-2 border-[var(--text-primary)]" />
              <motion.p
                key={bit}
                initial={{ opacity: 0.35, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                className="font-mono text-7xl tabular-nums md:text-8xl"
              >
                {bit}
              </motion.p>
            </div>

            <p className="mt-8 text-[10px] uppercase tracking-[0.35em] text-[var(--text-muted)]">
              {BRAND.brand}
            </p>
            <p className="display mt-3 text-2xl uppercase md:text-3xl">
              {BRAND.shortName}
            </p>

            <div className="mx-auto mt-10 h-px w-full max-w-[220px] overflow-hidden bg-[var(--border)]">
              <motion.div
                className="h-full bg-[var(--text-primary)]"
                animate={{ width: `${Math.min(100, progress)}%` }}
                transition={{ duration: 0.2 }}
              />
            </div>
            <p className="mt-3 font-mono text-[10px] tracking-[0.2em] text-[var(--text-muted)]">
              {String(Math.min(100, Math.round(progress))).padStart(2, "0")}%
            </p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
