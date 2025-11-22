"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon, ArrowTopRightOnSquareIcon, CodeBracketIcon } from "@heroicons/react/24/outline";
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
    }
  }, [project]);

  // Close modal on Escape key press
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }
    
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

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
        <div className="w-full h-full flex items-center justify-center bg-black">
          <video 
            src={currentMedia.url} 
            controls 
            className="max-h-full max-w-full object-contain"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      );
    } else {
      return (
        <img 
          src={currentMedia.url} 
          alt={currentMedia.label}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to placeholder if image fails to load
            const target = e.target as HTMLImageElement;
            if (target && target.parentElement) {
              target.onerror = null;
              target.parentElement.innerHTML = `
                <div class="bg-gray-200 dark:bg-gray-700 w-full h-full flex items-center justify-center">
                  <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
              `;
            }
          }}
        />
      );
    }
  };

  const nextMedia = () => {
    setCurrentMediaIndex((prev) => (prev + 1) % media.length);
  };

  const prevMedia = () => {
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
                            <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden mb-6 relative">
                              {media.length > 1 && (
                                <>
                                  <button
                                    onClick={prevMedia}
                                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all z-10"
                                  >
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={nextMedia}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all z-10"
                                  >
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                  </button>
                                </>
                              )}
                              
                              <div className="w-full h-full flex items-center justify-center">
                                {renderMedia()}
                              </div>
                              
                              {media.length > 1 && (
                                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white text-sm px-2 py-1 rounded">
                                  {currentMediaIndex + 1} / {media.length} - {media[currentMediaIndex]?.label}
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