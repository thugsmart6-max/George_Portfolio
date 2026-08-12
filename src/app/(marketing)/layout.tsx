import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ScrollProgress } from "@/components/layout/ScrollProgress";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-transparent">
      <SiteHeader />
      <ScrollProgress />
      <main className="relative z-10">{children}</main>
      <SiteFooter />
    </div>
  );
}
