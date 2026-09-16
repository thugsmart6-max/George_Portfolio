import type { Metadata } from "next";
import { Fraunces, Geist_Mono, Outfit } from "next/font/google";
import { AppProviders } from "@/components/providers/AppProviders";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "JG Antony — Dr. George Antony | Wealth By George",
    template: "%s · JG Antony",
  },
  description:
    "Personal finance and investment education by Dr. George Antony — JG Antony / Wealth By George. Services, academy, planners, and free resources for investors, students, and businesses.",
  icons: {
    icon: [{ url: "/images/logo/logo.png", type: "image/png" }],
    apple: "/images/logo/logo.png",
    shortcut: "/images/logo/logo.png",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="light"
      className={`${outfit.variable} ${fraunces.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var p=location.pathname;if(/^\\/(services|academy|stories)(\\/|$)/.test(p)){document.documentElement.setAttribute("data-theme","dark");document.documentElement.classList.add("dark");}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full bg-[var(--bg-primary)] text-[var(--text-primary)]">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
