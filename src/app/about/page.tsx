"use client";

import { useState, useEffect, useRef } from "react";
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
    title: "AI-First Thinking",
    description: "I approach every problem through the lens of intelligent automation and machine learning, seeking ways to amplify human capability with AI.",
    gradient: "from-purple-500/10 to-indigo-500/10",
    border: "border-purple-500/20",
  },
  {
    emoji: "⚡",
    title: "Ship Fast, Iterate Faster",
    description: "Build MVPs, gather real user feedback, and improve continuously. Speed of execution combined with quality engineering is the competitive edge.",
    gradient: "from-amber-500/10 to-orange-500/10",
    border: "border-amber-500/20",
  },
  {
    emoji: "🎯",
    title: "Impact-Driven Engineering",
    description: "Every line of code should solve a real problem. I measure success not in features shipped, but in meaningful impact delivered to users.",
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
      // Ease-out cubic
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

// ─── Section Wrapper with Scroll Animation ──────────────────────────────────

function AnimatedSection({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <motion.section
      ref={ref}
      id={id}
      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: prefersReducedMotion ? 0 : 0.7, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.section>
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
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const count = useCountUp(metric.value, 2000, isInView);
  const prefersReducedMotion = usePrefersReducedMotion();
  const Icon = metric.icon;

  return (
    <motion.div
      ref={ref}
      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.5,
        delay: prefersReducedMotion ? 0 : index * 0.1,
        ease: "easeOut",
      }}
      whileHover={prefersReducedMotion ? {} : { y: -6, scale: 1.03 }}
      className="group relative bg-white/5 dark:bg-white/[0.03] backdrop-blur-xl border border-white/10 dark:border-white/[0.06] rounded-2xl p-6 overflow-hidden cursor-default transition-shadow duration-300 hover:shadow-[0_8px_40px_rgba(99,102,241,0.12)]"
    >
      {/* Gradient top accent */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${metric.color} opacity-60 group-hover:opacity-100 transition-opacity`} />

      {/* Icon */}
      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${metric.color} bg-opacity-10 mb-4`}>
        <Icon className="w-6 h-6 text-white" />
      </div>

      {/* Counter */}
      <div className="text-4xl font-black text-white tracking-tight mb-1">
        {isInView ? count : 0}
        <span className="text-2xl">{metric.suffix}</span>
      </div>

      {/* Label */}
      <p className="text-sm text-gray-400 font-medium">{metric.label}</p>
    </motion.div>
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
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
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
    <div ref={ref} className="relative flex items-center w-full mb-8 lg:mb-12">
      {/* Desktop: Alternating layout */}
      <div className={`hidden lg:flex w-full items-center ${isLeft ? "" : "flex-row-reverse"}`}>
        {/* Card side */}
        <div className="w-[calc(50%-2rem)]">
          <motion.div
            initial={
              prefersReducedMotion
                ? { opacity: 1 }
                : { opacity: 0, x: isLeft ? -40 : 40 }
            }
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.6,
              delay: prefersReducedMotion ? 0 : 0.2,
              ease: "easeOut",
            }}
            whileHover={prefersReducedMotion ? {} : { y: -4 }}
            className={`relative bg-white/5 dark:bg-white/[0.03] backdrop-blur-xl border border-white/10 dark:border-white/[0.06] rounded-2xl p-6 overflow-hidden transition-shadow duration-300 hover:shadow-[0_8px_40px_rgba(99,102,241,0.1)] ${isAchievement ? "ring-1 ring-amber-400/30" : ""}`}
          >
            {/* Top accent */}
            <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${item.accent}`} />

            {/* Header */}
            <div className="flex items-center gap-3 mb-3">
              <div className={`inline-flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br ${item.accent} shrink-0`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <span className={`text-xs font-bold tracking-wider uppercase bg-gradient-to-r ${item.accent} bg-clip-text text-transparent`}>
                {item.year}
              </span>
            </div>

            <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
            <p className="text-sm text-blue-400/80 font-medium mb-2">{item.institution}</p>
            <p className="text-sm text-gray-400 leading-relaxed">{item.description}</p>
          </motion.div>
        </div>

        {/* Center line + dot */}
        <div className="flex flex-col items-center w-16 shrink-0">
          <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${item.accent} animate-timeline-pulse z-10`} />
        </div>

        {/* Empty side */}
        <div className="w-[calc(50%-2rem)]" />
      </div>

      {/* Mobile: Stacked layout */}
      <div className="flex lg:hidden w-full gap-4">
        {/* Timeline line + dot */}
        <div className="flex flex-col items-center shrink-0">
          <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${item.accent} animate-timeline-pulse z-10`} />
          <div className="w-px flex-1 bg-gradient-to-b from-indigo-500/30 to-transparent" />
        </div>

        {/* Card */}
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, x: 20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.5,
            delay: prefersReducedMotion ? 0 : 0.15,
          }}
          className={`relative flex-1 bg-white/5 dark:bg-white/[0.03] backdrop-blur-xl border border-white/10 dark:border-white/[0.06] rounded-2xl p-5 overflow-hidden ${isAchievement ? "ring-1 ring-amber-400/30" : ""}`}
        >
          <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${item.accent}`} />
          <div className="flex items-center gap-2 mb-2">
            <div className={`inline-flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br ${item.accent} shrink-0`}>
              <Icon className="w-3.5 h-3.5 text-white" />
            </div>
            <span className={`text-xs font-bold tracking-wider uppercase bg-gradient-to-r ${item.accent} bg-clip-text text-transparent`}>
              {item.year}
            </span>
          </div>
          <h3 className="text-base font-bold text-white mb-1">{item.title}</h3>
          <p className="text-xs text-blue-400/80 font-medium mb-1.5">{item.institution}</p>
          <p className="text-xs text-gray-400 leading-relaxed">{item.description}</p>
        </motion.div>
      </div>
    </div>
  );
}

// ─── Main About Page ────────────────────────────────────────────────────────

export default function About() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const certsContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen bg-[#030712] text-white overflow-hidden">
      {/* ── Section 1: Hero Banner ─────────────────────────────────────── */}
      <section className="relative min-h-[85vh] flex items-center justify-center py-20 overflow-hidden">
        {/* Gradient mesh background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#030712] via-[#0c1222] to-[#0f0720] animate-gradient-mesh" />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Floating gradient orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[200px] pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            {/* Profile Photo */}
            <motion.div
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.8, ease: "easeOut" }}
              className="relative mb-8"
            >
              {/* Glow ring */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-full animate-profile-glow opacity-75 blur-sm" />
              <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden border-2 border-white/20">
                <Image
                  src="/images/profile.jpg"
                  alt="Mahammad Aftab — AI Engineer & Full-Stack Developer"
                  fill
                  priority
                  className="object-cover object-top"
                />
              </div>
              {/* Status badge */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 bg-gray-900/90 backdrop-blur-xl border border-white/10 rounded-full">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
                <span className="text-[10px] font-bold tracking-wider uppercase text-green-400">Open to Work</span>
              </div>
            </motion.div>

            {/* Name */}
            <motion.h1
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.6, delay: prefersReducedMotion ? 0 : 0.3 }}
              className="text-5xl md:text-7xl font-black tracking-tight mb-4"
            >
              <span className="bg-gradient-to-r from-blue-300 via-purple-400 to-indigo-400 bg-clip-text text-transparent animate-gradient-text">
                Mahammad Aftab
              </span>
            </motion.h1>

            {/* Title */}
            <motion.p
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.6, delay: prefersReducedMotion ? 0 : 0.5 }}
              className="text-base md:text-lg text-gray-400 font-medium tracking-wide max-w-2xl mb-8"
            >
              <span className="text-white/90 font-semibold">AI Engineer</span>
              <span className="mx-2 text-indigo-400/60">·</span>
              <span className="text-white/90 font-semibold">Generative AI Specialist</span>
              <span className="mx-2 text-indigo-400/60">·</span>
              <span className="text-white/90 font-semibold">Full-Stack Developer</span>
              <span className="mx-2 text-indigo-400/60">·</span>
              <span className="text-white/90 font-semibold">Cloud Architect</span>
            </motion.p>

            {/* Social Links */}
            <motion.div
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.5, delay: prefersReducedMotion ? 0 : 0.7 }}
              className="flex items-center gap-4"
            >
              {[
                { icon: FaGithub, href: "https://github.com/mahammadaftab", label: "GitHub" },
                { icon: FaLinkedin, href: "https://linkedin.com/in/mahammadaftab", label: "LinkedIn" },
                { icon: FaEnvelope, href: "mailto:mahammadaftab.dev@gmail.com", label: "Email" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="group flex items-center justify-center w-11 h-11 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 hover:-translate-y-1 transition-all duration-300"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-1.5"
          >
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3], height: ["4px", "10px", "4px"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 bg-white/50 rounded-full"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ── Section 2: Professional Summary ────────────────────────────── */}
      <AnimatedSection className="py-20 md:py-28" id="about-summary">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-start">
              {/* Mission Statement */}
              <div className="lg:col-span-2">
                <div className="sticky top-24">
                  <span className="text-xs font-bold tracking-[0.2em] uppercase text-indigo-400 mb-4 block">
                    Mission
                  </span>
                  <blockquote className="text-2xl md:text-3xl font-light text-white/80 leading-relaxed italic">
                    &ldquo;Building intelligent systems that bridge the gap between{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-medium not-italic">
                      human creativity
                    </span>{" "}
                    and{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 font-medium not-italic">
                      machine intelligence
                    </span>
                    .&rdquo;
                  </blockquote>
                </div>
              </div>

              {/* Bio Content */}
              <div className="lg:col-span-3 space-y-6">
                <p className="text-gray-300 leading-relaxed text-base md:text-lg">
                  I&apos;m Mahammad Aftab — an AI Engineer and Full-Stack Developer currently pursuing my B.E. in Computer Science at Rural Engineering College, Hulkoti. My work sits at the intersection of{" "}
                  <span className="text-white font-semibold">Generative AI</span>,{" "}
                  <span className="text-white font-semibold">modern web development</span>, and{" "}
                  <span className="text-white font-semibold">cloud architecture</span>.
                </p>

                <p className="text-gray-400 leading-relaxed">
                  With an Oracle-certified foundation in Generative AI and hands-on experience building 15+ production-grade projects, I specialize in crafting intelligent, scalable applications. From AI-powered disease detection systems to full-stack e-commerce platforms, I bring ideas to life with clean architecture and modern tooling.
                </p>

                <p className="text-gray-400 leading-relaxed">
                  I&apos;ve competed in 3 national-level hackathons — securing 2nd place at Kristu Jayanti University among 50+ teams — and hold professional certifications across Python, Java, and cloud technologies. I believe in writing code that is not just functional, but elegant, maintainable, and impactful.
                </p>

                {/* Highlight chips */}
                <div className="flex flex-wrap gap-2 pt-4">
                  {["AI / Machine Learning", "Full-Stack Development", "Generative AI", "Cloud Architecture", "System Design", "Open Source"].map(
                    (chip) => (
                      <span
                        key={chip}
                        className="px-3 py-1.5 text-xs font-semibold tracking-wide rounded-full bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white transition-colors duration-200"
                      >
                        {chip}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* ── Gradient Divider ────────────────────────────────────────────── */}
      <div className="container mx-auto px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
      </div>

      {/* ── Section 3: Metrics Dashboard ───────────────────────────────── */}
      <AnimatedSection className="py-20 md:py-28" id="about-metrics">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-indigo-400 mb-3 block">
                Impact at a Glance
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Numbers That Define My Journey
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {metrics.map((metric, i) => (
                <MetricCard key={metric.label} metric={metric} index={i} />
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* ── Gradient Divider ────────────────────────────────────────────── */}
      <div className="container mx-auto px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
      </div>

      {/* ── Section 4: Technical DNA Marquee ────────────────────────────── */}
      <AnimatedSection className="py-20 md:py-28" id="about-tech">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14 px-4">
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-indigo-400 mb-3 block">
              Technical DNA
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              What I Build With
            </h2>
          </div>

          {/* Row 1 — Scroll Left */}
          <div className="relative overflow-hidden mb-4">
            {/* Fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#030712] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#030712] to-transparent z-10 pointer-events-none" />

            <div className="animate-marquee-left flex gap-4 w-max">
              {[...techSkillsRow1, ...techSkillsRow1].map((skill, i) => {
                const Icon = skill.icon;
                return (
                  <div
                    key={`${skill.name}-${i}`}
                    className="flex items-center gap-2.5 px-5 py-3 bg-white/5 border border-white/[0.06] rounded-xl hover:bg-white/10 hover:border-white/15 transition-all duration-200 shrink-0 group cursor-default"
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
          <div className="relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#030712] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#030712] to-transparent z-10 pointer-events-none" />

            <div className="animate-marquee-right flex gap-4 w-max">
              {[...techSkillsRow2, ...techSkillsRow2].map((skill, i) => {
                const Icon = skill.icon;
                return (
                  <div
                    key={`${skill.name}-${i}`}
                    className="flex items-center gap-2.5 px-5 py-3 bg-white/5 border border-white/[0.06] rounded-xl hover:bg-white/10 hover:border-white/15 transition-all duration-200 shrink-0 group cursor-default"
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
      <div className="container mx-auto px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
      </div>

      {/* ── Section 5: Professional Timeline ───────────────────────────── */}
      <AnimatedSection className="py-20 md:py-28" id="about-timeline">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-indigo-400 mb-3 block">
                My Journey
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Milestones & Achievements
              </h2>
            </div>

            {/* Timeline container */}
            <div className="relative">
              {/* Vertical line — desktop only */}
              <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500/40 via-purple-500/20 to-transparent" />

              {timelineData.map((item, i) => (
                <TimelineItem key={`${item.year}-${item.title}`} item={item} index={i} />
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* ── Gradient Divider ────────────────────────────────────────────── */}
      <div className="container mx-auto px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
      </div>

      {/* ── Section 6: Certifications Showcase ─────────────────────────── */}
      <AnimatedSection className="py-20 md:py-28" id="about-certifications">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-indigo-400 mb-3 block">
                Credentials
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
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
                  <motion.div
                    key={cert.title}
                    initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: prefersReducedMotion ? 0 : 0.5,
                      delay: prefersReducedMotion ? 0 : i * 0.1,
                    }}
                    whileHover={prefersReducedMotion ? {} : { y: -6 }}
                    className="group relative flex-shrink-0 w-72 sm:w-80 bg-white/5 dark:bg-white/[0.03] backdrop-blur-xl border border-white/10 dark:border-white/[0.06] rounded-2xl p-6 snap-start overflow-hidden cursor-default transition-shadow duration-300 hover:shadow-[0_8px_40px_rgba(99,102,241,0.1)]"
                  >
                    {/* Top accent */}
                    <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${cert.accent} opacity-60 group-hover:opacity-100 transition-opacity`} />

                    {/* Icon */}
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${cert.accent} mb-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    <h3 className="text-base font-bold text-white mb-1">{cert.title}</h3>
                    <p className="text-sm text-blue-400/70 font-medium mb-1">{cert.issuer}</p>
                    <p className="text-xs text-gray-500">{cert.date}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* ── Gradient Divider ────────────────────────────────────────────── */}
      <div className="container mx-auto px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
      </div>

      {/* ── Section 7: Philosophy & Values ─────────────────────────────── */}
      <AnimatedSection className="py-20 md:py-28" id="about-philosophy">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-indigo-400 mb-3 block">
                How I Think
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Engineering Philosophy
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {philosophies.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: prefersReducedMotion ? 0 : 0.5,
                    delay: prefersReducedMotion ? 0 : i * 0.15,
                  }}
                  whileHover={prefersReducedMotion ? {} : { y: -6, scale: 1.02 }}
                  className={`relative bg-gradient-to-br ${item.gradient} backdrop-blur-xl border ${item.border} rounded-2xl p-7 cursor-default transition-shadow duration-300 hover:shadow-lg`}
                >
                  <div className="text-4xl mb-4">{item.emoji}</div>
                  <h3 className="text-lg font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* ── Gradient Divider ────────────────────────────────────────────── */}
      <div className="container mx-auto px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
      </div>

      {/* ── Section 8: CTA Footer ──────────────────────────────────────── */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-purple-600/5 to-blue-600/10" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[150px] pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.7 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Ready to build something{" "}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                extraordinary
              </span>
              ?
            </h2>
            <p className="text-gray-400 text-base md:text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
              I&apos;m actively seeking opportunities where I can contribute to cutting-edge AI and full-stack projects at world-class engineering teams.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/projects"
                className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-gray-900 text-sm font-bold rounded-full hover:bg-gray-100 transition-all duration-300 active:scale-95"
              >
                View My Projects
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>

              <Link
                href="/contact"
                className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-transparent text-white text-sm font-bold rounded-full border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all duration-300 active:scale-95"
              >
                Get In Touch
                <span className="opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                  👋
                </span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}