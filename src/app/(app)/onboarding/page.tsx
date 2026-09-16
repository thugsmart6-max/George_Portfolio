"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatINR, formatPercent } from "@/lib/utils";

const screens = [
  "intro",
  "income",
  "expenses",
  "assets",
  "liabilities",
  "goals",
  "ready",
] as const;

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [income, setIncome] = useState("100000");
  const [expenses, setExpenses] = useState("70000");
  const [assets, setAssets] = useState("1000000");
  const [liabilities, setLiabilities] = useState("300000");
  const [goalName, setGoalName] = useState("Buy House");
  const [goalTarget, setGoalTarget] = useState("5000000");
  const [goalCurrent, setGoalCurrent] = useState("500000");
  const [saving, setSaving] = useState(false);
  const [summary, setSummary] = useState<{
    netWorth: number;
    savingsRate: number;
    emergency: number;
    score: number;
  } | null>(null);

  const screen = screens[step];

  const finish = async () => {
    setSaving(true);
    try {
      await fetch("/api/income", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(income),
          category: "Salary",
          frequency: "monthly",
          date: new Date().toISOString(),
        }),
      });
      await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(expenses),
          category: "Other",
          frequency: "monthly",
          date: new Date().toISOString(),
          description: "Onboarding total monthly expenses",
        }),
      });
      await fetch("/api/assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Primary assets",
          category: "Bank Balance",
          currentValue: Number(assets),
          date: new Date().toISOString(),
        }),
      });
      if (Number(liabilities) > 0) {
        await fetch("/api/liabilities", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "Primary liability",
            category: "Personal Loan",
            outstandingAmount: Number(liabilities),
          }),
        });
      }
      await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: goalName,
          category: "Home",
          targetAmount: Number(goalTarget),
          currentSavings: Number(goalCurrent),
          targetDate: "2032-12-31",
          monthlyContribution: 25000,
          priority: "high",
        }),
      });
      await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ onboardingCompleted: true }),
      });

      const wealth = await fetch("/api/wealth").then((r) => r.json());
      setSummary({
        netWorth: wealth.metrics.netWorth,
        savingsRate: wealth.metrics.savingsRate,
        emergency: wealth.metrics.emergencyFundMonths,
        score: wealth.wealthScore.score,
      });
      setStep(screens.length - 1);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-2xl flex-col justify-center px-5 py-16 md:px-10">
      <AnimatePresence mode="wait">
        <motion.div
          key={screen}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          {screen === "intro" && (
            <>
              <p className="eyebrow">Onboarding</p>
              <h1 className="display mt-4 text-5xl">
                Let&apos;s understand your money.
              </h1>
              <p className="mt-4 text-[var(--text-secondary)]">
                Seven short steps. Then your Wealth Map comes alive.
              </p>
              <Button className="mt-10" onClick={() => setStep(1)}>
                Begin
              </Button>
            </>
          )}
          {screen === "income" && (
            <>
              <h1 className="display text-4xl">What do you earn?</h1>
              <div className="mt-8">
                <Input
                  label="Monthly income (₹)"
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                />
              </div>
              <Button className="mt-8" onClick={() => setStep(2)}>
                Continue
              </Button>
            </>
          )}
          {screen === "expenses" && (
            <>
              <h1 className="display text-4xl">What do you spend?</h1>
              <div className="mt-8">
                <Input
                  label="Monthly expenses (₹)"
                  type="number"
                  value={expenses}
                  onChange={(e) => setExpenses(e.target.value)}
                />
              </div>
              <Button className="mt-8" onClick={() => setStep(3)}>
                Continue
              </Button>
            </>
          )}
          {screen === "assets" && (
            <>
              <h1 className="display text-4xl">What do you own?</h1>
              <div className="mt-8">
                <Input
                  label="Total assets (₹)"
                  type="number"
                  value={assets}
                  onChange={(e) => setAssets(e.target.value)}
                />
              </div>
              <Button className="mt-8" onClick={() => setStep(4)}>
                Continue
              </Button>
            </>
          )}
          {screen === "liabilities" && (
            <>
              <h1 className="display text-4xl">What do you owe?</h1>
              <div className="mt-8">
                <Input
                  label="Total liabilities (₹)"
                  type="number"
                  value={liabilities}
                  onChange={(e) => setLiabilities(e.target.value)}
                />
              </div>
              <Button className="mt-8" onClick={() => setStep(5)}>
                Continue
              </Button>
            </>
          )}
          {screen === "goals" && (
            <>
              <h1 className="display text-4xl">
                What are you building toward?
              </h1>
              <div className="mt-8 space-y-4">
                <Input
                  label="Goal name"
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                />
                <Input
                  label="Target amount"
                  type="number"
                  value={goalTarget}
                  onChange={(e) => setGoalTarget(e.target.value)}
                />
                <Input
                  label="Current savings"
                  type="number"
                  value={goalCurrent}
                  onChange={(e) => setGoalCurrent(e.target.value)}
                />
              </div>
              <Button className="mt-8" onClick={finish} disabled={saving}>
                {saving ? "Building map…" : "Generate Wealth Map"}
              </Button>
            </>
          )}
          {screen === "ready" && summary && (
            <>
              <h1 className="display text-4xl md:text-5xl">
                Your Wealth Map is ready.
              </h1>
              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                {[
                  ["Net Worth", formatINR(summary.netWorth)],
                  ["Savings Rate", formatPercent(summary.savingsRate)],
                  ["Emergency Fund", `${summary.emergency.toFixed(1)} mo`],
                  ["Wealth Score", `${summary.score}/100`],
                ].map(([k, v]) => (
                  <div key={k} className="border border-[var(--border)] p-5">
                    <p className="eyebrow">{k}</p>
                    <p className="display mt-2 text-3xl text-[var(--accent)]">
                      {v}
                    </p>
                  </div>
                ))}
              </div>
              <Button className="mt-10" onClick={() => router.push("/dashboard")}>
                Enter dashboard
              </Button>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
