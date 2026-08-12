import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { EditorialHero } from "@/components/brand/EditorialHero";
import { MeaningTicker } from "@/components/brand/MeaningTicker";
import { FeaturedWorks } from "@/components/brand/FeaturedWorks";
import { ContentShowcase } from "@/components/brand/ContentShowcase";
import { CreativeBreak } from "@/components/brand/CreativeBreak";
import { SITE_CHAPTERS } from "@/components/layout/PageTraverse";

export default function HomePage() {
  return (
    <div className="overflow-x-hidden">
      <EditorialHero />
      <MeaningTicker />

      <section className="border-y border-[var(--border)]">
        <div className="mx-auto grid max-w-[1400px] grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          {SITE_CHAPTERS.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              data-cursor="link"
              className="group border-b border-r border-[var(--border)] p-4 transition-colors hover:bg-[var(--surface)] sm:p-5"
            >
              <p className="font-mono text-[10px] text-[var(--text-muted)]">
                {c.index}
              </p>
              <p className="display mt-2 text-lg uppercase group-hover:text-[var(--accent-2)] sm:text-xl md:text-2xl">
                {c.label}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-[1400px] gap-6 px-4 py-14 sm:gap-8 sm:px-5 sm:py-16 md:grid-cols-[88px_1fr] md:px-10 md:py-20">
        <p className="font-mono text-[11px] tracking-[0.2em] text-[var(--text-muted)]">
          01
        </p>
        <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
          {[
            ["Precisely", "Refined selection"],
            ["Focused", "Visual showcase"],
            ["Carefully", "Chosen narratives"],
          ].map(([a, b]) => (
            <div key={a} className="border-t border-[var(--border)] pt-5">
              <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
                {a}
              </p>
              <p className="display mt-2 text-2xl sm:text-3xl md:text-4xl">{b}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-[1400px] px-4 sm:px-5 md:px-10">
        <div className="flex items-end gap-4 border-b border-[var(--border)] pb-5 sm:gap-6 sm:pb-6">
          <p className="font-mono text-[11px] tracking-[0.2em] text-[var(--text-muted)]">
            02
          </p>
          <p className="eyebrow">Featured ecosystem</p>
        </div>
      </div>
      <FeaturedWorks />

      <ContentShowcase />

      <div className="mx-auto max-w-[1400px] px-4 sm:px-5 md:px-10">
        <div className="flex items-end gap-4 border-b border-[var(--border)] pb-5 sm:gap-6 sm:pb-6">
          <p className="font-mono text-[11px] tracking-[0.2em] text-[var(--text-muted)]">
            03
          </p>
          <p className="eyebrow">Creative break</p>
        </div>
      </div>
      <CreativeBreak />

      <section className="mx-auto grid max-w-[1400px] gap-10 px-4 py-16 sm:gap-12 sm:px-5 sm:py-20 md:grid-cols-[88px_0.85fr_1.15fr] md:px-10 md:py-28">
        <p className="font-mono text-[11px] tracking-[0.2em] text-[var(--text-muted)]">
          04
        </p>
        <div>
          <p className="eyebrow">About George</p>
          <h2 className="display mt-4 text-4xl uppercase sm:text-5xl md:text-7xl">
            Who&apos;s
            <br />
            this?
          </h2>
          <p className="mt-6 text-[11px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
            Hello, hi, hey
          </p>
        </div>
        <div>
          <p className="display-italic text-2xl leading-snug sm:text-3xl md:text-4xl">
            “{BRAND.philosophy}”
          </p>
          <p className="mt-8 max-w-xl text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
            Founder of {BRAND.holding}. Creator of {BRAND.brand}. Based in{" "}
            {BRAND.location} — building education, technology, and real-asset
            businesses while teaching wealth mindset across Tamil Nadu and India.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {BRAND.roles.map((r) => (
              <span key={r} className="tag-pill">
                {r}
              </span>
            ))}
            <span className="tag-pill">Storytelling</span>
            <span className="tag-pill">Wealth Thinking</span>
          </div>
          <Link
            href="/about"
            data-cursor="link"
            className="btn-ghost mt-10 inline-flex px-5 py-3 text-[11px] font-semibold"
          >
            About George
          </Link>
        </div>
      </section>

      <section className="invert-block">
        <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-8 px-4 py-16 sm:px-5 sm:py-20 md:flex-row md:items-end md:px-10 md:py-28">
          <div>
            <p className="font-mono text-[11px] tracking-[0.2em] opacity-60">
              05
            </p>
            <p className="mt-4 text-[11px] uppercase tracking-[0.24em] opacity-60">
              Begin
            </p>
            <p className="display mt-4 text-3xl uppercase sm:text-4xl md:text-6xl">
              Want to talk
              <br />
              wealth, building,
              <br />
              <span className="display-italic normal-case">…or collab?</span>
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
            <Link
              href="/calculators"
              data-cursor="cta"
              className="btn-invert justify-center px-6 py-3 text-[11px]"
            >
              Open tools
            </Link>
            <Link
              href="/contact"
              className="btn-invert-ghost justify-center px-6 py-3 text-[11px] font-semibold"
            >
              Say hi
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
