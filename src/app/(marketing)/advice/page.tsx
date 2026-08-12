import Link from "next/link";
import { BRAND, TOPICS } from "@/lib/brand";
import { PageShell } from "@/components/layout/PageShell";
import { EditorialPageHero } from "@/components/layout/EditorialPageHero";
import { PageSection } from "@/components/layout/PageSection";
import { PageTraverse } from "@/components/layout/PageTraverse";
import { PageEndCta } from "@/components/layout/PageEndCta";
import { ChapterRail } from "@/components/layout/ChapterRail";
import { FinanceDisclaimer } from "@/components/brand/Disclaimer";

export const metadata = { title: "Financial Advice" };

const pillars = [
  {
    title: "Think in assets",
    body: "Income pays today. Assets pay tomorrow. Shift attention from salary theater to ownership — businesses, skills that compound, and property that endures.",
    example:
      "Chennai example: a ₹40,000 EMI on a depreciating car vs the same EMI toward a small plot or a skill that raises your billing rate — same outflow, different balance sheet.",
  },
  {
    title: "Cash flow before lifestyle",
    body: "Build systems that produce monthly surplus. Then decide lifestyle. The reverse order is why most high earners still feel trapped.",
    example:
      "India reality: festival / wedding spend often wipes 3–6 months of surplus. Set an automatic SIP the day salary credits — lifestyle comes from what’s left.",
  },
  {
    title: "Education is capital",
    body: "Skill compounds like interest. Through Rafzon’s lens: learn what the market pays for — then apply it inside real ventures.",
    example:
      "Tamil Nadu IT & MSME corridors hire for shipping skills, not certificates alone. Delivery becomes an income asset for the family.",
  },
  {
    title: "Use tools, don’t worship them",
    body: "SIP, SWP, EMI, GST — calculators reveal tradeoffs. They don’t replace judgment, goals, or risk capacity.",
    example:
      "Before a personal loan for a wedding, run EMI + total interest. If the number shocks you, redesign the celebration — not your next five years.",
  },
  {
    title: "Communication is a wealth skill",
    body: "Deals, teams, and trust move through words. Presence and clarity are part of your balance sheet.",
    example:
      "A Chennai founder who pitches clearly in Tamil + English closes partners faster — clarity prices as lower risk.",
  },
  {
    title: "Think in decades",
    body: "Thanith’s 2031 horizon is a reminder: durable wealth is a multi-year operating system, not a tip.",
    example:
      "RKR Landmark’s (since 2000) shows the point: real assets compound slower than tips — and outlast them.",
  },
];

export default function AdvicePage() {
  return (
    <PageShell>
      <ChapterRail
        items={pillars.map((p, i) => ({
          id: `pillar-${i + 1}`,
          label: p.title.split(" ").slice(0, 2).join(" "),
        }))}
      />

      <EditorialPageHero
        index="04 / 06"
        eyebrow="Wealth By George"
        title={
          <>
            Mindset
            <br />
            first
          </>
        }
        meta="Educational · Not a tracker"
        description="A teaching practice for builders in Tamil Nadu and across India: how to think, decide, and build — with tools when you need numbers."
        crumbs={[{ label: "Advice" }]}
        action={{ href: "/calculators", label: "Open tools" }}
      />

      <FinanceDisclaimer className="mt-10" />

      <div className="mt-10 grid gap-0 border border-[var(--border)] lg:grid-cols-[1fr_1.4fr]">
        <div className="border-b border-[var(--border)] p-6 lg:border-b-0 lg:border-r lg:p-8">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
            Focus topics
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {TOPICS.map((t) => (
              <span key={t} className="tag-pill">
                {t}
              </span>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3">
          {pillars.map((p, i) => (
            <a
              key={p.title}
              href={`#pillar-${i + 1}`}
              className="border-b border-[var(--border)] p-4 transition-colors hover:bg-[var(--surface)] odd:border-r sm:border-r sm:p-5 sm:[&:nth-child(3n)]:border-r-0"
            >
              <p className="font-mono text-[10px] text-[var(--text-muted)]">
                {String(i + 1).padStart(2, "0")}
              </p>
              <p className="display mt-2 text-lg leading-tight md:text-xl">
                {p.title}
              </p>
            </a>
          ))}
        </div>
      </div>

      <PageSection index="01" eyebrow="Pillars" title="Six ways of thinking" flush>
        <ol>
          {pillars.map((p, i) => (
            <li
              key={p.title}
              id={`pillar-${i + 1}`}
              className="grid scroll-mt-28 gap-6 border-t border-[var(--border)] py-12 md:grid-cols-[80px_1fr_1.2fr]"
            >
              <p className="font-mono text-[11px] text-[var(--text-muted)]">
                {String(i + 1).padStart(2, "0")}
              </p>
              <div>
                <h2 className="display text-3xl md:text-4xl">{p.title}</h2>
                <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)] md:text-base">
                  {p.body}
                </p>
              </div>
              <aside className="border border-[var(--border)] bg-[var(--bg-secondary)] p-5">
                <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--accent-2)]">
                  India / TN lens
                </p>
                <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                  {p.example}
                </p>
              </aside>
            </li>
          ))}
          <li className="border-t border-[var(--border)]" />
        </ol>
      </PageSection>

      <PageSection index="02" eyebrow="Next" title="Practice or go deeper">
        <div className="grid gap-0 md:grid-cols-2">
          <Link
            href="/calculators"
            data-cursor="link"
            className="group border border-[var(--border)] p-8 transition-colors hover:bg-[var(--surface)] md:-mr-px"
          >
            <p className="eyebrow">Practice</p>
            <p className="display mt-4 text-4xl group-hover:text-[var(--accent-2)]">
              Open tools
            </p>
            <p className="mt-3 text-sm text-[var(--text-muted)]">
              SIP · SWP · GST · EMI
            </p>
          </Link>
          <Link
            href="/books"
            data-cursor="link"
            className="group border border-[var(--border)] p-8 transition-colors hover:bg-[var(--surface)]"
          >
            <p className="eyebrow">Library</p>
            <p className="display mt-4 text-4xl group-hover:text-[var(--accent-2)]">
              Books (soon)
            </p>
            <p className="mt-3 text-sm text-[var(--text-muted)]">
              Thinking · Building · Time
            </p>
          </Link>
        </div>
        <p className="mt-10 text-xs text-[var(--text-muted)]">
          Educational content from {BRAND.name}. Not a substitute for a
          SEBI-registered advisor.
        </p>
      </PageSection>

      <PageTraverse current="/advice" />

      <PageEndCta
        title={
          <>
            Run the
            <br />
            numbers
          </>
        }
        primary={{ href: "/calculators", label: "Calculators" }}
        secondary={{ href: "/contact", label: "Ask a question" }}
      />
    </PageShell>
  );
}
