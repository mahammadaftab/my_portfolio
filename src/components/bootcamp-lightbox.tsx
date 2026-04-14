"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

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
  const [isPdfLoaded, setIsPdfLoaded] = useState(false);

  // Reset current media index when bootcamp changes
  useEffect(() => {
    setCurrentMediaIndex(0);
    setIsPdfLoaded(false);
  }, [bootcamp?.id]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight") {
        goToNextMedia();
      } else if (e.key === "ArrowLeft") {
        goToPrevMedia();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, bootcamp]);

  const goToNextMedia = () => {
    if (!bootcamp || !bootcamp.media || bootcamp.media.length <= 1) return;
    setCurrentMediaIndex((prev) => (prev + 1) % bootcamp.media.length);
    setIsPdfLoaded(false);
  };

  const goToPrevMedia = () => {
    if (!bootcamp || !bootcamp.media || bootcamp.media.length <= 1) return;
    setCurrentMediaIndex((prev) => (prev === 0 ? bootcamp.media.length - 1 : prev - 1));
    setIsPdfLoaded(false);
  };

  if (!bootcamp) return null;

  const currentMedia = bootcamp.media[currentMediaIndex];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-5xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-50"
              aria-label="Close lightbox"
            >
              <XMarkIcon className="h-8 w-8" />
            </button>

            {/* Bootcamp info */}
            <div className="mb-4 text-white">
              <h3 className="text-2xl font-bold">{bootcamp.title}</h3>
              <p className="text-gray-300">{bootcamp.issuer} • {bootcamp.date}</p>
            </div>

            {/* Media container */}
            <div className="relative bg-gray-900 rounded-lg overflow-hidden">
              {currentMedia?.type === "image" && (
                <img
                  src={currentMedia.url}
                  alt={currentMedia.caption || bootcamp.title}
                  className="w-full h-auto max-h-[70vh] object-contain"
                />
              )}

              {currentMedia?.type === "pdf" && (
                <div className="w-full h-[70vh]">
                  {!isPdfLoaded && (
                    <div className="flex items-center justify-center h-full text-white">
                      Loading PDF...
                    </div>
                  )}
                  <iframe
                    src={`${currentMedia.url}#toolbar=0`}
                    className={`w-full h-full ${isPdfLoaded ? 'block' : 'hidden'}`}
                    onLoad={() => setIsPdfLoaded(true)}
                    title={currentMedia.caption || bootcamp.title}
                  />
                </div>
              )}

              {currentMedia?.type === "video" && (
                <video
                  src={currentMedia.url}
                  controls
                  className="w-full h-auto max-h-[70vh]"
                  autoPlay
                />
              )}

              {/* Navigation arrows */}
              {bootcamp.media.length > 1 && (
                <>
                  <button
                    onClick={goToPrevMedia}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                    aria-label="Previous media"
                  >
                    <ChevronLeftIcon className="h-6 w-6" />
                  </button>
                  <button
                    onClick={goToNextMedia}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                    aria-label="Next media"
                  >
                    <ChevronRightIcon className="h-6 w-6" />
                  </button>
                </>
              )}
            </div>

            {/* Caption and indicators */}
            <div className="mt-4 flex justify-between items-center">
              <p className="text-white text-sm">
                {currentMedia?.caption || `Media ${currentMediaIndex + 1} of ${bootcamp.media.length}`}
              </p>
              {bootcamp.media.length > 1 && (
                <div className="flex gap-2">
                  {bootcamp.media.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentMediaIndex(index);
                        setIsPdfLoaded(false);
                      }}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentMediaIndex ? "bg-white w-4" : "bg-white/50"
                      }`}
                      aria-label={`Go to media ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
