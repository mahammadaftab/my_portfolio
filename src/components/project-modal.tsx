"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineXMark,
  HiOutlineArrowTopRightOnSquare,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlinePlayCircle,
  HiOutlinePhoto,
} from "react-icons/hi2";
import { FaGithub } from "react-icons/fa";

interface ProjectUrl {
  label: string;
  url: string;
}

interface ProjectMedia {
  url: string;
  label: string;
  type: "image" | "video";
}

interface ProjectModalProps {
  project: {
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
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectModal({
  project,
  isOpen,
  onClose,
}: ProjectModalProps) {
  const cancelButtonRef = useRef(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [media, setMedia] = useState<ProjectMedia[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Update media when project changes
  useEffect(() => {
    if (project) {
      const allMedia: ProjectMedia[] = [];

      // Add images from images array
      if (project.images && project.images.length > 0) {
        allMedia.push(...project.images);
      }
      // Fallback to single image
      else if (project.image) {
        allMedia.push({
          url: project.image,
          label: "Project Image",
          type: "image",
        });
      }

      // Add videos
      if (project.videos && project.videos.length > 0) {
        allMedia.push(...project.videos);
      }

      setMedia(allMedia);
      setCurrentMediaIndex(0);
      if (allMedia.length > 0) {
        setIsLoading(true);
      }
    }
  }, [project]);

  // Close modal on Escape key press
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    // Handle keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!project || media.length <= 1) return;

      if (e.key === "ArrowLeft") {
        prevMedia();
      } else if (e.key === "ArrowRight") {
        nextMedia();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      window.addEventListener("keydown", handleKeyDown);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose, project, media.length]);

  if (!project) return null;

  // Determine which URLs to display
  const renderUrls = () => {
    if (project.urls && project.urls.length > 0) {
      return project.urls
        .filter((urlObj) => urlObj.url)
        .map((urlObj, index) => (
          <a
            key={index}
            href={urlObj.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group/btn inline-flex items-center gap-2.5 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl text-sm font-semibold text-white hover:shadow-[0_4px_30px_rgba(99,102,241,0.4)] transition-all duration-300 hover:scale-[1.03]"
          >
            <HiOutlineArrowTopRightOnSquare className="h-4 w-4" />
            {urlObj.label}
          </a>
        ));
    }

    if (project.liveUrl) {
      return (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group/btn inline-flex items-center gap-2.5 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl text-sm font-semibold text-white hover:shadow-[0_4px_30px_rgba(99,102,241,0.4)] transition-all duration-300 hover:scale-[1.03]"
        >
          <HiOutlineArrowTopRightOnSquare className="h-4 w-4" />
          Live Demo
        </a>
      );
    }

    return null;
  };

  const handleMediaLoad = () => {
    setIsLoading(false);
  };

  const handleMediaError = () => {
    setIsLoading(false);
  };

  const renderMedia = () => {
    if (media.length === 0) {
      return (
        <div className="bg-gray-900/50 w-full h-full flex items-center justify-center">
          <HiOutlinePhoto className="w-12 h-12 text-gray-600" />
        </div>
      );
    }

    const currentMedia = media[currentMediaIndex];

    if (currentMedia.type === "video") {
      return (
        <div className="w-full h-full flex items-center justify-center bg-black relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
            </div>
          )}
          <video
            src={currentMedia.url}
            controls
            autoPlay={false}
            playsInline
            preload="metadata"
            className={`w-full h-full ${
              isLoading ? "opacity-0" : "opacity-100"
            } transition-opacity duration-300`}
            onLoadedData={handleMediaLoad}
            onError={handleMediaError}
          >
            Your browser does not support the video tag.
          </video>
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-red-500/80 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
            <HiOutlinePlayCircle className="w-3.5 h-3.5" />
            Video
          </div>
        </div>
      );
    } else {
      return (
        <>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
            </div>
          )}
          <img
            src={currentMedia.url}
            alt={currentMedia.label}
            className={`w-full h-full object-contain ${
              isLoading ? "opacity-0" : "opacity-100"
            } transition-opacity duration-300`}
            onLoad={handleMediaLoad}
            onError={handleMediaError}
          />
        </>
      );
    }
  };

  const nextMedia = () => {
    if (media.length <= 1) return;
    setIsLoading(true);
    setCurrentMediaIndex((prev) => (prev + 1) % media.length);
  };

  const prevMedia = () => {
    if (media.length <= 1) return;
    setIsLoading(true);
    setCurrentMediaIndex((prev) => (prev - 1 + media.length) % media.length);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Transition.Root show={isOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-50"
            initialFocus={cancelButtonRef}
            onClose={onClose}
          >
            {/* Backdrop */}
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-[#020408]/90 backdrop-blur-xl transition-opacity" />
            </Transition.Child>

            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel className="relative transform overflow-hidden rounded-2xl bg-[#0a0f1a] border border-white/[0.08] text-left shadow-[0_25px_100px_rgba(0,0,0,0.8)] transition-all sm:my-8 sm:w-full sm:max-w-4xl">
                    {/* Top gradient accent */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 z-10" />

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="p-6 sm:p-8"
                    >
                      {/* Close button */}
                      <div className="absolute right-4 top-4 sm:right-6 sm:top-6 z-20">
                        <button
                          type="button"
                          className="flex items-center justify-center w-9 h-9 rounded-full bg-white/[0.06] border border-white/[0.1] text-gray-400 hover:text-white hover:bg-white/[0.1] transition-all duration-200"
                          onClick={onClose}
                          ref={cancelButtonRef}
                        >
                          <span className="sr-only">Close</span>
                          <HiOutlineXMark className="h-5 w-5" />
                        </button>
                      </div>

                      <div className="sm:flex sm:items-start">
                        <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                          {/* Title */}
                          <Dialog.Title
                            as="h3"
                            className="text-2xl sm:text-3xl font-black text-white tracking-tight pr-10"
                          >
                            {project.title}
                          </Dialog.Title>

                          <div className="mt-6">
                            {/* Media Gallery */}
                            <div className="aspect-video bg-gray-900/50 rounded-xl overflow-hidden mb-6 relative border border-white/[0.06]">
                              {/* Navigation arrows */}
                              {media.length > 1 && (
                                <>
                                  <button
                                    onClick={prevMedia}
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 p-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/[0.1] text-white hover:bg-black/60 hover:border-white/[0.2] focus:outline-none transition-all duration-300"
                                    aria-label="Previous media"
                                  >
                                    <HiOutlineChevronLeft className="h-5 w-5" />
                                  </button>
                                  <button
                                    onClick={nextMedia}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10 p-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/[0.1] text-white hover:bg-black/60 hover:border-white/[0.2] focus:outline-none transition-all duration-300"
                                    aria-label="Next media"
                                  >
                                    <HiOutlineChevronRight className="h-5 w-5" />
                                  </button>
                                </>
                              )}

                              {/* Main media */}
                              <div className="w-full h-full flex items-center justify-center relative">
                                {isLoading && (
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-10 h-10 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                                  </div>
                                )}
                                {renderMedia()}
                              </div>

                              {/* Counter pill */}
                              {media.length > 1 && (
                                <div className="absolute top-3 left-1/2 transform -translate-x-1/2 z-10 bg-black/40 backdrop-blur-md border border-white/[0.1] text-white text-xs font-semibold px-3 py-1 rounded-full">
                                  {currentMediaIndex + 1} / {media.length}
                                </div>
                              )}
                            </div>

                            {/* Thumbnail strip */}
                            {media.length > 1 && (
                              <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-thin">
                                {media.map((item, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => {
                                      setIsLoading(true);
                                      setCurrentMediaIndex(idx);
                                    }}
                                    className={`relative flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                                      idx === currentMediaIndex
                                        ? "border-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.4)]"
                                        : "border-white/[0.06] hover:border-white/[0.2] opacity-60 hover:opacity-100"
                                    }`}
                                  >
                                    {item.type === "video" ? (
                                      <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                                        <HiOutlinePlayCircle className="w-5 h-5 text-red-400" />
                                      </div>
                                    ) : (
                                      <img
                                        src={item.url}
                                        alt={item.label}
                                        className="w-full h-full object-cover"
                                      />
                                    )}
                                  </button>
                                ))}
                              </div>
                            )}

                            {/* Tags */}
                            {project.categorizedTags ? (
                              <div className="space-y-4 mb-6 bg-white/[0.02] border border-white/[0.05] rounded-xl p-4">
                                {Object.entries(project.categorizedTags).map(([category, tags]) => (
                                  <div key={category} className="flex flex-col gap-1.5">
                                    <span className="text-xs font-bold tracking-widest text-indigo-400 uppercase">
                                      {category}
                                    </span>
                                    <div className="flex flex-wrap gap-2">
                                      {tags.map((tag) => (
                                        <span
                                          key={tag}
                                          className="px-3 py-1.5 text-xs font-semibold tracking-wide rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300"
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
                                    className="px-3 py-1.5 text-xs font-semibold tracking-wide rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Description */}
                            <div className="mb-6">
                              <p className="text-gray-400 leading-relaxed">
                                {project.description}
                              </p>
                              {project.details && (
                                <p className="mt-3 text-gray-500 leading-relaxed">
                                  {project.details}
                                </p>
                              )}
                            </div>

                            {/* Technologies */}
                            {project.technologies &&
                              project.technologies.length > 0 && (
                                <div className="mb-6">
                                  <h4 className="text-sm font-bold text-white mb-3 tracking-wide uppercase">
                                    Technologies Used
                                  </h4>
                                  <div className="flex flex-wrap gap-2">
                                    {project.technologies.map((tech) => (
                                      <span
                                        key={tech}
                                        className="px-3 py-1.5 bg-white/[0.04] border border-white/[0.06] text-gray-300 text-xs font-medium rounded-lg"
                                      >
                                        {tech}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                            {/* Action buttons */}
                            <div className="flex flex-wrap gap-3 pt-6 border-t border-white/[0.06]">
                              {renderUrls()}
                              <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-white/[0.06] border border-white/[0.1] rounded-xl text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/[0.1] hover:border-white/[0.2] transition-all duration-300"
                              >
                                <FaGithub className="h-4 w-4" />
                                GitHub Repo
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      )}
    </AnimatePresence>
  );
}