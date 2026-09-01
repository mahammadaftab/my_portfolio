"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowTopRightOnSquareIcon, DocumentTextIcon, EyeIcon } from "@heroicons/react/24/outline";
import experienceData from "@/data/experience.json";
import CertificateLightbox from "@/components/certificate-lightbox";
import BootcampLightbox from "@/components/bootcamp-lightbox";
import HackathonLightbox from "@/components/hackthon-lightbox";
import InternshipLightbox from "@/components/internship-lightbox";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Media {
  type: "image" | "pdf" | "video";
  url: string;
  caption?: string;
}

interface Certificate {
  id: number;
  category?: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
  media: Media[];
}

interface Hackathon {
  id: number;
  mode?: "Offline" | "Online";
  title: string;
  issuer: string;
  date: string;
  description: string;
  achievement?: string;
  keyAchievement?: string;
  highlighted?: boolean;
  githubLink?: string;
  liveLink?: string;
  media: Media[];
}

interface Internship {
  id: number;
  title: string;
  issuer: string;
  date: string;
  description: string;
  media: Media[];
}

interface Bootcamp {
  id: number;
  title: string;
  issuer: string;
  date: string;
  description: string | string[];
  media: Media[];
}

// ─── Animated Counter Component ──────────────────────────────────────────────

function AnimatedCounter({ target, suffix = "", duration = 2000 }: { target: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(target);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (now: number) => {
      if (!startTime) startTime = now;
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      setCount(current);
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [target, duration]);

  return <span>{count}{suffix}</span>;
}

// ─── Section Header Component ────────────────────────────────────────────────

function SectionHeader({ title, subtitle, icon }: { title: string; subtitle?: string; icon: React.ReactNode }) {
  return (
    <div className="text-center mb-16">
      <div className="inline-flex items-center gap-3 mb-4 px-6 py-2.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-lg">
        <span className="text-2xl">{icon}</span>
        <span className="text-xs font-mono font-bold tracking-[0.2em] uppercase text-indigo-400">{title}</span>
      </div>
      {subtitle && (
        <p className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg leading-relaxed mt-3">{subtitle}</p>
      )}
    </div>
  );
}

// ─── Star Background Layer ───────────────────────────────────────────────────

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
      {/* Deep space gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030014] via-[#0a0025] to-[#050010]" />

      {/* Nebula orbs */}
      <div className="absolute top-[10%] left-[15%] w-[500px] h-[500px] rounded-full bg-purple-900/20 blur-[120px] animate-float-orb" />
      <div className="absolute top-[60%] right-[10%] w-[400px] h-[400px] rounded-full bg-blue-900/15 blur-[100px] animate-float-orb" style={{ animationDelay: "-7s" }} />
      <div className="absolute top-[35%] right-[40%] w-[300px] h-[300px] rounded-full bg-indigo-900/10 blur-[80px] animate-float-orb" style={{ animationDelay: "-14s" }} />

      {/* Star particles */}
      {mounted && stars.map((star) => (
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

// ─── Main Page Component ─────────────────────────────────────────────────────

export default function Experience() {
  const { experiences, certificates, internships, bootcamps, hackthons, achievements_meta } = experienceData as any;
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [selectedBootcamp, setSelectedBootcamp] = useState<Bootcamp | null>(null);
  const [selectedHackathon, setSelectedHackathon] = useState<Hackathon | null>(null);
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);
  const [isCertificateLightboxOpen, setIsCertificateLightboxOpen] = useState(false);
  const [isBootcampLightboxOpen, setIsBootcampLightboxOpen] = useState(false);
  const [isHackathonLightboxOpen, setIsHackathonLightboxOpen] = useState(false);
  const [isInternshipLightboxOpen, setIsInternshipLightboxOpen] = useState(false);
  const [certFilter, setCertFilter] = useState("all");

  const certCategories = [
    { key: "all", label: "All Credentials", color: "from-purple-500 to-blue-500" },
    { key: "ai", label: "AI & GenAI", color: "from-violet-500 to-purple-500" },
    { key: "programming", label: "Programming", color: "from-blue-500 to-cyan-500" },
    { key: "basics", label: "Fundamentals", color: "from-emerald-500 to-teal-500" },
    { key: "community", label: "Community", color: "from-amber-500 to-orange-500" },
  ];

  const filteredCertificates = useMemo(() => {
    if (certFilter === "all") return certificates;
    return certificates.filter((c: any) => c.category === certFilter);
  }, [certFilter, certificates]);

  const stats = achievements_meta?.stats || { hackathons: 5, certifications: 20, projects: 10, internships: 2, bootcampDays: 5, technologies: 15 };
  const futureVision = achievements_meta?.futureVision || [];

  return (
    <div className="min-h-screen relative text-white overflow-x-clip">
      {/* Immersive Space Background */}
      <StarField />

      {/* Content Layer */}
      <div className="relative z-10">

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 1: HERO
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="pt-24 pb-20 px-6 md:px-12">
          <div className="container mx-auto max-w-[1600px]">
            <div className="text-center mb-16">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2.5 px-5 py-2 mb-6 rounded-full border border-white/10 bg-white/5 backdrop-blur-md shadow-lg">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                <span className="text-xs font-mono font-bold tracking-wider text-emerald-400 uppercase">Engineering Track Record & Recognition</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight text-white mb-6 leading-[0.95]">
                <span className="block text-white">
                  Achievements
                </span>
                <span className="block text-purple-400 mt-2">
                  & Engineering Milestones
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base md:text-lg lg:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                A verified showcase of certifications, hackathon victories, industry internships, and pivotal milestones defining my journey in software engineering & AI.
              </p>
            </div>

            {/* Telemetry Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
              {[
                { label: "Hackathons", value: stats.hackathons, suffix: "+", icon: "⚡", bg: "bg-white/[0.03]", border: "border-rose-500/30" },
                { label: "Certifications", value: stats.certifications, suffix: "+", icon: "📜", bg: "bg-white/[0.03]", border: "border-blue-500/30" },
                { label: "Projects Shipped", value: stats.projects, suffix: "+", icon: "🚀", bg: "bg-white/[0.03]", border: "border-purple-500/30" },
                { label: "Technologies", value: stats.technologies, suffix: "+", icon: "💻", bg: "bg-white/[0.03]", border: "border-emerald-500/30" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className={`relative rounded-2xl ${stat.bg} backdrop-blur-xl border ${stat.border} p-6 md:p-8 text-center group hover:border-indigo-500/40 hover:shadow-[0_8px_40px_rgba(99,102,241,0.15)] transition-all duration-300`}
                >
                  <div className="text-3xl md:text-4xl mb-3">{stat.icon}</div>
                  <div className="text-3xl md:text-5xl font-black text-white mb-2 tracking-tight">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-xs font-mono font-bold tracking-wider text-gray-400 uppercase">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Gradient Divider ────────────────────────────────────────────── */}
        <div className="container mx-auto px-6 md:px-12 max-w-[1600px]">
          <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 2: PROFESSIONAL MILESTONES TIMELINE
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="py-20 md:py-28 px-6 md:px-12">
          <div className="container mx-auto max-w-[1600px]">
            <SectionHeader
              title="Professional Experience"
              subtitle="My journey through software engineering — building scalable backend microservices, real-time detection tools, and modern web applications."
              icon="💼"
            />

            <div className="relative max-w-6xl mx-auto">
              <div className="absolute left-4 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500/80 via-purple-500/60 to-transparent" />

              {experiences.map((exp: any, index: number) => {
                const isEven = index % 2 === 0;

                return (
                  <div
                    key={exp.id}
                    className={`relative mb-12 md:mb-16 flex flex-col ${isEven ? "md:flex-row" : "md:flex-row-reverse"} items-start md:items-center w-full`}
                  >
                    <div className="absolute left-4 md:left-1/2 -translate-x-1/2 z-10">
                      <div className="w-4 h-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-[0_0_15px_rgba(99,102,241,0.6)]" />
                    </div>

                    <div className={`ml-12 md:ml-0 w-full md:w-[45%] ${isEven ? "md:pr-12" : "md:pl-12"} ${isEven ? "" : "md:ml-auto"}`}>
                      <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-2xl p-8 hover:border-indigo-500/40 hover:shadow-[0_16px_60px_rgba(99,102,241,0.12)] transition-all duration-300 group">
                        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-4">
                          <span className="text-xs font-mono font-bold text-indigo-300">{exp.period}</span>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-1.5 group-hover:text-indigo-300 transition-colors">{exp.title}</h3>
                        <p className="text-base font-medium text-purple-400 mb-3">{exp.company}</p>
                        <p className="text-base text-gray-400 leading-relaxed mb-4">{exp.description}</p>

                        {exp.responsibilities && exp.responsibilities.length > 0 && (
                          <ul className="space-y-2">
                            {exp.responsibilities.map((resp: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-2 text-sm text-gray-400">
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                                <span>{resp}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>

                    <div className="hidden md:block md:w-[45%]" />
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Gradient Divider ────────────────────────────────────────────── */}
        <div className="container mx-auto px-6 md:px-12 max-w-[1600px]">
          <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 3: CERTIFICATIONS SHOWCASE
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="py-20 md:py-28 px-6 md:px-12">
          <div className="container mx-auto max-w-[1600px]">
            <SectionHeader
              title="Verified Credentials"
              subtitle="Industry-recognized certifications validating expertise across Oracle GenAI, Python AI, LLM architectures, and Full-Stack Engineering."
              icon="📜"
            />

            {/* Category Filter Tabs */}
            <div 
              className="flex flex-row overflow-x-auto whitespace-nowrap pb-2 gap-2 max-w-full scrollbar-none snap-x snap-mandatory md:flex-wrap md:justify-center md:overflow-visible md:whitespace-normal mb-12"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {certCategories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setCertFilter(cat.key)}
                  className={`relative shrink-0 snap-start px-6 py-2.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                    certFilter === cat.key
                      ? "text-white bg-indigo-600 shadow-lg shadow-indigo-500/30 border border-indigo-400"
                      : "text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10"
                  }`}
                >
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            {/* Certificate Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {filteredCertificates.map((cert: any) => {
                const typedCertificate: Certificate = {
                  id: cert.id,
                  category: cert.category,
                  title: cert.title,
                  issuer: cert.issuer,
                  date: cert.date,
                  description: cert.description,
                  media: cert.media ? cert.media.map((media: any) => ({
                    type: media.type as "image" | "pdf" | "video",
                    url: media.url,
                    caption: media.caption,
                  })) : [],
                };

                const categoryColors: Record<string, string> = {
                  ai: "from-violet-500 to-purple-600",
                  programming: "from-blue-500 to-cyan-600",
                  basics: "from-emerald-500 to-teal-600",
                  community: "from-amber-500 to-orange-600",
                };

                const accentGradient = categoryColors[cert.category] || "from-indigo-500 to-purple-600";
                const firstImage = typedCertificate.media?.find((m: any) => m.type === "image")?.url;
                const firstPdf = typedCertificate.media?.find((m: any) => m.type === "pdf")?.url;

                return (
                  <div
                    key={cert.id}
                    className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden group hover:border-indigo-500/40 hover:shadow-[0_16px_60px_rgba(99,102,241,0.15)] transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className={`h-1 bg-gradient-to-r ${accentGradient}`} />

                      {/* Header Visual Preview (Image or PDF Document Card Header) */}
                      {firstImage ? (
                        <div
                          className="relative h-52 overflow-hidden cursor-pointer group/img"
                          onClick={() => {
                            setSelectedCertificate(typedCertificate);
                            setIsCertificateLightboxOpen(true);
                          }}
                        >
                          <img
                            src={firstImage}
                            alt={cert.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0025] via-transparent to-transparent opacity-60" />
                          <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-mono font-bold text-indigo-300 flex items-center gap-1.5 border border-white/10 opacity-0 group-hover/img:opacity-100 transition-opacity">
                            <EyeIcon className="w-3.5 h-3.5" />
                            View Certificate
                          </div>
                        </div>
                      ) : (
                        <div
                          className="relative h-52 bg-gradient-to-br from-indigo-950/60 via-purple-950/40 to-[#0a0025] flex flex-col items-center justify-center p-6 border-b border-white/10 cursor-pointer group/pdf overflow-hidden"
                          onClick={() => {
                            setSelectedCertificate(typedCertificate);
                            setIsCertificateLightboxOpen(true);
                          }}
                        >
                          {/* Background Watermark */}
                          <div className="absolute -right-4 -bottom-4 text-white/5 text-8xl font-black select-none pointer-events-none">
                            PDF
                          </div>
                          
                          {/* Document Preview Card Canvas */}
                          <div className="relative z-10 w-full max-w-[220px] h-32 rounded-xl bg-white/5 border border-white/15 backdrop-blur-md p-4 flex flex-col justify-between shadow-2xl group-hover/pdf:scale-105 group-hover/pdf:border-indigo-400/50 transition-all duration-300">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-400 animate-pulse" />
                                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-red-300">PDF Document</span>
                              </div>
                              <ArrowTopRightOnSquareIcon className="w-4 h-4 text-indigo-300 opacity-80 group-hover/pdf:opacity-100" />
                            </div>
                            <div className="space-y-1.5">
                              <div className="h-1.5 w-3/4 bg-white/25 rounded" />
                              <div className="h-1 w-full bg-white/15 rounded" />
                              <div className="h-1 w-2/3 bg-white/15 rounded" />
                            </div>
                            <div className="text-[11px] font-mono font-bold text-indigo-300 truncate">
                              {cert.title}
                            </div>
                          </div>

                          <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-mono font-bold text-indigo-300 group-hover/pdf:text-white transition-colors">
                            <DocumentTextIcon className="w-3.5 h-3.5" />
                            <span>Click to View PDF</span>
                            <span>→</span>
                          </div>
                        </div>
                      )}

                      <div className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1 mr-3">
                            <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">{cert.title}</h3>
                            <p className="text-sm text-indigo-400 font-medium mt-1">{cert.issuer}</p>
                          </div>
                          <span className="text-xs font-mono text-gray-300 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 whitespace-nowrap">
                            {cert.date}
                          </span>
                        </div>

                        <p className="text-sm text-gray-400 leading-relaxed mb-4 line-clamp-3">{cert.description}</p>
                      </div>
                    </div>

                    <div className="p-6 pt-0">
                      <div className="flex flex-wrap gap-3 pt-4 border-t border-white/5 items-center">
                        <button
                          onClick={() => {
                            setSelectedCertificate(typedCertificate);
                            setIsCertificateLightboxOpen(true);
                          }}
                          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-mono font-bold rounded-lg bg-indigo-500/10 hover:bg-indigo-500/25 text-indigo-300 border border-indigo-500/30 transition-all duration-300 cursor-pointer"
                        >
                          View Materials & PDF
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Gradient Divider ────────────────────────────────────────────── */}
        <div className="container mx-auto px-6 md:px-12 max-w-[1600px]">
          <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 4: INTERNSHIPS
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="py-20 md:py-28 px-6 md:px-12">
          <div className="container mx-auto max-w-[1600px]">
            <SectionHeader
              title="Internships"
              subtitle="Real-world engineering practice collaborating with senior software developers."
              icon="🏢"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {internships.map((internship: any) => {
                const typedInternship: Internship = {
                  id: internship.id,
                  title: internship.title,
                  issuer: internship.issuer,
                  date: internship.date,
                  description: internship.description,
                  media: internship.media.map((media: any) => ({
                    type: media.type as "image" | "pdf" | "video",
                    url: media.url,
                    caption: media.caption,
                  })),
                };

                const firstImage = typedInternship.media?.find((m: any) => m.type === "image")?.url;
                const firstPdf = typedInternship.media?.find((m: any) => m.type === "pdf")?.url;

                return (
                  <div
                    key={internship.id}
                    className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden group hover:border-emerald-500/40 hover:shadow-[0_16px_60px_rgba(16,185,129,0.15)] transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      {firstImage ? (
                        <div
                          className="relative h-52 overflow-hidden cursor-pointer group/img"
                          onClick={() => {
                            setSelectedInternship(typedInternship);
                            setIsInternshipLightboxOpen(true);
                          }}
                        >
                          <img
                            src={firstImage}
                            alt={internship.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0025] via-transparent to-transparent opacity-60" />
                        </div>
                      ) : (
                        <div
                          className="relative h-52 bg-gradient-to-br from-emerald-950/60 via-teal-950/40 to-[#0a0025] flex flex-col items-center justify-center p-6 border-b border-white/10 cursor-pointer group/pdf overflow-hidden"
                          onClick={() => {
                            setSelectedInternship(typedInternship);
                            setIsInternshipLightboxOpen(true);
                          }}
                        >
                          {/* Background Watermark */}
                          <div className="absolute -right-4 -bottom-4 text-white/5 text-8xl font-black select-none pointer-events-none">
                            PDF
                          </div>

                          {/* Document Preview Card Canvas */}
                          <div className="relative z-10 w-full max-w-[220px] h-32 rounded-xl bg-white/5 border border-white/15 backdrop-blur-md p-4 flex flex-col justify-between shadow-2xl group-hover/pdf:scale-105 group-hover/pdf:border-emerald-400/50 transition-all duration-300">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-300">PDF Credentials</span>
                              </div>
                              <ArrowTopRightOnSquareIcon className="w-4 h-4 text-emerald-300 opacity-80 group-hover/pdf:opacity-100" />
                            </div>
                            <div className="space-y-1.5">
                              <div className="h-1.5 w-3/4 bg-white/25 rounded" />
                              <div className="h-1 w-full bg-white/15 rounded" />
                              <div className="h-1 w-2/3 bg-white/15 rounded" />
                            </div>
                            <div className="text-[11px] font-mono font-bold text-emerald-300 truncate">
                              {internship.title}
                            </div>
                          </div>

                          <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-300 group-hover/pdf:text-white transition-colors">
                            <DocumentTextIcon className="w-3.5 h-3.5" />
                            <span>Click to View PDF Document</span>
                            <span>→</span>
                          </div>
                        </div>
                      )}

                      <div className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1 mr-3">
                            <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">{internship.title}</h3>
                            <p className="text-sm text-emerald-400 font-medium mt-1">{internship.issuer}</p>
                          </div>
                          <span className="text-xs font-mono text-gray-300 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 whitespace-nowrap">
                            {internship.date}
                          </span>
                        </div>

                        <p className="text-sm text-gray-400 leading-relaxed mb-4">{internship.description}</p>
                      </div>
                    </div>

                    <div className="p-6 pt-0">
                      <div className="flex flex-wrap gap-3 pt-4 border-t border-white/5 items-center">
                        <button
                          onClick={() => {
                            setSelectedInternship(typedInternship);
                            setIsInternshipLightboxOpen(true);
                          }}
                          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-mono font-bold rounded-lg bg-emerald-500/10 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 transition-all duration-300 cursor-pointer"
                        >
                          View Materials & PDF
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Gradient Divider ────────────────────────────────────────────── */}
        <div className="container mx-auto px-6 md:px-12 max-w-[1600px]">
          <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 5: BOOTCAMP JOURNEY
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="py-20 md:py-28 px-6 md:px-12">
          <div className="container mx-auto max-w-[1600px]">
            <SectionHeader
              title="IDE BootCamp Journey"
              subtitle="5-day Innovation, Design & Entrepreneurship (IDE) BootCamp — Phase 1"
              icon="🏕️"
            />

            <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-2xl p-8 mb-12 max-w-4xl mx-auto text-center">
              <p className="text-base text-gray-300 leading-relaxed">
                Organized by <span className="text-white font-semibold">The Ministry of Education</span>,{" "}
                <span className="text-purple-300 font-semibold">AICTE</span>, <span className="text-emerald-400 font-semibold">Wadhwani Foundation</span>, and{" "}
                <span className="text-amber-400 font-semibold">SBI Foundation</span> at Jawaharlal Nehru New College of Engineering, Shivamogga.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {bootcamps.map((bootcamp: any) => {
                const typedBootcamp: Bootcamp = {
                  id: bootcamp.id,
                  title: bootcamp.title,
                  issuer: bootcamp.issuer,
                  date: bootcamp.date,
                  description: bootcamp.description,
                  media: bootcamp.media.map((media: any) => ({
                    type: media.type as "image" | "pdf" | "video",
                    url: media.url,
                    caption: media.caption,
                  })),
                };

                const firstImage = typedBootcamp.media?.find((m: any) => m.type === "image")?.url;

                return (
                  <div
                    key={bootcamp.id}
                    className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden group hover:border-amber-400/40 hover:shadow-[0_16px_60px_rgba(245,158,11,0.15)] transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="h-1 bg-gradient-to-r from-amber-500 to-orange-500" />

                      {firstImage && (
                        <div
                          className="relative h-48 overflow-hidden cursor-pointer"
                          onClick={() => {
                            setSelectedBootcamp(typedBootcamp);
                            setIsBootcampLightboxOpen(true);
                          }}
                        >
                          <img
                            src={firstImage}
                            alt={bootcamp.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0025] via-transparent to-transparent opacity-60" />
                          <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full text-xs text-white flex items-center gap-1 font-semibold border border-white/10">
                            📸 {bootcamp.media.length} {bootcamp.media.length === 1 ? "Photo" : "Photos"}
                          </div>
                        </div>
                      )}

                      <div className="p-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 mb-3">
                          <span className="text-xs font-mono font-bold text-amber-300">{bootcamp.title}</span>
                        </div>

                        <div className="flex justify-between items-center mb-3">
                          <p className="text-xs font-semibold text-amber-400">{bootcamp.issuer}</p>
                          <span className="text-xs font-mono text-gray-300 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                            {bootcamp.date}
                          </span>
                        </div>

                        <div className="mb-4">
                          {Array.isArray(bootcamp.description) ? (
                            <ul className="space-y-1.5">
                              {bootcamp.description.map((item: string, idx: number) => (
                                <li key={idx} className="flex items-start gap-2 text-xs text-gray-400">
                                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-xs text-gray-400 leading-relaxed">{bootcamp.description}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="p-6 pt-0">
                      <div className="flex flex-wrap gap-3 pt-4 border-t border-white/5 items-center">
                        <button
                          onClick={() => {
                            setSelectedBootcamp(typedBootcamp);
                            setIsBootcampLightboxOpen(true);
                          }}
                          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-mono font-bold rounded-lg bg-amber-500/10 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 transition-all duration-300 cursor-pointer"
                        >
                          View Photos
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Gradient Divider ────────────────────────────────────────────── */}
        <div className="container mx-auto px-6 md:px-12 max-w-[1600px]">
          <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 6: HACKATHONS BATTLEGROUND
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="py-20 md:py-28 px-6 md:px-12">
          <div className="container mx-auto max-w-[1600px]">
            <SectionHeader
              title="Hackathon Competitions"
              subtitle="24-hour national hackathons engineering AI healthcare, disease detection, and autonomous tools under high stakes pressure."
              icon="⚡"
            />

            {[
              { title: "National Offline Hackathons", mode: "Offline", icon: "🏢" },
              { title: "Virtual & Online Hackathons", mode: "Online", icon: "🌐" },
            ].map((section, sectionIdx) => {
              const sectionHackathons = hackthons.filter((h: any) => h.mode === section.mode);

              return (
                <div key={section.mode} className={sectionIdx === 0 ? "mb-16" : ""}>
                  <div className="flex items-center gap-3 mb-8 max-w-6xl mx-auto">
                    <span className="text-xl">{section.icon}</span>
                    <h3 className="text-xl font-bold text-white">{section.title}</h3>
                    <div className="flex-1 h-px bg-gradient-to-r from-white/15 to-transparent" />
                  </div>

                  {sectionHackathons.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                      {sectionHackathons.map((hackathon: any) => {
                        const typedHackathon: Hackathon = {
                          id: hackathon.id,
                          mode: hackathon.mode as "Offline" | "Online",
                          title: hackathon.title,
                          issuer: hackathon.issuer,
                          date: hackathon.date,
                          description: hackathon.description,
                          achievement: hackathon.achievement,
                          keyAchievement: hackathon.keyAchievement,
                          highlighted: hackathon.highlighted,
                          githubLink: hackathon.githubLink,
                          liveLink: hackathon.liveLink,
                          media: hackathon.media.map((media: any) => ({
                            type: media.type as "image" | "pdf" | "video",
                            url: media.url,
                            caption: media.caption,
                          })),
                        };

                        const firstImage = typedHackathon.media?.find((m: any) => m.type === "image")?.url;

                        return (
                          <div
                            key={hackathon.id}
                            className={`rounded-2xl overflow-hidden group transition-all duration-300 relative flex flex-col justify-between ${
                              hackathon.highlighted
                                ? "bg-gradient-to-br from-amber-950/30 via-white/[0.03] to-orange-950/30 border border-amber-400/40 shadow-[0_16px_60px_rgba(251,191,36,0.15)]"
                                : "bg-white/[0.03] backdrop-blur-2xl border border-white/10 hover:border-indigo-500/40"
                            }`}
                          >
                            {hackathon.highlighted && (
                              <div className="absolute top-0 right-0 z-10">
                                <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-1.5 rounded-bl-xl text-xs font-mono font-bold flex items-center gap-1.5 shadow-lg">
                                  🏆 {hackathon.achievement}
                                </div>
                              </div>
                            )}

                            <div>
                              <div className={`h-1 ${hackathon.highlighted ? "bg-gradient-to-r from-amber-500 to-orange-500" : "bg-gradient-to-r from-rose-500 to-pink-500"}`} />

                              {firstImage && (
                                <div
                                  className="relative h-48 overflow-hidden cursor-pointer"
                                  onClick={() => {
                                    setSelectedHackathon(typedHackathon);
                                    setIsHackathonLightboxOpen(true);
                                  }}
                                >
                                  <img
                                    src={firstImage}
                                    alt={hackathon.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0025] via-transparent to-transparent opacity-60" />
                                </div>
                              )}

                              <div className={`p-6 ${!firstImage && hackathon.highlighted ? "pt-10" : ""}`}>
                                <div className="flex justify-between items-start mb-3">
                                  <div className="flex-1 mr-3">
                                    <h3 className={`font-bold ${hackathon.highlighted ? "text-2xl text-white" : "text-xl text-white"} group-hover:text-rose-300 transition-colors`}>
                                      {hackathon.title}
                                    </h3>
                                    <p className={`text-sm font-semibold mt-1 ${hackathon.highlighted ? "text-amber-400" : "text-rose-400"}`}>
                                      {hackathon.issuer}
                                    </p>
                                  </div>
                                  <span className="text-xs font-mono text-gray-300 bg-white/5 px-2.5 py-1 rounded-full border border-white/10 whitespace-nowrap">
                                    {hackathon.date}
                                  </span>
                                </div>

                                <p className="text-sm text-gray-400 leading-relaxed mb-4 line-clamp-4">{hackathon.description}</p>

                                {hackathon.highlighted && hackathon.keyAchievement && (
                                  <div className="mb-2 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
                                    <p className="text-xs font-mono font-bold text-amber-300 flex items-center gap-2">
                                      <span>🎯</span>
                                      <span>{hackathon.keyAchievement}</span>
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="p-6 pt-0">
                              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/5">
                                <button
                                  onClick={() => {
                                    setSelectedHackathon(typedHackathon);
                                    setIsHackathonLightboxOpen(true);
                                  }}
                                  className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-mono font-bold rounded-lg transition-all duration-300 cursor-pointer ${
                                    hackathon.highlighted
                                      ? "bg-amber-500/10 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30"
                                      : "bg-rose-500/10 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30"
                                  }`}
                                >
                                  View Materials & PDF
                                </button>

                                <div className="flex items-center gap-2 ml-auto">
                                  {hackathon.githubLink && (
                                    <a
                                      href={hackathon.githubLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors border border-white/10"
                                    >
                                      GitHub
                                    </a>
                                  )}
                                  {hackathon.liveLink && (
                                    <a
                                      href={hackathon.liveLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 transition-colors border border-emerald-500/30"
                                    >
                                      Demo
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-2xl p-10 text-center max-w-6xl mx-auto">
                      <div className="text-4xl mb-3">💻</div>
                      <h4 className="text-base font-bold text-white mb-1">Virtual Competitions</h4>
                      <p className="text-xs text-gray-400">Actively preparing for upcoming online AI hackathons.</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Gradient Divider ────────────────────────────────────────────── */}
        <div className="container mx-auto px-6 md:px-12 max-w-[1600px]">
          <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 7: FUTURE VISION & CONTINUOUS ROADMAP
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="py-20 md:py-28 px-6 md:px-12 mb-12">
          <div className="container mx-auto max-w-[1600px]">
            <SectionHeader
              title="Next Frontiers"
              subtitle="Technological domains I am actively exploring to push the boundaries of AI & system architecture."
              icon="🔮"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {futureVision.map((vision: any) => {
                return (
                  <div
                    key={vision.title}
                    className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-2xl p-8 group hover:border-indigo-500/40 hover:shadow-[0_16px_60px_rgba(99,102,241,0.15)] transition-all duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <span className="text-2xl">{vision.icon}</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">{vision.title}</h4>
                        <p className="text-sm text-gray-400 leading-relaxed">{vision.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

      </div>

      {/* Lightbox Modals */}
      <CertificateLightbox
        certificate={selectedCertificate}
        isOpen={isCertificateLightboxOpen}
        onClose={() => setIsCertificateLightboxOpen(false)}
      />

      <BootcampLightbox
        bootcamp={selectedBootcamp}
        isOpen={isBootcampLightboxOpen}
        onClose={() => setIsBootcampLightboxOpen(false)}
      />

      <HackathonLightbox
        hackathon={selectedHackathon}
        isOpen={isHackathonLightboxOpen}
        onClose={() => setIsHackathonLightboxOpen(false)}
      />

      <InternshipLightbox
        internship={selectedInternship}
        isOpen={isInternshipLightboxOpen}
        onClose={() => setIsInternshipLightboxOpen(false)}
      />
    </div>
  );
}