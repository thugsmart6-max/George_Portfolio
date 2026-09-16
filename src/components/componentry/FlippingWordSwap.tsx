"use client";

import { AnimatePresence, motion } from "motion/react";

/** Componentry Flipping Word Swap — character flip between two labels. */
export function FlippingWordSwap({
  word,
  className,
}: {
  word: string;
  className?: string;
}) {
  return (
    <span className={className} aria-hidden>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={word}
          className="inline-flex"
          initial={{ rotateX: 70, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          exit={{ rotateX: -70, opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: "50% 50%", display: "inline-block" }}
        >
          {word.split("").map((ch, i) => (
            <motion.span
              key={`${word}-${i}`}
              initial={{ y: "0.4em", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.03, duration: 0.22 }}
              style={{ display: "inline-block" }}
            >
              {ch}
            </motion.span>
          ))}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
