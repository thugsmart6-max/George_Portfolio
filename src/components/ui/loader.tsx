"use client";

import { motion } from "motion/react";

function bounce(delay: number) {
  return {
    duration: 1,
    repeat: Infinity,
    repeatType: "loop" as const,
    delay,
    ease: "easeInOut" as const,
  };
}

const bead =
  "h-4 w-4 rounded-full border border-[var(--border-strong)] bg-gradient-to-b from-[var(--text-muted)] to-[var(--border)]";

export function LoaderOne() {
  return (
    <div className="flex items-center gap-2" role="status" aria-label="Loading">
      <motion.div
        className={bead}
        initial={{ y: 0 }}
        animate={{ y: [0, 10, 0] }}
        transition={bounce(0)}
      />
      <motion.div
        className={bead}
        initial={{ y: 0 }}
        animate={{ y: [0, 10, 0] }}
        transition={bounce(0.2)}
      />
      <motion.div
        className={bead}
        initial={{ y: 0 }}
        animate={{ y: [0, 10, 0] }}
        transition={bounce(0.4)}
      />
    </div>
  );
}
