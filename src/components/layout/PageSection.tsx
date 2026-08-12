type Props = {
  index?: string;
  eyebrow?: string;
  title?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  /** Skip top border + default section spacing (for first content block). */
  flush?: boolean;
  id?: string;
};

export function PageSection({
  index,
  eyebrow,
  title,
  children,
  className = "",
  flush = false,
  id,
}: Props) {
  return (
    <section
      id={id}
      className={`${
        flush
          ? "mt-12 md:mt-16"
          : "mt-20 border-t border-[var(--border)] pt-14 md:mt-28 md:pt-20"
      } ${className}`}
    >
      {(eyebrow || title || index) && (
        <div className="mb-10 grid gap-4 md:grid-cols-[88px_1fr] md:items-end">
          {index ? (
            <p className="font-mono text-[11px] tracking-[0.2em] text-[var(--text-muted)]">
              {index}
            </p>
          ) : (
            <span />
          )}
          <div>
            {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
            {title ? (
              <h2 className="display mt-2 text-3xl uppercase md:text-5xl">
                {title}
              </h2>
            ) : null}
          </div>
        </div>
      )}
      {children}
    </section>
  );
}
