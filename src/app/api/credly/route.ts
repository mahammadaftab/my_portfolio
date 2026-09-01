import { NextResponse } from "next/server";

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
const CREDLY_ENDPOINT = `https://www.credly.com/users/${CREDLY_USERNAME}/badges.json`;

let cachedBadges: CredlyBadge[] | null = null;
let lastFetchTime = 0;
const CACHE_TTL = 1000 * 60 * 30; // 30 minutes in-memory cache

export async function GET() {
  const now = Date.now();

  // Return cached data if fresh
  if (cachedBadges && now - lastFetchTime < CACHE_TTL) {
    return NextResponse.json({
      success: true,
      count: cachedBadges.length,
      username: CREDLY_USERNAME,
      profileUrl: `https://www.credly.com/users/${CREDLY_USERNAME}`,
      badges: cachedBadges,
      cached: true,
    });
  }

  try {
    const response = await fetch(CREDLY_ENDPOINT, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "application/json",
      },
      next: { revalidate: 1800 },
    });

    if (!response.ok) {
      throw new Error(`Credly API returned HTTP status ${response.status}`);
    }

    const data = await response.json();
    const rawBadges = data.data || [];

    const badges: CredlyBadge[] = rawBadges.map((b: any) => {
      const template = b.badge_template || {};
      const issuerEntity =
        template.issuer?.entities?.[0]?.entity ||
        b.issuer?.entities?.[0]?.entity ||
        {};

      const skills = Array.isArray(template.skills)
        ? template.skills.map((s: any) => (typeof s === "string" ? s : s.name)).filter(Boolean)
        : [];

      return {
        id: b.id,
        name: template.name || "Verified Credential",
        issuer: issuerEntity.name || b.issuer?.summary || "Google Cloud",
        description: template.description || "",
        imageUrl: template.image_url || b.image_url || "",
        issuedAt: b.issued_at_date || b.issued_at || "",
        badgeUrl: `https://www.credly.com/badges/${b.id}`,
        level: template.level || null,
        skills,
      };
    });

    cachedBadges = badges;
    lastFetchTime = now;

    return NextResponse.json({
      success: true,
      count: badges.length,
      username: CREDLY_USERNAME,
      profileUrl: `https://www.credly.com/users/${CREDLY_USERNAME}`,
      badges,
      cached: false,
    });
  } catch (error) {
    console.error("Error fetching Credly badges:", error);

    // If cache exists, return stale cache on network failure
    if (cachedBadges) {
      return NextResponse.json({
        success: true,
        count: cachedBadges.length,
        username: CREDLY_USERNAME,
        profileUrl: `https://www.credly.com/users/${CREDLY_USERNAME}`,
        badges: cachedBadges,
        fallback: true,
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch Credly badges",
        profileUrl: `https://www.credly.com/users/${CREDLY_USERNAME}`,
      },
      { status: 500 }
    );
  }
}
