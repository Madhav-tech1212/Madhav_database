import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { visitorId, sessionId, type, data } = body;

    if (!visitorId || !sessionId || !type) {
      return NextResponse.json({ error: "Missing tracking payload parameters" }, { status: 400 });
    }

    const now = new Date();

    // 1. Resolve or Create Visitor
    let visitor = await prisma.visitor.findUnique({
      where: { id: visitorId },
    });

    if (!visitor) {
      // Determine country from headers or client data
      const countryHeader = req.headers.get("x-vercel-ip-country") || req.headers.get("cf-ipcountry") || data?.country || "India";
      
      visitor = await prisma.visitor.create({
        data: {
          id: visitorId,
          country: countryHeader,
          device: data?.device || "Desktop",
          browser: data?.browser || "Unknown",
          os: data?.os || "Unknown",
          screenResolution: data?.screenResolution || "Unknown",
          returning: false,
        },
      });
    } else if (!visitor.returning) {
      // Check if visitor has existing sessions, if so mark as returning
      const sessionCount = await prisma.session.count({
        where: { visitorId },
      });
      if (sessionCount > 0) {
        visitor = await prisma.visitor.update({
          where: { id: visitorId },
          data: { returning: true },
        });
      }
    }

    // 2. Resolve or Create Session
    let session = await prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      // Clean referrers into standard traffic sources
      const rawReferrer = data?.referrer || "";
      let trafficSource = "Direct";
      if (rawReferrer.includes("google.com")) trafficSource = "Google";
      else if (rawReferrer.includes("linkedin.com")) trafficSource = "LinkedIn";
      else if (rawReferrer.includes("github.com")) trafficSource = "GitHub";
      else if (rawReferrer.includes("t.co") || rawReferrer.includes("twitter.com") || rawReferrer.includes("x.com")) trafficSource = "Social";
      else if (rawReferrer) trafficSource = "Referral";

      // Allow client override (e.g. UTM parameters)
      if (data?.utmSource) {
        const utm = data.utmSource.toLowerCase();
        if (utm.includes("google")) trafficSource = "Google";
        else if (utm.includes("linkedin")) trafficSource = "LinkedIn";
        else if (utm.includes("github")) trafficSource = "GitHub";
        else if (utm.includes("referral")) trafficSource = "Referral";
        else trafficSource = data.utmSource;
      }

      session = await prisma.session.create({
        data: {
          id: sessionId,
          visitorId,
          trafficSource,
          referrer: rawReferrer,
          startedAt: now,
          lastActive: now,
          duration: 0,
        },
      });
    } else {
      // Update session activity duration
      const durationSeconds = Math.max(0, Math.floor((now.getTime() - new Date(session.startedAt).getTime()) / 1000));
      session = await prisma.session.update({
        where: { id: sessionId },
        data: {
          lastActive: now,
          duration: durationSeconds,
        },
      });
    }

    // 3. Log PageView
    if (type === "page_view" && data?.pagePath) {
      await prisma.pageView.create({
        data: {
          sessionId,
          pagePath: data.pagePath,
          viewedAt: now,
        },
      });
    }

    // 4. Log Custom Event
    if (type === "event" && data?.eventType && data?.eventName) {
      await prisma.customEvent.create({
        data: {
          sessionId,
          eventType: data.eventType,
          eventName: data.eventName,
          metadata: data.metadata ? JSON.stringify(data.metadata) : "",
          triggeredAt: now,
        },
      });
    }

    // 5. Update Daily Statistics aggregate cache
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Find daily statistics record
    const stats = await prisma.dailyStatistic.findUnique({
      where: { date: todayStart },
    });

    // Run aggregate calculations
    const pageViewCount = await prisma.pageView.count({
      where: { viewedAt: { gte: todayStart } },
    });

    const uniqueVisitorCount = await prisma.session.groupBy({
      by: ["visitorId"],
      where: { startedAt: { gte: todayStart } },
    });

    const totalSessionsToday = await prisma.session.count({
      where: { startedAt: { gte: todayStart } },
    });

    const avgSessionDurResult = await prisma.session.aggregate({
      _avg: { duration: true },
      where: { startedAt: { gte: todayStart } },
    });

    const avgSessionDur = avgSessionDurResult._avg.duration || 0;

    if (stats) {
      await prisma.dailyStatistic.update({
        where: { id: stats.id },
        data: {
          totalPageViews: pageViewCount,
          uniqueVisitors: uniqueVisitorCount.length,
          totalSessions: totalSessionsToday,
          avgSessionDuration: avgSessionDur,
        },
      });
    } else {
      await prisma.dailyStatistic.create({
        data: {
          date: todayStart,
          totalPageViews: pageViewCount,
          uniqueVisitors: uniqueVisitorCount.length,
          totalSessions: totalSessionsToday,
          avgSessionDuration: avgSessionDur,
        },
      });
    }

    return NextResponse.json({ success: true, duration: session.duration });
  } catch (error: any) {
    console.error("Tracking API Error:", error);
    return NextResponse.json({ error: error?.message || "Internal Server Error" }, { status: 500 });
  }
}
