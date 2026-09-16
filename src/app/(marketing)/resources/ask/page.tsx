import { PageShell } from "@/components/layout/PageShell";
import { EditorialPageHero } from "@/components/layout/EditorialPageHero";
import { PageSection } from "@/components/layout/PageSection";
import { PageEndCta } from "@/components/layout/PageEndCta";
import { ContactForm } from "@/components/brand/ContactForm";
import { FinanceDisclaimer } from "@/components/brand/Disclaimer";

export const metadata = {
  title: "Ask a Finance Question",
  description:
    "Ask Dr. George Antony a finance or investing question — educational reply, not a product pitch.",
};

export default function AskFinancePage() {
  return (
    <PageShell>
      <EditorialPageHero
        index="05 / 07"
        eyebrow="Ask a Finance Question"
        title={
          <>
            One
            <br />
            clear ask
          </>
        }
        meta="Education only"
        description="Write the situation in plain language — salary, EMI, SIP, or a concept you cannot unstick. You will get an educational reply, not a recommendation to buy."
        crumbs={[
          { href: "/resources", label: "Resources" },
          { label: "Ask" },
        ]}
      />

      <FinanceDisclaimer className="mt-10" />

      <PageSection index="01" eyebrow="Inbox" title="Your question" flush>
        <ContactForm topic="Finance question" heading="Ask finance" />
      </PageSection>

      <PageEndCta
        title={
          <>
            Prefer
            <br />
            a room?
          </>
        }
        primary={{ href: "/academy", label: "Academy" }}
        secondary={{ href: "/services", label: "Services" }}
      />
    </PageShell>
  );
}
