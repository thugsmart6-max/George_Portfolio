import { getSession } from "@/lib/auth/session";
import { getDashboardData } from "@/services/dashboard-service";
import { WealthMap } from "@/components/wealth/WealthMap";
import { redirect } from "next/navigation";

export const metadata = { title: "Wealth Map" };

export default async function WealthMapPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  const data = await getDashboardData(session.userId);
  if (!data) redirect("/dashboard");

  return (
    <div className="px-5 py-10 md:px-10">
      <p className="eyebrow">Signature view</p>
      <h1 className="display mt-3 text-4xl md:text-6xl">Your Wealth Map</h1>
      <p className="mt-4 max-w-xl text-[var(--text-secondary)]">
        Income, expenses, savings, assets, liabilities, and goals — connected as
        one living system. Click a node to inspect.
      </p>
      <div className="mt-10">
        <WealthMap metrics={data.metrics} goals={data.goals} />
      </div>
    </div>
  );
}
