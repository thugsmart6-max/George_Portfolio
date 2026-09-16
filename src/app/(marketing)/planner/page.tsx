import { WealthPlanner } from "@/components/planner/WealthPlanner";
import { PlotTicketMarket } from "@/components/planner/PlotTicketMarket";
import { PageShell } from "@/components/layout/PageShell";
import { EditorialPageHero } from "@/components/layout/EditorialPageHero";
import { PageSection } from "@/components/layout/PageSection";
import { PageTraverse } from "@/components/layout/PageTraverse";
import { PageEndCta } from "@/components/layout/PageEndCta";
import { ChapterRail } from "@/components/layout/ChapterRail";
import { FinanceDisclaimer } from "@/components/brand/Disclaimer";

export const metadata = {
  title: "Wealth Planner",
  description:
    "Goal planner, SIP/SWP corpus, good vs bad debt, salary buffers, inflation, and a plot-selling concept — Wealth By George.",
};

export default function PlannerPage() {
  return (
    <PageShell>
      <ChapterRail
        items={[
          { id: "snapshot", label: "Desk" },
          { id: "investing", label: "Investing" },
          { id: "goal", label: "Goal" },
          { id: "debt", label: "Debt" },
          { id: "savings", label: "Savings" },
          { id: "hustle", label: "Hustle" },
        ]}
      />

      <EditorialPageHero
        index="05 / 07"
        eyebrow="Resources · Planner"
        title={
          <>
            Plan the
            <br />
            number
          </>
        }
        meta="Goal · Debt · Savings · Emergency · SIP / SWP"
        description="One desk: monthly SIP against the SWP corpus you would need, good vs bad debt, salary buffers, and inflation. Numbers update together. Education — not a product sale."
        crumbs={[
          { href: "/resources", label: "Resources" },
          { label: "Planner" },
        ]}
        action={{ href: "/calculators", label: "All calculators" }}
      />

      <FinanceDisclaimer className="mt-10" />

      <PageSection
        index="01"
        eyebrow="Workbench"
        title="Run the plan"
        flush
      >
        <WealthPlanner />
      </PageSection>

      <PageSection
        id="hustle"
        index="02"
        eyebrow="Side income hustle"
        title="Plots like tickets"
      >
        <p className="mb-8 max-w-2xl text-sm leading-relaxed text-[var(--text-secondary)] md:text-base">
          Extra income idea from the notes: intermediating work, then selling
          land with the ease of a ticket counter and the language of a stock.
          This grid is a teaching model — not a live marketplace.
        </p>
        <PlotTicketMarket />
      </PageSection>

      <PageTraverse current="/resources" />

      <PageEndCta
        title={
          <>
            Want the
            <br />
            full toolkit?
          </>
        }
        primary={{ href: "/calculators", label: "Calculators" }}
        secondary={{ href: "/resources/analysis", label: "Analysis" }}
      />
    </PageShell>
  );
}
