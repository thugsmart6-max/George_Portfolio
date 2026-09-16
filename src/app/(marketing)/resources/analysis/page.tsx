import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { PageEndCta } from "@/components/layout/PageEndCta";
import { FinanceDisclaimer } from "@/components/brand/Disclaimer";
import { AliceConnect } from "@/components/resources/AliceConnect";
import { AliceAnalysisCanvas } from "@/components/resources/AliceAnalysisCanvas";
import { StockSearch } from "@/components/resources/StockSearch";
import { fetchAliceMarketSheet, readAliceSession } from "@/lib/alice-blue";

export const metadata = {
  title: "Equity Research Analysis",
  description:
    "NSE equity sheet with live Alice Blue LTP, chart, and range. Not registered advice.",
};

export default async function AnalysisPage({
  searchParams,
}: {
  searchParams: Promise<{ stock?: string }>;
}) {
  const params = await searchParams;
  const query = (params.stock ?? "KPITTECH").trim() || "KPITTECH";
  const connected = Boolean(await readAliceSession());
  const sheet = query ? await fetchAliceMarketSheet(query).catch(() => null) : null;
  const quote = sheet?.quote ?? null;

  return (
    <PageShell wide>
      <nav className="mb-6 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
        <Link href="/" className="hover:text-[var(--text-primary)]">
          Home
        </Link>
        <span>/</span>
        <Link href="/resources" className="hover:text-[var(--text-primary)]">
          Resources
        </Link>
        <span>/</span>
        <span className="text-[var(--text-primary)]">
          {quote?.symbol ?? query.toUpperCase()}
        </span>
      </nav>

      <AliceConnect
        compact
        next={query ? `/resources/analysis?stock=${encodeURIComponent(query)}` : "/resources/analysis"}
      />

      <div className="mt-6">
        <StockSearch initial={query} compact />
      </div>

      <div className="mt-8">
        <AliceAnalysisCanvas query={query} initialSheet={sheet} aliceConnected={connected} />
      </div>

      <FinanceDisclaimer className="mt-10" />

      <PageEndCta
        title={
          <>
            Mark
            <br />
            to market
          </>
        }
        primary={{ href: "/resources/tracker", label: "Investment tracker" }}
        secondary={{ href: "/academy", label: "Academy" }}
      />
    </PageShell>
  );
}
