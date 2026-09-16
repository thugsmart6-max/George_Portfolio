import { FinanceCalculators } from "@/components/calculators/FinanceCalculators";
import { PageShell } from "@/components/layout/PageShell";
import { EditorialPageHero } from "@/components/layout/EditorialPageHero";
import { PageSection } from "@/components/layout/PageSection";
import { PageTraverse } from "@/components/layout/PageTraverse";
import { PageEndCta } from "@/components/layout/PageEndCta";
import { FinanceDisclaimer } from "@/components/brand/Disclaimer";

export const metadata = {
  title: "Calculators",
  description:
    "SIP, Lumpsum, SWP, GST, EMI, Brokerage, and Margin calculators by Dr. George Antony — Wealth By George.",
};

export default async function CalculatorsPage({
  searchParams,
}: {
  searchParams: Promise<{ tool?: string }>;
}) {
  const params = await searchParams;
  const tool = params.tool?.toLowerCase();
  const initial =
    tool === "sip" ||
    tool === "swp" ||
    tool === "gst" ||
    tool === "emi" ||
    tool === "brokerage" ||
    tool === "margin" ||
    tool === "lumpsum"
      ? tool
      : "sip";

  return (
    <PageShell>
      <EditorialPageHero
        index="05 / 07"
        eyebrow="Resources · Calculator"
        title={
          <>
            Financial
            <br />
            calculators
          </>
        }
        meta="SIP / Lumpsum · SWP · GST · EMI · Brokerage · Margin"
        description="One formula at a time. Open the planner when SIP and SWP need to talk to each other."
        crumbs={[
          { href: "/resources", label: "Resources" },
          { label: "Calculator" },
        ]}
        action={{ href: "/planner", label: "Planner" }}
      />

      <FinanceDisclaimer className="mt-10" />

      <PageSection
        index="01"
        eyebrow="Workbench"
        title="Run the numbers"
        flush
      >
        <FinanceCalculators initial={initial} />
      </PageSection>

      <PageSection index="02" eyebrow="Mindset" title="Math with meaning">
        <div className="flex flex-wrap items-end justify-between gap-6 border border-[var(--border)] p-6 md:p-8">
          <p className="max-w-xl text-sm text-[var(--text-secondary)] md:text-base">
            Want the chart and the business in one desk? Open the merged equity
            research framework, then mark holdings to market in the tracker.
          </p>
          <a
            href="/resources/analysis"
            className="btn-ghost px-5 py-3 text-[11px] font-semibold"
          >
            Equity analysis
          </a>
        </div>
      </PageSection>

      <PageTraverse current="/resources" />

      <PageEndCta
        title={
          <>
            Ready to
            <br />
            talk?
          </>
        }
        primary={{ href: "/contact", label: "Contact Us" }}
        secondary={{ href: "/resources/analysis", label: "Analysis" }}
      />
    </PageShell>
  );
}
