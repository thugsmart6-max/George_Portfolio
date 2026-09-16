import Link from "next/link";
import { SERVICE_GROUPS } from "@/lib/site";
import { PageShell } from "@/components/layout/PageShell";
import { EditorialPageHero } from "@/components/layout/EditorialPageHero";
import { PageSection } from "@/components/layout/PageSection";
import { PageTraverse } from "@/components/layout/PageTraverse";
import { PageEndCta } from "@/components/layout/PageEndCta";
import { ChapterRail } from "@/components/layout/ChapterRail";
import { ExpandCards } from "@/components/ui/ExpandCards";

export const metadata = {
  title: "Services",
  description:
    "Services for investors, students, and businesses — portfolio review, financial literacy, workshops, and guest speaking.",
};

export default function ServicesPage() {
  return (
    <PageShell>
      <ChapterRail
        items={SERVICE_GROUPS.map((g) => ({
          id: g.slug,
          label: g.title,
        }))}
      />

      <EditorialPageHero
        index="02 / 07"
        eyebrow="Services"
        title={
          <>
            Three
            <br />
            rooms
          </>
        }
        meta="Investors · Students · Business"
        description="Education-shaped work. Reviews and rooms that leave you with a decision — not a brochure. Open a card for the brief."
        crumbs={[{ label: "Services" }]}
        action={{ href: "/contact", label: "Get Started" }}
      />

      {SERVICE_GROUPS.map((group, gi) => (
        <PageSection
          key={group.slug}
          id={group.slug}
          index={String(gi + 1).padStart(2, "0")}
          eyebrow={group.blurb}
          title={group.title}
          flush={gi === 0}
        >
          <ExpandCards
            items={group.items.map((item, i) => ({
              id: `${group.slug}-${item.title}`,
              kicker: `0${i + 1}`,
              title: item.title,
              summary: item.line,
              detail: item.detail,
            }))}
          />
        </PageSection>
      ))}

      <div className="mt-12 flex flex-wrap gap-3">
        <Link href="/academy" className="btn-primary px-5 py-3 text-[11px]">
          Join the Academy
        </Link>
        <Link href="/resources" className="btn-ghost px-5 py-3 text-[11px] font-semibold">
          Free resources
        </Link>
      </div>

      <PageTraverse current="/services" />
      <PageEndCta
        title={
          <>
            Learn it
            <br />
            properly
          </>
        }
        primary={{ href: "/academy", label: "Join the Academy" }}
        secondary={{ href: "/contact", label: "Contact Us" }}
      />
    </PageShell>
  );
}
