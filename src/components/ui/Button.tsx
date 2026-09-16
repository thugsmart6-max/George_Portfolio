"use client";

import { cn } from "@/lib/utils";
import {
  motion,
  useMotionValue,
  useSpring,
  type HTMLMotionProps,
} from "motion/react";
import Link from "next/link";
import { useRef, type ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: Variant;
  href?: string;
  magnetic?: boolean;
  children: ReactNode;
  className?: string;
}

const variants: Record<Variant, string> = {
  primary: "btn-primary",
  secondary: "btn-ghost",
  ghost: "btn-ghost opacity-80",
  danger:
    "border border-[var(--danger)]/40 bg-transparent text-[var(--danger)] hover:bg-[var(--danger)]/10",
};

export function Button({
  variant = "primary",
  href,
  magnetic = true,
  children,
  className,
  ...props
}: ButtonProps) {
  const ref = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 18 });
  const springY = useSpring(y, { stiffness: 220, damping: 18 });

  const onMove = (e: React.MouseEvent) => {
    if (!magnetic || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * 0.15);
    y.set((e.clientY - (rect.top + rect.height / 2)) * 0.15);
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  const classes = cn(
    "focus-ring inline-flex items-center justify-center gap-2 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] transition-all duration-300",
    variants[variant],
    className
  );

  if (href) {
    return (
      <motion.div style={{ x: springX, y: springY }} className="inline-block">
        <Link
          href={href}
          ref={ref as React.RefObject<HTMLAnchorElement>}
          className={classes}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          data-cursor="cta"
        >
          {children}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      ref={ref as React.RefObject<HTMLButtonElement>}
      className={classes}
      style={{ x: springX, y: springY }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      data-cursor="cta"
      {...props}
    >
      {children}
    </motion.button>
  );
}
