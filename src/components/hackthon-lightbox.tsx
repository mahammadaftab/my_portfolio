"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  XMarkIcon, 
  ArrowTopRightOnSquareIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon,
  CalendarIcon,
  TrophyIcon,
  PlayIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon
} from "@heroicons/react/24/outline";

interface HackathonMedia {
  type: "image" | "pdf" | "video";
  url: string;
  caption?: string;
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
  media: HackathonMedia[];
}

interface HackathonLightboxProps {
  hackathon: Hackathon | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function HackathonLightbox({ hackathon, isOpen, onClose }: HackathonLightboxProps) {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal on Escape key press
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Reset index when active hackathon changes
  useEffect(() => {
    setCurrentMediaIndex(0);
    setIsLoading(true);
  }, [hackathon?.id]);

  // Set loading state when changing media
  useEffect(() => {
    setIsLoading(true);
  }, [currentMediaIndex]);

  if (!isOpen || !hackathon) return null;

  const currentMedia = hackathon.media?.[currentMediaIndex];
  const totalMedia = hackathon.media?.length || 0;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const goToPrevious = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (totalMedia <= 1) return;
    setCurrentMediaIndex((prev) => (prev === 0 ? totalMedia - 1 : prev - 1));
  };

  const goToNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (totalMedia <= 1) return;
    setCurrentMediaIndex((prev) => (prev === totalMedia - 1 ? 0 : prev + 1));
  };

  const isWinner = !!hackathon.achievement;
  const isHighlighted = !!hackathon.highlighted;

  return (
    <AnimatePresence>
      <div 
        className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md p-4 md:p-6 overflow-hidden ${
          isHighlighted ? "bg-[#0a0601]/95" : "bg-[#0a0104]/95"
        }`}
        onClick={handleBackdropClick}
      >
        {/* Animated modal box */}
        <motion.div
          ref={modalRef}
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className={`relative w-full max-w-6xl h-auto max-h-[90vh] md:h-[75vh] flex flex-col md:flex-row bg-[#080305] border rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] ${
            isHighlighted 
              ? "border-amber-500/25 shadow-amber-500/5 bg-[#0a0703]" 
              : "border-rose-500/25 shadow-rose-500/5"
          }`}
        >
          {/* Close button (Floating top right) */}
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 z-30 p-2.5 rounded-full border border-white/10 transition-all duration-300 shadow-md group hover:scale-105 ${
              isHighlighted ? "bg-[#1c1206]/80 hover:bg-[#33220b]/80" : "bg-[#1c060b]/80 hover:bg-[#330b12]/80"
            }`}
            aria-label="Close modal"
          >
            <XMarkIcon className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />
          </button>

          {/* LEFT COLUMN: Immersive Media Section */}
          <div className="w-full md:w-[65%] h-[45vh] md:h-full bg-black/40 flex flex-col justify-between p-4 md:p-6 relative border-b md:border-b-0 md:border-r border-white/10">
            {/* Aspect Display Box */}
            <div className="relative flex-1 w-full flex items-center justify-center overflow-hidden rounded-xl bg-black/80 border border-white/5 group">
              
              {/* Media loader spinner */}
              {isLoading && currentMedia && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/80">
                  <div className={`animate-spin rounded-full h-10 w-10 border-2 border-t-transparent ${
                    isHighlighted ? "border-amber-500" : "border-rose-500"
                  }`}></div>
                </div>
              )}

              {/* Media Renderer */}
              {currentMedia ? (
                <div className="w-full h-full flex items-center justify-center">
                  
                  {/* IMAGE */}
                  {currentMedia.type === "image" && (
                    <motion.img
                      key={currentMedia.url}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: isLoading ? 0 : 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      src={currentMedia.url}
                      alt={currentMedia.caption || hackathon.title}
                      className="w-full h-full object-contain"
                      onLoad={() => setIsLoading(false)}
                    />
                  )}

                  {/* PDF */}
                  {currentMedia.type === "pdf" && (
                    <div className="w-full h-full">
                      {/* Desktop iframe view */}
                      <div className="hidden md:block w-full h-full">
                        <iframe
                          src={`${currentMedia.url}#toolbar=0`}
                          className="w-full h-full border-0 rounded-xl"
                          onLoad={() => setIsLoading(false)}
                          title={hackathon.title}
                        />
                      </div>
                      {/* Mobile responsive view */}
                      <div className="md:hidden flex flex-col items-center justify-center p-6 text-center w-full h-full bg-[#0d0408]">
                        <DocumentTextIcon className={`w-14 h-14 mb-3 animate-pulse ${
                          isHighlighted ? "text-amber-400" : "text-rose-400"
                        }`} />
                        <h4 className="text-white font-bold text-base mb-1.5">Hackathon Document</h4>
                        <p className="text-gray-400 text-xs mb-4 max-w-[240px] leading-relaxed">
                          PDF files are best viewed on desktop or in external screen readers.
                        </p>
                        <a
                          href={currentMedia.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center gap-1.5 px-4 py-2 text-white font-semibold rounded-lg text-xs transition-all duration-300 shadow-lg ${
                            isHighlighted ? "bg-amber-600 hover:bg-amber-500" : "bg-rose-600 hover:bg-rose-500"
                          }`}
                        >
                          <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
                          View Full PDF
                        </a>
                      </div>
                    </div>
                  )}

                  {/* VIDEO */}
                  {currentMedia.type === "video" && (
                    <video
                      key={currentMedia.url}
                      src={currentMedia.url}
                      controls
                      autoPlay={false}
                      className="w-full h-full object-contain"
                      onLoadedData={() => setIsLoading(false)}
                    />
                  )}

                </div>
              ) : (
                <div className="text-gray-500 text-sm">No media file uploaded</div>
              )}

              {/* Navigation overlay buttons (Only show if multiple items exist) */}
              {totalMedia > 1 && (
                <>
                  <button
                    onClick={goToPrevious}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/45 hover:bg-black/70 text-white border border-white/10 backdrop-blur-sm transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100 z-20"
                    aria-label="Previous Media"
                  >
                    <ChevronLeftIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={goToNext}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/45 hover:bg-black/70 text-white border border-white/10 backdrop-blur-sm transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100 z-20"
                    aria-label="Next Media"
                  >
                    <ChevronRightIcon className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Bottom Gallery Thumbnails Drawer */}
            {totalMedia > 1 && (
              <div className="flex gap-2.5 mt-4 overflow-x-auto py-1.5 justify-center max-w-full no-scrollbar">
                {hackathon.media.map((item, idx) => {
                  const isActive = idx === currentMediaIndex;
                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentMediaIndex(idx)}
                      className={`relative w-14 h-10 rounded-md overflow-hidden border transition-all duration-300 shrink-0 cursor-pointer ${
                        isActive 
                          ? isHighlighted
                            ? "border-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)] scale-105"
                            : "border-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)] scale-105" 
                          : "border-white/10 opacity-60 hover:opacity-100"
                      }`}
                      style={{ backgroundColor: isHighlighted ? "#0a0703" : "#080305" }}
                    >
                      {item.type === "image" ? (
                        <img src={item.url} alt="" className="w-full h-full object-cover" />
                      ) : item.type === "video" ? (
                        <div className={`w-full h-full flex items-center justify-center text-[10px] ${
                          isHighlighted ? "text-amber-300" : "text-rose-300"
                        }`}>
                          <PlayIcon className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className={`w-full h-full flex items-center justify-center text-[10px] ${
                          isHighlighted ? "text-amber-300" : "text-rose-300"
                        }`}>
                          <DocumentTextIcon className="w-4 h-4" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Sidebar metadata panel */}
          <div className={`w-full md:w-[35%] p-6 md:p-8 flex flex-col justify-between overflow-y-auto bg-gradient-to-b md:bg-gradient-to-br ${
            isHighlighted 
              ? "from-[#190f05] via-[#0a0703] to-[#050301]" 
              : "from-[#19050d] via-[#080305] to-[#040103]"
          }`}>
            <div className="flex-1 flex flex-col">
              
              {/* Category & Winner pill */}
              <div className="flex flex-wrap gap-2 mb-4">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase border w-fit ${
                  isHighlighted 
                    ? "text-amber-400 bg-amber-500/10 border-amber-500/20" 
                    : "text-rose-400 bg-rose-500/10 border-rose-500/20"
                }`}>
                  {hackathon.mode || "Battleground"} Hackathon
                </div>

                {isWinner && (
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md">
                    <TrophyIcon className="w-3.5 h-3.5 mr-1" />
                    {hackathon.achievement}
                  </div>
                )}
              </div>

              {/* Title */}
              <h3 className="text-xl md:text-2xl font-extrabold text-white tracking-tight mb-3 leading-snug">
                {hackathon.title}
              </h3>

              {/* Info panel */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-300 font-medium">
                  <span className={isHighlighted ? "text-amber-400" : "text-rose-400"}>🏫</span>
                  <span>{hackathon.issuer}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <CalendarIcon className={`w-4 h-4 ${isHighlighted ? "text-amber-400/80" : "text-rose-400/80"}`} />
                  <span>Timeline: {hackathon.date}</span>
                </div>
              </div>

              {/* Key achievement callout if highlighted */}
              {isHighlighted && hackathon.keyAchievement && (
                <div className="mb-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <p className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <span>🎯 Key Impact:</span>
                    <span>{hackathon.keyAchievement}</span>
                  </p>
                </div>
              )}

              {/* Line divider */}
              <div className="h-px bg-gradient-to-r from-white/10 to-transparent mb-4" />

              {/* Description */}
              <div className="flex-1 text-sm md:text-base text-gray-300 leading-relaxed overflow-y-auto mb-6 pr-1 no-scrollbar whitespace-pre-wrap">
                <p>{hackathon.description}</p>
                {currentMedia && currentMedia.caption && (
                  <div className="mt-4 p-3 rounded-lg bg-white/5 border border-white/5 text-xs italic text-gray-400">
                    <span className={`font-semibold not-italic block mb-0.5 ${
                      isHighlighted ? "text-amber-300" : "text-rose-300"
                    }`}>Media Caption</span>
                    {currentMedia.caption}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions Footer & Repository / Demo Links */}
            <div className="pt-4 border-t border-white/5 space-y-3">
              {/* Media Actions */}
              {currentMedia && (
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <a
                    href={currentMedia.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-gradient-to-r text-white font-semibold rounded-lg text-sm transition-all duration-300 cursor-pointer ${
                      isHighlighted
                        ? "from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                        : "from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 shadow-[0_0_15px_rgba(244,63,94,0.3)]"
                    }`}
                  >
                    <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                    Open Media
                  </a>
                  <a
                    href={currentMedia.url}
                    download
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/15 rounded-lg text-sm transition-all duration-300 cursor-pointer"
                  >
                    <ArrowDownTrayIcon className="w-4 h-4" />
                    Download
                  </a>
                </div>
              )}

              {/* Project Code & Demo Links */}
              {(hackathon.githubLink || hackathon.liveLink) && (
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  {hackathon.githubLink && (
                    <a
                      href={hackathon.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-[#12111d] hover:bg-[#1f1e31] text-gray-300 hover:text-white border border-white/10 transition-all duration-200"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                      </svg>
                      GitHub Repo
                    </a>
                  )}
                  {hackathon.liveLink && (
                    <a
                      href={hackathon.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-all duration-200 ${
                        isHighlighted 
                          ? "bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/25" 
                          : "bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border-rose-500/25"
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                      Live Demo
                    </a>
                  )}
                </div>
              )}
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}