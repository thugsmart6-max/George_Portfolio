import Link from "next/link";

const EXPERIMENTS = [
  {
    n: "01",
    title: "SIP & Lumpsum",
    blurb: "Monthly discipline or one-shot growth.",
    href: "/calculators",
  },
  {
    n: "02",
    title: "Brokerage",
    blurb: "Delivery & intraday charge estimate.",
    href: "/calculators",
  },
  {
    n: "03",
    title: "Margin",
    blurb: "See capital needed for exposure.",
    href: "/calculators",
  },
  {
    n: "04",
    title: "EMI Truth",
    blurb: "What a loan really costs.",
    href: "/calculators",
  },
  {
    n: "05",
    title: "Advice Pillars",
    blurb: "Mindset first. India / TN lens.",
    href: "/advice",
  },
];

export function CreativeBreak() {
  return (
    <section className="border-y border-[var(--border)] bg-[var(--bg-secondary)] py-16 sm:py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-5 md:px-10">
        <div className="grid gap-6 sm:gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-end">
          <div>
            <p className="eyebrow">Creative break</p>
            <h2 className="display mt-4 text-3xl uppercase sm:text-4xl md:text-6xl">
              Short,
              <br />
              <span className="display-italic normal-case">experimental</span>
              <br />
              tools
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-[var(--text-secondary)] md:text-base">
            Small-scale visual utility — calculators and advice fragments that
            sharpen decisions without becoming a tracker.
          </p>
        </div>

        <ul className="mt-12 grid gap-3 sm:mt-16 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {EXPERIMENTS.map((e) => (
            <li key={e.n}>
              <Link
                href={e.href}
                data-cursor="link"
                className="group block border border-[var(--border)] bg-[var(--bg-primary)] p-6 transition-transform hover:-translate-y-1"
              >
                <p className="font-mono text-[11px] text-[var(--text-muted)]">
                  {e.n}
                </p>
                <p className="display mt-4 text-3xl group-hover:text-[var(--accent-2)]">
                  {e.title}
                </p>
                <p className="mt-3 text-sm text-[var(--text-secondary)]">
                  {e.blurb}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
