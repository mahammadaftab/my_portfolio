"use client";

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    plausible?: (eventName: string, options?: { props: Record<string, unknown> }) => void;
  }
}

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import PDFViewer from "@/components/pdf-viewer";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export default function Resume() {
  // Replace with actual resume file path
  const resumePath = "/resume.pdf";
  const [fileExists, setFileExists] = useState(true);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Check if file exists
  useState(() => {
    fetch(resumePath)
      .then(response => {
        if (!response.ok) {
          setFileExists(false);
        }
      })
      .catch(() => {
        setFileExists(false);
      });
  });

  const handleDownload = (format: string = 'pdf') => {
    // Implement analytics tracking
    if (typeof window !== 'undefined') {
      // Google Analytics
      if (window.gtag) {
        window.gtag('event', 'download', {
          event_category: 'Resume',
          event_label: `${format} Download`,
          value: 1
        });
      }
      
      // Plausible Analytics
      if (window.plausible) {
        window.plausible('Resume Download', { props: { format } });
      }
      
      // Custom event for other analytics
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black py-16">
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">My Resume</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Download my resume to learn more about my professional background, skills, and achievements.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.7 }}
          className="max-w-4xl mx-auto"
        >
          {/* Summary Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Professional Summary</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              I am <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Mahammad Aftab</span>, a passionate and dedicated <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Computer Science Engineering student</span> currently pursuing my Bachelor's degree. 
              I have hands-on experience in full-stack web development (MERN stack), generative AI, and blockchain technology. 
              I enjoy building innovative, user-friendly, and responsive web applications while continuously exploring emerging technologies. 
              <br />Passionate about creating intuitive user experiences and writing clean, maintainable code. 
              Proven track record of delivering high-quality solutions in fast-paced environments.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center">
                <span className="font-medium text-gray-900 dark:text-white mr-2">Degree:</span>
                <span className="text-gray-600 dark:text-gray-400">Bachelor of Engineering in Computer Science</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium text-gray-900 dark:text-white mr-2">Pursuing:</span>
                <span className="text-gray-600 dark:text-gray-400">3rd Year</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium text-gray-900 dark:text-white mr-2">Location:</span>
                <span className="text-gray-600 dark:text-gray-400">Gadag, Karnataka</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium text-gray-900 dark:text-white mr-2">College:</span>
                <span className="text-red-600 dark:text-red-400">Rural Engineering College Hulkoti</span>
              </div>
            </div>
          </div>

          {/* Download Button */}
          <div className="flex justify-center mb-8">
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
              className={`inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${!fileExists ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
              {fileExists ? "Download Resume (PDF)" : "Resume Not Available"}
            </a>
          </div>

          {/* Resume Preview */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Resume Preview</h3>
            </div>
            <div className="max-h-[80vh] overflow-y-auto">
              {fileExists ? (
                <PDFViewer file={resumePath} className="w-full" />
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-900">
                  <div className="text-center p-8">
                    <div className="text-4xl mb-4">📄</div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Resume Not Available</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      The resume file is currently not available for preview.
                    </p>
                    <p className="text-gray-500 dark:text-gray-500 text-sm">
                      Please use the download button above to request a copy.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Alternative Formats */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Need a different format?
            </p>
            <div className="flex justify-center gap-4">
              <a 
                href="#" 
                onClick={handleCompressedDownload}
                className={`text-blue-600 dark:text-blue-400 hover:underline ${!fileExists ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Compressed PDF
              </a>
              <span className="text-gray-400">|</span>
              <a 
                href="#" 
                onClick={handleWordDownload}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Word Document
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}