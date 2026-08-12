import Link from "next/link";
import { BOOKS, BRAND } from "@/lib/brand";
import { PageShell } from "@/components/layout/PageShell";
import { EditorialPageHero } from "@/components/layout/EditorialPageHero";
import { PageSection } from "@/components/layout/PageSection";
import { PageTraverse } from "@/components/layout/PageTraverse";
import { PageEndCta } from "@/components/layout/PageEndCta";

export const metadata = { title: "Books" };

export default function BooksPage() {
  return (
    <PageShell>
      <EditorialPageHero
        index="03 / 06"
        eyebrow="Library"
        title={
          <>
            Three
            <br />
            books
          </>
        }
        meta="Coming soon · Titles provisional"
        description="Working titles below — final names and covers lock before publication. Mindset, enterprise, and the personal operating system of builders."
        crumbs={[{ label: "Books" }]}
        action={{ href: "/contact", label: "Inquire" }}
      />

      <div className="mt-10 grid gap-0 border border-[var(--border)] md:grid-cols-[1.2fr_0.8fr]">
        <div className="border-b border-[var(--border)] p-6 md:border-b-0 md:border-r md:p-8">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--warning)]">
            Production status
          </p>
          <p className="display mt-3 text-3xl md:text-4xl">
            Covers TBD · Not yet for sale
          </p>
          <p className="mt-4 max-w-lg text-sm text-[var(--text-secondary)]">
            Manuscripts in development. Titles and artwork remain provisional until
            publication.
          </p>
        </div>
        <div className="grid grid-cols-3">
          {BOOKS.map((b, i) => (
            <a
              key={b.n}
              href={`#book-${b.n}`}
              className={`p-5 transition-colors hover:bg-[var(--surface)] ${
                i > 0 ? "border-l border-[var(--border)]" : ""
              }`}
            >
              <p className="font-mono text-[11px] text-[var(--text-muted)]">{b.n}</p>
              <p className="display mt-3 text-xl leading-none md:text-2xl">
                {b.title}
              </p>
            </a>
          ))}
        </div>
      </div>

      <PageSection
        index="01"
        eyebrow="Manuscripts"
        title="Curated narratives"
        flush
      >
        <ul className="space-y-0">
          {BOOKS.map((book, i) => (
            <li
              key={book.n}
              id={`book-${book.n}`}
              className="grid scroll-mt-28 gap-8 border-t border-[var(--border)] py-14 md:grid-cols-[200px_1fr] lg:grid-cols-[240px_1.1fr_0.9fr]"
            >
              <div className="relative flex min-h-[300px] flex-col justify-between border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
                <div className="flex justify-between">
                  <span className="font-mono text-[11px]">{book.n}</span>
                  <span className="text-[9px] uppercase tracking-[0.16em] text-[var(--warning)]">
                    Soon
                  </span>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
                    Cover TBD
                  </p>
                  <p className="display mt-2 text-4xl leading-none">{book.title}</p>
                </div>
                <p className="font-mono text-[11px] text-[var(--text-muted)]">
                  Vol. {i + 1} / {BOOKS.length}
                </p>
              </div>

              <div className="flex flex-col justify-center">
                <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
                  {book.subtitle}
                </p>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--text-secondary)] md:text-lg">
                  {book.blurb}
                </p>
              </div>

              <div className="flex flex-col justify-center border border-[var(--border)] bg-[var(--surface)] p-6 md:col-span-2 lg:col-span-1 lg:border-0 lg:bg-transparent lg:p-0">
                <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
                  Themes
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {book.topics.map((t) => (
                    <span key={t} className="tag-pill">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </li>
          ))}
          <li className="border-t border-[var(--border)]" />
        </ul>
      </PageSection>

      <PageSection index="02" eyebrow="Inquire" title="Editions & speaking">
        <div className="grid gap-8 border border-[var(--border)] p-8 md:grid-cols-[1fr_auto] md:items-end md:p-10">
          <p className="max-w-xl text-sm leading-relaxed text-[var(--text-secondary)] md:text-base">
            For pre-orders, bulk editions, or speaking tied to the books — write
            to{" "}
            <a
              href={`mailto:${BRAND.email}`}
              className="text-[var(--text-primary)] underline underline-offset-4"
            >
              {BRAND.email}
            </a>
            .
          </p>
          <Link
            href="/advice"
            className="text-[11px] font-semibold uppercase tracking-[0.18em]"
          >
            Continue to advice →
          </Link>
        </div>
      </PageSection>

      <PageTraverse current="/books" />

      <PageEndCta
        title={
          <>
            Practice the
            <br />
            mindset
          </>
        }
        primary={{ href: "/advice", label: "Advice pillars" }}
        secondary={{ href: "/contact", label: "Say hi" }}
      />
    </PageShell>
  );
}
