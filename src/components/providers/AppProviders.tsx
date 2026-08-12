"use client";

import { SmoothScroll } from "./SmoothScroll";
import { CustomCursor } from "./CustomCursor";
import { ThemeProvider } from "./ThemeProvider";
import { BinaryLoader } from "@/components/brand/BinaryLoader";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <SmoothScroll>
        <BinaryLoader />
        <CustomCursor />
        {children}
      </SmoothScroll>
    </ThemeProvider>
  );
}
