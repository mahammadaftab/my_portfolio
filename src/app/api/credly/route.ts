import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export interface CredlyBadge {
  id: string;
  name: string;
  issuer: string;
  description: string;
  imageUrl: string;
  issuedAt: string;
  badgeUrl: string;
  level: string | null;
  skills: string[];
}

const CREDLY_USERNAME = "mahammadaftab";
const BASE_CREDLY_ENDPOINT = `https://www.credly.com/users/${CREDLY_USERNAME}/badges.json`;

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  "Pragma": "no-cache",
  "Expires": "0",
};

let cachedBadges: CredlyBadge[] | null = null;
let lastFetchTime = 0;
const CACHE_TTL = 1000 * 60 * 2; // 2 minute short cache

async function fetchAllPagesFromCredly(): Promise<CredlyBadge[]> {
  const allRawBadges: any[] = [];
  let page = 1;
  let totalPages = 1;

  const headers = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    Accept: "application/json",
  };

  while (page <= totalPages) {
    const url = `${BASE_CREDLY_ENDPOINT}?page=${page}`;
    const response = await fetch(url, {
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Credly API returned status ${response.status} on page ${page}`);
    }

    const data = await response.json();
    if (data.data && Array.isArray(data.data)) {
      allRawBadges.push(...data.data);
    }

    if (data.metadata && typeof data.metadata.total_pages === "number") {
      totalPages = data.metadata.total_pages;
    } else {
      break;
    }

    page++;
  }

  // Deduplicate and format badges
  const badgeMap = new Map<string, CredlyBadge>();

  for (const b of allRawBadges) {
    if (!b.id || badgeMap.has(b.id)) continue;

    const template = b.badge_template || {};
    const issuerEntity =
      template.issuer?.entities?.[0]?.entity ||
      b.issuer?.entities?.[0]?.entity ||
      {};

    const skills = Array.isArray(template.skills)
      ? template.skills.map((s: any) => (typeof s === "string" ? s : s.name)).filter(Boolean)
      : [];

    badgeMap.set(b.id, {
      id: b.id,
      name: template.name || "Verified Credential",
      issuer: issuerEntity.name || b.issuer?.summary || "Google Cloud",
      description: template.description || "",
      imageUrl: template.image_url || b.image_url || "",
      issuedAt: b.issued_at_date || b.issued_at || "",
      badgeUrl: `https://www.credly.com/badges/${b.id}`,
      level: template.level || null,
      skills,
    });
  }

  const badges = Array.from(badgeMap.values());

  // Sort newest first by date
  badges.sort((a, b) => new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime());

  return badges;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const forceRefresh = url.searchParams.get("refresh") === "true";
  const now = Date.now();

  if (!forceRefresh && cachedBadges && now - lastFetchTime < CACHE_TTL) {
    return NextResponse.json(
      {
        success: true,
        count: cachedBadges.length,
        username: CREDLY_USERNAME,
        profileUrl: `https://www.credly.com/users/${CREDLY_USERNAME}`,
        badges: cachedBadges,
        cached: true,
      },
      { headers: NO_CACHE_HEADERS }
    );
  }

  try {
    const badges = await fetchAllPagesFromCredly();
    cachedBadges = badges;
    lastFetchTime = now;

    return NextResponse.json(
      {
        success: true,
        count: badges.length,
        username: CREDLY_USERNAME,
        profileUrl: `https://www.credly.com/users/${CREDLY_USERNAME}`,
        badges,
        cached: false,
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error: any) {
    console.error("Error fetching Credly badges:", error);

    if (cachedBadges) {
      return NextResponse.json(
        {
          success: true,
          count: cachedBadges.length,
          username: CREDLY_USERNAME,
          profileUrl: `https://www.credly.com/users/${CREDLY_USERNAME}`,
          badges: cachedBadges,
          fallback: true,
        },
        { headers: NO_CACHE_HEADERS }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch Credly badges",
        profileUrl: `https://www.credly.com/users/${CREDLY_USERNAME}`,
      },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

