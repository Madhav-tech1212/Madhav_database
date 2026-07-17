import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range") || "7days";
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");
    
    // Filter parameters
    const countryFilter = searchParams.get("country");
    const sourceFilter = searchParams.get("source");
    const browserFilter = searchParams.get("browser");
    const osFilter = searchParams.get("os");
    const deviceFilter = searchParams.get("device");

    const now = new Date();
    let startDate = new Date();
    let endDate = now;

    // 1. Calculate Date Filters
    switch (range) {
      case "today":
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case "yesterday":
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
        endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, -1);
        break;
      case "30days":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "90days":
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case "year":
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      case "custom":
        if (startDateParam) startDate = new Date(startDateParam);
        if (endDateParam) endDate = new Date(endDateParam);
        break;
      case "7days":
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
    }

    // 2. Build Relational Where Clause
    const sessionWhere: any = {
      startedAt: { gte: startDate, lte: endDate },
    };

    if (sourceFilter) {
      sessionWhere.trafficSource = sourceFilter;
    }

    // Visitor relations
    const visitorWhere: any = {};
    if (countryFilter) visitorWhere.country = countryFilter;
    if (browserFilter) visitorWhere.browser = browserFilter;
    if (osFilter) visitorWhere.os = osFilter;
    if (deviceFilter) visitorWhere.device = deviceFilter;

    if (Object.keys(visitorWhere).length > 0) {
      sessionWhere.visitor = visitorWhere;
    }

    // 3. Query Sessions & Relations
    const sessions = await prisma.session.findMany({
      where: sessionWhere,
      include: {
        visitor: true,
        pageViews: true,
        customEvents: true,
      },
      orderBy: { startedAt: "desc" },
    });

    if (sessions.length === 0) {
      // Return structured empty state instead of failing
      return NextResponse.json({
        kpis: {
          totalVisitors: 0,
          uniqueVisitors: 0,
          totalSessions: 0,
          avgSessionDuration: 0,
          returningVisitors: 0,
          growthRate: 0,
          resumeDownloads: 0,
          githubClicks: 0,
          linkedinClicks: 0,
          contactClicks: 0,
          ctaClickRate: 0,
        },
        chartData: [],
        distributions: {
          trafficSources: [],
          countries: [],
          devices: [],
          browsers: [],
          operatingSystems: [],
          screenResolutions: [],
          scrollDepths: [],
        },
        topContent: {
          topPages: [],
          topProjects: [],
          mostClickedButtons: [],
        },
        recentActivity: [],
      });
    }

    // 4. Calculate Aggregate KPIs
    const totalSessions = sessions.length;
    const uniqueVisitorIds = new Set(sessions.map((s: any) => s.visitorId));
    const uniqueVisitorsCount = uniqueVisitorIds.size;
    const totalVisitorsCount = sessions.map((s: any) => s.visitorId).length;

    // Returning visitors
    const returningSessionsCount = sessions.filter((s: any) => s.visitor?.returning).length;

    // Average duration
    const totalDuration = sessions.reduce((acc: number, s: any) => acc + s.duration, 0);
    const avgSessionDuration = Math.round(totalDuration / totalSessions);

    // Custom events sums
    let resumeDownloads = 0;
    let githubClicks = 0;
    let linkedinClicks = 0;
    let contactClicks = 0;
    let ctaClicks = 0;

    sessions.forEach((s: any) => {
      s.customEvents.forEach((e: any) => {
        if (e.eventType === "resume_download") resumeDownloads++;
        if (e.eventType === "social_click" && e.eventName.includes("GitHub")) githubClicks++;
        if (e.eventType === "social_click" && e.eventName.includes("LinkedIn")) linkedinClicks++;
        if (e.eventType === "social_click" && e.eventName.includes("Contact")) contactClicks++;
        if (e.eventType === "cta_click") ctaClicks++;
      });
    });

    const ctaClickRate = totalSessions > 0 ? Math.round((ctaClicks / totalSessions) * 100) : 0;

    // Growth percentage check (Comparing current sessions to prior duration matching period)
    const periodLength = endDate.getTime() - startDate.getTime();
    const previousPeriodStart = new Date(startDate.getTime() - periodLength);
    const prevSessionsCount = await prisma.session.count({
      where: {
        startedAt: { gte: previousPeriodStart, lt: startDate },
        ...(sourceFilter ? { trafficSource: sourceFilter } : {}),
        ...(Object.keys(visitorWhere).length > 0 ? { visitor: visitorWhere } : {}),
      },
    });

    const growthRate =
      prevSessionsCount > 0
        ? Math.round(((totalSessions - prevSessionsCount) / prevSessionsCount) * 100)
        : 100; // Fallback to 100% growth on first cycles

    // 5. Aggregate Distributions
    const sourceMap: Record<string, number> = {};
    const countryMap: Record<string, number> = {};
    const deviceMap: Record<string, number> = {};
    const browserMap: Record<string, number> = {};
    const osMap: Record<string, number> = {};
    const resolutionMap: Record<string, number> = {};
    const scrollMap: Record<string, number> = { "25%": 0, "50%": 0, "75%": 0, "100%": 0 };

    const pageCountMap: Record<string, number> = {};
    const projectCountMap: Record<string, number> = {};
    const buttonCountMap: Record<string, number> = {};

    sessions.forEach((s: any) => {
      const v = s.visitor;
      // Sources
      sourceMap[s.trafficSource] = (sourceMap[s.trafficSource] || 0) + 1;
      
      if (v) {
        // Country
        countryMap[v.country] = (countryMap[v.country] || 0) + 1;
        // Device
        deviceMap[v.device] = (deviceMap[v.device] || 0) + 1;
        // Browser
        browserMap[v.browser] = (browserMap[v.browser] || 0) + 1;
        // OS
        osMap[v.os] = (osMap[v.os] || 0) + 1;
        // Resolution
        resolutionMap[v.screenResolution] = (resolutionMap[v.screenResolution] || 0) + 1;
      }

      // PageViews
      s.pageViews.forEach((pv: any) => {
        pageCountMap[pv.pagePath] = (pageCountMap[pv.pagePath] || 0) + 1;
      });

      // Events
      s.customEvents.forEach((e: any) => {
        if (e.eventType === "project_view" || e.eventName.toLowerCase().includes("project")) {
          projectCountMap[e.eventName] = (projectCountMap[e.eventName] || 0) + 1;
        }
        if (e.eventType === "cta_click") {
          buttonCountMap[e.eventName] = (buttonCountMap[e.eventName] || 0) + 1;
        }
        if (e.eventType === "scroll_depth") {
          scrollMap[e.eventName] = (scrollMap[e.eventName] || 0) + 1;
        }
      });
    });

    // Format distributions into chart ready lists
    const mapToValArray = (m: Record<string, number>) =>
      Object.entries(m)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);

    const trafficSources = mapToValArray(sourceMap);
    const countries = mapToValArray(countryMap).slice(0, 10);
    const devices = mapToValArray(deviceMap);
    const browsers = mapToValArray(browserMap).slice(0, 5);
    const operatingSystems = mapToValArray(osMap).slice(0, 5);
    const screenResolutions = mapToValArray(resolutionMap).slice(0, 5);
    const scrollDepths = Object.entries(scrollMap).map(([name, value]) => ({ name, value }));

    const topPages = Object.entries(pageCountMap)
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    const topProjects = Object.entries(projectCountMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const mostClickedButtons = Object.entries(buttonCountMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // 6. Time series Chart Data
    // Group pageviews/visits by date
    const chartDataMap: Record<string, { date: string; Views: number; Visits: number; Sessions: number }> = {};
    
    // Seed all dates in the range to ensure zero lines don't clip charts
    const tempDate = new Date(startDate.getTime());
    while (tempDate <= endDate) {
      const dStr = tempDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      chartDataMap[dStr] = { date: dStr, Views: 0, Visits: 0, Sessions: 0 };
      tempDate.setDate(tempDate.getDate() + 1);
    }

    sessions.forEach((s: any) => {
      const dStr = new Date(s.startedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      if (chartDataMap[dStr]) {
        chartDataMap[dStr].Sessions++;
        chartDataMap[dStr].Visits++; // Sessions are visitor visits
        chartDataMap[dStr].Views += s.pageViews.length;
      }
    });

    const chartData = Object.values(chartDataMap);

    // 7. Recent Activity Logs list
    const recentActivity = sessions.slice(0, 10).map((s: any) => ({
      id: s.id,
      time: new Date(s.startedAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      country: s.visitor?.country || "Unknown",
      page: s.pageViews[0]?.pagePath || "home",
      device: s.visitor?.device || "Desktop",
      source: s.trafficSource,
      duration: `${s.duration}s`,
    }));

    return NextResponse.json({
      kpis: {
        totalVisitors: totalVisitorsCount,
        uniqueVisitors: uniqueVisitorsCount,
        totalSessions,
        avgSessionDuration,
        returningVisitors: returningSessionsCount,
        growthRate,
        resumeDownloads,
        githubClicks,
        linkedinClicks,
        contactClicks,
        ctaClickRate,
      },
      chartData,
      distributions: {
        trafficSources,
        countries,
        devices,
        browsers,
        operatingSystems,
        screenResolutions,
        scrollDepths,
      },
      topContent: {
        topPages,
        topProjects,
        mostClickedButtons,
      },
      recentActivity,
    });
  } catch (error: any) {
    console.error("Stats API Error:", error);
    return NextResponse.json({ error: error?.message || "Internal Server Error" }, { status: 500 });
  }
}
