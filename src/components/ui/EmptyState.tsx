import { Button } from "./Button";

interface EmptyStateProps {
  title: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  onCta?: () => void;
}

export function EmptyState({
  title,
  description,
  ctaLabel,
  ctaHref,
  onCta,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center border border-dashed border-[var(--border-strong)] px-8 py-16 text-center">
      <p className="display text-3xl text-[var(--text-primary)] md:text-4xl">
        {title}
      </p>
      {description ? (
        <p className="mt-3 max-w-md text-sm text-[var(--text-secondary)]">
          {description}
        </p>
      ) : null}
      {ctaLabel ? (
        <div className="mt-8">
          {ctaHref ? (
            <Button href={ctaHref}>{ctaLabel}</Button>
          ) : (
            <Button onClick={onCta}>{ctaLabel}</Button>
          )}
        </div>
      ) : null}
    </div>
  );
}
