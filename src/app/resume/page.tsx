"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    plausible?: (eventName: string, options?: { props: Record<string, unknown> }) => void;
  }
}

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import PDFViewer from "@/components/pdf-viewer";
import experienceData from "@/data/experience.json";

// Lightbox components
import CertificateLightbox from "@/components/certificate-lightbox";
import HackathonLightbox from "@/components/hackthon-lightbox";
import InternshipLightbox from "@/components/internship-lightbox";
import BootcampLightbox from "@/components/bootcamp-lightbox";

// Icons from react-icons
import { 
  FaGithub, 
  FaLinkedin, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaGraduationCap, 
  FaAward, 
  FaBriefcase, 
  FaCertificate, 
  FaFilePdf, 
  FaRocket, 
  FaFileWord, 
  FaCopy, 
  FaCheck, 
  FaSearch, 
  FaAngleRight,
  FaCode
} from "react-icons/fa";
import { FiDownload } from "react-icons/fi";

// Live stat counter component
function StatCounter({ value, duration = 1.5 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;

    const totalMiliseconds = duration * 1000;
    const incrementTime = Math.max(Math.floor(totalMiliseconds / end), 20);

    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) {
        clearInterval(timer);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{count}</span>;
}

// Pre-generated static stars to prevent react-hooks/purity errors during render
const staticStars = Array.from({ length: 120 }, (_, i) => ({
  id: i,
  top: Math.random() * 100,
  left: Math.random() * 100,
  size: Math.random() * 2.5 + 0.5,
  delay: Math.random() * 5,
  duration: Math.random() * 3 + 2,
}));

// Immersive CSS-based StarField background from the achievements/experience page
function StarField() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const stars = mounted ? staticStars : [];

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Deep space gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030014] via-[#0a0025] to-[#050010]" />

      {/* Nebula orbs */}
      <div className="absolute top-[10%] left-[15%] w-[500px] h-[500px] rounded-full bg-purple-900/20 blur-[120px] animate-float-orb" />
      <div className="absolute top-[60%] right-[10%] w-[400px] h-[400px] rounded-full bg-blue-900/15 blur-[100px] animate-float-orb" style={{ animationDelay: "-7s" }} />
      <div className="absolute top-[35%] right-[40%] w-[300px] h-[300px] rounded-full bg-indigo-900/10 blur-[80px] animate-float-orb" style={{ animationDelay: "-14s" }} />

      {/* Star particles (only render on client after mount to prevent hydration mismatch) */}
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

export default function Resume() {
  const resumePath = "/Mahammad Aftab Resume.pdf";
  const [fileExists, setFileExists] = useState(true);
  const [activeTab, setActiveTab] = useState<"interactive" | "document">("interactive");
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const prefersReducedMotion = usePrefersReducedMotion();

  // Lightbox States
  const [activeCert, setActiveCert] = useState<any>(null);
  const [activeHackathon, setActiveHackathon] = useState<any>(null);
  const [activeInternship, setActiveInternship] = useState<any>(null);
  const [activeBootcamp, setActiveBootcamp] = useState<any>(null);

  // Set document title
  useEffect(() => {
    document.title = "Resume & Credentials | Mahammad Aftab";
  }, []);

  // Check if PDF file exists
  useEffect(() => {
    fetch(resumePath)
      .then(response => {
        if (!response.ok) {
          setFileExists(false);
        }
      })
      .catch(() => {
        setFileExists(false);
      });
  }, [resumePath]);

  // Analytics helper for downloads
  const handleDownload = (format: string = 'pdf') => {
    if (typeof window !== 'undefined') {
      if (window.gtag) {
        window.gtag('event', 'download', {
          event_category: 'Resume',
          event_label: `${format} Download`,
          value: 1
        });
      }
      if (window.plausible) {
        window.plausible('Resume Download', { props: { format } });
      }
      window.dispatchEvent(new CustomEvent('resumeDownload', { 
        detail: { format } 
      }));
    }
    console.log(`Resume download initiated: ${format}`);
  };

  const handleCompressedDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    handleDownload('compressed-pdf');
    if (fileExists) {
      window.open(`${resumePath}?format=compressed`, '_blank');
    }
  };

  const handleWordDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    handleDownload('word');
    window.open('/resume.docx', '_blank');
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("mdaftabeditz360@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Stats mapped from experienceData
  const stats = useMemo(() => [
    { label: "Hackathons", value: experienceData.achievements_meta.stats.hackathons, icon: <FaAward className="text-pink-400" /> },
    { label: "Certifications", value: experienceData.achievements_meta.stats.certifications, icon: <FaCertificate className="text-purple-400" /> },
    { label: "Internships", value: experienceData.achievements_meta.stats.internships, icon: <FaBriefcase className="text-emerald-400" /> },
    { label: "Tech Stack", value: experienceData.achievements_meta.stats.technologies, icon: <FaCode className="text-blue-400" />, suffix: "+" },
  ], []);

  // Filtered Certifications
  const filteredCertificates = useMemo(() => {
    return experienceData.certificates.filter(cert => {
      const matchesSearch = cert.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            cert.issuer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || cert.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen relative text-white overflow-hidden py-16 px-4 md:px-8">
      {/* Immersive space background */}
      <StarField />

      <div className="container mx-auto max-w-7xl relative z-10">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full border border-purple-500/30 bg-purple-500/10 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse shadow-[0_0_8px_#a855f7]" />
            <span className="text-xs font-bold tracking-wider text-purple-300 uppercase">Executive Dossier</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-none mb-4 bg-gradient-to-r from-white via-indigo-200 to-purple-300 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(168,85,247,0.15)]">
            Professional Profile
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Review key credentials, interactive hackathon timelines, engineering certifications, and download official formats.
          </p>
        </motion.div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Panel: Profile and Key Statistics (lg:col-span-4) */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
            
            {/* profile Glass Card */}
            <motion.div
              initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.7 }}
              className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] rounded-3xl p-6 relative overflow-hidden group hover:border-purple-500/20 transition-colors duration-500"
            >
              {/* Backlit Glow */}
              <div className="absolute -top-12 -right-12 w-36 h-36 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all duration-500" />
              
              {/* Avatar Initials Badge */}
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 relative shadow-[0_0_25px_rgba(79,70,229,0.4)] border border-white/20 transform group-hover:scale-105 transition-transform duration-500">
                    <Image
                      src="/images/profile.jpg"
                      alt="Mahammad Aftab"
                      fill
                      priority
                      className="object-cover object-top"
                    />
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-[#02000a] rounded-full animate-pulse shadow-[0_0_8px_#22c55e] z-10" />
                </div>

                {/* Name & Title */}
                <h2 className="text-2xl font-bold tracking-tight text-white mb-1">
                  Mahammad Aftab
                </h2>
                <p className="text-purple-400 font-semibold text-xs tracking-wide uppercase mb-3">
                  Computer Science Student & Aspiring AI Engineer
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 justify-center mb-6">
                  {["Generative AI", "Full Stack", "Blockchain"].map((tag, i) => (
                    <span key={i} className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-white/[0.04] border border-white/5 text-gray-300">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Line Separator */}
                <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-5" />

                {/* Profile Details List */}
                <div className="w-full space-y-3.5 text-sm text-gray-400 mb-6">
                  <div className="flex items-center gap-3">
                    <FaGraduationCap className="text-purple-400 text-lg shrink-0" />
                    <div className="text-left">
                      <p className="text-white font-medium text-xs leading-none mb-0.5">Bachelor of Engineering</p>
                      <p className="text-[11px] text-gray-400">Rural Engineering College Hulkoti (3rd Year)</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaMapMarkerAlt className="text-pink-400 text-lg shrink-0" />
                    <div className="text-left">
                      <p className="text-white font-medium text-xs leading-none mb-0.5">Location</p>
                      <p className="text-[11px] text-gray-400">Gadag, Karnataka, India</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaEnvelope className="text-blue-400 text-lg shrink-0" />
                    <div className="text-left flex-1">
                      <p className="text-white font-medium text-xs leading-none mb-0.5">Contact Email</p>
                      <p className="text-[11px] text-gray-400 break-all select-all">mdaftabeditz360@gmail.com</p>
                    </div>
                  </div>
                </div>

                {/* Contact and Actions Row */}
                <div className="flex gap-3 w-full">
                  <button
                    suppressHydrationWarning={true}
                    onClick={handleCopyEmail}
                    className="flex-1 py-2.5 px-3 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/15 rounded-xl text-xs font-semibold text-gray-200 transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <FaCheck className="text-green-400" /> Copied
                      </>
                    ) : (
                      <>
                        <FaCopy className="text-gray-400" /> Copy Email
                      </>
                    )}
                  </button>
                  <a
                    href="https://www.linkedin.com/in/mahammad-aftab"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-[#0077b5]/10 hover:bg-[#0077b5]/20 border border-[#0077b5]/30 rounded-xl text-gray-200 hover:text-[#0077b5] transition-all flex items-center justify-center active:scale-95 cursor-pointer"
                    aria-label="LinkedIn"
                  >
                    <FaLinkedin className="text-base" />
                  </a>
                  <a
                    href="https://github.com/mahammadaftab"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-xl text-gray-200 hover:text-white transition-all flex items-center justify-center active:scale-95 cursor-pointer"
                    aria-label="GitHub"
                  >
                    <FaGithub className="text-base" />
                  </a>
                </div>

              </div>
            </motion.div>

            {/* Quick Stats Grid */}
            <motion.div
              initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.7, delay: 0.1 }}
              className="grid grid-cols-2 gap-4"
            >
              {stats.map((stat, i) => (
                <div 
                  key={i} 
                  className="backdrop-blur-md bg-white/[0.01] border border-white/5 rounded-2xl p-4 flex flex-col justify-between hover:border-purple-500/20 transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="p-2 rounded-lg bg-white/[0.04] border border-white/5 text-sm group-hover:scale-110 transition-transform duration-300">
                      {stat.icon}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black tracking-tight text-white mb-0.5">
                      <StatCounter value={stat.value} />
                      {stat.suffix}
                    </h3>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                      {stat.label}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Future Vision Section */}
            <motion.div
              initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.7, delay: 0.2 }}
              className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] rounded-3xl p-6 relative overflow-hidden hover:border-purple-500/20 transition-all duration-300"
            >
              <h3 className="text-sm font-bold uppercase tracking-widest text-purple-300 mb-4 flex items-center gap-2">
                <FaRocket className="text-xs" /> Future Engineering Vision
              </h3>
              <div className="space-y-4">
                {experienceData.achievements_meta.futureVision.map((vision, idx) => (
                  <div key={idx} className="flex gap-3 items-start">
                    <span className="text-lg bg-white/[0.04] p-1.5 rounded-lg border border-white/5 shrink-0 select-none">
                      {vision.icon}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-gray-200 mb-0.5">{vision.title}</h4>
                      <p className="text-[10.5px] text-gray-400 leading-snug">{vision.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>

          {/* Right Panel: Tabs, Interactive Content & PDF Preview (lg:col-span-8) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Custom Tab Switcher */}
            <div className="p-1 rounded-2xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-md flex relative overflow-hidden">
              <button
                suppressHydrationWarning={true}
                onClick={() => setActiveTab("interactive")}
                className={`flex-1 py-3 text-xs md:text-sm font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 relative z-10 cursor-pointer ${
                  activeTab === "interactive" ? "text-white" : "text-gray-400 hover:text-gray-200"
                }`}
              >
                <span>🚀 <span className="hidden sm:inline">Interactive </span>Timeline<span className="hidden md:inline"> & Credentials</span></span>
              </button>
              <button
                suppressHydrationWarning={true}
                onClick={() => setActiveTab("document")}
                className={`flex-1 py-3 text-xs md:text-sm font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 relative z-10 cursor-pointer ${
                  activeTab === "document" ? "text-white" : "text-gray-400 hover:text-gray-200"
                }`}
              >
                <span>📄 <span className="hidden sm:inline">Official </span>Document<span className="hidden md:inline"> Viewer</span></span>
              </button>
              
              {/* Sliding Background */}
              <motion.div 
                className="absolute inset-y-1 bg-gradient-to-r from-blue-600/20 via-indigo-600/30 to-purple-600/20 border border-purple-500/25 rounded-xl shadow-[0_0_15px_rgba(139,92,246,0.1)] pointer-events-none"
                initial={false}
                animate={{
                  left: activeTab === "interactive" ? "4px" : "50%",
                  width: "calc(50% - 6px)"
                }}
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            </div>

            {/* Content Container */}
            <AnimatePresence mode="wait">
              {activeTab === "interactive" ? (
                <motion.div
                  key="interactive-tab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6"
                >
                  
                  {/* Featured Achievements Panel (Top Highlight) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* SST Finalist Highlight */}
                    <div 
                      onClick={() => setActiveHackathon(experienceData.hackthons[4])}
                      className="relative overflow-hidden p-5 rounded-2xl bg-gradient-to-br from-purple-500/10 to-indigo-500/5 border border-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.05)] cursor-pointer group hover:border-purple-500/40 transition-all duration-300"
                    >
                      <div className="absolute -top-10 -right-10 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all duration-500" />
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-2 py-0.5 rounded bg-purple-500/20 border border-purple-500/30 text-[9px] font-bold text-purple-300 uppercase tracking-widest">
                          National Finalist
                        </span>
                        <span className="text-[10px] text-purple-400 font-bold">Top 800 Teams</span>
                      </div>
                      <h4 className="text-base font-extrabold text-white mb-1 group-hover:text-purple-300 transition-colors">
                        Meta × Hugging Face Hackathon
                      </h4>
                      <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                        Represented Top 800 teams from 31,000+ registrations nationwide. Focused on Clinical AI agent systems and reinforcement learning.
                      </p>
                      <div className="mt-4 flex items-center text-[10px] font-bold text-purple-400 group-hover:underline gap-1 select-none">
                        Inspect Certificate & Media <FaAngleRight />
                      </div>
                    </div>

                    {/* KJU Winner Highlight */}
                    <div 
                      onClick={() => setActiveHackathon(experienceData.hackthons[1])}
                      className="relative overflow-hidden p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.05)] cursor-pointer group hover:border-amber-500/40 transition-all duration-300"
                    >
                      <div className="absolute -top-10 -right-10 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all duration-500" />
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/30 text-[9px] font-bold text-amber-300 uppercase tracking-widest">
                          🥈 2nd Position Winner
                        </span>
                        <span className="text-[10px] text-amber-400 font-bold">National level</span>
                      </div>
                      <h4 className="text-base font-extrabold text-white mb-1 group-hover:text-amber-300 transition-colors">
                        Bangalore Travel & Tech Hackathon
                      </h4>
                      <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                        Placed #2 among 50+ elite teams. Built and demonstrated real-time AI solutions for travel and tourism tech.
                      </p>
                      <div className="mt-4 flex items-center text-[10px] font-bold text-amber-400 group-hover:underline gap-1 select-none">
                        Inspect Certificate & Media <FaAngleRight />
                      </div>
                    </div>

                  </div>

                  {/* Interactive Career Milestones Timeline */}
                  <div className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] rounded-3xl p-6 md:p-8">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 border-b border-white/5 pb-4">
                      <FaGraduationCap className="text-purple-400" /> Academic & Professional Milestones
                    </h3>
                    
                    <div className="relative border-l border-white/10 ml-3 md:ml-6 space-y-8 py-2">
                      {experienceData.achievements_meta.timeline.map((node, i) => (
                        <div key={i} className="relative pl-6 md:pl-8 group">
                          {/* Timeline dot */}
                          <div className="absolute -left-[9px] top-1.5 w-4.5 h-4.5 rounded-full bg-[#02000a] border-2 border-purple-500 group-hover:border-purple-400 group-hover:scale-110 shadow-[0_0_8px_rgba(168,85,247,0.5)] transition-all duration-300 flex items-center justify-center text-[10px]">
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 group-hover:bg-purple-400" />
                          </div>

                          {/* Node Card */}
                          <div className="bg-white/[0.01] border border-white/5 hover:border-purple-500/20 rounded-2xl p-4 transform hover:-translate-y-0.5 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/15">
                                {node.year}
                              </span>
                              <span className="text-base select-none">{node.icon}</span>
                              <h4 className="text-sm md:text-base font-extrabold text-gray-200 group-hover:text-white">
                                {node.label}
                              </h4>
                            </div>
                            <p className="text-xs md:text-sm text-gray-400 leading-relaxed pl-1">
                              {node.detail}
                            </p>

                            {/* Timeline Linked items click triggers */}
                            {node.year === "2025" && (
                              <div className="mt-3 flex flex-wrap gap-2">
                                <button
                                  suppressHydrationWarning={true}
                                  onClick={() => setActiveInternship(experienceData.internships[1])}
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition-all cursor-pointer"
                                >
                                  <FaBriefcase className="text-[9px]" /> Pinnacle Labs Certificate
                                </button>
                                <button
                                  suppressHydrationWarning={true}
                                  onClick={() => setActiveHackathon(experienceData.hackthons[0])}
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 border border-pink-500/20 transition-all cursor-pointer"
                                >
                                  <FaAward className="text-[9px]" /> BIT Hackathon Participation
                                </button>
                              </div>
                            )}
                            
                            {node.year === "2026" && (
                              <div className="mt-3 flex flex-wrap gap-2">
                                <button
                                  suppressHydrationWarning={true}
                                  onClick={() => setActiveBootcamp(experienceData.bootcamps[5])}
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 transition-all cursor-pointer"
                                >
                                  <FaRocket className="text-[9px]" /> IDE Bootcamp Certificate
                                </button>
                                <button
                                  suppressHydrationWarning={true}
                                  onClick={() => setActiveHackathon(experienceData.hackthons[4])}
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 transition-all cursor-pointer"
                                >
                                  <FaAward className="text-[9px]" /> Meta Hackathon Finalist
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Certifications & Courses Grid */}
                  <div className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] rounded-3xl p-6 md:p-8 space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <FaCertificate className="text-purple-400" /> Engineering Certifications
                      </h3>
                      
                      {/* Search Bar */}
                      <div className="relative max-w-xs w-full">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs" />
                        <input
                          suppressHydrationWarning={true}
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search credentials..."
                          className="w-full pl-8 pr-4 py-1.5 bg-white/[0.03] border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/40"
                        />
                      </div>
                    </div>

                    {/* Category Filter Pills */}
                    <div className="flex flex-row overflow-x-auto whitespace-nowrap pb-2 scrollbar-none max-w-full gap-2 sm:flex-wrap">
                      {[
                        { id: "all", label: "All Credentials" },
                        { id: "ai", label: "AI & GenAI" },
                        { id: "programming", label: "Programming" },
                        { id: "basics", label: "Fundamentals" },
                        { id: "community", label: "Leadership" }
                      ].map((cat) => (
                        <button
                          suppressHydrationWarning={true}
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat.id)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            selectedCategory === cat.id
                              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md shadow-purple-500/10"
                              : "bg-white/[0.03] border border-white/5 text-gray-400 hover:text-gray-200"
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>

                    {/* Certifications Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredCertificates.length > 0 ? (
                        filteredCertificates.map((cert) => (
                          <div
                            key={cert.id}
                            className="bg-white/[0.01] border border-white/5 hover:border-purple-500/20 rounded-2xl p-4 flex flex-col justify-between hover:shadow-[0_4px_25px_rgba(0,0,0,0.3)] transition-all duration-300 group"
                          >
                            <div>
                              <div className="flex items-center justify-between gap-2 mb-2">
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/[0.04] border border-white/5 text-gray-400 uppercase tracking-widest">
                                  {cert.issuer}
                                </span>
                                <span className="text-[10px] text-gray-500 font-bold">{cert.date}</span>
                              </div>
                              <h4 className="text-sm font-extrabold text-gray-200 group-hover:text-purple-300 transition-colors leading-snug mb-1">
                                {cert.title}
                              </h4>
                              <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-4">
                                {cert.description}
                              </p>
                            </div>

                            {cert.media && cert.media.length > 0 && (
                              <button
                                suppressHydrationWarning={true}
                                onClick={() => setActiveCert(cert)}
                                className="w-full py-1.5 bg-white/[0.03] hover:bg-purple-600/10 border border-white/5 hover:border-purple-500/25 rounded-xl text-[10px] font-bold text-gray-300 hover:text-purple-400 transition-all flex items-center justify-center gap-1 cursor-pointer"
                              >
                                View Linked Credentials <FiDownload className="text-[11px]" />
                              </button>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="col-span-2 text-center py-8">
                          <p className="text-gray-500 text-sm">No certifications found matching the filters.</p>
                        </div>
                      )}
                    </div>
                  </div>

                </motion.div>
              ) : (
                <motion.div
                  key="document-tab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6"
                >
                  
                  {/* Download Action Bar */}
                  <div className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group">
                    <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all duration-500 pointer-events-none" />
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">
                        Looking for a printable copy?
                      </h3>
                      <p className="text-xs text-gray-400">
                        Download my official resume PDF or alternative formats.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                      <a
                        href={fileExists ? resumePath : "#"}
                        onClick={(e) => {
                          if (fileExists) {
                            handleDownload('pdf');
                          } else {
                            e.preventDefault();
                            alert("Resume file not available. Please contact me directly for my resume.");
                          }
                        }}
                        download={fileExists}
                        className={`inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.35)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 text-sm cursor-pointer ${
                          !fileExists ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        <FiDownload className="mr-2 text-base" />
                        {fileExists ? "Download Resume (PDF)" : "Resume Unavailable"}
                      </a>
                    </div>
                  </div>

                  {/* Preview Container Frame */}
                  <div className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] rounded-3xl overflow-hidden shadow-2xl">
                    <div className="px-6 py-4 bg-white/[0.03] border-b border-white/5 flex items-center justify-between">
                      <h3 className="text-sm font-bold text-gray-300 flex items-center gap-2">
                        <FaFilePdf className="text-red-400" /> Document Sandbox Preview
                      </h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/[0.05] border border-white/5 text-gray-400 uppercase tracking-widest">
                        PDF.js Engine
                      </span>
                    </div>

                    <div className="max-h-[80vh] overflow-y-auto min-h-[500px] w-full max-w-full overflow-x-hidden">
                      {fileExists ? (
                        <PDFViewer file={resumePath} className="w-full max-w-full" />
                      ) : (
                        <div className="flex items-center justify-center min-h-[500px] bg-white/[0.01]">
                          <div className="text-center p-8 max-w-sm">
                            <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/5 flex items-center justify-center text-3xl mx-auto mb-4 animate-bounce">
                              📄
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Document Preview Offline</h3>
                            <p className="text-xs text-gray-400 leading-relaxed mb-6">
                              The resume PDF is not currently matching in local public folder paths, or is being uploaded. 
                            </p>
                            <p className="text-[11px] text-gray-500">
                              Please request my resume directly via the email listed on the profile side card.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Alternative formats card */}
                  <div className="backdrop-blur-md bg-white/[0.01] border border-white/5 rounded-2xl p-5 text-center">
                    <p className="text-xs text-gray-400 mb-3 font-semibold">
                      Preferred formats required by Applicant Tracking Systems (ATS)?
                    </p>
                    <div className="flex justify-center items-center gap-4 text-xs font-bold">
                      <a 
                        href="#" 
                        onClick={handleCompressedDownload}
                        className={`text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-1 transition-colors cursor-pointer ${!fileExists ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <FaFilePdf className="text-[10px]" /> Compressed PDF
                      </a>
                      <span className="text-gray-700">|</span>
                      <a 
                        href="#" 
                        onClick={handleWordDownload}
                        className="text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <FaFileWord className="text-[10px]" /> Word Doc (.docx)
                      </a>
                    </div>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>

      </div>

      {/* Media Inspection Lightboxes */}
      <CertificateLightbox 
        certificate={activeCert} 
        isOpen={!!activeCert} 
        onClose={() => setActiveCert(null)} 
      />
      <HackathonLightbox 
        hackathon={activeHackathon} 
        isOpen={!!activeHackathon} 
        onClose={() => setActiveHackathon(null)} 
      />
      <InternshipLightbox 
        internship={activeInternship} 
        isOpen={!!activeInternship} 
        onClose={() => setActiveInternship(null)} 
      />
      <BootcampLightbox 
        bootcamp={activeBootcamp} 
        isOpen={!!activeBootcamp} 
        onClose={() => setActiveBootcamp(null)} 
      />
    </div>
  );
}