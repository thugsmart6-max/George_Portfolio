import { GALLERY_SLOTS } from "@/lib/site";
import { PageShell } from "@/components/layout/PageShell";
import { EditorialPageHero } from "@/components/layout/EditorialPageHero";
import { PageSection } from "@/components/layout/PageSection";
import { PageTraverse } from "@/components/layout/PageTraverse";
import { PageEndCta } from "@/components/layout/PageEndCta";
import { EditorialPortrait } from "@/components/brand/EditorialPortrait";
import { FOUNDER } from "@/lib/media";
import { BRAND } from "@/lib/brand";

export const metadata = {
  title: "Media / Gallery",
  description:
    "Event, seminar, and public-speaking gallery — professional photo shoot planned for 30 October.",
};

export default function GalleryPage() {
  return (
    <PageShell>
      <EditorialPageHero
        index="06 / 07"
        eyebrow="Media / Gallery"
        title={
          <>
            Frames
            <br />
            incoming
          </>
        }
        meta="Events · Seminars · Stage · Studio"
        description="A professional shoot is planned within 30 days — target 30 October. These slots hold the structure until the files land."
        crumbs={[{ label: "Gallery" }]}
        action={{ href: "/contact", label: "Invite a camera" }}
      />

      <PageSection index="01" eyebrow="Now" title="Working portraits" flush>
        <div className="grid gap-6 md:grid-cols-2">
          <EditorialPortrait
            src={FOUNDER.portrait}
            alt={BRAND.name}
            caption="Current still"
            meta="Studio pending"
            index="A"
            variant="film"
            objectPosition="center top"
          />
          <EditorialPortrait
            src={FOUNDER.alt}
            alt={`${BRAND.name} alternate frame`}
            caption="Alternate still"
            meta="Until 30 Oct"
            index="B"
            variant="film"
          />
        </div>
      </PageSection>

      <PageSection index="02" eyebrow="Planned" title="What we will hang">
        <ul className="grid gap-0 border border-[var(--border)] sm:grid-cols-2">
          {GALLERY_SLOTS.map((slot, i) => (
            <li
              key={slot.id}
              id={slot.id}
              className={`min-h-[220px] border-[var(--border)] p-6 sm:border ${
                i > 0 ? "border-t sm:-ml-px sm:-mt-px" : ""
              }`}
            >
              <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--accent-2)]">
                {slot.status}
              </p>
              <p className="display mt-4 text-3xl">{slot.title}</p>
              <p className="mt-3 max-w-sm text-sm text-[var(--text-secondary)]">
                {slot.note}
              </p>
            </li>
          ))}
        </ul>
      </PageSection>

      <PageTraverse current="/gallery" />
      <PageEndCta
        title={
          <>
            Write
            <br />
            anyway
          </>
        }
        primary={{ href: "/contact", label: "Contact Us" }}
        secondary={{ href: "/resources", label: "Resources" }}
      />
    </PageShell>
  );
}
