"use client";

import { useEffect, useState } from "react";

/** Thin reading progress under the fixed header. */
export function ScrollProgress() {
  const [p, setP] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      setP(max > 0 ? el.scrollTop / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="pointer-events-none fixed left-0 right-0 top-[57px] z-[51] h-[2px] bg-transparent md:top-[61px]"
      aria-hidden
    >
      <div
        className="h-full bg-[var(--accent-2)] transition-[width] duration-75 ease-out"
        style={{ width: `${Math.min(100, p * 100)}%` }}
      />
    </div>
  );
}
