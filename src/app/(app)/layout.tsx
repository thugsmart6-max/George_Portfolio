import { AppNav } from "@/components/layout/AppNav";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <AppNav />
      <div className="mx-auto max-w-[1400px] pb-20">{children}</div>
    </div>
  );
}
