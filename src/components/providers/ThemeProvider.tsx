"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { usePathname } from "next/navigation";

type Theme = "light" | "dark";

const ThemeContext = createContext<{
  theme: Theme;
  toggle: () => void;
}>({ theme: "light", toggle: () => {} });

const DARK_DEFAULT_PREFIXES = ["/services", "/academy", "/stories"];

function isDarkDefaultPath(pathname: string) {
  return DARK_DEFAULT_PREFIXES.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

function applyTheme(next: Theme, persist: boolean) {
  document.documentElement.setAttribute("data-theme", next);
  document.documentElement.classList.toggle("dark", next === "dark");
  if (persist) window.localStorage.setItem("ga-theme", next);
}

function storedTheme(): Theme {
  const stored = window.localStorage.getItem("ga-theme");
  return stored === "dark" || stored === "light" ? stored : "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "/";
  const [theme, setTheme] = useState<Theme>(() =>
    isDarkDefaultPath(pathname) ? "dark" : "light"
  );

  useEffect(() => {
    const next = isDarkDefaultPath(pathname) ? "dark" : storedTheme();
    setTheme(next);
    applyTheme(next, false);
  }, [pathname]);

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      applyTheme(next, true);
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
