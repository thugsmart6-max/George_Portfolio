"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import { useEffect, useId, useRef, useState, type PointerEvent } from "react";
import { ThemeDoodle } from "@/components/brand/ThemeDoodles";
import { cn } from "@/lib/utils";

export type ExpandCardItem = {
  id: string;
  kicker?: string;
  title: string;
  summary: string;
  detail: string;
  quote?: boolean;
};

const ease = [0.76, 0, 0.24, 1] as const;
const DOODLE_CYCLE = ["chart", "pyramid", "flow", "bars", "pie", "arrow", "percent"] as const;

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return reduced;
}

function MagneticCard({
  children,
  className,
  open,
  reduced,
  onClick,
  controls,
}: {
  children: React.ReactNode;
  className?: string;
  open: boolean;
  reduced: boolean;
  onClick: () => void;
  controls: string;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const sx = useSpring(rx, { stiffness: 180, damping: 20 });
  const sy = useSpring(ry, { stiffness: 180, damping: 20 });

  const [live, setLive] = useState(false);
  useEffect(() => setLive(true), []);

  function onMove(event: React.MouseEvent) {
    if (!live || reduced || open || !ref.current) return;
    const box = ref.current.getBoundingClientRect();
    const px = (event.clientX - box.left) / box.width - 0.5;
    const py = (event.clientY - box.top) / box.height - 0.5;
    ry.set(px * 8);
    rx.set(py * -8);
  }

  function onLeave() {
    rx.set(0);
    ry.set(0);
  }

  return (
    <motion.button
      ref={ref}
      type="button"
      aria-expanded={open}
      aria-controls={controls}
      data-cursor="explore"
      onClick={onClick}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={live && !reduced ? { rotateX: sx, rotateY: sy, transformPerspective: 900 } : undefined}
      className={className}
    >
      {children}
    </motion.button>
  );
}

function BriefCopy({ text, reduced }: { text: string; reduced: boolean }) {
  const parts = text.split(/(?<=[.!?])\s+/).filter(Boolean);
  return (
    <p className="mt-4 text-[15px] leading-[1.8] text-[var(--text-primary)] md:text-base">
      {parts.map((sentence, i) => (
        <motion.span
          key={`${sentence.slice(0, 24)}-${i}`}
          initial={reduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 + i * 0.08, duration: 0.4, ease }}
          className="inline"
        >
          {sentence}
          {i < parts.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </p>
  );
}

export function ExpandCards({
  items,
  columns = 3,
}: {
  items: ExpandCardItem[];
  columns?: 2 | 3;
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const deckId = useId();
  const stageRef = useRef<HTMLDivElement>(null);
  const swipeX = useRef<number | null>(null);
  const reduced = usePrefersReducedMotion();
  const activeIndex = openId ? items.findIndex((item) => item.id === openId) : -1;
  const active = activeIndex >= 0 ? items[activeIndex] : null;

  useEffect(() => {
    if (!openId) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenId(null);
      if (event.key === "ArrowRight") {
        setOpenId(items[(Math.max(activeIndex, 0) + 1) % items.length]?.id ?? null);
      }
      if (event.key === "ArrowLeft") {
        setOpenId(items[(Math.max(activeIndex, 0) - 1 + items.length) % items.length]?.id ?? null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openId, activeIndex, items]);

  useEffect(() => {
    if (!openId || !stageRef.current) return;
    stageRef.current.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "nearest" });
  }, [openId, reduced]);

  function openAt(index: number) {
    const next = items[(index + items.length) % items.length];
    if (next) setOpenId(next.id);
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    swipeX.current = event.clientX;
  }

  function onPointerUp(event: PointerEvent<HTMLDivElement>) {
    if (swipeX.current == null || items.length < 2) return;
    const delta = event.clientX - swipeX.current;
    swipeX.current = null;
    if (delta > 56) openAt(activeIndex - 1);
    if (delta < -56) openAt(activeIndex + 1);
  }

  return (
    <div className="expand-deck" style={{ perspective: 1200 }}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
          {openId ? "Brief open — tap another card or use arrows" : "Tap a card to open the brief"}
        </p>
        <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Cards in this room">
          {items.map((item, i) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={openId === item.id}
              data-cursor="link"
              onClick={() => setOpenId(openId === item.id ? null : item.id)}
              className={cn(
                "focus-ring h-1.5 w-7 border-0 transition-all duration-300",
                openId === item.id
                  ? "bg-[var(--accent-2)]"
                  : "bg-[var(--border-strong)] hover:bg-[var(--text-muted)]"
              )}
              aria-label={`${item.title}, card ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <ul
        className={cn(
          "grid gap-3 sm:gap-4",
          columns === 2 ? "md:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"
        )}
      >
        {items.map((item, i) => {
          const open = openId === item.id;
          const dim = openId != null && !open;
          const doodle = DOODLE_CYCLE[i % DOODLE_CYCLE.length];
          return (
            <motion.li
              key={item.id}
              layout
              initial={reduced ? false : { opacity: 0, y: 22 }}
              animate={{ opacity: dim ? 0.32 : 1, y: 0, scale: dim ? 0.985 : 1 }}
              transition={{ duration: 0.45, delay: i * 0.05, ease }}
              className="min-w-0"
            >
              <MagneticCard
                open={open}
                reduced={reduced}
                controls={`${deckId}-stage`}
                onClick={() => setOpenId(open ? null : item.id)}
                className={cn(
                  "expand-card group relative isolate flex h-full min-h-[228px] w-full flex-col overflow-hidden p-6 text-left md:min-h-[268px] md:p-7",
                  open && "is-open"
                )}
              >
                <span className="expand-card__glow" aria-hidden />
                <ThemeDoodle
                  id={doodle}
                  className="pointer-events-none absolute -bottom-6 -right-4 h-28 w-28 opacity-[0.14] md:h-36 md:w-36"
                  rotate={i % 2 === 0 ? -8 : 10}
                />
                <span
                  className="pointer-events-none absolute -right-1 -top-5 select-none font-mono text-[5.5rem] font-semibold leading-none opacity-[0.08] md:text-[6.5rem]"
                  aria-hidden
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="relative z-10 flex items-start justify-between gap-4">
                  {item.kicker ? (
                    <p className="expand-card__kicker font-mono text-[10px] uppercase tracking-[0.22em]">
                      {item.kicker}
                    </p>
                  ) : (
                    <span />
                  )}
                  <span className="expand-card__plus grid h-8 w-8 shrink-0 place-items-center">
                    <Plus size={14} strokeWidth={2.2} />
                  </span>
                </div>

                <h3
                  className={cn(
                    "display relative z-10 mt-8 text-[1.65rem] leading-[0.95] md:text-[1.95rem]",
                    item.quote && "display-italic text-[1.25rem] leading-snug md:text-[1.4rem]"
                  )}
                >
                  {item.quote ? `“${item.title}”` : item.title}
                </h3>

                <p className="expand-card__summary relative z-10 mt-4 line-clamp-3 text-sm leading-relaxed">
                  {item.summary}
                </p>

                <p className="expand-card__cta relative z-10 mt-auto pt-6 font-mono text-[10px] uppercase tracking-[0.2em]">
                  {open ? "Close brief" : "Open brief"}
                </p>
              </MagneticCard>
            </motion.li>
          );
        })}
      </ul>

      <div
        id={`${deckId}-stage`}
        ref={stageRef}
        className="mt-4 min-h-[4px]"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        <AnimatePresence mode="wait">
          {active ? (
            <motion.article
              key={active.id}
              role="region"
              aria-label={`Brief for ${active.title}`}
              initial={reduced ? false : { opacity: 0, y: 24, clipPath: "inset(8% 0 92% 0)" }}
              animate={{ opacity: 1, y: 0, clipPath: "inset(0% 0 0% 0)" }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: 12, clipPath: "inset(0 0 100% 0)" }}
              transition={{ duration: 0.5, ease }}
              className="expand-stage"
            >
              <div className="expand-stage__rule" aria-hidden />

              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--accent-2)]">
                  Brief {String(activeIndex + 1).padStart(2, "0")} /{" "}
                  {String(items.length).padStart(2, "0")}
                  {active.kicker && !/^\d+$/.test(active.kicker) ? ` · ${active.kicker}` : ""}
                </p>
                <div className="flex items-center gap-2">
                  {items.length > 1 ? (
                    <>
                      <button
                        type="button"
                        onClick={() => openAt(activeIndex - 1)}
                        className="focus-ring grid h-9 w-9 place-items-center border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--text-primary)] hover:text-[var(--text-primary)]"
                        aria-label="Previous brief"
                        data-cursor="link"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => openAt(activeIndex + 1)}
                        className="focus-ring grid h-9 w-9 place-items-center border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--text-primary)] hover:text-[var(--text-primary)]"
                        aria-label="Next brief"
                        data-cursor="link"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => setOpenId(null)}
                    className="focus-ring inline-flex items-center gap-2 border border-[var(--border-strong)] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)]"
                    data-cursor="link"
                  >
                    <X size={12} /> Close
                  </button>
                </div>
              </div>

              <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:items-start">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
                    At a glance
                  </p>
                  <h3
                    className={cn(
                      "display mt-3 text-4xl leading-[0.92] md:text-5xl",
                      active.quote && "display-italic text-3xl leading-snug md:text-4xl"
                    )}
                  >
                    {active.quote ? `“${active.title}”` : active.title}
                  </h3>
                  <p className="mt-5 max-w-md text-[15px] leading-relaxed text-[var(--text-secondary)]">
                    {active.summary}
                  </p>
                  <div className="mt-6 hidden gap-2 lg:flex">
                    {items.map((item, i) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setOpenId(item.id)}
                        className={cn(
                          "font-mono text-[10px] uppercase tracking-[0.16em] transition-opacity",
                          i === activeIndex ? "text-[var(--text-primary)]" : "text-[var(--text-muted)] opacity-50 hover:opacity-100"
                        )}
                      >
                        {String(i + 1).padStart(2, "0")}
                        {i < items.length - 1 ? <span className="mx-2 opacity-40">/</span> : null}
                      </button>
                    ))}
                  </div>
                  <p className="mt-6 text-[11px] text-[var(--text-muted)]">
                    Swipe or ← → to switch · Esc to close
                  </p>
                </div>
                <div className="expand-stage__copy">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--accent-2)]">
                    The brief
                  </p>
                  <BriefCopy text={active.detail} reduced={reduced} />
                  <p className="mt-8 border-t border-[var(--border)] pt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
                    Education · not a product push
                  </p>
                </div>
              </div>
            </motion.article>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
