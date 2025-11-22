"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon, ArrowTopRightOnSquareIcon, CodeBracketIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

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

export default function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
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
          type: "image"
        });
      }
      
      // Add videos
      if (project.videos && project.videos.length > 0) {
        allMedia.push(...project.videos);
      }
      
      setMedia(allMedia);
      setCurrentMediaIndex(0);
      // Set loading state when media changes
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
    // If urls array exists, use that
    if (project.urls && project.urls.length > 0) {
      return project.urls.map((urlObj, index) => (
        <a
          key={index}
          href={urlObj.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          <ArrowTopRightOnSquareIcon className="h-5 w-5 mr-2" />
          {urlObj.label}
        </a>
      ));
    }
    
    // If single liveUrl exists, use that
    if (project.liveUrl) {
      return (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          <ArrowTopRightOnSquareIcon className="h-5 w-5 mr-2" />
          Live Demo
        </a>
      );
    }
    
    // If no URLs, return null
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
        <div className="bg-gray-200 dark:bg-gray-700 w-full h-full flex items-center justify-center">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
        </div>
      );
    }

    const currentMedia = media[currentMediaIndex];
    
    if (currentMedia.type === "video") {
      return (
        <div className="w-full h-full flex items-center justify-center bg-black relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}
          <video 
            src={currentMedia.url} 
            controls 
            autoPlay={false}
            playsInline
            preload="metadata"
            className={`w-full h-full ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
            onLoadedData={handleMediaLoad}
            onError={handleMediaError}
          >
            Your browser does not support the video tag.
          </video>
          <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm flex items-center">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z"></path>
            </svg>
            Video
          </div>
        </div>
      );
    } else {
      return (
        <>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}
          <img 
            src={currentMedia.url} 
            alt={currentMedia.label}
            className={`w-full h-full object-contain ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
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
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity dark:bg-gray-900 dark:bg-opacity-80" />
            </Transition.Child>

            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="p-6"
                    >
                      <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                        <button
                          type="button"
                          className="rounded-md bg-white dark:bg-gray-800 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          onClick={onClose}
                          ref={cancelButtonRef}
                        >
                          <span className="sr-only">Close</span>
                          <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                      
                      <div className="sm:flex sm:items-start">
                        <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                          <Dialog.Title
                            as="h3"
                            className="text-2xl font-bold leading-6 text-gray-900 dark:text-white"
                          >
                            {project.title}
                          </Dialog.Title>
                          
                          <div className="mt-4">
                            <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden mb-6 relative shadow-lg">
                              {media.length > 1 && (
                                <>
                                  <button
                                    onClick={prevMedia}
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 focus:outline-none focus:ring-2 focus:ring-white transition-all duration-300 group md:p-2"
                                    aria-label="Previous media"
                                  >
                                    <motion.div
                                      whileHover={{ x: -5 }}
                                      transition={{ duration: 0.2 }}
                                    >
                                      <ChevronLeftIcon className="h-6 w-6 md:h-5 md:w-5" />
                                    </motion.div>
                                  </button>
                                  <button
                                    onClick={nextMedia}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 focus:outline-none focus:ring-2 focus:ring-white transition-all duration-300 group md:p-2"
                                    aria-label="Next media"
                                  >
                                    <motion.div
                                      whileHover={{ x: 5 }}
                                      transition={{ duration: 0.2 }}
                                    >
                                      <ChevronRightIcon className="h-6 w-6 md:h-5 md:w-5" />
                                    </motion.div>
                                  </button>
                                </>
                              )}
                                                            
                              <div className="w-full h-full flex items-center justify-center relative">
                                {isLoading && (
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                                  </div>
                                )}
                                {renderMedia()}
                              </div>
                                                            
                              {media.length > 1 && (
                                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 bg-black/30 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-full">
                                  {currentMediaIndex + 1} / {media.length}
                                </div>
                              )}
                            </div>
                            
                            <div className="flex flex-wrap gap-2 mb-6">
                              {project.tags.map((tag) => (
                                <span 
                                  key={tag} 
                                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-sm font-medium rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                            
                            <div className="prose dark:prose-invert max-w-none mb-6">
                              <p className="text-gray-600 dark:text-gray-400">
                                {project.description}
                              </p>
                              {project.details && (
                                <p className="mt-4 text-gray-600 dark:text-gray-400">
                                  {project.details}
                                </p>
                              )}
                            </div>
                            
                            {project.technologies && project.technologies.length > 0 && (
                              <div className="mb-6">
                                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                  Technologies Used
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {project.technologies.map((tech) => (
                                    <span 
                                      key={tech} 
                                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-medium rounded"
                                    >
                                      {tech}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                              {renderUrls()}
                              <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-4 py-2 bg-gray-800 dark:bg-gray-700 text-white font-medium rounded-md hover:bg-gray-900 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                              >
                                <CodeBracketIcon className="h-5 w-5 mr-2" />
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