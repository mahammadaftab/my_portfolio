"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import projectsData from "@/data/projects.json";
import ProjectModal from "@/components/project-modal";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import {
  HiOutlineCodeBracket,
  HiOutlineArrowTopRightOnSquare,
  HiOutlineFunnel,
  HiOutlineRocketLaunch,
  HiOutlineSparkles,
  HiOutlinePlayCircle,
} from "react-icons/hi2";
import { FaGithub } from "react-icons/fa";

// ─── Types ──────────────────────────────────────────────────────────────────

interface ProjectUrl {
  label: string;
  url: string;
}

interface ProjectMedia {
  url: string;
  label: string;
  type: "image" | "video";
}

interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  categorizedTags?: Record<string, string[]>;
  image?: string;
  images?: ProjectMedia[];
  videos?: ProjectMedia[];
  liveUrl?: string;
  urls?: ProjectUrl[];
  githubUrl: string;
  details?: string;
  technologies?: string[];
}

// ─── Helpers ────────────────────────────────────────────────────────────────

const castToProject = (project: any): Project => {
  let tags = project.tags || [];
  let categorizedTags = project.categorizedTags;

  if (project.tags && !Array.isArray(project.tags) && typeof project.tags === "object") {
    categorizedTags = project.tags;
    tags = Object.values(project.tags).flat() as string[];
  }

  return {
    ...project,
    tags,
    categorizedTags,
    images:
      project.images?.map((img: any) => ({
        ...img,
        type: img.type as "image" | "video",
      })) || [],
    videos:
      project.videos?.map((video: any) => ({
        ...video,
        type: video.type as "image" | "video",
      })) || [],
    urls: project.urls || [],
  };
};

const typedProjects = projectsData.map(castToProject);

const getProjectImage = (project: Project) => {
  if (project.images && project.images.length > 0) return project.images[0].url;
  if (project.image) return project.image;
  return "";
};

const hasVideos = (project: Project) =>
  project.videos && project.videos.length > 0;

// Gradient accents per project index (cycles through)
const cardAccents = [
  "from-blue-500 via-indigo-500 to-purple-500",
  "from-emerald-500 via-teal-500 to-cyan-500",
  "from-amber-500 via-orange-500 to-red-500",
  "from-pink-500 via-rose-500 to-red-500",
  "from-violet-500 via-purple-500 to-indigo-500",
  "from-cyan-500 via-blue-500 to-indigo-500",
  "from-lime-500 via-emerald-500 to-teal-500",
  "from-fuchsia-500 via-pink-500 to-rose-500",
];

// Gradient colors per tag category
const tagGradients: Record<string, string> = {
  "Next.js": "from-white/20 to-gray-400/20",
  React: "from-cyan-400/20 to-blue-500/20",
  "React.js": "from-cyan-400/20 to-blue-500/20",
  "Node.js": "from-green-400/20 to-emerald-500/20",
  MongoDB: "from-green-500/20 to-lime-400/20",
  NeonDB: "from-indigo-400/20 to-purple-500/20",
  "Three.js": "from-white/20 to-gray-400/20",
  "Tailwind CSS": "from-cyan-300/20 to-blue-400/20",
  JavaScript: "from-yellow-400/20 to-amber-500/20",
  springboot: "from-green-400/20 to-emerald-600/20",
  Maven: "from-orange-400/20 to-red-500/20",
  vite: "from-purple-400/20 to-violet-500/20",
  Python: "from-blue-500/20 to-yellow-400/20",
  "MongoDB Atlas": "from-green-500/20 to-emerald-600/20",
  LangGraph: "from-purple-500/20 to-indigo-500/20",
  "React + Vite + TypeScript": "from-cyan-400/20 to-blue-500/20",
  "Framer Motion + GSAP": "from-pink-500/20 to-rose-500/20",
  "React Three Fiber (Three.js)": "from-orange-400/20 to-red-500/20",
  "Recharts + D3.js": "from-yellow-400/20 to-orange-500/20",
  "Tailwind CSS + ShadCN": "from-teal-400/20 to-cyan-500/20",
  "Python + Libraries": "from-blue-500/20 to-yellow-500/20",
  "HuggingFace": "from-yellow-400/20 to-orange-500/20",
  "Reinforcement Learning": "from-purple-500/20 to-pink-500/20",
  "OPENENV": "from-emerald-500/20 to-teal-500/20",
  "Agent": "from-indigo-500/20 to-purple-500/20",
  "Multi-Agent": "from-indigo-500/20 to-purple-500/20",
  "Dockerfile": "from-cyan-500/20 to-blue-600/20",
  "Rewards": "from-emerald-400/20 to-green-500/20",
  "Action": "from-rose-400/20 to-red-500/20",
  "JWT + REST APIs": "from-indigo-500/20 to-purple-500/20",
  "Open-Meteo API + PredictHQ API": "from-sky-400/20 to-blue-500/20",
  "Lucide React": "from-pink-400/20 to-rose-500/20"
};

// ─── Animated Section Wrapper ───────────────────────────────────────────────

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

// ─── Project Card Component (Larger, More Prominent) ────────────────────────

function ProjectCard({
  project,
  index,
  onSelect,
}: {
  project: Project;
  index: number;
  onSelect: (project: Project) => void;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const prefersReducedMotion = usePrefersReducedMotion();
  const imageUrl = getProjectImage(project);
  const projectHasVideos = hasVideos(project);
  const accent = cardAccents[index % cardAccents.length];

  return (
    <motion.div
      ref={ref}
      initial={
        prefersReducedMotion
          ? { opacity: 1 }
          : { opacity: 0, y: 40, scale: 0.96 }
      }
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.6,
        delay: prefersReducedMotion ? 0 : index * 0.1,
        ease: "easeOut",
      }}
      whileHover={prefersReducedMotion ? {} : { y: -10, scale: 1.015 }}
      className="group relative bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-[0_16px_80px_rgba(99,102,241,0.18)] hover:border-white/[0.15]"
      onClick={() => onSelect(project)}
    >
      {/* Top gradient accent — unique per card */}
      <div
        className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${accent} opacity-50 group-hover:opacity-100 transition-opacity duration-500`}
      />

      {/* Image — taller for more visual impact */}
      <div className="relative h-56 sm:h-64 lg:h-72 overflow-hidden bg-gray-900/50">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
            <HiOutlineCodeBracket className="w-14 h-14 text-gray-600" />
          </div>
        )}

        {/* Permanent subtle gradient at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1a] via-transparent to-transparent opacity-60" />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center gap-3">
          <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-500">
            <HiOutlineSparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-white/90 text-sm font-semibold tracking-wide">
            View Details
          </span>
        </div>

        {/* Video badge */}
        {projectHasVideos && (
          <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-red-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider z-10 shadow-lg shadow-red-500/20">
            <HiOutlinePlayCircle className="w-3.5 h-3.5" />
            Video Demo
          </div>
        )}

        {/* Project number indicator */}
        <div className="absolute top-4 left-4 z-10 text-[11px] font-bold text-white/30 tracking-widest">
          {String(index + 1).padStart(2, "0")}
        </div>
      </div>

      {/* Content — more spacious */}
      <div className="p-6 sm:p-7">
        {/* Title */}
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-300 leading-tight">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-sm sm:text-base text-gray-400 leading-relaxed mb-5 line-clamp-3">
          {project.description}
        </p>

        {/* Tags */}
        {project.categorizedTags ? (
          <div className="space-y-3 mb-6">
            {Object.entries(project.categorizedTags).map(([category, tags]) => (
              <div key={category} className="flex flex-col gap-1.5">
                <span className="text-[10px] font-black tracking-widest text-indigo-400 uppercase">
                  {category}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className={`px-2.5 py-1 text-[10px] font-semibold tracking-wide rounded bg-gradient-to-r ${
                        tagGradients[tag] || "from-indigo-400/20 to-blue-500/20"
                      } text-gray-300 border border-white/[0.04] hover:border-white/[0.1] transition-colors duration-200`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className={`px-3 py-1.5 text-[11px] font-semibold tracking-wide rounded-full bg-gradient-to-r ${
                  tagGradients[tag] || "from-indigo-400/20 to-blue-500/20"
                } text-gray-300 border border-white/[0.06] hover:border-white/[0.12] transition-colors duration-200`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Action links */}
        <div className="flex items-center gap-4 pt-5 border-t border-white/[0.06]">
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="group/link flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-white transition-all duration-300"
          >
            <div className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center group-hover/link:bg-white/[0.1] group-hover/link:border-white/[0.15] transition-all duration-300">
              <FaGithub className="w-4 h-4" />
            </div>
            Source
          </a>
          {project.urls &&
            project.urls.length > 0 &&
            project.urls[0].url && (
              <a
                href={project.urls[0].url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="group/link flex items-center gap-2 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-all duration-300 ml-auto"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-400/20 flex items-center justify-center group-hover/link:bg-indigo-500/20 group-hover/link:border-indigo-400/30 transition-all duration-300">
                  <HiOutlineArrowTopRightOnSquare className="w-4 h-4" />
                </div>
                Live Demo
              </a>
            )}
        </div>
      </div>
    </motion.div>
  );
}

// Curated filter categories (important technologies)
const FILTER_CATEGORIES = [
  "React",
  "Next.js",
  "Node.js",
  "Python",
  "Java",
  "Spring Boot",
  "MongoDB",
  "PostgreSQL",
  "AI / ML / GenAI"
];

// Helper to check if a project uses a specific technology
const projectMatchesTech = (project: Project, tech: string): boolean => {
  const searchStr = tech.toLowerCase();
  
  if (searchStr === "ai / ml / genai") {
    return project.tags.some(t => {
      const lower = t.toLowerCase();
      return (
        lower.includes("ai") ||
        lower.includes("openai") ||
        lower.includes("langgraph") ||
        lower.includes("langchain") ||
        lower.includes("gemini") ||
        lower.includes("huggingface") ||
        lower.includes("learning") ||
        lower.includes("agent") ||
        lower.includes("openenv")
      );
    });
  }
  
  if (searchStr === "spring boot") {
    return project.tags.some(t => {
      const lower = t.toLowerCase();
      return lower.includes("spring") || lower.includes("boot");
    });
  }

  if (searchStr === "node.js") {
    return project.tags.some(t => {
      const lower = t.toLowerCase();
      return lower.includes("node") || lower.includes("express");
    });
  }
  
  if (searchStr === "java") {
    return project.tags.some(t => {
      const lower = t.toLowerCase();
      return (lower.includes("java") && !lower.includes("script")) || lower.includes("jdk");
    });
  }

  return project.tags.some(t => t.toLowerCase().includes(searchStr));
};

// ─── Main Projects Page ─────────────────────────────────────────────────────

export default function Projects() {
  const [filter, setFilter] = useState("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedStat, setExpandedStat] = useState<string | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Get all unique technologies for tech stats
  const allTags = Array.from(
    new Set(typedProjects.flatMap((project) => project.tags))
  ).sort();
  const allTagsCount = allTags.length;

  const stats = [
    {
      id: "shipped",
      value: typedProjects.length,
      suffix: "+",
      label: "Projects Shipped",
      gradient: "from-blue-500 to-cyan-400",
      icon: "🚀",
      items: typedProjects.map(p => ({ id: p.id, label: p.title, action: () => handleSelectProject(p) }))
    },
    {
      id: "tech",
      value: allTagsCount,
      suffix: "",
      label: "Tech Stack",
      gradient: "from-indigo-500 to-purple-400",
      icon: "⚡",
      items: allTags.map(t => ({ id: t, label: t, type: "tag" }))
    },
    {
      id: "demos",
      value: typedProjects.filter((p) => hasVideos(p)).length,
      suffix: "",
      label: "Live Demos",
      gradient: "from-purple-500 to-pink-400",
      icon: "🎬",
      items: typedProjects.filter(p => hasVideos(p)).map(p => ({ id: p.id, label: p.title, action: () => handleSelectProject(p) }))
    },
    {
      id: "deployed",
      value: typedProjects.filter(
        (p) => p.urls && p.urls.length > 0 && p.urls[0].url
      ).length,
      suffix: "",
      label: "Deployed Live",
      gradient: "from-emerald-500 to-teal-400",
      icon: "🌐",
      items: typedProjects.filter(p => p.urls && p.urls.length > 0 && p.urls[0].url).map(p => ({ id: p.id, label: p.title, url: p.urls![0].url, action: () => window.open(p.urls![0].url, '_blank') }))
    },
  ];

  const filteredProjects =
    filter === "all"
      ? typedProjects
      : typedProjects.filter((project) => projectMatchesTech(project, filter));

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  // Count projects per filter category
  const tagCounts = FILTER_CATEGORIES.reduce((acc, cat) => {
    acc[cat] = typedProjects.filter((p) => projectMatchesTech(p, cat)).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-[#030712] text-white overflow-hidden">
      {/* ── Hero Section ─────────────────────────────────────────────────── */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 lg:min-h-[600px] flex items-center overflow-hidden">
        {/* ── Ambient background layers ─────────────────────────────────── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Base grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_30%,#000_10%,transparent_100%)]" />

          {/* Pulsing concentric rings — center */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.06, 0.12, 0.06] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="w-[500px] h-[500px] md:w-[700px] md:h-[700px] rounded-full border border-indigo-500/10"
            />
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.04, 0.08, 0.04] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="w-[700px] h-[700px] md:w-[1000px] md:h-[1000px] rounded-full border border-purple-500/8"
            />
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.03, 0.06, 0.03] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              className="w-[900px] h-[900px] md:w-[1300px] md:h-[1300px] rounded-full border border-blue-500/5"
            />
          </div>

          {/* Gradient orbs — multi-layered */}
          <motion.div
            animate={{ opacity: [0.25, 0.5, 0.25], x: [0, 20, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-40 -left-40 w-[55vw] h-[55vw] max-w-[650px] max-h-[650px] bg-indigo-600/12 rounded-full blur-[200px]"
          />
          <motion.div
            animate={{ opacity: [0.2, 0.4, 0.2], x: [0, -15, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 3 }}
            className="absolute -top-20 -right-20 w-[45vw] h-[45vw] max-w-[550px] max-h-[550px] bg-purple-600/10 rounded-full blur-[180px]"
          />
          <motion.div
            animate={{ opacity: [0.1, 0.25, 0.1] }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 5 }}
            className="absolute bottom-0 left-1/4 w-[35vw] h-[35vw] max-w-[450px] max-h-[450px] bg-blue-500/8 rounded-full blur-[150px]"
          />
          <motion.div
            animate={{ opacity: [0.08, 0.18, 0.08] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-10 right-10 w-[25vw] h-[25vw] max-w-[350px] max-h-[350px] bg-cyan-500/6 rounded-full blur-[120px]"
          />

          {/* Floating code snippets — left side (desktop only) */}
          <div className="hidden lg:block">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="absolute top-24 left-8 xl:left-16"
            >
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] rounded-xl px-5 py-4 font-mono text-[11px] leading-relaxed shadow-2xl shadow-black/20"
              >
                <div className="text-gray-600 mb-1">{"// build something great"}</div>
                <div>
                  <span className="text-purple-400">const</span>{" "}
                  <span className="text-blue-300">project</span>{" "}
                  <span className="text-gray-500">=</span>{" "}
                  <span className="text-emerald-400">create</span>
                  <span className="text-gray-400">{"({"}</span>
                </div>
                <div className="pl-4">
                  <span className="text-gray-400">stack:</span>{" "}
                  <span className="text-amber-300">{'"full-stack"'}</span>
                  <span className="text-gray-500">,</span>
                </div>
                <div className="pl-4">
                  <span className="text-gray-400">quality:</span>{" "}
                  <span className="text-amber-300">{'"production"'}</span>
                </div>
                <div>
                  <span className="text-gray-400">{"});"}</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Floating terminal — right side */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 1.1 }}
              className="absolute top-32 right-8 xl:right-16"
            >
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] rounded-xl px-5 py-4 font-mono text-[11px] leading-relaxed shadow-2xl shadow-black/20"
              >
                <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-white/[0.06]">
                  <div className="w-2 h-2 rounded-full bg-red-500/60" />
                  <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
                  <div className="w-2 h-2 rounded-full bg-green-500/60" />
                  <span className="text-gray-600 ml-2 text-[10px]">terminal</span>
                </div>
                <div>
                  <span className="text-emerald-400">✓</span>{" "}
                  <span className="text-gray-400">Build successful</span>
                </div>
                <div>
                  <span className="text-emerald-400">✓</span>{" "}
                  <span className="text-gray-400">Tests passed</span>{" "}
                  <span className="text-emerald-400/60">(100%)</span>
                </div>
                <div>
                  <span className="text-blue-400">→</span>{" "}
                  <span className="text-gray-400">Deployed to</span>{" "}
                  <span className="text-indigo-400">production</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Floating git badge — bottom left */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.4 }}
              className="absolute bottom-20 left-12 xl:left-24"
            >
              <motion.div
                animate={{ y: [0, -8, 0], rotate: [0, 2, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] rounded-xl px-4 py-3 font-mono text-[11px] shadow-2xl shadow-black/20"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-gray-400">
                    <span className="text-emerald-400">+{typedProjects.length * 1200}</span>{" "}
                    lines shipped
                  </span>
                </div>
              </motion.div>
            </motion.div>

            {/* Floating tech badge — bottom right */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.6 }}
              className="absolute bottom-24 right-12 xl:right-24"
            >
              <motion.div
                animate={{ y: [0, 8, 0], rotate: [0, -1, 0] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] rounded-xl px-4 py-3 font-mono text-[11px] shadow-2xl shadow-black/20"
              >
                <div className="flex items-center gap-2">
                  <span className="text-indigo-400">⚡</span>
                  <span className="text-gray-400">{allTagsCount} tech stack</span>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Floating particles — subtle animated dots */}
          {[
            { top: "15%", left: "10%", size: 3, delay: 0, duration: 4 },
            { top: "25%", left: "85%", size: 2, delay: 1, duration: 5 },
            { top: "70%", left: "15%", size: 2, delay: 2, duration: 6 },
            { top: "60%", left: "90%", size: 3, delay: 0.5, duration: 4.5 },
            { top: "40%", left: "5%", size: 2, delay: 3, duration: 5.5 },
            { top: "80%", left: "75%", size: 2, delay: 1.5, duration: 4 },
            { top: "10%", left: "60%", size: 1.5, delay: 2.5, duration: 5 },
            { top: "55%", left: "30%", size: 1.5, delay: 0.8, duration: 6.5 },
          ].map((particle, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -20, 0],
                opacity: [0.15, 0.5, 0.15],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: particle.delay,
              }}
              className="absolute rounded-full bg-indigo-400"
              style={{
                top: particle.top,
                left: particle.left,
                width: particle.size,
                height: particle.size,
              }}
            />
          ))}
        </div>

        {/* ── Hero Content ──────────────────────────────────────────────── */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <motion.div
              initial={
                prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 15 }
              }
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md mb-8 shadow-lg shadow-black/10"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
              </span>
              <span className="text-[11px] font-bold text-indigo-400/90 tracking-[0.2em] uppercase">
                Project Section
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={
                prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 15 }
              }
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-[5rem] font-black tracking-tighter mb-8 leading-[0.92]"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-gray-300">
                Engineering
              </span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400">
                Production-Grade
              </span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 animate-gradient-text">
                Digital Products.
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={
                prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 15 }
              }
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
              className="text-base md:text-lg lg:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed"
            >
              From concept to deployment —{" "}
              <span className="text-white font-medium">{typedProjects.length} production projects</span>{" "}
              built with modern architectures, spanning{" "}
              <span className="text-white font-medium">full-stack development</span>,{" "}
              <span className="text-white font-medium">AI/ML</span>, and{" "}
              <span className="text-white font-medium">cloud-native systems</span>.
            </motion.p>

            {/* Metrics — glassmorphism cards */}
            <motion.div
              layout
              initial={
                prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }
              }
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35, ease: "easeOut" }}
              className="flex flex-wrap justify-center gap-4 md:gap-6 items-start"
            >
              {stats.map((stat) => (
                <motion.div
                  layout
                  key={stat.id}
                  onClick={() => setExpandedStat(expandedStat === stat.id ? null : stat.id)}
                  whileHover={prefersReducedMotion || expandedStat === stat.id ? {} : { y: -4, scale: 1.03 }}
                  className={`group relative bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl px-6 py-5 md:px-8 md:py-6 min-w-[140px] md:min-w-[180px] overflow-hidden transition-all duration-500 cursor-pointer ${
                    expandedStat === stat.id
                      ? "bg-white/[0.08] border-white/[0.2] shadow-[0_16px_60px_rgba(99,102,241,0.2)] md:min-w-[240px] flex-grow md:flex-grow-0"
                      : "hover:shadow-[0_8px_40px_rgba(99,102,241,0.12)] hover:border-white/[0.12]"
                  }`}
                >
                  {/* Top accent line */}
                  <motion.div
                    layout="position"
                    className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${stat.gradient} opacity-50 group-hover:opacity-100 transition-opacity duration-500`}
                  />
                  <motion.div layout="position" className="text-lg mb-2">{stat.icon}</motion.div>
                  <motion.div
                    layout="position"
                    className={`text-3xl md:text-4xl font-black bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent flex items-center justify-between`}
                  >
                    <div>
                      {stat.value}
                      <span className="text-xl">{stat.suffix}</span>
                    </div>
                  </motion.div>
                  <motion.div
                    layout="position"
                    className="text-[11px] text-gray-500 font-semibold tracking-wider uppercase mt-1.5 flex justify-between items-center"
                  >
                    {stat.label}
                    <motion.div
                      animate={{ rotate: expandedStat === stat.id ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="ml-2 text-gray-500/50"
                    >
                      ▼
                    </motion.div>
                  </motion.div>

                  <AnimatePresence>
                    {expandedStat === stat.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, filter: "blur(4px)" }}
                        animate={{ opacity: 1, height: "auto", filter: "blur(0px)" }}
                        exit={{ opacity: 0, height: 0, filter: "blur(4px)" }}
                        transition={{ duration: 0.4, type: "spring", bounce: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-4 mt-4 border-t border-white/[0.08] max-h-[220px] overflow-y-auto custom-scrollbar pr-2 -mr-2">
                          {stat.id === "tech" ? (
                            <div className="flex flex-wrap gap-1.5 pb-2">
                              {stat.items.map(item => (
                                <span
                                  key={item.id}
                                  className={`px-2 py-1 text-[10px] font-semibold tracking-wide rounded bg-gradient-to-r ${
                                    tagGradients[item.label as string] || "from-indigo-400/20 to-blue-500/20"
                                  } text-gray-300 border border-white/[0.04] whitespace-nowrap`}
                                >
                                  {item.label}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <div className="flex flex-col gap-1 pb-2">
                              {stat.items.map(item => (
                                <div
                                  key={item.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if ('action' in item && typeof item.action === 'function') {
                                      item.action();
                                    }
                                  }}
                                  className="text-left group/item flex items-center gap-2 p-2 rounded-lg hover:bg-white/[0.06] transition-colors cursor-pointer"
                                >
                                  <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${stat.gradient} opacity-50 group-hover/item:opacity-100 transition-opacity`} />
                                  <span className="text-[13px] text-gray-400 group-hover/item:text-white transition-colors truncate">
                                    {item.label}
                                  </span>
                                  {(item as any).url && <HiOutlineArrowTopRightOnSquare className="w-3.5 h-3.5 text-gray-500 group-hover/item:text-indigo-400 ml-auto shrink-0" />}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
        >
          <span className="text-[10px] uppercase tracking-widest text-gray-600 font-semibold hidden sm:block">
            Explore
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-4 h-6 rounded-full border border-white/15 flex items-start justify-center p-1"
          >
            <motion.div
              animate={{ opacity: [0.2, 0.8, 0.2], height: ["3px", "7px", "3px"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-0.5 bg-white/40 rounded-full"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ── Gradient Divider ─────────────────────────────────────────────── */}
      <div className="container mx-auto px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
      </div>

      {/* ── Filter Bar ───────────────────────────────────────────────────── */}
      <AnimatedSection className="py-8 md:py-12" id="projects-filters">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {/* Section label */}
            <div className="flex items-center gap-2 mb-5">
              <HiOutlineFunnel className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-indigo-400">
                Filter by Technology
              </span>
            </div>

            {/* Filter pills */}
            <div className="flex flex-wrap gap-2.5">
              <button
                onClick={() => setFilter("all")}
                className={`relative px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                  filter === "all"
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-[0_4px_20px_rgba(99,102,241,0.3)]"
                    : "bg-white/[0.04] border border-white/[0.08] text-gray-400 hover:text-white hover:bg-white/[0.08] hover:border-white/[0.15]"
                }`}
              >
                All Projects
                <span className="ml-2 text-xs opacity-70">
                  {typedProjects.length}
                </span>
              </button>

              {FILTER_CATEGORIES.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setFilter(tag)}
                  className={`relative px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                    filter === tag
                      ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-[0_4px_20px_rgba(99,102,241,0.3)]"
                      : "bg-white/[0.04] border border-white/[0.08] text-gray-400 hover:text-white hover:bg-white/[0.08] hover:border-white/[0.15]"
                  }`}
                >
                  {tag}
                  <span className="ml-2 text-xs opacity-70">
                    {tagCounts[tag]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* ── Gradient Divider ─────────────────────────────────────────────── */}
      <div className="container mx-auto px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      </div>

      {/* ── All Projects Grid ────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`grid-${filter}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <AnimatedSection className="py-12 md:py-16 pb-24 md:pb-32" id="projects-grid">
            <div className="container mx-auto px-4">
              <div className="max-w-7xl mx-auto">
                {/* Section header */}
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-2">
                    <HiOutlineRocketLaunch className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-bold tracking-[0.2em] uppercase text-indigo-400">
                      {filter === "all"
                        ? "All Projects"
                        : `${filter} Projects`}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600 font-medium">
                    {filteredProjects.length}{" "}
                    {filteredProjects.length === 1 ? "project" : "projects"}
                  </span>
                </div>

                {/* Grid — 3 columns */}
                {filteredProjects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {filteredProjects.map((project, index) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        index={index}
                        onSelect={handleSelectProject}
                      />
                    ))}
                  </div>
                ) : (
                  /* Empty state */
                  <div className="text-center py-24">
                    <div className="w-20 h-20 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mx-auto mb-5">
                      <HiOutlineCodeBracket className="w-10 h-10 text-gray-700" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-400 mb-2">
                      No projects found
                    </h3>
                    <p className="text-sm text-gray-500 mb-6">
                      No projects match the selected technology filter.
                    </p>
                    <button
                      onClick={() => setFilter("all")}
                      className="px-5 py-2.5 rounded-full text-sm font-semibold bg-white/[0.06] border border-white/[0.1] text-gray-300 hover:text-white hover:bg-white/[0.1] transition-all duration-300"
                    >
                      View All Projects
                    </button>
                  </div>
                )}
              </div>
            </div>
          </AnimatedSection>
        </motion.div>
      </AnimatePresence>

      {/* ── Explore More CTA ──────────────────────────────────────────────── */}
      <AnimatedSection className="py-16 md:py-24 relative overflow-hidden" id="explore-more">
        {/* Background glow for CTA */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[600px] h-full max-h-[400px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8 md:p-12 lg:p-16 backdrop-blur-xl relative overflow-hidden group hover:border-white/[0.1] transition-colors duration-500">
            {/* Animated border gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-500">
              <FaGithub className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400 mb-4 tracking-tight">
              Explore More
            </h2>
            <p className="text-gray-400 text-base md:text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              Want to see what else I'm working on? Check out my GitHub profile for open-source contributions, experimental projects, and more code.
            </p>
            
            <a
              href="https://github.com/mahammadaftab"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-gray-900 font-bold tracking-wide hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:shadow-[0_0_60px_rgba(255,255,255,0.3)] relative overflow-hidden group/btn"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 via-white to-indigo-100 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10 flex items-center gap-2">
                <FaGithub className="w-5 h-5" />
                View GitHub Profile
              </span>
              <HiOutlineArrowTopRightOnSquare className="w-4 h-4 relative z-10" />
            </a>
          </div>
        </div>
      </AnimatedSection>

      {/* ── Project Modal ────────────────────────────────────────────────── */}
      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}