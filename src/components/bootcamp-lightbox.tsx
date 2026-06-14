"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  XMarkIcon, 
  ArrowTopRightOnSquareIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon,
  CalendarIcon,
  SparklesIcon,
  PlayIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon
} from "@heroicons/react/24/outline";

interface Media {
  type: "image" | "pdf" | "video";
  url: string;
  caption?: string;
}

interface Bootcamp {
  id: number;
  title: string;
  issuer: string;
  date: string;
  description: string | string[];
  media: Media[];
}

interface BootcampLightboxProps {
  bootcamp: Bootcamp | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function BootcampLightbox({ bootcamp, isOpen, onClose }: BootcampLightboxProps) {
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

  // Reset index when active bootcamp changes
  useEffect(() => {
    setCurrentMediaIndex(0);
    setIsLoading(true);
  }, [bootcamp?.id]);

  // Set loading state when changing media
  useEffect(() => {
    setIsLoading(true);
  }, [currentMediaIndex]);

  if (!isOpen || !bootcamp) return null;

  const currentMedia = bootcamp.media?.[currentMediaIndex];
  const totalMedia = bootcamp.media?.length || 0;

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

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0601]/95 backdrop-blur-md p-4 md:p-6 overflow-hidden"
        onClick={handleBackdropClick}
      >
        {/* Animated modal box */}
        <motion.div
          ref={modalRef}
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative w-full max-w-6xl h-auto max-h-[90vh] md:h-[75vh] flex flex-col md:flex-row bg-[#0a0703] border border-amber-500/20 rounded-2xl md:rounded-3xl shadow-[0_0_50px_rgba(245,158,11,0.12)] overflow-hidden"
        >
          {/* Close button (Floating top right) */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-[#1c1206]/80 hover:bg-[#33220b]/80 text-gray-300 hover:text-white border border-white/10 transition-all duration-300 shadow-md group hover:scale-105"
            aria-label="Close modal"
          >
            <XMarkIcon className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />
          </button>

          {/* LEFT COLUMN: Immersive Media Section */}
          <div className="w-full md:w-[65%] h-[45vh] md:h-full bg-black/40 flex flex-col justify-between p-4 md:p-6 relative border-b md:border-b-0 md:border-r border-white/10">
            {/* Aspect Display Box */}
            <div className="relative flex-1 w-full flex items-center justify-center overflow-hidden rounded-xl bg-[#050301] border border-white/5 group">
              
              {/* Media loader spinner */}
              {isLoading && currentMedia && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#050301]">
                  <div className="animate-spin rounded-full h-10 w-10 border-2 border-t-transparent border-amber-500"></div>
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
                      alt={currentMedia.caption || bootcamp.title}
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
                          title={bootcamp.title}
                        />
                      </div>
                      {/* Mobile responsive view */}
                      <div className="md:hidden flex flex-col items-center justify-center p-6 text-center w-full h-full bg-[#0d0904]">
                        <DocumentTextIcon className="w-14 h-14 text-amber-400 mb-3 animate-pulse" />
                        <h4 className="text-white font-bold text-base mb-1.5">Bootcamp Document</h4>
                        <p className="text-gray-400 text-xs mb-4 max-w-[240px] leading-relaxed">
                          PDF files are best viewed on desktop or in external screen readers.
                        </p>
                        <a
                          href={currentMedia.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-lg text-xs transition-all duration-300 shadow-lg"
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
                {bootcamp.media.map((item, idx) => {
                  const isActive = idx === currentMediaIndex;
                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentMediaIndex(idx)}
                      className={`relative w-14 h-10 rounded-md overflow-hidden bg-[#0a0703] border transition-all duration-300 shrink-0 cursor-pointer ${
                        isActive 
                          ? "border-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)] scale-105" 
                          : "border-white/10 opacity-60 hover:opacity-100"
                      }`}
                    >
                      {item.type === "image" ? (
                        <img src={item.url} alt="" className="w-full h-full object-cover" />
                      ) : item.type === "video" ? (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-amber-300">
                          <PlayIcon className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-orange-300">
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
          <div className="w-full md:w-[35%] p-6 md:p-8 flex flex-col justify-between overflow-y-auto bg-gradient-to-b md:bg-gradient-to-br from-[#190f05] via-[#0a0703] to-[#050301]">
            <div className="flex-1 flex flex-col">
              {/* Category pill indicator */}
              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase border w-fit mb-4 text-amber-400 bg-amber-500/10 border-amber-500/20">
                <SparklesIcon className="w-3.5 h-3.5 mr-1" />
                IDE Innovation Bootcamp
              </div>

              {/* Title */}
              <h3 className="text-xl md:text-2xl font-extrabold text-white tracking-tight mb-3 leading-snug">
                {bootcamp.title}
              </h3>

              {/* Info panel */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-300 font-medium">
                  <span className="text-amber-400">🏫</span>
                  <span>{bootcamp.issuer}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <CalendarIcon className="w-4 h-4 text-amber-400/80" />
                  <span>Date: {bootcamp.date}</span>
                </div>
              </div>

              {/* Line divider */}
              <div className="h-px bg-gradient-to-r from-white/10 to-transparent mb-5" />

              {/* Description (Custom formatting for array bootcamps) */}
              <div className="flex-1 text-sm md:text-base text-gray-300 leading-relaxed overflow-y-auto mb-6 pr-1 no-scrollbar">
                {Array.isArray(bootcamp.description) ? (
                  <ul className="space-y-3">
                    {bootcamp.description.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                        <span className="text-sm md:text-base">{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="whitespace-pre-line">{bootcamp.description}</p>
                )}

                {currentMedia && currentMedia.caption && (
                  <div className="mt-6 p-3 rounded-lg bg-white/5 border border-white/5 text-xs italic text-gray-400">
                    <span className="font-semibold text-amber-300 not-italic block mb-0.5">Media Caption</span>
                    {currentMedia.caption}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions Footer */}
            {currentMedia && (
              <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row gap-3">
                <a
                  href={currentMedia.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold rounded-lg text-sm transition-all duration-300 shadow-[0_0_15px_rgba(245,158,11,0.3)] cursor-pointer"
                >
                  <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                  Open Document
                </a>
                <a
                  href={currentMedia.url}
                  download
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/15 rounded-lg text-sm transition-all duration-300 cursor-pointer"
                >
                  <ArrowDownTrayIcon className="w-4 h-4" />
                  Download
                </a>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
