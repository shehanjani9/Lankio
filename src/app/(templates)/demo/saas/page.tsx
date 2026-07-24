"use client";

import { useMemo, useState } from "react";

/* ============================================================================
   NEXUSAI — Slate/Violet Dark AI Analytics Platform (Standalone Demo)
   Self-contained. No external imports beyond React. Pure Tailwind utility classes.
   ============================================================================ */

type Period = "24h" | "7d" | "30d" | "1y";

const NAV_ITEMS = [
  { key: "overview", label: "Overview" },
  { key: "analytics", label: "Analytics" },
  { key: "automation", label: "Automation" },
  { key: "customers", label: "Customers" },
  { key: "settings", label: "Settings" },
];

const KPIS = [
  {
    label: "Monthly Recurring Revenue",
    value: "$482,910",
    delta: "+34%",
    positive: true,
    spark: [12, 18, 15, 22, 28, 24, 32, 38, 35, 42],
  },
  {
    label: "Active Users",
    value: "128,402",
    delta: "+12.4%",
    positive: true,
    spark: [20, 22, 19, 25, 24, 27, 26, 30, 29, 33],
  },
  {
    label: "Conversion Rate",
    value: "4.82%",
    delta: "-0.6%",
    positive: false,
    spark: [30, 28, 29, 26, 27, 25, 24, 22, 23, 21],
  },
];

const CHART_DATA: Record<Period, number[]> = {
  "24h": [40, 44, 38, 52, 60, 55, 66, 70, 62, 74, 80, 76],
  "7d": [55, 60, 58, 66, 70, 68, 78],
  "30d": [50, 54, 60, 58, 66, 70, 72, 68, 74, 80, 78, 84, 88, 86, 92],
  "1y": [40, 45, 48, 52, 55, 58, 62, 66, 70, 74, 80, 88],
};

interface LogRow {
  id: string;
  user: string;
  action: string;
  amount: string;
  status: "Success" | "Processing" | "Failed";
  time: string;
}

const LOG_ROWS: LogRow[] = [
  { id: "TXN-8231", user: "Aria Chen", action: "Subscription renewal", amount: "$249.00", status: "Success", time: "2m ago" },
  { id: "TXN-8230", user: "Marcus Lee", action: "Plan upgrade → Pro", amount: "$580.00", status: "Success", time: "6m ago" },
  { id: "TXN-8229", user: "Nadia Osei", action: "Automation sync", amount: "—", status: "Processing", time: "9m ago" },
  { id: "TXN-8228", user: "Theo Park", action: "Payment retry", amount: "$99.00", status: "Failed", time: "14m ago" },
  { id: "TXN-8227", user: "Ines Duarte", action: "Seat added ×3", amount: "$147.00", status: "Success", time: "22m ago" },
  { id: "TXN-8226", user: "Jonas Weber", action: "Webhook delivery", amount: "—", status: "Processing", time: "31m ago" },
];

function StatusPill({ status }: { status: LogRow["status"] }) {
  const styles: Record<LogRow["status"], string> = {
    Success: "bg-emerald-400/10 text-emerald-300 border-emerald-400/20",
    Processing: "bg-amber-400/10 text-amber-300 border-amber-400/20",
    Failed: "bg-rose-400/10 text-rose-300 border-rose-400/20",
  };
  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function Sparkline({ data, positive }: { data: number[]; positive: boolean }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - ((v - min) / (max - min || 1)) * 100;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="h-10 w-24">
      <polyline
        points={points.split(" ").map((p) => {
          const [x, y] = p.split(",").map(Number);
          return `${x},${(y * 40) / 100}`;
        }).join(" ")}
        fill="none"
        stroke={positive ? "#34d399" : "#fb7185"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function SaasDemoPage() {
  const [activeNav, setActiveNav] = useState("overview");
  const [period, setPeriod] = useState<Period>("7d");

  const chartPoints = useMemo(() => {
    const data = CHART_DATA[period];
    const max = Math.max(...data);
    const min = Math.min(...data);
    return data.map((v, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - ((v - min) / (max - min || 1)) * 85 - 5;
      return { x, y };
    });
  }, [period]);

  const linePath = chartPoints
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`)
    .join(" ");
  const areaPath = `${linePath} L100,100 L0,100 Z`;

  return (
    <div className="flex min-h-screen w-full bg-[#0a0a12] text-white antialiased">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-white/10 bg-[#0d0d17] lg:flex">
        <div className="flex items-center gap-2 border-b border-white/10 px-6 py-5">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-400" />
          <span className="text-sm font-bold tracking-wide">NexusAI</span>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveNav(item.key)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                activeNav === item.key
                  ? "bg-violet-500/15 text-violet-200"
                  : "text-white/50 hover:bg-white/5 hover:text-white/80"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  activeNav === item.key ? "bg-violet-400" : "bg-white/20"
                }`}
              />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="border-t border-white/10 p-4">
          <div className="rounded-xl border border-violet-400/20 bg-violet-500/10 p-3">
            <p className="text-xs font-semibold text-violet-200">Upgrade to Enterprise</p>
            <p className="mt-1 text-[11px] text-white/50">
              Unlock unlimited automations & SSO.
            </p>
          </div>
        </div>
      </aside>

      <div className="flex-1">
        {/* Top bar */}
        <header className="flex items-center justify-between border-b border-white/10 bg-[#0a0a12]/80 px-6 py-4 backdrop-blur">
          <div className="flex w-full max-w-md items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-white/40">
              <circle cx="11" cy="11" r="7" strokeWidth="1.6" />
              <path d="M21 21l-4.3-4.3" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <input
              placeholder="Search customers, reports, workflows…"
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="relative rounded-full p-2 hover:bg-white/5">
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-white/60">
                <path
                  d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="M13.7 21a2 2 0 01-3.4 0" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-violet-400" />
            </button>
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 overflow-hidden rounded-full border border-white/10">
                <img
                  src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200&auto=format&fit=crop"
                  alt="User avatar"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="hidden text-left sm:block">
                <p className="text-xs font-semibold">Priya Raman</p>
                <p className="text-[11px] text-white/40">Product Lead</p>
              </div>
            </div>
          </div>
        </header>

        <main className="space-y-6 p-6">
          {/* KPI cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {KPIS.map((kpi) => (
              <div
                key={kpi.label}
                className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent p-5"
              >
                <p className="text-xs text-white/50">{kpi.label}</p>
                <div className="mt-3 flex items-end justify-between">
                  <div>
                    <p className="text-2xl font-bold">{kpi.value}</p>
                    <span
                      className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        kpi.positive
                          ? "bg-emerald-400/10 text-emerald-300"
                          : "bg-rose-400/10 text-rose-300"
                      }`}
                    >
                      {kpi.delta}
                    </span>
                  </div>
                  <Sparkline data={kpi.spark} positive={kpi.positive} />
                </div>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold">Revenue Analytics</h2>
                <p className="text-xs text-white/40">
                  Aggregated across all connected workspaces
                </p>
              </div>
              <div className="flex gap-1 rounded-lg border border-white/10 bg-white/5 p-1">
                {(["24h", "7d", "30d", "1y"] as Period[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                      period === p
                        ? "bg-violet-500 text-white"
                        : "text-white/50 hover:text-white"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="h-56 w-full"
            >
              <defs>
                <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={areaPath} fill="url(#areaFill)" />
              <path
                d={linePath}
                fill="none"
                stroke="#a78bfa"
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>

          {/* Activity table */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold">Live Activity Stream</h2>
              <span className="flex items-center gap-1.5 text-xs text-emerald-300">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                Live
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-xs uppercase tracking-wide text-white/40">
                    <th className="pb-3 font-medium">Transaction</th>
                    <th className="pb-3 font-medium">Customer</th>
                    <th className="pb-3 font-medium">Action</th>
                    <th className="pb-3 font-medium">Amount</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {LOG_ROWS.map((row) => (
                    <tr key={row.id} className="transition hover:bg-white/[0.03]">
                      <td className="py-3 font-mono text-xs text-white/50">{row.id}</td>
                      <td className="py-3 font-medium">{row.user}</td>
                      <td className="py-3 text-white/60">{row.action}</td>
                      <td className="py-3">{row.amount}</td>
                      <td className="py-3">
                        <StatusPill status={row.status} />
                      </td>
                      <td className="py-3 text-right text-white/40">{row.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
