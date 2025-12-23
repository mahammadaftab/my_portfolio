// Define the Media interface directly in this file
interface Media {
  type: "image" | "pdf" | "video";
  url: string;
  caption?: string;
}

import { Fragment, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon, ArrowTopRightOnSquareIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

interface Internship {
  id: number;
  title: string;
  issuer: string;
  date: string;
  description: string;
  media: Media[];
}

interface InternshipLightboxProps {
  internship: Internship | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function InternshipLightbox({ internship, isOpen, onClose }: InternshipLightboxProps) {
  const cancelButtonRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isPdf, setIsPdf] = useState(false);
  const [isVideo, setIsVideo] = useState(false);

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

  // Reset current media index when internship changes
  useEffect(() => {
    setCurrentMediaIndex(0);
  }, [internship?.id]);

  // Update media type when current media index changes
  useEffect(() => {
    if (internship && internship.media && internship.media.length > 0) {
      const currentMedia = internship.media[currentMediaIndex];
      setIsPdf(currentMedia.url.toLowerCase().endsWith('.pdf'));
      setIsVideo(currentMedia.type === 'video');
      setIsLoading(true);
    }
  }, [internship, currentMediaIndex]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!internship || !internship.media || internship.media.length <= 1) return;
      
      if (e.key === "ArrowLeft") {
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        goToNext();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, internship]);

  const handleMediaLoad = () => {
    setIsLoading(false);
  };

  const handleMediaError = () => {
    setIsLoading(false);
  };

  const goToPrevious = () => {
    if (!internship || !internship.media || internship.media.length <= 1) return;
    
    setCurrentMediaIndex((prev) => 
      prev === 0 ? internship.media.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    if (!internship || !internship.media || internship.media.length <= 1) return;
    
    setCurrentMediaIndex((prev) => 
      prev === internship.media.length - 1 ? 0 : prev + 1
    );
  };

  const renderMedia = () => {
    if (!internship || !internship.media || internship.media.length === 0) return null;
    
    const currentMedia = internship.media[currentMediaIndex];
    
    if (!currentMedia) return null;
    
    if (isPdf) {
      return (
        <iframe
          src={currentMedia.url}
          className={`w-full h-full ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          onLoad={handleMediaLoad}
          onError={handleMediaError}
          title={`${internship.title} internship media ${currentMediaIndex + 1}`}
        />
      );
    } else if (isVideo) {
      return (
        <video
          src={currentMedia.url}
          controls
          className={`w-full h-full ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          onLoadedData={handleMediaLoad}
          onError={handleMediaError}
          title={`${internship.title} internship video ${currentMediaIndex + 1}`}
        />
      );
    } else {
      return (
        <img
          src={currentMedia.url}
          alt={`${internship.title} internship media ${currentMediaIndex + 1}`}
          className={`w-full h-full object-contain ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          onLoad={handleMediaLoad}
          onError={handleMediaError}
        />
      );
    }
  };

  // Render nothing if not open or no internship
  if (!isOpen || !internship) {
    return null;
  }

  // Render nothing if internship has no media
  if (!internship.media || internship.media.length === 0) {
    return null;
  }

  const currentMedia = internship.media[currentMediaIndex];

  return (
    <AnimatePresence>
      {isOpen && internship && (
        <Transition.Root show={isOpen && !!internship} as={Fragment}>
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
                      
                      {/* Mobile close button */}
                      <div className="absolute right-0 top-0 pr-4 pt-4 sm:hidden">
                        <button
                          type="button"
                          className="rounded-md bg-white dark:bg-gray-800 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          onClick={onClose}
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
                            {internship.title}
                          </Dialog.Title>
                          
                          <div className="mt-2">
                            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                              {internship.issuer} • {internship.date}
                            </p>
                          </div>
                          
                          <div className="mt-4 relative">
                            {/* Media navigation arrows - centered and professional */}
                            {internship.media.length > 1 && (
                              <>
                                <button
                                  onClick={goToPrevious}
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
                                  onClick={goToNext}
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
                            
                            {/* Media counter */}
                            {internship.media.length > 1 && (
                              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 bg-black/30 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-full">
                                {currentMediaIndex + 1} / {internship.media.length}
                              </div>
                            )}
                            
                            {/* Media display area */}
                            <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden mb-4 relative">
                              {isLoading && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                                </div>
                              )}
                              {renderMedia()}
                            </div>
                            
                            {/* Media caption */}
                            {currentMedia && currentMedia.caption && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 italic mb-4 text-center">
                                {currentMedia.caption}
                              </p>
                            )}
                            
                            <div className="prose dark:prose-invert max-w-none mb-6">
                              <p className="text-gray-600 dark:text-gray-400">
                                {internship.description}
                              </p>
                            </div>
                            
                            <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                              <a
                                href={currentMedia.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                              >
                                <ArrowTopRightOnSquareIcon className="h-5 w-5 mr-2" />
                                View Media
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