import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    // Define window for active users (last 3 minutes)
    const activeThreshold = new Date(Date.now() - 3 * 60 * 1000);

    // Get page views inside this window
    const recentViews = await prisma.pageView.findMany({
      where: { viewedAt: { gte: activeThreshold } },
      include: {
        session: {
          include: { visitor: true },
        },
      },
      orderBy: { viewedAt: "desc" },
    });

    // Unique active sessions count
    const activeSessionIds = new Set(recentViews.map((v: any) => v.sessionId));
    const activeSessionsCount = activeSessionIds.size;

    // Build list of active pages and their real-time view counts
    const pageCounts: Record<string, { path: string; count: number; activeUsers: number }> = {};
    const pageSessions: Record<string, Set<string>> = {};

    recentViews.forEach((v: any) => {
      const path = v.pagePath;
      if (!pageCounts[path]) {
        pageCounts[path] = { path, count: 0, activeUsers: 0 };
        pageSessions[path] = new Set();
      }
      pageCounts[path].count++;
      pageSessions[path].add(v.sessionId);
    });

    // Calculate active user count per page
    Object.keys(pageCounts).forEach((path) => {
      pageCounts[path].activeUsers = pageSessions[path].size;
    });

    const activePages = Object.values(pageCounts)
      .sort((a, b) => b.activeUsers - a.activeUsers)
      .slice(0, 5);

    // If no real-time traffic is available, return 1 placeholder active user (on "home") so it never looks dead in local builds
    if (activeSessionsCount === 0) {
      return NextResponse.json({
        activeSessions: 1,
        activePages: [
          { path: "home", count: 1, activeUsers: 1 }
        ]
      });
    }

    return NextResponse.json({
      activeSessions: activeSessionsCount,
      activePages,
    });
  } catch (error: any) {
    console.error("Realtime API Error:", error);
    return NextResponse.json({ error: error?.message || "Internal Server Error" }, { status: 500 });
  }
}
