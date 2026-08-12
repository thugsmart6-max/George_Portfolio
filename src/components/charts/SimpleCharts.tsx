"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatINR } from "@/lib/utils";

const COLORS = ["#1f6b4a", "#2f6f8f", "#b7791f", "#5c4d7a", "#c53030", "#8a8a8a"];

export function NetWorthTrend({
  data,
}: {
  data: { date: string; netWorth: number }[];
}) {
  if (!data.length) return null;
  const chartData = data.map((d) => ({
    ...d,
    label: new Date(d.date).toLocaleDateString("en-IN", {
      month: "short",
    }),
  }));
  return (
    <div className="h-64 w-full" data-cursor="chart">
      <ResponsiveContainer>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="nw" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1f6b4a" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#1f6b4a" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(18,18,18,0.06)" vertical={false} />
          <XAxis dataKey="label" stroke="#8a8a8a" fontSize={11} />
          <YAxis
            stroke="#8a8a8a"
            fontSize={11}
            tickFormatter={(v) => formatINR(v, true)}
          />
          <Tooltip
            contentStyle={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
            }}
            formatter={(v) => formatINR(Number(v))}
          />
          <Area
            type="monotone"
            dataKey="netWorth"
            stroke="#1f6b4a"
            fill="url(#nw)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function IncomeExpenseBars({
  income,
  expenses,
}: {
  income: number;
  expenses: number;
}) {
  const data = [
    { name: "Income", value: income },
    { name: "Expenses", value: expenses },
    { name: "Savings", value: Math.max(0, income - expenses) },
  ];
  return (
    <div className="h-56 w-full" data-cursor="chart">
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid stroke="rgba(18,18,18,0.06)" vertical={false} />
          <XAxis dataKey="name" stroke="#8a8a8a" fontSize={11} />
          <YAxis
            stroke="#8a8a8a"
            fontSize={11}
            tickFormatter={(v) => formatINR(v, true)}
          />
          <Tooltip
            contentStyle={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
            }}
            formatter={(v) => formatINR(Number(v))}
          />
          <Bar dataKey="value">
            {data.map((entry) => (
              <Cell
                key={entry.name}
                fill={
                  entry.name === "Expenses"
                    ? "#b7791f"
                    : entry.name === "Savings"
                      ? "#1f6b4a"
                      : "#2f6f8f"
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function AllocationPie({
  data,
}: {
  data: { name: string; value: number }[];
}) {
  if (!data.length) return null;
  return (
    <div className="h-56 w-full" data-cursor="chart">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={2}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
            }}
            formatter={(v) => formatINR(Number(v))}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
