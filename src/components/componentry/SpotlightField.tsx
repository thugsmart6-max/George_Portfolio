"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";

/** Componentry-style cursor spotlight, themed with site CSS variables. */
export function SpotlightField() {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 80, damping: 22 });
  const y = useSpring(rawY, { stiffness: 80, damping: 22 });
  const [on, setOn] = useState(false);
  const mask = useMotionTemplate`radial-gradient(520px circle at ${x}px ${y}px, var(--accent-dim), transparent 58%)`;

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    setOn(true);
    const move = (e: PointerEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [rawX, rawY]);

  if (!on) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[1]"
      style={{ background: mask }}
    />
  );
}
