import { cn } from "@/lib/utils";
import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id || props.name;
    return (
      <label className="block space-y-2" htmlFor={inputId}>
        {label ? (
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
            {label}
          </span>
        ) : null}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "focus-ring w-full border-b border-[var(--border-strong)] bg-transparent px-0 py-3 text-base text-[var(--text-primary)] placeholder:text-[var(--text-muted)] transition-colors focus:border-[var(--accent)]",
            error && "border-[var(--danger)]",
            className
          )}
          {...props}
        />
        {error ? <span className="text-xs text-[var(--danger)]">{error}</span> : null}
      </label>
    );
  }
);
Input.displayName = "Input";
