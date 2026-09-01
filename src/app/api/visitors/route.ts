import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Baseline count: 1248 (ensures visitor count never starts at 0 or loses previous state)
const BASELINE_COUNT = 1248;
const DATA_FILE_PATH = path.join(process.cwd(), "src", "data", "visitor_count.json");

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

// Memory fallback to ensure smooth atomic increments during high traffic
let inMemoryCount = getStoredCount();

export async function GET() {
  const currentCount = Math.max(getStoredCount(), inMemoryCount);
  return NextResponse.json({ count: currentCount });
}

export async function POST() {
  const currentCount = getStoredCount();
  inMemoryCount = Math.max(currentCount, inMemoryCount) + 1;
  saveCount(inMemoryCount);
  return NextResponse.json({ count: inMemoryCount });
}
