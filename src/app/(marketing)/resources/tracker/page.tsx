import { PageShell } from "@/components/layout/PageShell";
import { EditorialPageHero } from "@/components/layout/EditorialPageHero";
import { PageSection } from "@/components/layout/PageSection";
import { PageEndCta } from "@/components/layout/PageEndCta";
import { AliceConnect } from "@/components/resources/AliceConnect";
import { TrackerDesk } from "@/components/resources/TrackerDesk";
import { FinanceDisclaimer } from "@/components/brand/Disclaimer";
import { TradeQuote } from "@/components/resources/TradeQuote";

export const metadata = {
  title: "Investment Tracker",
  description:
    "NSE equity mark-to-market book: Alice Blue holdings, dated lots, realized vs unrealized, XIRR when cash-flows exist. Teaching only — not registered advice.",
};

export default function TrackerPage() {
  return (
    <PageShell>
      <EditorialPageHero
        index="05 / 07"
        eyebrow="Investment Tracker"
        title={
          <>
            Mark
            <br />
            to market
          </>
        }
        meta="Read-only Alice Blue · NSE equity · Dated lots"
        quote={<TradeQuote />}
        description="One NSE equity book. Alice Blue marks live names to LTP. Dated lots in this browser add fees, sells, and XIRR. Not tax, not a full portfolio app."
        crumbs={[
          { href: "/resources", label: "Resources" },
          { label: "Tracker" },
        ]}
        action={{ href: "/resources/analysis", label: "Analysis" }}
      />

      <FinanceDisclaimer className="mt-10" />

      <PageSection index="01" eyebrow="Broker feed" title="Connect Alice Blue">
        <AliceConnect next="/resources/tracker" />
      </PageSection>

      <PageSection index="02" eyebrow="One book" title="Desk">
        <TrackerDesk />
      </PageSection>

      <PageEndCta
        title={
          <>
            Read
            <br />
            the business
          </>
        }
        primary={{ href: "/resources/analysis", label: "Equity analysis" }}
        secondary={{ href: "/planner", label: "Planner" }}
      />
    </PageShell>
  );
}
