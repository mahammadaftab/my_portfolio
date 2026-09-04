import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const BASELINE_COUNT = 1248;
const DATA_FILE_PATH = path.join(process.cwd(), "src", "data", "visitor_count.json");
const ACTIVE_SESSION_WINDOW_MS = 45000; // 45 seconds

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  "Pragma": "no-cache",
  "Expires": "0",
};

// Initialize Upstash Redis if configured in environment variables
let redis: any = null;
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  try {
    const { Redis } = await import("@upstash/redis");
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  } catch (error) {
    console.warn("Visitors route: Failed to initialize Redis:", error);
  }
}

// File storage helper
function getStoredCount(): number {
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const content = fs.readFileSync(DATA_FILE_PATH, "utf-8");
      const parsed = JSON.parse(content);
      if (typeof parsed.count === "number" && parsed.count >= BASELINE_COUNT) {
        return parsed.count;
      }
    }
  } catch (error) {
    console.error("Error reading persistent visitor count file:", error);
  }
  return BASELINE_COUNT;
}

function saveCount(count: number): void {
  try {
    const dir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(
      DATA_FILE_PATH,
      JSON.stringify({ count, updatedAt: new Date().toISOString() }, null, 2),
      "utf-8"
    );
  } catch (error) {
    console.error("Error saving persistent visitor count file:", error);
  }
}

// Global state in node process memory
const globalStore = global as unknown as {
  visitorCount?: number;
  activeSessions?: Map<string, number>;
  countedSessions?: Set<string>;
};

if (!globalStore.visitorCount) {
  globalStore.visitorCount = getStoredCount();
}
if (!globalStore.activeSessions) {
  globalStore.activeSessions = new Map<string, number>();
}
if (!globalStore.countedSessions) {
  globalStore.countedSessions = new Set<string>();
}

function pruneInMemActiveSessions(): number {
  const now = Date.now();
  const sessions = globalStore.activeSessions!;
  for (const [id, timestamp] of sessions.entries()) {
    if (now - timestamp > ACTIVE_SESSION_WINDOW_MS) {
      sessions.delete(id);
    }
  }
  return Math.max(1, sessions.size);
}

async function getActiveVisitorsCount(): Promise<number> {
  if (redis) {
    try {
      const keys = await redis.keys("active_visitor:*");
      return Math.max(1, keys.length);
    } catch (err) {
      console.warn("Redis error fetching active visitors, falling back:", err);
    }
  }
  return pruneInMemActiveSessions();
}

async function getTotalVisitorCount(): Promise<number> {
  if (redis) {
    try {
      const val = await redis.get("portfolio_total_visitors");
      if (val !== null && val !== undefined) {
        const num = Number(val);
        if (!isNaN(num) && num >= BASELINE_COUNT) {
          globalStore.visitorCount = Math.max(globalStore.visitorCount || BASELINE_COUNT, num);
          return globalStore.visitorCount;
        }
      }
      // Seed Redis with initial baseline count
      await redis.set("portfolio_total_visitors", globalStore.visitorCount || BASELINE_COUNT);
    } catch (err) {
      console.warn("Redis error reading total visitors, falling back:", err);
    }
  }
  return Math.max(BASELINE_COUNT, globalStore.visitorCount || getStoredCount());
}

async function registerHeartbeat(visitorId: string, isNewSession: boolean): Promise<{ count: number; active: number }> {
  const now = Date.now();
  
  // 1. Touch active session
  globalStore.activeSessions!.set(visitorId, now);

  if (redis) {
    try {
      await redis.set(`active_visitor:${visitorId}`, "1", { ex: Math.ceil(ACTIVE_SESSION_WINDOW_MS / 1000) });
    } catch (err) {
      console.warn("Redis heartbeat failed:", err);
    }
  }

  // 2. Increment total count if new session
  let shouldIncrement = false;
  if (isNewSession && !globalStore.countedSessions!.has(visitorId)) {
    globalStore.countedSessions!.add(visitorId);
    shouldIncrement = true;
  }

  if (shouldIncrement) {
    globalStore.visitorCount = (globalStore.visitorCount || BASELINE_COUNT) + 1;
    saveCount(globalStore.visitorCount);

    if (redis) {
      try {
        await redis.incr("portfolio_total_visitors");
      } catch (err) {
        console.warn("Redis increment failed:", err);
      }
    }
  }

  const [count, active] = await Promise.all([
    getTotalVisitorCount(),
    getActiveVisitorsCount(),
  ]);

  return { count, active };
}

export async function GET() {
  pruneInMemActiveSessions();
  const [count, active] = await Promise.all([
    getTotalVisitorCount(),
    getActiveVisitorsCount(),
  ]);

  return NextResponse.json({ count, active }, { headers: NO_CACHE_HEADERS });
}

export async function POST(request: Request) {
  let visitorId = "default-session";
  let isNewSession = false;

  try {
    const body = await request.json();
    if (body.visitorId && typeof body.visitorId === "string") {
      visitorId = body.visitorId;
    }
    if (typeof body.isNewSession === "boolean") {
      isNewSession = body.isNewSession;
    }
  } catch {
    // Empty body is acceptable
  }

  const result = await registerHeartbeat(visitorId, isNewSession);
  return NextResponse.json(result, { headers: NO_CACHE_HEADERS });
}

