"use client";

import { useEffect, useState, useRef } from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from "recharts";
import {
  TrendingUp, Users, Clock, Globe, ArrowDownToLine,
  Mail, Sparkles, RefreshCw, LogOut, Laptop, CheckCircle2, ChevronRight, Activity, Search
} from "lucide-react";
import { FaGithub } from "react-icons/fa";

interface StatsData {
  kpis: {
    totalVisitors: number;
    uniqueVisitors: number;
    totalSessions: number;
    avgSessionDuration: number;
    returningVisitors: number;
    growthRate: number;
    resumeDownloads: number;
    githubClicks: number;
    linkedinClicks: number;
    contactClicks: number;
    ctaClickRate: number;
  };
  chartData: { date: string; Views: number; Visits: number; Sessions: number }[];
  distributions: {
    trafficSources: { name: string; value: number }[];
    countries: { name: string; value: number }[];
    devices: { name: string; value: number }[];
    browsers: { name: string; value: number }[];
    operatingSystems: { name: string; value: number }[];
    screenResolutions: { name: string; value: number }[];
    scrollDepths: { name: string; value: number }[];
  };
  topContent: {
    topPages: { path: string; count: number }[];
    topProjects: { name: string; count: number }[];
    mostClickedButtons: { name: string; count: number }[];
  };
  recentActivity: {
    id: string;
    time: string;
    country: string;
    page: string;
    device: string;
    source: string;
    duration: string;
  }[];
}

interface RealtimeData {
  activeSessions: number;
  activePages: { path: string; count: number; activeUsers: number }[];
}

const COLORS = ["#00d2ff", "#3b82f6", "#6366f1", "#a855f7", "#ec4899", "#f43f5e"];

export default function AnalyticsOverview() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatsData | null>(null);
  
  // Filters
  const [range, setRange] = useState("7days");
  const [country, setCountry] = useState("");
  const [source, setSource] = useState("");
  const [browser, setBrowser] = useState("");
  const [os, setOs] = useState("");
  const [device, setDevice] = useState("");

  // Realtime state
  const [realtime, setRealtime] = useState<RealtimeData>({ activeSessions: 1, activePages: [] });
  const [insights, setInsights] = useState<string[]>([]);
  const [insightsLoading, setInsightsLoading] = useState(true);
  const [dashboardTab, setDashboardTab] = useState<"overview" | "behavior" | "demographics">("overview");

  // Fetch stats based on active filters
  const fetchStats = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        range,
        ...(country && { country }),
        ...(source && { source }),
        ...(browser && { browser }),
        ...(os && { os }),
        ...(device && { device }),
      });
      const res = await fetch(`/api/analytics/stats?${query.toString()}`);
      const data = await res.json();
      setStats(data);
    } catch (e) {
      console.warn("Failed fetching analytics statistics", e);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Realtime stats
  const fetchRealtime = async () => {
    try {
      const res = await fetch("/api/analytics/realtime");
      const data = await res.json();
      setRealtime(data);
    } catch {
      // fallback
    }
  };

  // Fetch AI Insights
  const fetchInsights = async () => {
    setInsightsLoading(true);
    try {
      const res = await fetch("/api/analytics/insights");
      const data = await res.json();
      setInsights(data.insights || []);
    } catch {
      // fallback
    } finally {
      setInsightsLoading(false);
    }
  };

  // Polling for real-time card (every 6 seconds)
  useEffect(() => {
    fetchRealtime();
    const interval = setInterval(fetchRealtime, 6000);
    return () => clearInterval(interval);
  }, []);

  // Fetch statistics and insights on filter changes
  useEffect(() => {
    fetchStats();
    fetchInsights();
  }, [range, country, source, browser, os, device]);

  const handleSignOut = () => {
    sessionStorage.removeItem("admin_portfolio_auth");
    window.location.reload();
  };

  // Formats seconds into h:m:s readable formats
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs <= 0) return "0s";
    if (secs < 60) return `${secs}s`;
    const mins = Math.floor(secs / 60);
    const remainSecs = secs % 60;
    return `${mins}m ${remainSecs}s`;
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto min-h-screen text-slate-200 font-sans select-none relative z-10">
      
      {/* Top dashboard header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-border pb-4 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-500"></span>
            </span>
            <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase">
              System Admin Console
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
            Portfolio Analytics Engine
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-lg bg-cyan-950/20 border border-cyan-500/20 px-3 py-1.5 text-[10px] font-mono text-cyan-400">
            <Activity size={12} className="animate-spin text-cyan-400" />
            <span>{realtime.activeSessions} LIVE ACTIVE SESSION{realtime.activeSessions !== 1 ? "S" : ""}</span>
          </div>

          <button
            onClick={fetchStats}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-secondary hover:bg-muted p-2 text-xs font-semibold transition"
            title="Refresh Data"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 rounded-lg border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-400 transition"
          >
            <LogOut size={13} />
            <span>Lock Console</span>
          </button>
        </div>
      </div>

      {/* Filter Control Header Row */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 rounded-xl border border-border bg-card p-4">
        <div className="flex flex-col gap-1">
          <label className="text-[9px] font-mono text-slate-500 uppercase">Date Range</label>
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="bg-secondary border border-border rounded-lg text-xs p-2 focus:outline-none focus:border-cyan-500 font-mono text-foreground"
          >
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="year">This Year</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[9px] font-mono text-slate-500 uppercase">Country</label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="bg-secondary border border-border rounded-lg text-xs p-2 focus:outline-none focus:border-cyan-500 font-mono text-foreground"
          >
            <option value="">All Countries</option>
            <option value="India">India</option>
            <option value="United States">United States</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Canada">Canada</option>
            <option value="Australia">Australia</option>
            <option value="Europe">Europe</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[9px] font-mono text-slate-500 uppercase">Traffic Source</label>
          <select
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="bg-secondary border border-border rounded-lg text-xs p-2 focus:outline-none focus:border-cyan-500 font-mono text-foreground"
          >
            <option value="">All Sources</option>
            <option value="Direct">Direct</option>
            <option value="Google">Google</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="GitHub">GitHub</option>
            <option value="Social">Social / X</option>
            <option value="Referral">Referral</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[9px] font-mono text-slate-500 uppercase">Device</label>
          <select
            value={device}
            onChange={(e) => setDevice(e.target.value)}
            className="bg-secondary border border-border rounded-lg text-xs p-2 focus:outline-none focus:border-cyan-500 font-mono text-foreground"
          >
            <option value="">All Devices</option>
            <option value="Desktop">Desktop</option>
            <option value="Mobile">Mobile</option>
            <option value="Tablet">Tablet</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[9px] font-mono text-slate-500 uppercase">Browser</label>
          <select
            value={browser}
            onChange={(e) => setBrowser(e.target.value)}
            className="bg-secondary border border-border rounded-lg text-xs p-2 focus:outline-none focus:border-cyan-500 font-mono text-foreground"
          >
            <option value="">All Browsers</option>
            <option value="Chrome">Chrome</option>
            <option value="Safari">Safari</option>
            <option value="Firefox">Firefox</option>
            <option value="Edge">Edge</option>
            <option value="Brave">Brave</option>
            <option value="Opera">Opera</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[9px] font-mono text-slate-500 uppercase">Operating System</label>
          <select
            value={os}
            onChange={(e) => setOs(e.target.value)}
            className="bg-secondary border border-border rounded-lg text-xs p-2 focus:outline-none focus:border-cyan-500 font-mono text-foreground"
          >
            <option value="">All OS</option>
            <option value="Windows">Windows</option>
            <option value="macOS">macOS</option>
            <option value="Linux">Linux</option>
            <option value="Android">Android</option>
            <option value="iOS">iOS</option>
          </select>
        </div>
      </div>

      {/* AI Automated Data Insights Section */}
      <div className="border border-cyan-500/20 bg-cyan-950/5 rounded-xl p-5 space-y-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[300px] h-[100px] bg-gradient-to-l from-cyan-500/5 to-transparent blur-2xl" />
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-cyan-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Automated Analytics Insights</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {insightsLoading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="h-16 rounded-lg border border-border bg-card/40 animate-pulse" />
            ))
          ) : (
            insights.slice(0, 4).map((ins, idx) => (
              <div key={idx} className="rounded-lg border border-border bg-card/60 p-3 flex gap-2 text-xs leading-relaxed text-slate-300">
                <span className="text-cyan-400 font-mono">0{idx + 1}.</span>
                <span>{ins}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex border-b border-border gap-2 text-xs font-semibold">
        <button
          onClick={() => setDashboardTab("overview")}
          className={`pb-3 px-4 transition ${
            dashboardTab === "overview"
              ? "border-b-2 border-cyan-500 text-cyan-400"
              : "text-slate-500 hover:text-slate-300"
          }`}
        >
          General Traffic Overview
        </button>
        <button
          onClick={() => setDashboardTab("behavior")}
          className={`pb-3 px-4 transition ${
            dashboardTab === "behavior"
              ? "border-b-2 border-cyan-500 text-cyan-400"
              : "text-slate-500 hover:text-slate-300"
          }`}
        >
          Visitor Behaviors & CTAs
        </button>
        <button
          onClick={() => setDashboardTab("demographics")}
          className={`pb-3 px-4 transition ${
            dashboardTab === "demographics"
              ? "border-b-2 border-cyan-500 text-cyan-400"
              : "text-slate-500 hover:text-slate-300"
          }`}
        >
          Audience Devices & Demographics
        </button>
      </div>

      {/* Primary KPI Grid (Rendered above tabs for quick lookup) */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          
          <div className="rounded-xl border border-border bg-card p-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Unique Visitors</span>
              <Users size={14} className="text-cyan-500" />
            </div>
            <div className="text-xl font-bold text-white tabular-nums">{stats.kpis.uniqueVisitors.toLocaleString()}</div>
            <div className="text-[9px] font-mono text-emerald-400 flex items-center gap-0.5">
              <TrendingUp size={10} />
              <span>+{stats.kpis.growthRate}% Period Growth</span>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Total Sessions</span>
              <Activity size={14} className="text-blue-500" />
            </div>
            <div className="text-xl font-bold text-white tabular-nums">{stats.kpis.totalSessions.toLocaleString()}</div>
            <div className="text-[9px] font-mono text-cyan-400">Total Visits Logged</div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Avg Session Time</span>
              <Clock size={14} className="text-indigo-500" />
            </div>
            <div className="text-xl font-bold text-white font-mono">{formatTime(stats.kpis.avgSessionDuration)}</div>
            <div className="text-[9px] font-mono text-slate-500">Read & Sandbox Interactivity</div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Resume Downloads</span>
              <ArrowDownToLine size={14} className="text-purple-500" />
            </div>
            <div className="text-xl font-bold text-white tabular-nums">{stats.kpis.resumeDownloads.toLocaleString()}</div>
            <div className="text-[9px] font-mono text-cyan-400">Conversion Rate check</div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">GitHub Clicks</span>
              <FaGithub size={14} className="text-pink-500" />
            </div>
            <div className="text-xl font-bold text-white tabular-nums">{stats.kpis.githubClicks.toLocaleString()}</div>
            <div className="text-[9px] font-mono text-slate-500">Repository Referral Triggers</div>
          </div>

        </div>
      )}

      {/* Render conditional dashboard views based on selected tab */}
      {loading ? (
        <div className="h-96 rounded-xl border border-border bg-card flex flex-col items-center justify-center font-mono text-xs text-slate-500 animate-pulse">
          <Activity size={24} className="animate-spin text-cyan-400 mb-2" />
          <span>Aggregating statistics from database models...</span>
        </div>
      ) : stats ? (
        <div className="space-y-6">

          {/* TAB 1: GENERAL OVERVIEW */}
          {dashboardTab === "overview" && (
            <div className="space-y-6">
              
              {/* Main Area Chart Container */}
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center justify-between border-b border-border pb-3 mb-5">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white">Daily Traffic Compilations</h3>
                    <span className="text-[9px] text-slate-500 font-mono">Sessions and page views count timeline</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-mono">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-cyan-400" />
                      <span>Page Views</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-blue-500" />
                      <span>Sessions</span>
                    </div>
                  </div>
                </div>

                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats.chartData} margin={{ left: -10, right: 10, top: 10, bottom: 5 }}>
                      <XAxis dataKey="date" tick={{ fill: "#8a9ebf", fontSize: 9 }} stroke="rgba(255,255,255,0.05)" />
                      <YAxis tick={{ fill: "#8a9ebf", fontSize: 9 }} stroke="rgba(255,255,255,0.05)" />
                      <Tooltip contentStyle={{ backgroundColor: "#090e1f", borderColor: "rgba(255,255,255,0.1)", color: "#fff" }} />
                      <Area type="monotone" dataKey="Views" stroke="#00d2ff" fill="rgba(0,210,255,0.08)" strokeWidth={2} />
                      <Area type="monotone" dataKey="Sessions" stroke="#3b82f6" fill="rgba(59,130,246,0.04)" strokeWidth={1.5} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Bottom Row: Referrers & Countries & Activity logs */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Traffic Referral Donut */}
                <div className="rounded-xl border border-border bg-card p-5 flex flex-col justify-between">
                  <div className="border-b border-border pb-3 mb-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white">Referral Traffic Sources</h3>
                    <span className="text-[9px] text-slate-500 font-mono">Incoming channel distributions</span>
                  </div>

                  <div className="h-48 w-full flex items-center justify-center relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stats.distributions.trafficSources}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={70}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {stats.distributions.trafficSources.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: "#090e1f", borderColor: "rgba(255,255,255,0.1)", color: "#fff" }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-4 text-[10px] font-mono">
                    {stats.distributions.trafficSources.slice(0, 6).map((src, sIdx) => (
                      <div key={sIdx} className="flex flex-col border border-border bg-secondary/30 p-1.5 rounded text-center">
                        <span className="text-slate-500 uppercase truncate">{src.name}</span>
                        <span className="text-white font-bold mt-0.5">{src.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Countries List */}
                <div className="rounded-xl border border-border bg-card p-5 space-y-4">
                  <div className="border-b border-border pb-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white">Geographic Demographics</h3>
                    <span className="text-[9px] text-slate-500 font-mono">Visitors by identified country codes</span>
                  </div>

                  <div className="space-y-3.5 max-h-64 overflow-y-auto pr-1 scrollbar-none">
                    {stats.distributions.countries.length === 0 ? (
                      <div className="text-center text-slate-500 text-xs italic">No geographic data logged yet...</div>
                    ) : (
                      stats.distributions.countries.map((ctr, cIdx) => (
                        <div key={cIdx} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <Globe size={13} className="text-cyan-400" />
                            <span className="font-mono text-slate-300">{ctr.name}</span>
                          </div>
                          <span className="font-bold text-white">{ctr.value} visits</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Recent Activity Log Stream */}
                <div className="rounded-xl border border-border bg-card p-5 space-y-4">
                  <div className="border-b border-border pb-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white">Visitor Activity Stream</h3>
                    <span className="text-[9px] text-slate-500 font-mono">Real-time session updates stream</span>
                  </div>

                  <div className="space-y-3 max-h-64 overflow-y-auto pr-1 scrollbar-none">
                    {stats.recentActivity.map((act, idx) => (
                      <div key={idx} className="flex items-center justify-between text-[11px] border-b border-border/50 pb-2 last:border-b-0">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-slate-200 uppercase font-mono">{act.page} tab</span>
                            <span className="text-[9px] text-slate-500">{act.time}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5 uppercase">
                            Source: {act.source} • {act.device}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-mono text-cyan-400 block font-semibold">{act.duration}</span>
                          <span className="text-[9px] text-slate-500 block uppercase">{act.country}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: BEHAVIOR & CTAS */}
          {dashboardTab === "behavior" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Top Pages viewed table */}
              <div className="rounded-xl border border-border bg-card p-5 space-y-4">
                <div className="border-b border-border pb-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white">Most Viewed Page Tabs</h3>
                  <span className="text-[9px] text-slate-500 font-mono">Total click views per workspace tab</span>
                </div>

                <div className="space-y-3">
                  {stats.topContent.topPages.map((pg, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs border-b border-border/50 pb-2 last:border-b-0">
                      <span className="font-mono text-slate-300 font-medium">/{pg.path}</span>
                      <span className="font-bold text-cyan-400">{pg.count.toLocaleString()} views</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Clicked CTA buttons table */}
              <div className="rounded-xl border border-border bg-card p-5 space-y-4">
                <div className="border-b border-border pb-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white">Clicked CTA Interactions</h3>
                  <span className="text-[9px] text-slate-500 font-mono">Conversion metrics for buttons</span>
                </div>

                <div className="space-y-3">
                  {stats.topContent.mostClickedButtons.length === 0 ? (
                    <div className="text-center text-slate-500 text-xs italic py-4">No CTA actions logged yet...</div>
                  ) : (
                    stats.topContent.mostClickedButtons.map((btn, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs border-b border-border/50 pb-2 last:border-b-0">
                        <span className="font-mono text-slate-300 font-medium">{btn.name}</span>
                        <span className="font-bold text-[#3b82f6]">{btn.count.toLocaleString()} clicks</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Scroll Depth Distribution */}
              <div className="rounded-xl border border-border bg-card p-5 space-y-4">
                <div className="border-b border-border pb-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white">Scroll Depth Distribution</h3>
                  <span className="text-[9px] text-slate-500 font-mono">Checkpoints reached on portfolio body</span>
                </div>

                <div className="h-56 w-full mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.distributions.scrollDepths}>
                      <XAxis dataKey="name" tick={{ fill: "#8a9ebf", fontSize: 9 }} stroke="transparent" />
                      <Tooltip contentStyle={{ backgroundColor: "#090e1f", borderColor: "rgba(255,255,255,0.1)", color: "#fff" }} />
                      <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: DEMOGRAPHICS & DEVICES */}
          {dashboardTab === "demographics" && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              
              {/* Browser Distribution */}
              <div className="rounded-xl border border-border bg-card p-5 space-y-4">
                <div className="border-b border-border pb-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white">Browsers</h3>
                  <span className="text-[9px] text-slate-500 font-mono">Visitor agent browser engines</span>
                </div>
                <div className="space-y-3.5">
                  {stats.distributions.browsers.map((b, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs border-b border-border/50 pb-2 last:border-b-0">
                      <span className="font-mono text-slate-300 font-medium">{b.name}</span>
                      <span className="font-bold text-white">{b.value} sessions</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Operating System Distribution */}
              <div className="rounded-xl border border-border bg-card p-5 space-y-4">
                <div className="border-b border-border pb-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white">Operating Systems</h3>
                  <span className="text-[9px] text-slate-500 font-mono">Platform distributions</span>
                </div>
                <div className="space-y-3.5">
                  {stats.distributions.operatingSystems.map((o, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs border-b border-border/50 pb-2 last:border-b-0">
                      <span className="font-mono text-slate-300 font-medium">{o.name}</span>
                      <span className="font-bold text-white">{o.value} sessions</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Device Type Distribution */}
              <div className="rounded-xl border border-border bg-card p-5 space-y-4">
                <div className="border-b border-border pb-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white">Device Class Types</h3>
                  <span className="text-[9px] text-slate-500 font-mono">Form factor distributions</span>
                </div>
                <div className="space-y-3.5">
                  {stats.distributions.devices.map((d, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs border-b border-border/50 pb-2 last:border-b-0">
                      <span className="font-mono text-slate-300 font-medium">{d.name}</span>
                      <span className="font-bold text-white">{d.value} sessions</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Screen Resolution Distribution */}
              <div className="rounded-xl border border-border bg-card p-5 space-y-4">
                <div className="border-b border-border pb-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white">Screen Resolutions</h3>
                  <span className="text-[9px] text-slate-500 font-mono">Common viewport parameters</span>
                </div>
                <div className="space-y-3.5">
                  {stats.distributions.screenResolutions.map((r, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs border-b border-border/50 pb-2 last:border-b-0">
                      <span className="font-mono text-slate-300 font-medium">{r.name}</span>
                      <span className="font-bold text-white">{r.value} sessions</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>
      ) : null}

    </div>
  );
}
