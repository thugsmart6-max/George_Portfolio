"use client";

import { AnimatePresence, motion } from "motion/react";

/** Componentry Text Morph — fluid word swap that inherits current type. */
export function TextMorph({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <span className={className} style={{ display: "inline-block" }}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={text}
          initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: "inline-block" }}
        >
          {text}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
