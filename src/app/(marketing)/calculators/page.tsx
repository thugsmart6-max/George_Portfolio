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

export default function CalculatorsPage() {
  return (
    <PageShell>
      <EditorialPageHero
        index="05 / 06"
        eyebrow="Creative break · Tools"
        title={
          <>
            Financial
            <br />
            calculators
          </>
        }
        meta="SIP · Lumpsum · SWP · GST · EMI · Brokerage · Margin"
        description="Groww-style clarity for investing, trading costs, margin, tax, and loans — built for awareness, not account tracking."
        crumbs={[{ label: "Tools" }]}
        action={{ href: "/advice", label: "Mindset first" }}
      />

      <FinanceDisclaimer className="mt-10" />

      <PageSection
        index="01"
        eyebrow="Workbench"
        title="Run the numbers"
        flush
      >
        <FinanceCalculators />
      </PageSection>

      <PageSection index="02" eyebrow="Mindset" title="Math with meaning">
        <div className="flex flex-wrap items-end justify-between gap-6 border border-[var(--border)] p-6 md:p-8">
          <p className="max-w-xl text-sm text-[var(--text-secondary)] md:text-base">
            Want mindset with the math? Read the advice pillars shaped for Tamil
            Nadu and India builders.
          </p>
          <a
            href="/advice"
            className="btn-ghost px-5 py-3 text-[11px] font-semibold"
          >
            Advice pillars
          </a>
        </div>
      </PageSection>

      <PageTraverse current="/calculators" />

      <PageEndCta
        title={
          <>
            Ready to
            <br />
            talk?
          </>
        }
        primary={{ href: "/contact", label: "Say hi" }}
        secondary={{ href: "/advice", label: "Advice" }}
      />
    </PageShell>
  );
}
