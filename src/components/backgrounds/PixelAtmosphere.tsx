"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/components/providers/ThemeProvider";

type Props = {
  className?: string;
  pixelSize?: number;
  intensity?: number;
};

const DARK = ["#0a0708", "#1a0c0a", "#5c2414", "#ff5a2a", "#c9a24d"];
const LIGHT = ["#f7f1e8", "#f0e0d0", "#f0a070", "#d84315", "#9a7420"];

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

function mix(
  a: { r: number; g: number; b: number },
  b: { r: number; g: number; b: number },
  t: number
) {
  return {
    r: a.r + (b.r - a.r) * t,
    g: a.g + (b.g - a.g) * t,
    b: a.b + (b.b - a.b) * t,
  };
}

function samplePalette(palette: string[], t: number) {
  const stops = palette.map(hexToRgb);
  const x = Math.min(1, Math.max(0, t)) * (stops.length - 1);
  const i = Math.floor(x);
  const f = x - i;
  if (i >= stops.length - 1) return stops[stops.length - 1];
  return mix(stops[i], stops[i + 1], f);
}

function StaticAtmosphere({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        background: `
          radial-gradient(ellipse 80% 60% at 20% 30%, rgba(255,90,42,0.28), transparent 55%),
          radial-gradient(ellipse 70% 50% at 85% 20%, rgba(201,162,77,0.18), transparent 50%),
          radial-gradient(ellipse 60% 40% at 50% 90%, rgba(255,90,42,0.1), transparent 45%),
          linear-gradient(165deg, #0a0708, #1a0c0a 45%, #140e10)
        `,
      }}
    />
  );
}

export function PixelAtmosphere({
  className = "",
  pixelSize = 16,
  intensity = 1,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const [useCanvas, setUseCanvas] = useState(false);

  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const narrow = window.matchMedia("(max-width: 768px)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Mobile / touch / reduced-motion → soft static gradient (no canvas cost)
    setUseCanvas(!(coarse || narrow || reduced));
  }, []);

  useEffect(() => {
    if (!useCanvas) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const palette = theme === "light" ? LIGHT : DARK;

    let w = 0;
    let h = 0;
    let cols = 0;
    let rows = 0;
    let field: Float32Array;
    let blur: Float32Array;
    let raf = 0;
    let last = performance.now();

    const pointer = { x: 0.55, y: 0.4, tx: 0.55, ty: 0.4 };
    let idleSince = performance.now();
    let demoAngle = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      const rect = parent?.getBoundingClientRect() ?? {
        width: window.innerWidth,
        height: window.innerHeight,
      };
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = Math.max(1, Math.floor(rect.width));
      h = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / pixelSize);
      rows = Math.ceil(h / pixelSize);
      field = new Float32Array(cols * rows);
      blur = new Float32Array(cols * rows);
      field.fill(0.1);
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.tx = (e.clientX - rect.left) / Math.max(1, rect.width);
      pointer.ty = (e.clientY - rect.top) / Math.max(1, rect.height);
      idleSince = performance.now();
    };

    resize();
    window.addEventListener("resize", resize);
    if (fine) window.addEventListener("pointermove", onMove, { passive: true });

    const splat = (px: number, py: number, force: number) => {
      const cx = px * cols;
      const cy = py * rows;
      const radius = Math.max(cols, rows) * 0.14;
      const r2 = radius * radius;
      const x0 = Math.max(0, Math.floor(cx - radius));
      const x1 = Math.min(cols - 1, Math.ceil(cx + radius));
      const y0 = Math.max(0, Math.floor(cy - radius));
      const y1 = Math.min(rows - 1, Math.ceil(cy + radius));
      for (let y = y0; y <= y1; y++) {
        for (let x = x0; x <= x1; x++) {
          const dx = x - cx;
          const dy = y - cy;
          const d = dx * dx + dy * dy;
          if (d < r2) {
            const falloff = 1 - d / r2;
            field[y * cols + x] += force * falloff * falloff * intensity;
          }
        }
      }
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      if (!reduced) {
        const idle = !fine || now - idleSince > 1100;
        if (idle) {
          demoAngle += dt * 0.6;
          pointer.tx =
            0.5 + Math.cos(demoAngle) * 0.3 + Math.sin(demoAngle * 0.65) * 0.1;
          pointer.ty = 0.42 + Math.sin(demoAngle * 1.15) * 0.24;
        }
        pointer.x += (pointer.tx - pointer.x) * 0.1;
        pointer.y += (pointer.ty - pointer.y) * 0.1;

        for (let i = 0; i < field.length; i++) field[i] *= 0.915;

        splat(pointer.x, pointer.y, 0.62);
        splat(
          0.5 + Math.cos(now * 0.00035) * 0.38,
          0.55 + Math.sin(now * 0.0005) * 0.28,
          0.2
        );

        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < cols; x++) {
            let sum = 0;
            let n = 0;
            for (let oy = -1; oy <= 1; oy++) {
              for (let ox = -1; ox <= 1; ox++) {
                const xx = x + ox;
                const yy = y + oy;
                if (xx < 0 || yy < 0 || xx >= cols || yy >= rows) continue;
                sum += field[yy * cols + xx];
                n++;
              }
            }
            blur[y * cols + x] = sum / n;
          }
        }
        const tmp = field;
        field = blur;
        blur = tmp;
      }

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          let v = Math.min(1, field[y * cols + x]);
          const bayer = ((x & 1) + (y & 1) * 2) / 4;
          v = Math.min(1, v + (bayer - 0.375) * 0.045);
          const c = samplePalette(palette, v);
          const grain = ((x * 37 + y * 17) % 9) - 4;
          ctx.fillStyle = `rgb(${c.r + grain},${c.g + grain},${c.b + grain})`;
          ctx.fillRect(
            x * pixelSize,
            y * pixelSize,
            pixelSize + 0.6,
            pixelSize + 0.6
          );
        }
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, [theme, pixelSize, intensity, useCanvas]);

  if (!useCanvas) {
    return <StaticAtmosphere className={className} />;
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
