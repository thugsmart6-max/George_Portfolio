import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-transparent">
      <SiteHeader />
      <main className="relative z-10 pb-16 md:pb-20">{children}</main>
      <div className="relative z-20 bg-[var(--bg-primary)]">
        <SiteFooter />
      </div>
    </div>
  );
}
