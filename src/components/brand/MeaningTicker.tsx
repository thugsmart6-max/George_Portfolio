"use client";

const PHRASES = [
  "PURPOSEFUL Wealth",
  "CREATING Assets",
  "Narrative through Thinking",
  "WITH Meaning",
  "PURPOSEFUL Wealth",
  "CREATING Assets",
  "Narrative through Thinking",
  "WITH Meaning",
];

export function MeaningTicker() {
  const loop = [...PHRASES, ...PHRASES];
  return (
    <section className="overflow-hidden border-y border-[var(--border)] py-8 sm:py-10 md:py-14">
      <div className="ticker-track gap-6 px-4 sm:gap-10">
        {loop.map((p, i) => (
          <span
            key={`${p}-${i}`}
            className="display whitespace-nowrap text-2xl uppercase tracking-[-0.03em] sm:text-4xl md:text-6xl lg:text-7xl"
          >
            {p}
            <span className="mx-8 text-[var(--accent-2)]">/</span>
          </span>
        ))}
      </div>
      <p className="mt-6 text-center text-[11px] uppercase tracking-[0.28em] text-[var(--text-muted)]">
        Narrative through enterprise
      </p>
    </section>
  );
}
