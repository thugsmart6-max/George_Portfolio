"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { formatINR } from "@/lib/utils";

interface AnimatedNumberProps {
  value: number;
  format?: "inr" | "number" | "percent";
  duration?: number;
  className?: string;
  digits?: number;
}

export function AnimatedNumber({
  value,
  format = "number",
  duration = 1200,
  className,
  digits = 0,
}: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setDisplay(value);
      return;
    }
    let frame: number;
    const start = performance.now();
    const from = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(from + (value - from) * eased);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value, duration, reduced]);

  let text: string;
  if (format === "inr") text = formatINR(Math.round(display));
  else if (format === "percent") text = `${display.toFixed(digits)}%`;
  else text = Math.round(display).toLocaleString("en-IN");

  return (
    <span ref={ref} className={className}>
      {text}
    </span>
  );
}
