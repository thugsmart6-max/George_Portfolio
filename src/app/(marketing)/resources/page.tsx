import Link from "next/link";
import { BOOKS } from "@/lib/brand";
import { RESOURCE_ITEMS } from "@/lib/site";
import { PageShell } from "@/components/layout/PageShell";
import { EditorialPageHero } from "@/components/layout/EditorialPageHero";
import { PageSection } from "@/components/layout/PageSection";
import { PageTraverse } from "@/components/layout/PageTraverse";
import { PageEndCta } from "@/components/layout/PageEndCta";
import { ResourceFlow } from "@/components/brand/ResourceFlow";
import { FinanceDisclaimer } from "@/components/brand/Disclaimer";
import { TradeQuote } from "@/components/resources/TradeQuote";
import { StockSearch } from "@/components/resources/StockSearch";

export const metadata = {
  title: "Resources",
  description:
    "Free resources — e-book, calculators, planner, investment tracker, equity analysis, and ask a finance question.",
};

export default function ResourcesPage() {
  return (
    <PageShell>
      <EditorialPageHero
        index="05 / 07"
        eyebrow="Resources"
        title={<TradeQuote variant="hero" />}
        titleVariant="quote"
        meta="E-book · Calculator · Planner · Tracker · Analysis"
        description="Everything here is for awareness. Start with the Debt → SIP → Investment flow, then open a tool."
        crumbs={[{ label: "Resources" }]}
        action={{ href: "/resources/analysis", label: "Analysis" }}
      />

      <FinanceDisclaimer className="mt-10" />

      <PageSection index="00" eyebrow="Analysis" title="A specific stock" flush>
        <StockSearch />
      </PageSection>

      <PageSection index="01" eyebrow="The flow" title="Debt → SIP → Investment">
        <ResourceFlow />
      </PageSection>

      <PageSection index="02" eyebrow="Library" title="Open a tool">
        <ul className="grid gap-0 border border-[var(--border)] sm:grid-cols-2 lg:grid-cols-3">
          {RESOURCE_ITEMS.map((item, i) => (
            <li
              key={item.title}
              className="border-[var(--border)] sm:-ml-px sm:-mt-px sm:border"
            >
              <Link
                href={item.href}
                data-cursor="link"
                className="group block h-full p-6 transition-colors hover:bg-[var(--surface)] md:p-8"
              >
                <p className="font-mono text-[11px] text-[var(--text-muted)]">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <p className="display mt-4 text-2xl group-hover:text-[var(--accent-2)] md:text-3xl">
                  {item.title}
                </p>
                <p className="mt-3 text-sm text-[var(--text-secondary)]">
                  {item.line}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </PageSection>

      <PageSection id="ebook" index="03" eyebrow="E-Book" title="Free to read">
        <ul className="grid gap-4 md:grid-cols-3">
          {BOOKS.map((book) => (
            <li key={book.n} className="border border-[var(--border)] p-6">
              <p className="font-mono text-[11px] text-[var(--text-muted)]">
                {book.n} · {book.status.replace("_", " ")}
              </p>
              <p className="display mt-3 text-2xl">{book.title}</p>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                {book.blurb}
              </p>
            </li>
          ))}
        </ul>
      </PageSection>

      <PageTraverse current="/resources" />
      <PageEndCta
        title={
          <>
            Ask
            <br />
            a question
          </>
        }
        primary={{ href: "/resources/ask", label: "Ask finance" }}
        secondary={{ href: "/gallery", label: "Gallery" }}
      />
    </PageShell>
  );
}
