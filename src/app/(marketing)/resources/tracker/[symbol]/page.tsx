import { PageShell } from "@/components/layout/PageShell";
import { EditorialPageHero } from "@/components/layout/EditorialPageHero";
import { PageSection } from "@/components/layout/PageSection";
import { PageEndCta } from "@/components/layout/PageEndCta";
import { AliceConnect } from "@/components/resources/AliceConnect";
import { TrackerPosition } from "@/components/resources/TrackerPosition";
import { FinanceDisclaimer } from "@/components/brand/Disclaimer";
import { nseKey } from "@/lib/tracker-book";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ symbol: string }>;
}) {
  const { symbol } = await params;
  const key = nseKey(decodeURIComponent(symbol));
  return {
    title: key ? `${key} · Tracker` : "Holding · Tracker",
    description: `NSE holding book for ${key || "this name"}: lots, realized vs unrealized, XIRR when dates exist.`,
  };
}

export default async function TrackerHoldingPage({
  params,
}: {
  params: Promise<{ symbol: string }>;
}) {
  const { symbol } = await params;
  const key = nseKey(decodeURIComponent(symbol));

  return (
    <PageShell>
      <EditorialPageHero
        index="05 / 07"
        eyebrow="Holding"
        title={
          <>
            {key || "Name"}
            <br />
            book
          </>
        }
        meta="Dated lots · Alice LTP · XIRR when cash-flows exist"
        description="One NSE name. Live qty from Alice if connected. Typed lots keep buy dates so XIRR is honest. Not tax."
        crumbs={[
          { href: "/resources", label: "Resources" },
          { href: "/resources/tracker", label: "Tracker" },
          { label: key || "Holding" },
        ]}
        action={{ href: `/resources/analysis?stock=${encodeURIComponent(key)}`, label: "Analysis" }}
      />

      <FinanceDisclaimer className="mt-10" />

      <PageSection index="01" eyebrow="Broker" title="Connect">
        <AliceConnect next={`/resources/tracker/${encodeURIComponent(key)}`} />
      </PageSection>

      <PageSection index="02" eyebrow="Position" title={key || "Lots"}>
        <TrackerPosition symbol={key} />
      </PageSection>

      <PageEndCta
        title={
          <>
            Back to
            <br />
            the book
          </>
        }
        primary={{ href: "/resources/tracker", label: "Investment tracker" }}
        secondary={{ href: "/resources/analysis", label: "Equity analysis" }}
      />
    </PageShell>
  );
}
