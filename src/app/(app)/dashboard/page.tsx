import { getSession } from "@/lib/auth/session";
import { getDashboardData } from "@/services/dashboard-service";
import { DashboardView } from "@/components/dashboard/DashboardView";
import { redirect } from "next/navigation";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const data = await getDashboardData(session.userId);
  if (!data) redirect("/login");

  if (!data.profile.onboardingCompleted) {
    redirect("/onboarding");
  }

  return <DashboardView data={data} />;
}
