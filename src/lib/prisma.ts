import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

// Initialize Prisma Client ONLY if a database connection URL is specified
const isDbConfigured = typeof process.env.DATABASE_URL === "string" && process.env.DATABASE_URL.length > 0;

console.log("[Analytics DB Connection] DATABASE_URL defined:", !!process.env.DATABASE_URL);
console.log("[Analytics DB Connection] Mode:", isDbConfigured ? "POSTGRESQL (SUPABASE)" : "LOCAL JSON FALLBACK");

let realPrisma: PrismaClient | null = null;
if (isDbConfigured) {
  try {
    realPrisma = new PrismaClient();
  } catch (e) {
    console.warn("Prisma Client failed to initialize. Falling back to local file DB.", e);
  }
}

// local JSON file-based database engine
class LocalJsonDatabase {
  private getFilePath() {
    const dir = path.join(process.cwd(), "src/data");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const file = path.join(dir, "analyticsDb.json");
    if (!fs.existsSync(file)) {
      fs.writeFileSync(
        file,
        JSON.stringify({ visitors: [], sessions: [], pageViews: [], customEvents: [], dailyStatistics: [] }, null, 2)
      );
    }
    return file;
  }

  private read() {
    try {
      const content = fs.readFileSync(this.getFilePath(), "utf-8");
      const parsed = JSON.parse(content);
      return {
        visitors: parsed.visitors || [],
        sessions: parsed.sessions || [],
        pageViews: parsed.pageViews || [],
        customEvents: parsed.customEvents || [],
        dailyStatistics: parsed.dailyStatistics || [],
      };
    } catch {
      return { visitors: [], sessions: [], pageViews: [], customEvents: [], dailyStatistics: [] };
    }
  }

  private write(data: any) {
    try {
      fs.writeFileSync(this.getFilePath(), JSON.stringify(data, null, 2));
    } catch (e) {
      console.error("Local JSON DB Write Error:", e);
    }
  }

  // --- Visitor Methods ---
  public visitor = {
    findUnique: async (args: { where: { id: string } }) => {
      const db = this.read();
      const visitor = db.visitors.find((v: any) => v.id === args.where.id);
      return visitor || null;
    },
    create: async (args: { data: any }) => {
      const db = this.read();
      const newVisitor = {
        ...args.data,
        firstSeen: new Date().toISOString(),
      };
      db.visitors.push(newVisitor);
      this.write(db);
      return newVisitor;
    },
    update: async (args: { where: { id: string }; data: any }) => {
      const db = this.read();
      const idx = db.visitors.findIndex((v: any) => v.id === args.where.id);
      if (idx !== -1) {
        db.visitors[idx] = { ...db.visitors[idx], ...args.data };
        this.write(db);
        return db.visitors[idx];
      }
      return null;
    },
  };

  // --- Session Methods ---
  public session = {
    findUnique: async (args: { where: { id: string } }) => {
      const db = this.read();
      const session = db.sessions.find((s: any) => s.id === args.where.id);
      return session || null;
    },
    create: async (args: { data: any }) => {
      const db = this.read();
      const newSession = {
        ...args.data,
        startedAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        duration: 0,
      };
      db.sessions.push(newSession);
      this.write(db);
      return newSession;
    },
    update: async (args: { where: { id: string }; data: any }) => {
      const db = this.read();
      const idx = db.sessions.findIndex((s: any) => s.id === args.where.id);
      if (idx !== -1) {
        // Parse date keys to handle ISO strings appropriately
        const updated = {
          ...db.sessions[idx],
          ...args.data,
          lastActive: new Date().toISOString(),
        };
        db.sessions[idx] = updated;
        this.write(db);
        return updated;
      }
      return null;
    },
    findMany: async (args: { where?: any; include?: any; orderBy?: any }) => {
      const db = this.read();
      let result = [...db.sessions];

      // Date Filters filtering
      if (args.where?.startedAt?.gte) {
        const threshold = new Date(args.where.startedAt.gte).getTime();
        result = result.filter((s: any) => new Date(s.startedAt).getTime() >= threshold);
      }
      if (args.where?.startedAt?.lte) {
        const threshold = new Date(args.where.startedAt.lte).getTime();
        result = result.filter((s: any) => new Date(s.startedAt).getTime() <= threshold);
      }

      // Referral filters
      if (args.where?.trafficSource) {
        result = result.filter((s: any) => s.trafficSource === args.where.trafficSource);
      }

      // Visitor filters
      if (args.where?.visitor) {
        const vFilter = args.where.visitor;
        result = result.filter((s: any) => {
          const v = db.visitors.find((visitor: any) => visitor.id === s.visitorId);
          if (!v) return false;
          if (vFilter.country && v.country !== vFilter.country) return false;
          if (vFilter.browser && v.browser !== vFilter.browser) return false;
          if (vFilter.os && v.os !== vFilter.os) return false;
          if (vFilter.device && v.device !== vFilter.device) return false;
          return true;
        });
      }

      // Order By startedAt desc
      result.sort((a: any, b: any) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());

      // Include mock relations
      return result.map((s: any) => ({
        ...s,
        visitor: db.visitors.find((v: any) => v.id === s.visitorId) || null,
        pageViews: db.pageViews.filter((pv: any) => pv.sessionId === s.id),
        customEvents: db.customEvents.filter((ce: any) => ce.sessionId === s.id),
      }));
    },
    count: async (args?: { where?: any }) => {
      const db = this.read();
      let result = [...db.sessions];

      if (args?.where?.startedAt?.gte) {
        const threshold = new Date(args.where.startedAt.gte).getTime();
        result = result.filter((s: any) => new Date(s.startedAt).getTime() >= threshold);
      }
      if (args?.where?.startedAt?.lt) {
        const threshold = new Date(args.where.startedAt.lt).getTime();
        result = result.filter((s: any) => new Date(s.startedAt).getTime() < threshold);
      }

      // Filter relations
      if (args?.where?.visitor) {
        const vFilter = args.where.visitor;
        result = result.filter((s: any) => {
          const v = db.visitors.find((visitor: any) => visitor.id === s.visitorId);
          if (!v) return false;
          if (vFilter.country && v.country !== vFilter.country) return false;
          return true;
        });
      }

      return result.length;
    },
    groupBy: async (args: { by: string[]; where?: any }) => {
      const db = this.read();
      let result = [...db.sessions];

      if (args.where?.startedAt?.gte) {
        const threshold = new Date(args.where.startedAt.gte).getTime();
        result = result.filter((s: any) => new Date(s.startedAt).getTime() >= threshold);
      }

      // Group by visitorId or trafficSource
      if (args.by.includes("visitorId")) {
        const groups: Record<string, number> = {};
        result.forEach((s: any) => {
          groups[s.visitorId] = (groups[s.visitorId] || 0) + 1;
        });
        return Object.keys(groups).map((visitorId) => ({ visitorId }));
      }

      if (args.by.includes("trafficSource")) {
        const groups: Record<string, number> = {};
        result.forEach((s: any) => {
          groups[s.trafficSource] = (groups[s.trafficSource] || 0) + 1;
        });
        return Object.entries(groups).map(([trafficSource, count]) => ({
          trafficSource,
          _count: { id: count },
        }));
      }

      return [];
    },
    aggregate: async (args: { _avg?: { duration?: boolean }; where?: any }) => {
      const db = this.read();
      let result = [...db.sessions];

      if (args.where?.startedAt?.gte) {
        const threshold = new Date(args.where.startedAt.gte).getTime();
        result = result.filter((s: any) => new Date(s.startedAt).getTime() >= threshold);
      }

      if (args.where?.visitor?.device) {
        const deviceFilter = args.where.visitor.device;
        result = result.filter((s: any) => {
          const v = db.visitors.find((visitor: any) => visitor.id === s.visitorId);
          return v && v.device === deviceFilter;
        });
      }

      const totalDuration = result.reduce((acc: number, s: any) => acc + (s.duration || 0), 0);
      const avg = result.length > 0 ? totalDuration / result.length : 0;
      return {
        _avg: { duration: avg },
      };
    },
  };

  // --- PageView Methods ---
  public pageView = {
    create: async (args: { data: any }) => {
      const db = this.read();
      const newView = {
        id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 10),
        ...args.data,
        viewedAt: new Date().toISOString(),
      };
      db.pageViews.push(newView);
      this.write(db);
      return newView;
    },
    count: async (args?: { where?: any }) => {
      const db = this.read();
      let result = [...db.pageViews];

      if (args?.where?.viewedAt?.gte) {
        const threshold = new Date(args.where.viewedAt.gte).getTime();
        result = result.filter((v: any) => new Date(v.viewedAt).getTime() >= threshold);
      }

      return result.length;
    },
    findMany: async (args: { where?: any; include?: any; orderBy?: any }) => {
      const db = this.read();
      let result = [...db.pageViews];

      if (args.where?.viewedAt?.gte) {
        const threshold = new Date(args.where.viewedAt.gte).getTime();
        result = result.filter((v: any) => new Date(v.viewedAt).getTime() >= threshold);
      }

      return result.map((v: any) => ({
        ...v,
        session: db.sessions.find((s: any) => s.id === v.sessionId) || null,
      }));
    },
    groupBy: async (args: { by: string[]; _count?: any; orderBy?: any; take?: number }) => {
      const db = this.read();
      const groups: Record<string, number> = {};
      
      db.pageViews.forEach((v: any) => {
        groups[v.pagePath] = (groups[v.pagePath] || 0) + 1;
      });

      const formatted = Object.entries(groups).map(([pagePath, count]) => ({
        pagePath,
        _count: { id: count },
      }));

      // Sort desc
      formatted.sort((a, b) => b._count.id - a._count.id);
      return args.take ? formatted.slice(0, args.take) : formatted;
    },
  };

  // --- CustomEvent Methods ---
  public customEvent = {
    create: async (args: { data: any }) => {
      const db = this.read();
      const newEvent = {
        id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 10),
        ...args.data,
        triggeredAt: new Date().toISOString(),
      };
      db.customEvents.push(newEvent);
      this.write(db);
      return newEvent;
    },
    count: async (args?: { where?: any }) => {
      const db = this.read();
      let result = [...db.customEvents];

      if (args?.where?.eventType) {
        result = result.filter((e: any) => e.eventType === args.where.eventType);
      }

      return result.length;
    },
    groupBy: async (args: { by: string[]; _count?: any; where?: any; orderBy?: any; take?: number }) => {
      const db = this.read();
      let result = [...db.customEvents];

      if (args.where?.eventType) {
        result = result.filter((e: any) => e.eventType === args.where.eventType);
      }

      const groups: Record<string, number> = {};
      result.forEach((e: any) => {
        groups[e.eventName] = (groups[e.eventName] || 0) + 1;
      });

      const formatted = Object.entries(groups).map(([eventName, count]) => ({
        eventName,
        _count: { id: count },
      }));

      formatted.sort((a, b) => b._count.id - a._count.id);
      return args.take ? formatted.slice(0, args.take) : formatted;
    },
  };

  // --- DailyStatistic Methods ---
  public dailyStatistic = {
    findUnique: async (args: { where: { date: Date } }) => {
      const db = this.read();
      const dateStr = args.where.date.toISOString().split("T")[0];
      const stats = db.dailyStatistics.find((d: any) => d.date.split("T")[0] === dateStr);
      return stats || null;
    },
    create: async (args: { data: any }) => {
      const db = this.read();
      const newStats = {
        id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 10),
        ...args.data,
        date: args.data.date.toISOString(),
      };
      db.dailyStatistics.push(newStats);
      this.write(db);
      return newStats;
    },
    update: async (args: { where: { id: string }; data: any }) => {
      const db = this.read();
      const idx = db.dailyStatistics.findIndex((d: any) => d.id === args.where.id);
      if (idx !== -1) {
        const updated = {
          ...db.dailyStatistics[idx],
          ...args.data,
          ...(args.data.date ? { date: args.data.date.toISOString() } : {}),
        };
        db.dailyStatistics[idx] = updated;
        this.write(db);
        return updated;
      }
      return null;
    },
  };
}

const localDb = new LocalJsonDatabase();

export const prisma = (realPrisma || localDb) as unknown as PrismaClient;
