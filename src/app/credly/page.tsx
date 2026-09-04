"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  HiOutlineCheckBadge,
  HiOutlineSparkles,
  HiOutlineMagnifyingGlass,
  HiOutlineArrowTopRightOnSquare,
  HiOutlineFunnel,
  HiOutlineAcademicCap,
  HiOutlineCpuChip,
  HiOutlineXMark,
  HiOutlineShieldCheck,
  HiOutlineArrowPath,
} from "react-icons/hi2";
import { SiGooglecloud, SiCredly, SiOracle } from "react-icons/si";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface CredlyBadge {
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

// Immersive CSS-based StarField background
function StarField() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const stars = useMemo(() => {
    if (!mounted) return [];
    return Array.from({ length: 120 }, (_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 2.5 + 0.5,
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 2,
    }));
  }, [mounted]);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div className="absolute inset-0 bg-gradient-to-b from-[#030014] via-[#0a0025] to-[#050010]" />
      <div className="absolute top-[10%] left-[15%] w-[500px] h-[500px] rounded-full bg-purple-900/20 blur-[120px] animate-float-orb" />
      <div className="absolute top-[60%] right-[10%] w-[400px] h-[400px] rounded-full bg-blue-900/15 blur-[100px] animate-float-orb" style={{ animationDelay: "-7s" }} />
      <div className="absolute top-[35%] right-[40%] w-[300px] h-[300px] rounded-full bg-indigo-900/10 blur-[80px] animate-float-orb" style={{ animationDelay: "-14s" }} />

      {mounted &&
        stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{
              top: `${star.top}%`,
              left: `${star.left}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
            }}
          />
        ))}
    </div>
  );
}

export default function CredlyPage() {
  const [badges, setBadges] = useState<CredlyBadge[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "name">("newest");
  const [selectedBadge, setSelectedBadge] = useState<CredlyBadge | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Fetch Credly Badges dynamically from API route with optional forced live sync
  const fetchBadges = async (forceRefresh = false) => {
    try {
      if (forceRefresh) {
        setIsSyncing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const url = forceRefresh ? "/api/credly?refresh=true" : "/api/credly";
      const res = await fetch(url, { cache: "no-store" });
      const data = await res.json();

      if (data.success && Array.isArray(data.badges)) {
        setBadges(data.badges);
      } else {
        throw new Error(data.error || "Failed to load Credly badges");
      }
    } catch (err: any) {
      console.error("Credly page fetch error:", err);
      setError(err.message || "Unable to fetch live Credly badges");
    } finally {
      setLoading(false);
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchBadges(false);
  }, []);

  // Filter & Sort Badges
  const filteredBadges = useMemo(() => {
    let result = [...badges];

    // Category Filter
    if (activeCategory === "google") {
      result = result.filter((b) => b.issuer.toLowerCase().includes("google"));
    } else if (activeCategory === "ai") {
      result = result.filter(
        (b) =>
          b.name.toLowerCase().includes("ai") ||
          b.name.toLowerCase().includes("agent") ||
          b.description.toLowerCase().includes("agent") ||
          b.skills.some((s) => s.toLowerCase().includes("ai") || s.toLowerCase().includes("agent"))
      );
    } else if (activeCategory === "ibm") {
      result = result.filter((b) => b.issuer.toLowerCase().includes("ibm"));
    }

    // Search Query Filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (b) =>
          b.name.toLowerCase().includes(query) ||
          b.issuer.toLowerCase().includes(query) ||
          b.description.toLowerCase().includes(query) ||
          b.skills.some((s) => s.toLowerCase().includes(query))
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime();
      } else if (sortBy === "oldest") {
        return new Date(a.issuedAt).getTime() - new Date(b.issuedAt).getTime();
      } else {
        return a.name.localeCompare(b.name);
      }
    });

    return result;
  }, [badges, activeCategory, searchQuery, sortBy]);

  // Statistics
  const googleCloudCount = useMemo(
    () => badges.filter((b) => b.issuer.toLowerCase().includes("google")).length,
    [badges]
  );

  return (
    <div className="min-h-screen relative text-white overflow-x-clip py-12 px-3 sm:px-4 md:px-6">
      <StarField />

      <div className="w-full max-w-[1850px] mx-auto relative z-10">
        {/* ── Section 1: Hero Header ─────────────────────────────────────── */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2.5 px-5 py-2 mb-6 rounded-full border border-orange-500/30 bg-orange-500/10 backdrop-blur-md shadow-lg">
            <SiCredly className="w-4 h-4 text-orange-400" />
            <span className="text-xs font-mono font-bold tracking-wider text-orange-300 uppercase">
              Credly Verified Digital Credentials
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight text-white mb-6 leading-[0.95]">
            <span className="block text-white">Credly Badges</span>
            <span className="block text-purple-400 mt-2">& Google Cloud Skills</span>
          </h1>

          <p className="text-base md:text-lg lg:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed mb-8">
            Live dynamic showcase of official badges earned on Credly — validating expertise in Google Cloud AI Agents, Multi-Agent Architectures, Model Context Protocol (MCP), and Enterprise Engineering.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => fetchBadges(true)}
              disabled={isSyncing || loading}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all shadow-[0_0_25px_rgba(99,102,241,0.3)] disabled:opacity-50 cursor-pointer"
            >
              <HiOutlineArrowPath className={`w-4 h-4 ${isSyncing ? "animate-spin" : ""}`} />
              {isSyncing ? "Syncing Credly..." : "Sync Live Badges"}
            </button>
            <a
              href="https://www.credly.com/users/mahammadaftab"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-sm hover:scale-105 transition-all shadow-[0_0_30px_rgba(249,115,22,0.3)]"
            >
              <SiCredly className="w-4 h-4" />
              View Official Profile on Credly
              <HiOutlineArrowTopRightOnSquare className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* ── Section 2: Telemetry Metrics ───────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full mb-16">
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center">
            <div className="text-3xl font-black text-white mb-1">
              {loading ? "..." : badges.length}
            </div>
            <div className="text-xs font-mono font-bold uppercase text-gray-400">Total Badges Earned</div>
          </div>

          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center">
            <div className="text-3xl font-black text-indigo-400 mb-1">
              {loading ? "..." : googleCloudCount}
            </div>
            <div className="text-xs font-mono font-bold uppercase text-gray-400">Google Cloud Badges</div>
          </div>

          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center">
            <div className="text-3xl font-black text-emerald-400 mb-1">100%</div>
            <div className="text-xs font-mono font-bold uppercase text-gray-400">Verified Credentials</div>
          </div>

          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center">
            <div className="flex items-center justify-center gap-2 text-3xl font-black text-purple-400 mb-1">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
              </span>
              <span>Live</span>
            </div>
            <div className="text-xs font-mono font-bold uppercase text-gray-400">Credly API Real-Time Sync</div>
          </div>
        </div>

        {/* ── Section 3: Filter & Search Bar ──────────────────────────────── */}
        <div className="bg-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-3xl p-6 md:p-8 mb-12 w-full">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <HiOutlineMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search badges, issuers, or skills..."
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <HiOutlineXMark className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 items-center justify-center">
              {[
                { key: "all", label: `All (${badges.length})` },
                { key: "google", label: `Google Cloud (${googleCloudCount})` },
                { key: "ai", label: "AI & Agents" },
                { key: "ibm", label: "IBM SkillsBuild" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveCategory(tab.key)}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    activeCategory === tab.key
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 border border-indigo-400"
                      : "bg-white/5 text-gray-400 hover:text-white border border-white/10 hover:bg-white/10"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-gray-400 uppercase">Sort:</span>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-white/5 border border-white/10 text-white text-xs font-mono rounded-xl px-3 py-2 focus:outline-none cursor-pointer"
              >
                <option value="newest" className="bg-gray-900 text-white">Newest First</option>
                <option value="oldest" className="bg-gray-900 text-white">Oldest First</option>
                <option value="name" className="bg-gray-900 text-white">Name (A-Z)</option>
              </select>
            </div>

          </div>
        </div>

        {/* ── Section 4: Badges Grid ──────────────────────────────────────── */}
        {loading ? (
          <div className="py-24 text-center">
            <HiOutlineArrowPath className="w-10 h-10 text-indigo-400 animate-spin mx-auto mb-4" />
            <p className="text-base text-gray-300 font-medium">Fetching real-time badges from Credly...</p>
          </div>
        ) : error && badges.length === 0 ? (
          <div className="py-16 text-center max-w-xl mx-auto bg-white/[0.02] border border-white/10 rounded-3xl p-8">
            <p className="text-red-400 font-semibold mb-4">{error}</p>
            <button
              onClick={() => fetchBadges(false)}
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-full text-xs font-mono font-bold hover:bg-indigo-500 transition-colors"
            >
              Retry Connection
            </button>
          </div>
        ) : filteredBadges.length === 0 ? (
          <div className="py-20 text-center bg-white/[0.02] border border-white/10 rounded-3xl p-12 max-w-xl mx-auto">
            <HiOutlineMagnifyingGlass className="w-12 h-12 text-gray-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-2">No Badges Match Your Filter</h3>
            <p className="text-sm text-gray-400 mb-6">Try adjusting your search query or category filter.</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
              }}
              className="px-5 py-2 rounded-full bg-white/10 text-white text-xs font-mono font-bold hover:bg-white/20 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5 w-full">
            {filteredBadges.map((badge) => {
              const isGoogle = badge.issuer.toLowerCase().includes("google");
              const isIBM = badge.issuer.toLowerCase().includes("ibm");

              return (
                <div
                  key={badge.id}
                  className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl p-6 flex flex-col justify-between group hover:border-indigo-500/40 hover:shadow-[0_16px_60px_rgba(99,102,241,0.15)] transition-all duration-300 relative overflow-hidden"
                >
                  <div>
                    {/* Header Top Accent */}
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                          isGoogle
                            ? "bg-blue-500/10 text-blue-300 border border-blue-500/30"
                            : isIBM
                            ? "bg-cyan-500/10 text-cyan-300 border border-cyan-500/30"
                            : "bg-purple-500/10 text-purple-300 border border-purple-500/30"
                        }`}
                      >
                        {isGoogle ? (
                          <SiGooglecloud className="w-3 h-3 text-blue-400" />
                        ) : isIBM ? (
                          <HiOutlineShieldCheck className="w-3 h-3 text-cyan-400" />
                        ) : (
                          <HiOutlineShieldCheck className="w-3 h-3 text-purple-400" />
                        )}
                        {badge.issuer}
                      </span>

                      {badge.issuedAt && (
                        <span className="text-[10px] font-mono text-gray-400">
                          {badge.issuedAt}
                        </span>
                      )}
                    </div>

                    {/* Badge Image Preview */}
                    <div
                      className="relative w-36 h-36 mx-auto mb-5 cursor-pointer group/img"
                      onClick={() => setSelectedBadge(badge)}
                    >
                      {badge.imageUrl ? (
                        <img
                          src={badge.imageUrl}
                          alt={badge.name}
                          className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] group-hover/img:scale-108 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                          <SiCredly className="w-12 h-12 text-orange-400" />
                        </div>
                      )}
                    </div>

                    {/* Title */}
                    <h3
                      className="text-base font-bold text-white mb-2 leading-snug group-hover:text-indigo-300 transition-colors cursor-pointer text-center"
                      onClick={() => setSelectedBadge(badge)}
                    >
                      {badge.name}
                    </h3>

                    {/* Description Snippet */}
                    {badge.description && (
                      <p className="text-xs text-gray-400 leading-relaxed mb-4 line-clamp-3 text-center">
                        {badge.description}
                      </p>
                    )}

                    {/* Skill Pills */}
                    {badge.skills && badge.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 justify-center mb-4">
                        {badge.skills.slice(0, 3).map((skill) => (
                          <span
                            key={skill}
                            className="px-2 py-0.5 text-[9px] font-mono font-semibold rounded-md bg-white/5 border border-white/10 text-gray-300"
                          >
                            {skill}
                          </span>
                        ))}
                        {badge.skills.length > 3 && (
                          <span className="px-1.5 py-0.5 text-[9px] font-mono text-gray-400">
                            +{badge.skills.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-white/5 flex items-center gap-2">
                    <a
                      href={badge.badgeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-300 border border-orange-500/30 text-xs font-mono font-bold transition-all hover:border-orange-400"
                    >
                      Verify on Credly
                      <HiOutlineArrowTopRightOnSquare className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Section 5: Badge Detail Lightbox Modal ────────────────────── */}
        <AnimatePresence>
          {selectedBadge && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 md:p-6"
              onClick={() => setSelectedBadge(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#0b081d] border border-white/15 rounded-3xl p-6 md:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelectedBadge(null)}
                  className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-gray-300 hover:text-white hover:bg-white/20 transition-colors"
                >
                  <HiOutlineXMark className="w-5 h-5" />
                </button>

                {/* Badge Image */}
                <div className="w-40 h-40 mx-auto mb-6 relative">
                  <img
                    src={selectedBadge.imageUrl}
                    alt={selectedBadge.name}
                    className="w-full h-full object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]"
                  />
                </div>

                {/* Header Info */}
                <div className="text-center mb-6">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-2">
                    {selectedBadge.issuer}
                  </span>
                  <h2 className="text-2xl font-black text-white mb-1 leading-tight">
                    {selectedBadge.name}
                  </h2>
                  {selectedBadge.issuedAt && (
                    <p className="text-xs font-mono text-gray-400">
                      Issued on {selectedBadge.issuedAt}
                    </p>
                  )}
                </div>

                {/* Description */}
                {selectedBadge.description && (
                  <div className="mb-6 p-4 rounded-2xl bg-white/5 border border-white/10">
                    <h4 className="text-xs font-mono font-bold uppercase text-indigo-300 mb-2">
                      Credential Description
                    </h4>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      {selectedBadge.description}
                    </p>
                  </div>
                )}

                {/* Skills */}
                {selectedBadge.skills && selectedBadge.skills.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-xs font-mono font-bold uppercase text-indigo-300 mb-3">
                      Skills Validated
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedBadge.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 text-xs font-mono rounded-lg bg-white/5 border border-white/10 text-gray-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Verify Button */}
                <div className="pt-4 border-t border-white/10 flex justify-end">
                  <a
                    href={selectedBadge.badgeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs hover:scale-105 transition-transform"
                  >
                    Verify Credentials on Credly
                    <HiOutlineArrowTopRightOnSquare className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
