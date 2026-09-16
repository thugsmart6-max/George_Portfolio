"use client";

import { SmoothScroll } from "./SmoothScroll";
import { CustomCursor } from "./CustomCursor";
import { ThemeProvider } from "./ThemeProvider";
import { BinaryLoader } from "@/components/brand/BinaryLoader";
import { MotionRoot } from "@/components/motion/MotionRoot";
import { SpotlightField } from "@/components/componentry";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <MotionRoot>
        <SmoothScroll>
          <BinaryLoader />
          <CustomCursor />
          <SpotlightField />
          {children}
        </SmoothScroll>
      </MotionRoot>
    </ThemeProvider>
  );
}
