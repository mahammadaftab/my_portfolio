"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaPython,
  FaJava,
  FaReact,
  FaNodeJs,
  FaDocker,
  FaGitAlt,
  FaFigma,
  FaHtml5,
  FaCss3Alt,
  FaAws,
} from "react-icons/fa";
import {
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
  SiTailwindcss,
  SiMongodb,
  SiPostgresql,
  SiThreedotjs,
  SiVercel,
  SiOpenai,
  SiTensorflow,
  SiFirebase,
  SiSpringboot,
  SiOracle,
  SiFramer,
} from "react-icons/si";
import {
  HiOutlineAcademicCap,
  HiOutlineBriefcase,
  HiOutlineTrophy,
  HiOutlineRocketLaunch,
  HiOutlineSparkles,
  HiOutlineLightBulb,
  HiOutlineCodeBracket,
  HiOutlineCpuChip,
  HiOutlineCheckBadge,
  HiOutlineBolt,
  HiOutlineGlobeAlt,
  HiOutlineCommandLine,
} from "react-icons/hi2";

// ─── Data ───────────────────────────────────────────────────────────────────

const metrics = [
  { value: 15, suffix: "+", label: "Projects Completed", icon: HiOutlineCodeBracket, color: "from-blue-500 to-cyan-400" },
  { value: 3, suffix: "", label: "Hackathons Competed", icon: HiOutlineRocketLaunch, color: "from-purple-500 to-pink-400" },
  { value: 2, suffix: "nd", label: "Place Hackathon Winner", icon: HiOutlineTrophy, color: "from-amber-500 to-orange-400" },
  { value: 10, suffix: "+", label: "Certifications Earned", icon: HiOutlineAcademicCap, color: "from-emerald-500 to-teal-400" },
  { value: 3, suffix: "+", label: "Professional Internships", icon: HiOutlineBriefcase, color: "from-rose-500 to-pink-400" },
  { value: 1, suffix: "", label: "Oracle GenAI Certified", icon: SiOracle, color: "from-red-500 to-orange-400" },
];

const techSkillsRow1 = [
  { name: "Python", icon: FaPython, color: "#3776AB" },
  { name: "React", icon: FaReact, color: "#61DAFB" },
  { name: "Next.js", icon: SiNextdotjs, color: "#ffffff" },
  { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
  { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
  { name: "Java", icon: FaJava, color: "#ED8B00" },
  { name: "Node.js", icon: FaNodeJs, color: "#339933" },
  { name: "Spring Boot", icon: SiSpringboot, color: "#6DB33F" },
  { name: "Three.js", icon: SiThreedotjs, color: "#ffffff" },
  { name: "Framer Motion", icon: SiFramer, color: "#0055FF" },
  { name: "TensorFlow", icon: SiTensorflow, color: "#FF6F00" },
  { name: "OpenAI", icon: SiOpenai, color: "#ffffff" },
];

const techSkillsRow2 = [
  { name: "HTML5", icon: FaHtml5, color: "#E34F26" },
  { name: "CSS3", icon: FaCss3Alt, color: "#1572B6" },
  { name: "Tailwind CSS", icon: SiTailwindcss, color: "#06B6D4" },
  { name: "MongoDB", icon: SiMongodb, color: "#47A248" },
  { name: "PostgreSQL", icon: SiPostgresql, color: "#4169E1" },
  { name: "Firebase", icon: SiFirebase, color: "#FFCA28" },
  { name: "Docker", icon: FaDocker, color: "#2496ED" },
  { name: "AWS", icon: FaAws, color: "#FF9900" },
  { name: "Git", icon: FaGitAlt, color: "#F05032" },
  { name: "Vercel", icon: SiVercel, color: "#ffffff" },
  { name: "Figma", icon: FaFigma, color: "#F24E1E" },
  { name: "Oracle Cloud", icon: SiOracle, color: "#F80000" },
];

const timelineData = [
  {
    year: "2021",
    title: "SSLC — 85.12%",
    institution: "Royal English Medium High School, Gadag",
    description: "Completed 10th Grade with a strong academic foundation in mathematics, science, and languages.",
    type: "education",
    accent: "from-blue-500 to-cyan-500",
  },
  {
    year: "2021–2023",
    title: "Pre-University College — Science Stream",
    institution: "KLE Societies Jagadguru Tontadarya P.U College, Gadag",
    description: "Completed PUC in Science stream with Physics, Chemistry, Mathematics, and Biology.",
    type: "education",
    accent: "from-purple-500 to-indigo-500",
  },
  {
    year: "2023–Present",
    title: "B.E. Computer Science Engineering",
    institution: "Rural Engineering College, Hulkoti",
    description: "Currently pursuing 3rd year with hands-on experience in programming, AI/ML, web development, and system design.",
    type: "education",
    accent: "from-indigo-500 to-blue-500",
  },
  {
    year: "2025",
    title: "Oracle GenAI Professional Certification",
    institution: "Oracle University",
    description: "Oracle Cloud Infrastructure 2025 Certified Generative AI Professional — validating expertise in enterprise-grade AI systems.",
    type: "certification",
    accent: "from-red-500 to-orange-500",
  },
  {
    year: "2025",
    title: "Pinnacle Labs — Java Development Internship",
    institution: "Pinnacle Labs",
    description: "Gained hands-on experience collaborating with senior developers. Built a real-time disease detection system using Java.",
    type: "work",
    accent: "from-emerald-500 to-teal-500",
  },
  {
    year: "Oct 2025",
    title: "Bangalore Hackathon",
    institution: "Bangalore Institute of Technology (BIT)",
    description: "Participated in a 24-hour hackathon focused on AI-powered Medical Health solutions. Built a real-time disease detection system using ML.",
    type: "hackathon",
    accent: "from-pink-500 to-rose-500",
  },
  {
    year: "Feb 2026",
    title: "🏆 2nd Place — National Hackathon",
    institution: "Kristu Jayanti University, Bangalore",
    description: "Secured 2nd Position out of 50+ teams. Built an innovative AI-powered solution that impressed industry judges with technical excellence.",
    type: "achievement",
    accent: "from-amber-400 to-yellow-500",
  },
  {
    year: "Apr 2026",
    title: "IDE BootCamp — 5-Day Entrepreneurship Program",
    institution: "Innovation & Entrepreneurship Development",
    description: "Intensive program covering Design Thinking, Lean Canvas, MVP development, pitch presentations, and startup incubator visits.",
    type: "program",
    accent: "from-violet-500 to-purple-500",
  },
  {
    year: "Apr 2026",
    title: "INFOTHON 6.0 — National Hackathon",
    institution: "Vidyavardhaka Engineering College, Mysuru",
    description: "Participated in a 24-hour national-level hackathon, collaborating with cross-functional teams on innovative tech solutions.",
    type: "hackathon",
    accent: "from-cyan-500 to-blue-500",
  },
];

const certifications = [
  { title: "Oracle GenAI Professional", issuer: "Oracle University", date: "2025", accent: "from-red-500 to-orange-500", icon: SiOracle },
  { title: "Python Programming with AI", issuer: "Internshala", date: "2025", accent: "from-blue-500 to-cyan-500", icon: FaPython },
  { title: "GenAI 101: Mastering LLMs", issuer: "LetsUpgrade", date: "2025", accent: "from-purple-500 to-pink-500", icon: SiOpenai },
  { title: "Java Bootcamp", issuer: "LetsUpgrade", date: "2025", accent: "from-orange-500 to-amber-500", icon: FaJava },
  { title: "C++ Bootcamp", issuer: "LetsUpgrade", date: "2025", accent: "from-indigo-500 to-blue-500", icon: HiOutlineCodeBracket },
  { title: "HTML & CSS Bootcamp", issuer: "LetsUpgrade", date: "2025", accent: "from-emerald-500 to-teal-500", icon: FaHtml5 },
];

const philosophies = [
  {
    emoji: "🧠",
    title: "AI-First & Agentic Systems",
    description: "I approach system design by embedding intelligent automation, agentic workflows, and machine learning models directly into software cores to amplify human productivity.",
    gradient: "from-purple-500/10 to-indigo-500/10",
    border: "border-purple-500/20",
  },
  {
    emoji: "⚡",
    title: "Sub-100ms Microservices & Speed",
    description: "Build ultra-fast MVPs and production systems using modern microservices, Next.js Turbopack, and edge runtime architectures. Speed of execution backed by quality engineering is the ultimate edge.",
    gradient: "from-amber-500/10 to-orange-500/10",
    border: "border-amber-500/20",
  },
  {
    emoji: "🎯",
    title: "Impact-Driven Architecture",
    description: "Every line of code must solve a real-world enterprise problem. I measure software success not just by lines written, but by system reliability, speed, and real user value.",
    gradient: "from-emerald-500/10 to-teal-500/10",
    border: "border-emerald-500/20",
  },
];

// ─── Animated Counter Hook ──────────────────────────────────────────────────

function useCountUp(end: number, duration: number = 2000, startCounting: boolean = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startCounting) return;
    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, startCounting]);

  return count;
}

// ─── Section Wrapper ────────────────────────────────────────────────────────

function AnimatedSection({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`relative z-10 ${className}`}>
      {children}
    </section>
  );
}

// ─── Metric Card Component ──────────────────────────────────────────────────

function MetricCard({
  metric,
  index,
}: {
  metric: (typeof metrics)[0];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const count = useCountUp(metric.value, 2000, isInView);
  const prefersReducedMotion = usePrefersReducedMotion();
  const Icon = metric.icon;

  return (
    <div
      ref={ref}
      className="group relative bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 overflow-hidden cursor-default transition-all duration-300 hover:border-indigo-500/40 hover:shadow-[0_8px_40px_rgba(99,102,241,0.15)] hover:-translate-y-1"
    >
      {/* Gradient top accent line */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${metric.color} opacity-60 group-hover:opacity-100 transition-opacity`} />

      {/* Icon */}
      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${metric.color} bg-opacity-10 mb-4`}>
        <Icon className="w-6 h-6 text-white" />
      </div>

      {/* Counter */}
      <div className="text-4xl font-black text-white tracking-tight mb-1">
        {isInView ? count : metric.value}
        <span className="text-2xl">{metric.suffix}</span>
      </div>

      {/* Label */}
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{metric.label}</p>
    </div>
  );
}

// ─── Timeline Item Component ────────────────────────────────────────────────

function TimelineItem({
  item,
  index,
}: {
  item: (typeof timelineData)[0];
  index: number;
}) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isLeft = index % 2 === 0;
  const isAchievement = item.type === "achievement";

  const typeIcons: Record<string, typeof HiOutlineAcademicCap> = {
    education: HiOutlineAcademicCap,
    certification: HiOutlineSparkles,
    work: HiOutlineBriefcase,
    hackathon: HiOutlineRocketLaunch,
    achievement: HiOutlineTrophy,
    program: HiOutlineLightBulb,
  };
  const Icon = typeIcons[item.type] || HiOutlineSparkles;

  return (
    <div className="relative flex items-center w-full mb-8 lg:mb-12">
      {/* Desktop: Alternating layout */}
      <div className={`hidden lg:flex w-full items-center ${isLeft ? "" : "flex-row-reverse"}`}>
        {/* Card side */}
        <div className="w-[calc(50%-2rem)]">
          <div
            className={`relative bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 overflow-hidden transition-all duration-300 hover:border-indigo-500/40 hover:shadow-[0_8px_40px_rgba(99,102,241,0.12)] hover:-translate-y-1 ${isAchievement ? "ring-1 ring-amber-400/40" : ""}`}
          >
            {/* Top accent */}
            <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${item.accent}`} />

            {/* Header */}
            <div className="flex items-center gap-3 mb-3">
              <div className={`inline-flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br ${item.accent} shrink-0`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs font-bold tracking-wider uppercase text-purple-300">
                {item.year}
              </span>
            </div>

            <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
            <p className="text-sm text-blue-400 font-medium mb-2">{item.institution}</p>
            <p className="text-sm text-gray-400 leading-relaxed">{item.description}</p>
          </div>
        </div>

        {/* Center line + dot */}
        <div className="flex flex-col items-center w-16 shrink-0">
          <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${item.accent} z-10`} />
        </div>

        {/* Empty side */}
        <div className="w-[calc(50%-2rem)]" />
      </div>

      {/* Mobile: Stacked layout */}
      <div className="flex lg:hidden w-full gap-4">
        {/* Timeline line + dot */}
        <div className="flex flex-col items-center shrink-0">
          <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${item.accent} z-10`} />
          <div className="w-px flex-1 bg-gradient-to-b from-indigo-500/30 to-transparent" />
        </div>

        {/* Card */}
        <div
          className={`relative flex-1 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-5 overflow-hidden ${isAchievement ? "ring-1 ring-amber-400/40" : ""}`}
        >
          <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${item.accent}`} />
          <div className="flex items-center gap-2 mb-2">
            <div className={`inline-flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br ${item.accent} shrink-0`}>
              <Icon className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-xs font-bold tracking-wider uppercase text-purple-300">
              {item.year}
            </span>
          </div>
          <h3 className="text-base font-bold text-white mb-1">{item.title}</h3>
          <p className="text-xs text-blue-400 font-medium mb-1.5">{item.institution}</p>
          <p className="text-xs text-gray-400 leading-relaxed">{item.description}</p>
        </div>
      </div>
    </div>
  );
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

// ─── Main About Page ────────────────────────────────────────────────────────

export default function About() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const certsContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen relative text-white overflow-x-clip">
      {/* Immersive Space Background */}
      <StarField />

      {/* ── Section 1: Hero Banner ─────────────────────────────────────── */}
      <section className="relative w-full min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 lg:py-20 bg-transparent">
        {/* Deep space ambient lighting */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ 
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 -left-1/4 w-[50vw] h-[50vw] bg-indigo-600/10 rounded-full blur-[180px]"
          />
          <motion.div
            animate={{ 
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-1/4 right-0 w-[40vw] h-[40vw] bg-blue-600/10 rounded-full blur-[150px]"
          />
          <div className="absolute top-1/2 right-[10%] -translate-y-1/2 w-[30vw] h-[30vw] bg-purple-600/15 rounded-full blur-[120px]" />
        </div>

        <div className="container mx-auto px-6 md:px-12 relative z-10 w-full max-w-[1600px]">
          <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-10 lg:gap-12 py-6 lg:py-0">
            
            {/* Left Section (58% on Desktop) */}
            <div className="flex-1 lg:w-[58%] flex flex-col items-center lg:items-start text-center lg:text-left">
              
              {/* Status Badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6 shadow-lg shadow-black/20">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400 tracking-wider uppercase">Open for Software Engineering & AI Roles</span>
              </div>

              {/* Intro & Name */}
              <div className="mb-3 text-xl md:text-2xl text-gray-300 font-medium tracking-tight">
                Hi, I&apos;m <span className="text-white font-bold">Mahammad Aftab</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-[4.2rem] xl:text-[5rem] font-black tracking-tighter mb-6 leading-[0.95] flex flex-col">
                <span className="text-white">
                  Architecting
                </span>
                <span className="text-white">
                  Intelligent Systems.
                </span>
                <span className="text-purple-400">
                  AI & Cloud Engineering.
                </span>
              </h1>

              {/* Bio */}
              <p className="text-base md:text-lg lg:text-xl text-gray-400 font-normal tracking-wide mb-8 leading-relaxed max-w-[680px]">
                Engineering high-performance software at the intersection of <span className="text-white font-medium">Generative AI</span>, <span className="text-white font-medium">Cloud Systems</span>, and <span className="text-white font-medium">Full-Stack Development</span>.
              </p>

              {/* Action Buttons & Social Links */}
              <div className="flex flex-col sm:flex-row items-center gap-5 lg:gap-6">
                <Link 
                  href="/projects"
                  className="group relative inline-flex items-center justify-center gap-3 px-7 py-3.5 bg-white text-black text-base font-bold rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.25)]"
                >
                  <span className="relative flex items-center gap-2">
                    Explore Project Architecture
                    <HiOutlineRocketLaunch className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
                
                <div className="flex items-center gap-3">
                  {[
                    { icon: FaGithub, href: "https://github.com/mahammadaftab", label: "GitHub" },
                    { icon: FaLinkedin, href: "https://www.linkedin.com/in/mahammad-aftab", label: "LinkedIn" },
                    { icon: FaEnvelope, href: "mailto:mdaftabeditz360@gmail.com", label: "Email" },
                  ].map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="group flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/30 hover:-translate-y-1 transition-all duration-300 backdrop-blur-md shadow-xl"
                    >
                      <social.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Section: Profile Avatar (42% on Desktop) */}
            <div className="lg:w-[42%] flex justify-center lg:justify-end items-center relative mt-8 lg:mt-0">
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-[380px] lg:h-[380px] xl:w-[440px] xl:h-[440px] flex-shrink-0">
                {/* Decorative Rings */}
                <div className="absolute inset-[-10px] sm:inset-[-20px] lg:inset-[-30px] rounded-full border border-white/10 animate-[spin_10s_linear_infinite]" />
                <div className="absolute inset-[-20px] sm:inset-[-40px] lg:inset-[-60px] rounded-full border border-white/5 animate-[spin_15s_linear_infinite_reverse]" />
                
                {/* Orbiting Icons */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -left-2 top-12 sm:-left-4 lg:-left-12 lg:top-24 w-10 h-10 lg:w-16 lg:h-16 rounded-2xl bg-black/50 border border-white/10 backdrop-blur-xl flex items-center justify-center shadow-[0_0_30px_rgba(97,218,251,0.25)] z-20"
                >
                  <FaReact className="w-5 h-5 lg:w-8 lg:h-8 text-[#61DAFB]" />
                </motion.div>
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute -right-1 bottom-12 sm:-right-2 lg:-right-8 lg:bottom-24 w-10 h-10 lg:w-16 lg:h-16 rounded-2xl bg-black/50 border border-white/10 backdrop-blur-xl flex items-center justify-center shadow-[0_0_30px_rgba(49,120,198,0.25)] z-20"
                >
                  <SiTypescript className="w-5 h-5 lg:w-8 lg:h-8 text-[#3178C6]" />
                </motion.div>
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute left-12 -top-4 sm:-top-6 lg:left-24 lg:-top-12 w-10 h-10 lg:w-16 lg:h-16 rounded-2xl bg-black/50 border border-white/10 backdrop-blur-xl flex items-center justify-center shadow-[0_0_30px_rgba(248,0,0,0.25)] z-20"
                >
                  <SiOracle className="w-5 h-5 lg:w-8 lg:h-8 text-[#F80000]" />
                </motion.div>

                {/* Profile Image */}
                <div className="relative w-full h-full rounded-full overflow-hidden border-[4px] border-white/15 shadow-[0_0_80px_rgba(79,70,229,0.3)] z-10">
                  <Image
                    src="/images/profile.jpg"
                    alt="Mahammad Aftab"
                    fill
                    priority
                    className="object-cover object-top hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-6 lg:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 lg:gap-3 z-20"
        >
          <span className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold hidden sm:block">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-4 h-6 lg:w-5 lg:h-8 rounded-full border border-white/20 flex items-start justify-center p-1"
          >
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3], height: ["4px", "8px", "4px"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 bg-white/50 rounded-full"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ── Section 2: Bento Grid Architecture (Google / Vercel Style) ─────── */}
      <AnimatedSection className="py-20 md:py-28" id="about-bento">
        <div className="container mx-auto px-6 md:px-12 max-w-[1600px]">
          <div className="w-full">
            <div className="text-center mb-14">
              <span className="text-xs font-mono font-bold tracking-[0.2em] uppercase text-indigo-400 mb-3 block">
                Engineering Identity
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                Architectural DNA & Core Expertise
              </h2>
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              
              {/* Bento Card 1 (Span 3 cols) — Vision & Summary */}
              <div className="lg:col-span-3 bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl p-8 lg:p-10 relative overflow-hidden flex flex-col justify-between group hover:border-indigo-500/40 hover:shadow-[0_16px_60px_rgba(99,102,241,0.12)] transition-all duration-500">
                <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <HiOutlineCpuChip className="w-5 h-5 text-indigo-400" />
                    <span className="text-xs font-mono font-bold tracking-widest text-indigo-400 uppercase">Core Mission</span>
                  </div>
                  <blockquote className="text-2xl md:text-3xl font-light text-white/90 leading-relaxed italic mb-8">
                    &ldquo;Building intelligent systems that bridge the gap between{" "}
                    <span className="text-indigo-400 font-medium not-italic">human creativity</span>{" "}
                    and{" "}
                    <span className="text-purple-400 font-medium not-italic">machine intelligence</span>.&rdquo;
                  </blockquote>
                  <p className="text-gray-300 leading-relaxed text-base mb-6">
                    I&apos;m Mahammad Aftab — an AI Engineer and Full-Stack Developer currently pursuing my B.E. in Computer Science at Rural Engineering College, Hulkoti. My engineering focus centers on <span className="text-white font-semibold">Generative AI</span>, <span className="text-white font-semibold">Microservices Architecture</span>, and <span className="text-white font-semibold">Cloud Systems</span>.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
                  {["AI / Machine Learning", "Full-Stack Systems", "Generative AI", "Cloud Architecture", "System Design", "Open Source"].map((chip) => (
                    <span
                      key={chip}
                      className="px-3.5 py-1.5 text-xs font-semibold rounded-full bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bento Card 2 (Span 2 cols) — Oracle GenAI Certified */}
              <div className="lg:col-span-2 bg-gradient-to-br from-red-950/20 via-white/[0.03] to-orange-950/20 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 relative overflow-hidden flex flex-col justify-between group hover:border-red-500/40 hover:shadow-[0_16px_60px_rgba(248,0,0,0.15)] transition-all duration-500">
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <SiOracle className="w-6 h-6 text-red-500" />
                      <span className="text-xs font-mono font-bold tracking-widest text-red-400 uppercase">Certified Expert</span>
                    </div>
                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-full bg-red-500/20 text-red-400 border border-red-500/30">Verified</span>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-3 leading-snug">
                    Oracle Cloud Infrastructure 2025 Certified Generative AI Professional
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed mb-6">
                    Validated enterprise-grade expertise in fine-tuning Large Language Models (LLMs), RAG pipelines, vector databases, and cloud-native AI deployment.
                  </p>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-black/40 border border-white/10">
                  <HiOutlineCheckBadge className="w-6 h-6 text-emerald-400 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-white">Oracle University Issued</div>
                    <div className="text-[11px] text-gray-400">Enterprise Cloud & AI Specialist</div>
                  </div>
                </div>
              </div>

              {/* Bento Card 3 (Span 2 cols) — Hackathon Winner */}
              <div className="lg:col-span-2 bg-gradient-to-br from-amber-950/20 via-white/[0.03] to-orange-950/20 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 relative overflow-hidden flex flex-col justify-between group hover:border-amber-400/40 hover:shadow-[0_16px_60px_rgba(251,191,36,0.15)] transition-all duration-500">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <HiOutlineTrophy className="w-6 h-6 text-amber-400" />
                      <span className="text-xs font-mono font-bold tracking-widest text-amber-400 uppercase">Track Record</span>
                    </div>
                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">2nd Place</span>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-3">
                    🏆 National Hackathon Runner-Up
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed mb-4">
                    Secured 2nd Position out of 50+ engineering teams at Kristu Jayanti University, Bangalore. Competed across 3 national-level 24-hour hackathons including Bangalore Institute of Technology (BIT) & INFOTHON 6.0.
                  </p>
                </div>

                <div className="text-xs font-mono text-amber-300/80 bg-amber-400/10 border border-amber-400/20 px-4 py-2.5 rounded-xl">
                  50+ Teams • 24-Hour AI Challenge • Kristu Jayanti Bangalore
                </div>
              </div>

              {/* Bento Card 4 (Span 3 cols) — Technical & Academic Foundation */}
              <div className="lg:col-span-3 bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl p-8 lg:p-10 relative overflow-hidden flex flex-col justify-between group hover:border-indigo-500/40 hover:shadow-[0_16px_60px_rgba(99,102,241,0.12)] transition-all duration-500">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <HiOutlineAcademicCap className="w-5 h-5 text-indigo-400" />
                      <span className="text-xs font-mono font-bold tracking-widest text-indigo-400 uppercase">Degree Engineering</span>
                    </div>
                    <h4 className="text-lg font-bold text-white mb-1">B.E. Computer Science Engineering</h4>
                    <p className="text-xs text-blue-400 font-semibold mb-2">Rural Engineering College, Hulkoti (2023–Present)</p>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      3rd Year Scholar specializing in Algorithms, AI/ML, Cloud Infrastructure, and Distributed Systems.
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <HiOutlineBolt className="w-5 h-5 text-purple-400" />
                      <span className="text-xs font-mono font-bold tracking-widest text-purple-400 uppercase">Academic Excellence</span>
                    </div>
                    <h4 className="text-lg font-bold text-white mb-1">Pre-University & High School</h4>
                    <p className="text-xs text-purple-300 font-semibold mb-2">KLE Society PUC (Science) & Royal High School (SSLC 85.12%)</p>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Strong foundation in Mathematics, Physics, Computer Science logic, and technical problem solving.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* ── Gradient Divider ────────────────────────────────────────────── */}
      <div className="container mx-auto px-6 md:px-12 max-w-[1600px]">
        <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
      </div>

      {/* ── Section 3: Telemetry Dashboard ──────────────────────────────── */}
      <AnimatedSection className="py-20 md:py-28" id="about-metrics">
        <div className="container mx-auto px-6 md:px-12 max-w-[1600px]">
          <div className="w-full">
            <div className="text-center mb-14">
              <span className="text-xs font-mono font-bold tracking-[0.2em] uppercase text-indigo-400 mb-3 block">
                Telemetry Dashboard
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                Quantifiable Impact & Production Stats
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 md:gap-6">
              {metrics.map((metric, i) => (
                <MetricCard key={metric.label} metric={metric} index={i} />
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* ── Gradient Divider ────────────────────────────────────────────── */}
      <div className="container mx-auto px-6 md:px-12 max-w-[1600px]">
        <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
      </div>

      {/* ── Section 4: Technical DNA Marquee ────────────────────────────── */}
      <AnimatedSection className="py-20 md:py-28" id="about-tech">
        <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12">
          <div className="text-center mb-14 px-4">
            <span className="text-xs font-mono font-bold tracking-[0.2em] uppercase text-indigo-400 mb-3 block">
              Stack Architecture
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              Technologies & Tooling Ecosystem
            </h2>
          </div>

          {/* Row 1 — Scroll Left */}
          <div className="relative overflow-hidden mb-4 w-full max-w-full">
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#0a0025] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#0a0025] to-transparent z-10 pointer-events-none" />

            <div className="animate-marquee-left flex gap-4 w-max">
              {[...techSkillsRow1, ...techSkillsRow1].map((skill, i) => {
                const Icon = skill.icon;
                return (
                  <div
                    key={`${skill.name}-${i}`}
                    className="flex items-center gap-2.5 px-5 py-3 bg-white/5 border border-white/[0.08] rounded-xl hover:bg-white/10 hover:border-indigo-500/30 transition-all duration-200 shrink-0 group cursor-default"
                  >
                    <Icon className="w-5 h-5 shrink-0 transition-colors duration-200" style={{ color: skill.color }} />
                    <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors whitespace-nowrap">
                      {skill.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Row 2 — Scroll Right */}
          <div className="relative overflow-hidden w-full max-w-full">
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#0a0025] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#0a0025] to-transparent z-10 pointer-events-none" />

            <div className="animate-marquee-right flex gap-4 w-max">
              {[...techSkillsRow2, ...techSkillsRow2].map((skill, i) => {
                const Icon = skill.icon;
                return (
                  <div
                    key={`${skill.name}-${i}`}
                    className="flex items-center gap-2.5 px-5 py-3 bg-white/5 border border-white/[0.08] rounded-xl hover:bg-white/10 hover:border-indigo-500/30 transition-all duration-200 shrink-0 group cursor-default"
                  >
                    <Icon className="w-5 h-5 shrink-0 transition-colors duration-200" style={{ color: skill.color }} />
                    <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors whitespace-nowrap">
                      {skill.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* ── Gradient Divider ────────────────────────────────────────────── */}
      <div className="container mx-auto px-6 md:px-12 max-w-[1600px]">
        <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
      </div>

      {/* ── Section 5: Professional Timeline ───────────────────────────── */}
      <AnimatedSection className="py-20 md:py-28" id="about-timeline">
        <div className="container mx-auto px-6 md:px-12 max-w-[1600px]">
          <div className="w-full">
            <div className="text-center mb-16">
              <span className="text-xs font-mono font-bold tracking-[0.2em] uppercase text-indigo-400 mb-3 block">
                Roadmap & History
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                Milestones & Key Accomplishments
              </h2>
            </div>

            {/* Timeline container */}
            <div className="relative">
              <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500/40 via-purple-500/20 to-transparent" />

              {timelineData.map((item, i) => (
                <TimelineItem key={`${item.year}-${item.title}`} item={item} index={i} />
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* ── Gradient Divider ────────────────────────────────────────────── */}
      <div className="container mx-auto px-6 md:px-12 max-w-[1600px]">
        <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
      </div>

      {/* ── Section 6: Certifications Showcase ─────────────────────────── */}
      <AnimatedSection className="py-20 md:py-28" id="about-certifications">
        <div className="container mx-auto px-6 md:px-12 max-w-[1600px]">
          <div className="w-full">
            <div className="text-center mb-14">
              <span className="text-xs font-mono font-bold tracking-[0.2em] uppercase text-indigo-400 mb-3 block">
                Verified Credentials
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                Certifications & Training
              </h2>
            </div>

            {/* Horizontal scroll carousel */}
            <div
              ref={certsContainerRef}
              className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {certifications.map((cert, i) => {
                const Icon = cert.icon;
                return (
                  <div
                    key={cert.title}
                    className="group relative flex-shrink-0 w-72 sm:w-80 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 snap-start overflow-hidden cursor-default transition-all duration-300 hover:border-indigo-500/40 hover:shadow-[0_8px_40px_rgba(99,102,241,0.12)] hover:-translate-y-1"
                  >
                    <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${cert.accent} opacity-60 group-hover:opacity-100 transition-opacity`} />

                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${cert.accent} mb-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    <h3 className="text-base font-bold text-white mb-1">{cert.title}</h3>
                    <p className="text-sm text-blue-400 font-medium mb-1">{cert.issuer}</p>
                    <p className="text-xs text-gray-500">{cert.date}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* ── Gradient Divider ────────────────────────────────────────────── */}
      <div className="container mx-auto px-6 md:px-12 max-w-[1600px]">
        <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
      </div>

      {/* ── Section 7: Philosophy & Principles ─────────────────────────── */}
      <AnimatedSection className="py-20 md:py-28" id="about-philosophy">
        <div className="container mx-auto px-6 md:px-12 max-w-[1600px]">
          <div className="w-full">
            <div className="text-center mb-14">
              <span className="text-xs font-mono font-bold tracking-[0.2em] uppercase text-indigo-400 mb-3 block">
                Research & Engineering Culture
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                Software Engineering Philosophy
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {philosophies.map((item, i) => (
                <div
                  key={item.title}
                  className={`relative bg-gradient-to-br ${item.gradient} backdrop-blur-xl border ${item.border} rounded-3xl p-8 cursor-default transition-all duration-300 hover:border-indigo-500/40 hover:shadow-[0_16px_60px_rgba(99,102,241,0.12)] hover:-translate-y-1`}
                >
                  <div className="text-4xl mb-4">{item.emoji}</div>
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* ── Gradient Divider ────────────────────────────────────────────── */}
      <div className="container mx-auto px-6 md:px-12 max-w-[1600px]">
        <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
      </div>

      {/* ── Section 8: CTA Footer ──────────────────────────────────────── */}
      <section className="py-24 md:py-32 relative overflow-x-clip">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-purple-600/5 to-blue-600/10" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[150px] pointer-events-none" />

        <div className="container mx-auto px-6 md:px-12 max-w-[1600px] relative z-10">
          <div className="max-w-4xl mx-auto text-center bg-white/[0.02] border border-white/10 rounded-3xl p-10 md:p-16 backdrop-blur-2xl">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight tracking-tight">
              Ready to build something{" "}
              <span className="text-purple-400">
                extraordinary
              </span>
              ?
            </h2>
            <p className="text-gray-400 text-base md:text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
              Actively seeking software engineering, full-stack, and AI opportunities to build cutting-edge systems with world-class engineering teams.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/projects"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-900 text-base font-bold rounded-full hover:bg-gray-100 transition-all duration-300 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.2)]"
              >
                View Project Architecture
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>

              <Link
                href="/contact"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent text-white text-base font-bold rounded-full border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all duration-300 active:scale-95"
              >
                Get In Touch
                <span className="opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                  👋
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}