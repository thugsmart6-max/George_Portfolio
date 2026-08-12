"use client";

import { useEffect, useRef, useState } from "react";

type Mode = "default" | "hover" | "text" | "hidden";

const LABELS: Record<string, string> = {
  link: "OPEN",
  cta: "GO",
  explore: "VIEW",
  chart: "READ",
  ask: "ASK",
  data: "SEE",
};

function isTextTarget(el: Element | null) {
  if (!el) return false;
  const tag = el.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  if ((el as HTMLElement).isContentEditable) return true;
  return Boolean(el.closest("input, textarea, select, [contenteditable='true']"));
}

function isHoverTarget(el: Element | null) {
  if (!el) return false;
  return Boolean(
    el.closest(
      "a, button, [role='button'], [data-cursor], label, summary, .calc-range, input[type='range'], input[type='checkbox'], input[type='radio']"
    )
  );
}

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const pos = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });
  const raf = useRef(0);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touchHeavy = navigator.maxTouchPoints > 1 && window.innerWidth < 1024;
    const ok = fine && !reduced && !touchHeavy;
    setEnabled(ok);
    if (!ok) return;

    const root = document.documentElement;
    root.classList.add("custom-cursor-zone");

    let mode: Mode = "default";
    let label = "";
    let visible = false;
    let pressed = false;

    const applyDom = () => {
      const dot = dotRef.current;
      const ringEl = ringRef.current;
      const labelEl = labelRef.current;
      if (!dot || !ringEl || !labelEl) return;

      const show = visible && mode !== "text" && mode !== "hidden";
      dot.style.opacity = show ? "1" : "0";
      ringEl.style.opacity = show ? "1" : "0";

      const hovering = mode === "hover";
      ringEl.style.width = hovering ? "56px" : "28px";
      ringEl.style.height = hovering ? "56px" : "28px";
      ringEl.style.background = hovering
        ? "var(--text-primary)"
        : "transparent";
      ringEl.style.borderColor = "var(--text-primary)";
      labelEl.textContent = hovering ? label : "";
      labelEl.style.opacity = hovering && label ? "1" : "0";
      const scale = pressed ? 0.88 : 1;
      dot.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%)`;
      ringEl.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0) translate(-50%, -50%) scale(${scale})`;
    };

    const tick = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.18;
      ring.current.y += (pos.current.y - ring.current.y) * 0.18;
      applyDom();
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);

    const onMove = (e: MouseEvent) => {
      pos.current.x = e.clientX;
      pos.current.y = e.clientY;
      visible = true;

      const target = e.target as Element | null;
      if (isTextTarget(target)) {
        mode = "text";
        label = "";
        root.classList.add("custom-cursor-text");
      } else {
        root.classList.remove("custom-cursor-text");
        if (isHoverTarget(target)) {
          mode = "hover";
          const marked = target?.closest?.("[data-cursor]");
          const key = marked?.getAttribute("data-cursor") || "link";
          label = LABELS[key] || "OPEN";
        } else {
          mode = "default";
          label = "";
        }
      }
    };

    const onLeave = () => {
      visible = false;
      mode = "hidden";
    };

    const onDown = () => {
      pressed = true;
    };
    const onUp = () => {
      pressed = false;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      root.classList.remove("custom-cursor-zone", "custom-cursor-text");
    };
  }, []);

  if (!enabled) return null;

  return (
    <div aria-hidden className="cursor-layer">
      <div ref={ringRef} className="cursor-ring">
        <span ref={labelRef} className="cursor-label" />
      </div>
      <div ref={dotRef} className="cursor-dot" />
    </div>
  );
}
