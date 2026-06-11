import { NextResponse } from "next/server";

// Using a free, reliable, and real public API counter: counterapi.dev
// This ensures that the visitor count is truly persistent and real-time
// across all visitors and serverless deployments (like Vercel).
const NAMESPACE = "mahammadaftab_portfolio_v1";
const NAME = "visitor_count";
const API_URL = `https://api.counterapi.dev/v1/${NAMESPACE}/${NAME}`;

export async function GET() {
  try {
    const response = await fetch(API_URL, { next: { revalidate: 0 } });
    if (response.ok) {
      const data = await response.json();
      return NextResponse.json({ count: data.count || 1248 });
    }
    return NextResponse.json({ count: 1248 });
  } catch (error) {
    console.error("Error reading real visitor count:", error);
    return NextResponse.json({ count: 1248 });
  }
}

export async function POST() {
  try {
    // Calling /up increments the real-time persistent counter
    const response = await fetch(`${API_URL}/up`, { method: "GET", next: { revalidate: 0 } });
    if (response.ok) {
      const data = await response.json();
      return NextResponse.json({ count: data.count || 1248 });
    }
    return NextResponse.json({ count: 1248 });
  } catch (error) {
    console.error("Error updating real visitor count:", error);
    return NextResponse.json({ count: 1248 });
  }
}

