"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
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
  enrollLink?: string;
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
  enrollLink?: string;
  media: Media[];
}

interface Bootcamp {
  id: number;
  title: string;
  issuer: string;
  date: string;
  description: string | string[];
  enrollLink?: string;
  media: Media[];
}

// ─── Animated Counter Component ──────────────────────────────────────────────

function AnimatedCounter({ target, suffix = "", duration = 2000 }: { target: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!isInView) return;
    if (prefersReducedMotion) {
      setCount(target);
      return;
    }
    let start = 0;
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      setCount(current);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isInView, target, duration, prefersReducedMotion]);

  return <span ref={ref}>{count}{suffix}</span>;
}

// ─── Section Header Component ────────────────────────────────────────────────

function SectionHeader({ title, subtitle, icon }: { title: string; subtitle?: string; icon: React.ReactNode }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <motion.div
      ref={ref}
      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="text-center mb-20"
    >
      <div className="inline-flex items-center gap-3 mb-5 px-6 py-2.5 rounded-full bg-[#0f0f23]/90 border border-purple-500/25 shadow-lg">
        <span className="text-2xl">{icon}</span>
        <span className="text-sm font-semibold tracking-widest uppercase text-purple-300">{title}</span>
      </div>
      {subtitle && (
        <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed mt-4">{subtitle}</p>
      )}
    </motion.div>
  );
}

// ─── Star Background Layer ───────────────────────────────────────────────────

function StarField() {
  const stars = useMemo(() => {
    return Array.from({ length: 120 }, (_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 2.5 + 0.5,
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 2,
    }));
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Deep space gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030014] via-[#0a0025] to-[#050010]" />

      {/* Nebula orbs */}
      <div className="absolute top-[10%] left-[15%] w-[500px] h-[500px] rounded-full bg-purple-900/20 blur-[120px] animate-float-orb" />
      <div className="absolute top-[60%] right-[10%] w-[400px] h-[400px] rounded-full bg-blue-900/15 blur-[100px] animate-float-orb" style={{ animationDelay: "-7s" }} />
      <div className="absolute top-[35%] right-[40%] w-[300px] h-[300px] rounded-full bg-indigo-900/10 blur-[80px] animate-float-orb" style={{ animationDelay: "-14s" }} />

      {/* Star particles */}
      {stars.map((star) => (
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
  const prefersReducedMotion = usePrefersReducedMotion();

  const certCategories = [
    { key: "all", label: "All", color: "from-purple-500 to-blue-500" },
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
  const timeline = achievements_meta?.timeline || [];
  const futureVision = achievements_meta?.futureVision || [];

  // Animation variants
  const cardVariants = {
    hidden: prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 40 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: prefersReducedMotion ? 0 : i * 0.08,
        duration: 0.6,
        ease: "easeOut" as const,
      },
    }),
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Immersive Space Background */}
      <StarField />

      {/* Content Layer */}
      <div className="relative z-10">

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 1: HERO
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="pt-20 pb-24 px-4">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center mb-16"
            >
              {/* Eyebrow */}
              <motion.div
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-flex items-center gap-2 px-5 py-2 mb-6 rounded-full border border-purple-500/25 bg-[#0f0f23]/90 shadow-lg"
              >
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
                <span className="text-xs font-medium tracking-wider text-gray-300 uppercase">Continuous Growth & Excellence</span>
              </motion.div>

              {/* Headline */}
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white mb-6 leading-[0.9]">
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-gradient-text">
                  Achievements
                </span>
                <span className="block text-2xl md:text-3xl font-medium tracking-normal text-gray-400 mt-3">
                  & Professional Growth
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                A comprehensive showcase of certifications, hackathons, internships, and milestones
                that define my journey in technology and engineering.
              </p>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto"
            >
              {[
                { label: "Hackathons", value: stats.hackathons, suffix: "+", icon: "⚡", bg: "bg-[#1a0a1e]", border: "border-rose-500/30" },
                { label: "Certifications", value: stats.certifications, suffix: "+", icon: "📜", bg: "bg-[#0a1528]", border: "border-blue-500/30" },
                { label: "Projects", value: stats.projects, suffix: "+", icon: "🚀", bg: "bg-[#12081e]", border: "border-purple-500/30" },
                { label: "Technologies", value: stats.technologies, suffix: "+", icon: "💻", bg: "bg-[#081a14]", border: "border-emerald-500/30" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + i * 0.1, duration: 0.5, type: "spring", stiffness: 200 }}
                  className={`relative rounded-2xl ${stat.bg} border ${stat.border} p-8 text-center group hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl`}
                >
                  <div className="text-4xl mb-3">{stat.icon}</div>
                  <div className="text-4xl md:text-5xl font-black text-white mb-2">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-sm font-semibold tracking-wider text-gray-300 uppercase">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 2: PROFESSIONAL MILESTONES TIMELINE
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-5xl">
            <SectionHeader
              title="Professional Experience"
              subtitle="My journey through the technology landscape — building, learning, and growing with every project."
              icon="💼"
            />

            <div className="relative">
              {/* Vertical glowing line */}
              <div className="absolute left-4 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500/80 via-blue-500/60 to-transparent" />

              {experiences.map((exp: any, index: number) => {
                const expRef = useRef(null);
                const isExpInView = useInView(expRef, { once: true, margin: "-80px" });
                const isEven = index % 2 === 0;

                return (
                  <div
                    key={exp.id}
                    ref={expRef}
                    className={`relative mb-12 md:mb-16 flex flex-col ${isEven ? "md:flex-row" : "md:flex-row-reverse"} items-start md:items-center w-full`}
                  >
                    {/* Timeline dot */}
                    <motion.div
                      initial={prefersReducedMotion ? { scale: 1 } : { scale: 0 }}
                      animate={isExpInView ? { scale: 1 } : {}}
                      transition={{ duration: 0.4, type: "spring", stiffness: 400 }}
                      className="absolute left-4 md:left-1/2 -translate-x-1/2 z-10"
                    >
                      <div className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 shadow-[0_0_15px_rgba(139,92,246,0.6)] animate-ring-pulse" />
                    </motion.div>

                    {/* Card */}
                    <motion.div
                      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, x: isEven ? -60 : 60 }}
                      animate={isExpInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
                      className={`ml-12 md:ml-0 w-full md:w-[45%] ${isEven ? "md:pr-12" : "md:pl-12"} ${isEven ? "" : "md:ml-auto"}`}
                    >
                      <div className="achievement-glass rounded-2xl p-8 hover:shadow-[0_0_40px_rgba(139,92,246,0.15)] transition-all duration-500 group">
                        {/* Period badge */}
                        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#1a1040] border border-purple-500/30 mb-4">
                          <span className="text-sm font-semibold text-purple-300">{exp.period}</span>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-1.5 group-hover:text-purple-300 transition-colors">{exp.title}</h3>
                        <p className="text-base font-medium text-blue-400 mb-3">{exp.company}</p>
                        <p className="text-base text-gray-400 leading-relaxed mb-4">{exp.description}</p>

                        {exp.responsibilities && exp.responsibilities.length > 0 && (
                          <ul className="space-y-2">
                            {exp.responsibilities.map((resp: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-2 text-sm text-gray-400">
                                <span className="mt-1.5 w-1 h-1 rounded-full bg-purple-400 shrink-0" />
                                <span>{resp}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </motion.div>

                    {/* Empty spacer */}
                    <div className="hidden md:block md:w-[45%]" />
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 3: CERTIFICATIONS SHOWCASE
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <SectionHeader
              title="Certifications"
              subtitle="Industry-recognized credentials validating expertise across AI, programming, web development, and community engagement."
              icon="📜"
            />

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              {certCategories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setCertFilter(cat.key)}
                  className={`relative px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                    certFilter === cat.key
                      ? "text-white shadow-lg"
                      : "text-gray-400 hover:text-white bg-[#0f0f23] hover:bg-[#161633] border border-white/10 hover:border-purple-500/25"
                  }`}
                >
                  {certFilter === cat.key && (
                    <motion.div
                      layoutId="certFilterBg"
                      className={`absolute inset-0 rounded-full bg-gradient-to-r ${cat.color}`}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{cat.label}</span>
                </button>
              ))}
            </div>

            {/* Certificate Cards */}
            <AnimatePresence mode="wait">
              <motion.div
                key={certFilter}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredCertificates.map((cert: any, index: number) => {
                  const typedCertificate: Certificate = {
                    id: cert.id,
                    category: cert.category,
                    title: cert.title,
                    issuer: cert.issuer,
                    date: cert.date,
                    description: cert.description,
                    enrollLink: cert.enrollLink,
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

                  const accentGradient = categoryColors[cert.category] || "from-purple-500 to-blue-600";
                  const firstImage = typedCertificate.media?.find((m: any) => m.type === "image")?.url;

                  return (
                    <motion.div
                      key={cert.id}
                      custom={index}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      className="achievement-glass rounded-2xl overflow-hidden group hover:shadow-[0_0_40px_rgba(139,92,246,0.2)] transition-all duration-500 hover:-translate-y-2 flex flex-col justify-between"
                    >
                      <div>
                        {/* Top accent bar */}
                        <div className={`h-1 bg-gradient-to-r ${accentGradient}`} />

                        {/* Visual Media Header */}
                        {firstImage ? (
                          <div
                            className="relative h-48 overflow-hidden cursor-pointer"
                            onClick={() => {
                              setSelectedCertificate(typedCertificate);
                              setIsCertificateLightboxOpen(true);
                            }}
                          >
                            <img
                              src={firstImage}
                              alt={cert.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f23] via-transparent to-transparent opacity-60" />
                          </div>
                        ) : (
                          <div
                            className="relative h-48 bg-gradient-to-br from-purple-950/40 via-blue-950/30 to-[#0f0f23] flex items-center justify-center border-b border-white/5 cursor-pointer group-hover:from-purple-950/50 group-hover:via-blue-950/40 transition-all duration-500"
                            onClick={() => {
                              setSelectedCertificate(typedCertificate);
                              setIsCertificateLightboxOpen(true);
                            }}
                          >
                            <div className="text-center">
                              <span className="text-4xl block mb-2 opacity-80 group-hover:scale-110 transition-transform duration-300">📜</span>
                              <span className="text-xs tracking-wider font-semibold text-purple-300 uppercase">View Credentials (PDF)</span>
                            </div>
                          </div>
                        )}

                        <div className="p-8 pb-4">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1 mr-3">
                              <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">{cert.title}</h3>
                              <p className="text-sm text-blue-400 font-medium mt-1">{cert.issuer}</p>
                            </div>
                            <span className="text-xs font-semibold text-gray-300 bg-[#0f0f23] px-3 py-1.5 rounded-full border border-white/15 whitespace-nowrap">
                              {cert.date}
                            </span>
                          </div>

                          <p className="text-base text-gray-400 leading-relaxed mb-4 line-clamp-3">{cert.description}</p>
                        </div>
                      </div>

                      <div className="p-8 pt-0">
                        <div className="flex flex-wrap gap-3 pt-4 border-t border-white/5 items-center">
                          <button
                            onClick={() => {
                              setSelectedCertificate(typedCertificate);
                              setIsCertificateLightboxOpen(true);
                            }}
                            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg bg-blue-500/10 hover:bg-blue-500/25 text-blue-300 border border-blue-500/25 transition-all duration-300 cursor-pointer"
                          >
                            View Materials
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 4: INTERNSHIPS
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-5xl">
            <SectionHeader
              title="Internships"
              subtitle="Real-world industry experience that shaped my professional development and engineering skills."
              icon="🏢"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {internships.map((internship: any, index: number) => {
                const internRef = useRef(null);
                const isIntInView = useInView(internRef, { once: true, margin: "-50px" });

                const typedInternship: Internship = {
                  id: internship.id,
                  title: internship.title,
                  issuer: internship.issuer,
                  date: internship.date,
                  description: internship.description,
                  enrollLink: internship.enrollLink,
                  media: internship.media.map((media: any) => ({
                    type: media.type as "image" | "pdf" | "video",
                    url: media.url,
                    caption: media.caption,
                  })),
                };

                return (
                  <motion.div
                    key={internship.id}
                    ref={internRef}
                    initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 40 }}
                    animate={isIntInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                    className="achievement-glass rounded-2xl overflow-hidden group hover:shadow-[0_0_40px_rgba(16,185,129,0.15)] transition-all duration-500 hover:-translate-y-2 flex flex-col justify-between"
                  >
                    <div>
                      {/* Visual Mockup Header */}
                      <div
                        className="relative h-48 bg-gradient-to-br from-emerald-950/40 via-teal-950/30 to-[#0f0f23] flex items-center justify-center border-b border-white/5 cursor-pointer group-hover:from-emerald-950/50 group-hover:via-teal-950/40 transition-all duration-500"
                        onClick={() => {
                          setSelectedInternship(typedInternship);
                          setIsInternshipLightboxOpen(true);
                        }}
                      >
                        <div className="text-center">
                          <span className="text-4xl block mb-2 opacity-80 group-hover:scale-110 transition-transform duration-300">💼</span>
                          <span className="text-xs tracking-wider font-semibold text-emerald-300 uppercase">View Credentials (PDF)</span>
                        </div>
                      </div>

                      <div className="p-8 pb-4">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1 mr-3">
                            <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">{internship.title}</h3>
                            <p className="text-base text-emerald-400 font-medium mt-1">{internship.issuer}</p>
                          </div>
                          <span className="text-xs font-semibold text-gray-300 bg-[#0f0f23] px-3 py-1.5 rounded-full border border-white/15 whitespace-nowrap">
                            {internship.date}
                          </span>
                        </div>

                        <p className="text-base text-gray-400 leading-relaxed mb-4">{internship.description}</p>
                      </div>
                    </div>

                    <div className="p-8 pt-0">
                      <div className="flex flex-wrap gap-3 pt-4 border-t border-white/5 items-center">
                        <button
                          onClick={() => {
                            setSelectedInternship(typedInternship);
                            setIsInternshipLightboxOpen(true);
                          }}
                          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg bg-emerald-500/10 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/25 transition-all duration-300 cursor-pointer"
                        >
                          View Materials
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 5: BOOTCAMP JOURNEY
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <SectionHeader
              title="BootCamp Journey"
              subtitle="5-day Innovation, Design & Entrepreneurship (IDE) BootCamp — Phase 1"
              icon="🏕️"
            />

            {/* Bootcamp context */}
            <motion.div
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="achievement-glass rounded-2xl p-8 mb-14 max-w-4xl mx-auto"
            >
              <p className="text-base text-gray-400 leading-relaxed text-center">
                <span className="text-white font-semibold">The 3rd Edition</span> of the Innovation, Design and Entrepreneurship (IDE) BootCamp —
                organized by <span className="text-purple-300">The Minister of Education</span>,{" "}
                <span className="text-blue-400">AICTE</span>, <span className="text-emerald-400">Wadhwani Foundation</span>, and{" "}
                <span className="text-amber-400">SBI Foundation</span>, hosted at Jawaharlal Nehru New College of Engineering, Shivamogga.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bootcamps.map((bootcamp: any, index: number) => {
                const bootRef = useRef(null);
                const isBootInView = useInView(bootRef, { once: true, margin: "-50px" });

                const typedBootcamp: Bootcamp = {
                  id: bootcamp.id,
                  title: bootcamp.title,
                  issuer: bootcamp.issuer,
                  date: bootcamp.date,
                  description: bootcamp.description,
                  enrollLink: bootcamp.enrollLink,
                  media: bootcamp.media.map((media: any) => ({
                    type: media.type as "image" | "pdf" | "video",
                    url: media.url,
                    caption: media.caption,
                  })),
                };

                const firstImage = typedBootcamp.media?.find((m: any) => m.type === "image")?.url;

                return (
                  <motion.div
                    key={bootcamp.id}
                    ref={bootRef}
                    initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 40 }}
                    animate={isBootInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
                    className="achievement-glass rounded-2xl overflow-hidden group hover:shadow-[0_0_40px_rgba(245,158,11,0.15)] transition-all duration-500 hover:-translate-y-2 flex flex-col justify-between"
                  >
                    <div>
                      {/* Amber accent bar */}
                      <div className="h-1 bg-gradient-to-r from-amber-500 to-orange-500" />

                      {/* Visual Media Header */}
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
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f23] via-transparent to-transparent opacity-60" />
                          <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs text-white flex items-center gap-1 font-semibold border border-white/10">
                            📸 {bootcamp.media.length} {bootcamp.media.length === 1 ? "Photo" : "Photos"}
                          </div>
                        </div>
                      )}

                      <div className="p-8 pb-4">
                        {/* Day badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1a1408] border border-amber-500/30 mb-4">
                          <span className="text-sm font-bold text-amber-300">{bootcamp.title}</span>
                        </div>

                        <div className="flex justify-between items-center mb-3">
                          <p className="text-sm font-medium text-amber-400">{bootcamp.issuer}</p>
                          <span className="text-xs font-medium text-gray-300 bg-[#0f0f23] px-3 py-1.5 rounded-full border border-white/15">
                            {bootcamp.date}
                          </span>
                        </div>

                        <div className="mb-4">
                          {Array.isArray(bootcamp.description) ? (
                            <ul className="space-y-2">
                              {bootcamp.description.map((item: string, idx: number) => (
                                <li key={idx} className="flex items-start gap-2 text-sm text-gray-400">
                                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-gray-400 leading-relaxed">{bootcamp.description}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="p-8 pt-0">
                      <div className="flex flex-wrap gap-3 pt-4 border-t border-white/5 items-center">
                        <button
                          onClick={() => {
                            setSelectedBootcamp(typedBootcamp);
                            setIsBootcampLightboxOpen(true);
                          }}
                          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg bg-amber-500/10 hover:bg-amber-500/25 text-amber-300 border border-amber-500/25 transition-all duration-300 cursor-pointer"
                        >
                          View Photos
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 6: HACKATHONS BATTLEGROUND
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <SectionHeader
              title="Hackathons"
              subtitle="Competitive coding events where ideas become reality under pressure — from 24-hour sprints to national-level competitions."
              icon="⚡"
            />

            {[
              { title: "Offline Hackathons", mode: "Offline", icon: "🏢" },
              { title: "Online Hackathons", mode: "Online", icon: "🌐" },
            ].map((section, sectionIdx) => {
              const sectionHackathons = hackthons.filter((h: any) => h.mode === section.mode);

              return (
                <div key={section.mode} className={sectionIdx === 0 ? "mb-16" : ""}>
                  {/* Sub-section header */}
                  <div className="flex items-center gap-3 mb-8">
                    <span className="text-xl">{section.icon}</span>
                    <h3 className="text-xl font-bold text-white">{section.title}</h3>
                    <div className="flex-1 h-px bg-gradient-to-r from-white/15 to-transparent" />
                  </div>

                  {sectionHackathons.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {sectionHackathons.map((hackathon: any, index: number) => {
                        const hackRef = useRef(null);
                        const isHackInView = useInView(hackRef, { once: true, margin: "-50px" });

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
                          <motion.div
                            key={hackathon.id}
                            ref={hackRef}
                            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 40 }}
                            animate={isHackInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                            className={`rounded-2xl overflow-hidden group transition-all duration-500 hover:-translate-y-2 relative flex flex-col justify-between ${
                              hackathon.highlighted
                                ? "bg-gradient-to-br from-[#1a1408]/95 via-[#1a1205]/92 to-[#1a0e08]/95 border border-amber-500/35 shadow-[0_4px_30px_rgba(0,0,0,0.4),0_0_20px_rgba(245,158,11,0.08)] hover:shadow-[0_8px_40px_rgba(245,158,11,0.15)]"
                                : "achievement-glass hover:shadow-[0_0_40px_rgba(244,63,94,0.12)]"
                            }`}
                          >
                            {/* Featured card effects */}
                            {hackathon.highlighted && (
                              <>
                                {/* Animated shine sweep */}
                                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/10 to-transparent animate-shine-sweep" />
                                </div>

                                {/* Achievement badge */}
                                <div className="absolute -top-0 -right-0 z-10">
                                  <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-1.5 rounded-bl-xl text-xs font-bold flex items-center gap-1.5 shadow-lg">
                                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    {hackathon.achievement}
                                  </div>
                                </div>
                              </>
                            )}

                            <div>
                              {/* Top accent */}
                              <div className={`h-1 ${hackathon.highlighted ? "bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500" : "bg-gradient-to-r from-rose-500 to-pink-500"}`} />

                              {/* Visual Media Header */}
                              {firstImage ? (
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
                                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f23] via-transparent to-transparent opacity-60" />
                                </div>
                              ) : (
                                hackathon.highlighted && (
                                  <div className="p-6 pb-2">
                                    <div className="text-3xl mb-1 animate-bounce" style={{ animationDuration: "2s" }}>🏆</div>
                                  </div>
                                )
                              )}

                              <div className={`p-8 pb-4 ${!firstImage && hackathon.highlighted ? "pt-2" : ""}`}>
                                <div className="flex justify-between items-start mb-3">
                                  <div className="flex-1 mr-3">
                                    <h3 className={`font-bold ${hackathon.highlighted ? "text-2xl text-white" : "text-xl text-white"} group-hover:text-rose-300 transition-colors`}>
                                      {hackathon.title}
                                    </h3>
                                    <p className={`text-base font-medium mt-1.5 ${hackathon.highlighted ? "text-amber-400" : "text-rose-400"}`}>
                                      {hackathon.issuer}
                                    </p>
                                  </div>
                                  <span className={`text-xs font-medium whitespace-nowrap px-2.5 py-1 rounded-full ${
                                    hackathon.highlighted
                                      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold"
                                      : "text-gray-300 bg-[#0f0f23] border border-white/15 font-semibold"
                                  }`}>
                                    {hackathon.date}
                                  </span>
                                </div>

                                <p className="text-base text-gray-400 leading-relaxed mb-4 whitespace-pre-wrap line-clamp-4">{hackathon.description}</p>

                                {/* Key achievement callout */}
                                {hackathon.highlighted && hackathon.keyAchievement && (
                                  <div className="mb-2 p-4 rounded-xl bg-[#1a1408]/80 border border-amber-500/30">
                                    <p className="text-sm font-semibold text-amber-300 flex items-center gap-2">
                                      <span>🎯</span>
                                      <span>{hackathon.keyAchievement}</span>
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="p-8 pt-0">
                              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/5">
                                <button
                                  onClick={() => {
                                    setSelectedHackathon(typedHackathon);
                                    setIsHackathonLightboxOpen(true);
                                  }}
                                  className={`inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 cursor-pointer ${
                                    hackathon.highlighted
                                      ? "bg-amber-500/10 hover:bg-amber-500/25 text-amber-300 border border-amber-500/25"
                                      : "bg-rose-500/10 hover:bg-rose-500/25 text-rose-300 border border-rose-500/25"
                                  }`}
                                  aria-label={`View ${hackathon.title} details`}
                                >
                                  View Materials
                                </button>

                                <div className="flex items-center gap-2 ml-auto">
                                  {hackathon.githubLink && (
                                    <a
                                      href={hackathon.githubLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 px-3 py-2 text-sm font-semibold rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all duration-300 border border-white/10"
                                    >
                                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                      </svg>
                                      GitHub
                                    </a>
                                  )}

                                  {hackathon.liveLink && (
                                    <a
                                      href={hackathon.liveLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 px-3 py-2 text-sm font-semibold rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 hover:text-emerald-200 transition-all duration-300 border border-emerald-500/25"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                      </svg>
                                      Demo
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="achievement-glass rounded-2xl p-14 text-center">
                      <div className="text-4xl mb-4">💻</div>
                      <h4 className="text-lg font-semibold text-white mb-2">Exploring Opportunities</h4>
                      <p className="text-base text-gray-400">Looking forward to participating in exciting virtual hackathons soon!</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 7: IMPACT DASHBOARD
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <SectionHeader
              title="Impact Dashboard"
              subtitle="Quantifiable milestones that demonstrate consistent growth and a commitment to excellence."
              icon="📊"
            />

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { label: "Hackathons\nCompeted", value: stats.hackathons, icon: "⚡", bg: "bg-[#1a0a1e]", border: "border-rose-500/25" },
                { label: "Certifications\nEarned", value: stats.certifications, icon: "📜", bg: "bg-[#0a1528]", border: "border-blue-500/25" },
                { label: "Bootcamp\nDays", value: stats.bootcampDays, icon: "🏕️", bg: "bg-[#1a1408]", border: "border-amber-500/25" },
                { label: "Technologies\nMastered", value: stats.technologies, icon: "💻", bg: "bg-[#12081e]", border: "border-purple-500/25" },
                { label: "Projects\nShipped", value: stats.projects, icon: "🚀", bg: "bg-[#081a14]", border: "border-emerald-500/25" },
                { label: "Internships\nCompleted", value: stats.internships, icon: "🏢", bg: "bg-[#0a1028]", border: "border-indigo-500/25" },
              ].map((metric, i) => {
                const metricRef = useRef(null);
                const isMetricInView = useInView(metricRef, { once: true, margin: "-30px" });

                return (
                  <motion.div
                    key={metric.label}
                    ref={metricRef}
                    initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
                    animate={isMetricInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    className={`rounded-2xl ${metric.bg} border ${metric.border} p-6 text-center hover:scale-105 transition-all duration-300 shadow-lg`}
                  >
                    <div className="text-3xl mb-3">{metric.icon}</div>
                    <div className="text-3xl font-black text-white mb-2">
                      <AnimatedCounter target={metric.value} suffix="+" />
                    </div>
                    <div className="text-xs font-semibold tracking-wider text-gray-300 uppercase whitespace-pre-line leading-tight">
                      {metric.label}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 8: ACHIEVEMENT ROADMAP TIMELINE
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-5xl">
            <SectionHeader
              title="Growth Roadmap"
              subtitle="A year-by-year journey of continuous learning, building, and professional evolution."
              icon="🗺️"
            />

            <div className="relative">
              {/* Horizontal line */}
              <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent -translate-y-1/2" />

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {timeline.map((milestone: any, index: number) => {
                  const milestoneRef = useRef(null);
                  const isMilestoneInView = useInView(milestoneRef, { once: true, margin: "-30px" });
                  const isLatest = index === timeline.length - 1;

                  return (
                    <motion.div
                      key={milestone.year}
                      ref={milestoneRef}
                      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
                      animate={isMilestoneInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.5, delay: index * 0.15 }}
                      className="text-center relative"
                    >
                      {/* Node dot */}
                      <div className="hidden md:flex justify-center mb-6">
                        <div className={`w-5 h-5 rounded-full ${
                          isLatest
                            ? "bg-gradient-to-r from-purple-500 to-blue-500 shadow-[0_0_20px_rgba(139,92,246,0.6)] animate-ring-pulse"
                            : "bg-white/20 border-2 border-white/30"
                        }`} />
                      </div>

                      {/* Card */}
                      <div className={`achievement-glass rounded-2xl p-6 ${isLatest ? "border-purple-500/30 shadow-[0_0_30px_rgba(139,92,246,0.15)]" : ""}`}>
                        <div className="text-3xl mb-3">{milestone.icon}</div>
                        <div className={`text-2xl font-black mb-2 ${isLatest ? "text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400" : "text-white"}`}>
                          {milestone.year}
                        </div>
                        <h4 className="text-sm font-semibold text-white mb-1">{milestone.label}</h4>
                        <p className="text-xs text-gray-400">{milestone.detail}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 9: FUTURE VISION
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="py-20 px-4 mb-12">
          <div className="container mx-auto max-w-5xl">
            <SectionHeader
              title="What's Next"
              subtitle="The journey doesn't stop here — these are the frontiers I'm actively pursuing."
              icon="🔮"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {futureVision.map((vision: any, index: number) => {
                const visionRef = useRef(null);
                const isVisionInView = useInView(visionRef, { once: true, margin: "-50px" });

                return (
                  <motion.div
                    key={vision.title}
                    ref={visionRef}
                    initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
                    animate={isVisionInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="achievement-glass rounded-2xl p-8 group hover:shadow-[0_0_40px_rgba(139,92,246,0.15)] transition-all duration-500 hover:-translate-y-2"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-[#12081e] border border-purple-500/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <span className="text-2xl">{vision.icon}</span>
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">{vision.title}</h4>
                        <p className="text-base text-gray-400 leading-relaxed">{vision.description}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          LIGHTBOX MODALS (Unchanged)
      ═══════════════════════════════════════════════════════════════════ */}
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