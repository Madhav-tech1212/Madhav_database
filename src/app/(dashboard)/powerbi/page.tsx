"use client";

import { useState } from "react";
import { BarChart, AreaChart, Area, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { LayoutGrid, FileSpreadsheet, GitFork, BarChart3, ChevronRight } from "lucide-react";

interface PowerBiDashboard {
  title: string;
  category: string;
  problem: string;
  kpis: { label: string; value: string; trend: string }[];
  dax: { name: string; formula: string; desc: string }[];
  starSchema: { fact: string; dimensions: string[] };
  chartData: any[];
  chartType: "bar" | "area";
}

const pbiDashboards: PowerBiDashboard[] = [
  {
    title: "Executive EBITDA & Financials",
    category: "Corporate Finance",
    problem: "C-Suite leadership required rapid access to regional sales margins, currency offsets, and real-time EBITDA growth variables.",
    kpis: [
      { label: "Total Revenue", value: "$4.82M", trend: "+12.4% YoY" },
      { label: "EBITDA Margin", value: "24.8%", trend: "+2.1% YoY" },
      { label: "Operating Expenses", value: "$3.12M", trend: "-4.5% Budgeted" }
    ],
    dax: [
      {
        name: "EBITDA Calculation",
        formula: `EBITDA = SUM(Fact_Financials[OperatingIncome]) \n         + SUM(Fact_Financials[Depreciation])`,
        desc: "Aggregates core operating margins while offsetting amortizations."
      },
      {
        name: "Revenue YoY % Growth",
        formula: `Revenue YoY % = \nVAR CurrentRev = [Total Revenue]\nVAR LastYearRev = CALCULATE([Total Revenue], SAMEPERIODLASTYEAR(Dim_Calendar[Date]))\nRETURN DIVIDE(CurrentRev - LastYearRev, LastYearRev)`,
        desc: "Time-intelligence calculation assessing yearly compounding variations."
      }
    ],
    starSchema: {
      fact: "Fact_Financials (Transaction IDs, Date, Amount, Cost)",
      dimensions: [
        "Dim_Calendar (DateKey, Month, Quarter, Year)",
        "Dim_Subsidiaries (SubID, Location, Region, Currency)",
        "Dim_GLAccounts (AccountID, Category, SubCategory)"
      ]
    },
    chartType: "area",
    chartData: [
      { name: "Jan", Revenue: 340000, Expenses: 220000 },
      { name: "Feb", Revenue: 380000, Expenses: 230000 },
      { name: "Mar", Revenue: 420000, Expenses: 245000 },
      { name: "Apr", Revenue: 480000, Expenses: 260000 },
    ]
  },
  {
    title: "Supply Chain & Logistics KPI Suite",
    category: "Warehouse Operations",
    problem: "Logistics supervisors lacked a star-schema view to cross-reference carrier dispatch failures, warehouse backlogs, and inventory cycles.",
    kpis: [
      { label: "Inventory Turn", value: "4.8x", trend: "+0.5x targets" },
      { label: "Stockout Rate", value: "0.8%", trend: "-1.4% MoM" },
      { label: "On-Time Delivery", value: "98.2%", trend: "+1.1% vs Q1" }
    ],
    dax: [
      {
        name: "Stockout Frequency",
        formula: `Stockout Rate = \nDIVIDE(\n  CALCULATE(COUNTROWS(Fact_Inventory), Fact_Inventory[UnitsInStock] = 0),\n  COUNTROWS(Fact_Inventory)\n)`,
        desc: "Divided counts of out-of-stock SKUs against total active inventory matrix records."
      }
    ],
    starSchema: {
      fact: "Fact_Inventory (InvID, WarehouseID, SKU, Timestamp, Quantity)",
      dimensions: [
        "Dim_SKU (SKUCode, Name, Category, RetailCost)",
        "Dim_Warehouses (WarehouseID, City, Capacity, Supervisor)",
        "Dim_Carriers (CarrierID, FleetType, Rating)"
      ]
    },
    chartType: "bar",
    chartData: [
      { name: "North W1", Stock: 850, Capacity: 1000 },
      { name: "South W2", Stock: 620, Capacity: 800 },
      { name: "East W1", Stock: 910, Capacity: 950 },
      { name: "West W2", Stock: 410, Capacity: 750 },
    ]
  }
];

export default function PowerBiPage() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const current = pbiDashboards[selectedIdx];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 select-none font-sans h-full items-stretch">
      {/* Sidebar switcher */}
      <div className="xl:col-span-1 border border-border bg-card rounded-xl p-4 flex flex-col gap-4">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <BarChart3 size={16} className="text-cyan-600 dark:text-cyan-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-foreground">BI Dashboards</span>
        </div>

        <nav className="flex flex-col gap-1 overflow-y-auto max-h-[300px] xl:max-h-[500px] scrollbar-none">
          {pbiDashboards.map((d, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIdx(idx)}
              className={`flex items-center justify-between text-left px-3 py-2.5 rounded-lg text-xs font-medium transition ${
                selectedIdx === idx
                  ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground tracking-wider uppercase font-mono">{d.category}</span>
                <span>{d.title}</span>
              </div>
              <ChevronRight size={14} className={selectedIdx === idx ? "text-cyan-600 dark:text-cyan-400" : "text-slate-500"} />
            </button>
          ))}
        </nav>
      </div>

      {/* Main dashboard visual showcase */}
      <div className="xl:col-span-3 flex flex-col gap-6">
        {/* KPI Panel */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {current.kpis.map((kpi, kIdx) => (
            <div key={kIdx} className="rounded-xl border border-border bg-card p-4 space-y-1">
              <span className="text-xs uppercase font-bold text-muted-foreground tracking-wider">
                {kpi.label}
              </span>
              <div className="text-xl font-bold text-foreground">
                {kpi.value}
              </div>
              <div className="text-xs font-mono text-cyan-600 dark:text-cyan-400">
                {kpi.trend}
              </div>
            </div>
          ))}
        </div>

        {/* Live Preview Simulator */}
        <div className="border border-border bg-card p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-border pb-3 text-xs">
            <span className="font-mono text-muted-foreground flex items-center gap-1.5">
              <LayoutGrid size={13} className="text-cyan-600 dark:text-cyan-400" />
              <span>Embedded_Report_Preview.pbix</span>
            </span>
            <span className="rounded bg-cyan-500/10 px-2 py-0.5 text-xs font-mono text-cyan-600 dark:text-cyan-400">
              Live Mock Simulation
            </span>
          </div>

          <div className="h-64 w-full bg-secondary rounded-lg border border-border p-4 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              {current.chartType === "area" ? (
                <AreaChart data={current.chartData}>
                  <XAxis dataKey="name" tick={{ fill: "#8a9ebf", fontSize: 9 }} stroke="transparent" />
                  <Tooltip contentStyle={{ backgroundColor: "#090e1f", borderColor: "rgba(255,255,255,0.1)", color: "#fff" }} />
                  <Area type="monotone" dataKey="Revenue" stroke="#00d2ff" fill="rgba(0,210,255,0.1)" strokeWidth={2} />
                  <Area type="monotone" dataKey="Expenses" stroke="#3b82f6" fill="rgba(59,130,246,0.05)" strokeWidth={1.5} />
                </AreaChart>
              ) : (
                <BarChart data={current.chartData}>
                  <XAxis dataKey="name" tick={{ fill: "#8a9ebf", fontSize: 9 }} stroke="transparent" />
                  <Tooltip contentStyle={{ backgroundColor: "#090e1f", borderColor: "rgba(255,255,255,0.1)", color: "#fff" }} />
                  <Bar dataKey="Stock" fill="#00d2ff" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Capacity" fill="#3b82f6" radius={[4, 4, 0, 0]} opacity={0.3} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Data Architecture / Star Schema Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Star Schema Diagram Card */}
          <div className="rounded-xl border border-border bg-card p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <GitFork size={14} className="text-cyan-600 dark:text-cyan-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-foreground">Data Model Architecture</span>
            </div>

            <div className="space-y-3 text-[11px] font-mono leading-relaxed">
              <div className="rounded bg-secondary border border-border p-2">
                <span className="text-cyan-600 dark:text-cyan-400 font-semibold block">FACT TABLE</span>
                <span className="text-foreground">{current.starSchema.fact}</span>
              </div>
              
              <div className="space-y-1.5">
                <span className="text-slate-500 dark:text-slate-400 font-semibold block text-[10px]">DIMENSION TABLES</span>
                {current.starSchema.dimensions.map((dim, dIdx) => (
                  <div key={dIdx} className="rounded bg-background border border-border p-2 text-muted-foreground">
                    {dim}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* DAX Card */}
          <div className="rounded-xl border border-border bg-card p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <FileSpreadsheet size={14} className="text-cyan-600 dark:text-cyan-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-foreground">DAX Calculations</span>
            </div>

            <div className="space-y-4 max-h-56 overflow-y-auto pr-2 scrollbar-none">
              {current.dax.map((calc, cIdx) => (
                <div key={cIdx} className="space-y-2 border-b border-border pb-3 last:border-b-0 last:pb-0">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-foreground">
                    <span>{calc.name}</span>
                  </div>
                  <pre className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 bg-background p-2.5 rounded border border-border whitespace-pre">
                    {calc.formula}
                  </pre>
                  <p className="text-[10px] text-muted-foreground">
                    {calc.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
