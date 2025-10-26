"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import experienceData from "@/data/experience.json";
import CertificateLightbox from "@/components/certificate-lightbox";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export default function Experience() {
  const { experiences, certificates } = experienceData;
  const [selectedCertificate, setSelectedCertificate] = useState<typeof certificates[0] | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Experience & Certificates</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            A timeline of my professional journey and certifications that showcase my expertise.
          </p>
        </motion.div>

        {/* Experience Timeline */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Professional Experience
          </h2>
          
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-500 to-purple-600 hidden md:block"></div>
            
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.5, delay: prefersReducedMotion ? 0 : index * 0.2 }}
                className={`mb-12 flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} justify-between items-center w-full`}
              >
                <div className={`order-1 w-full md:w-5/12 ${index % 2 === 0 ? '' : 'md:text-right'}`}>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{exp.period}</span>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-2">{exp.role}</h3>
                    <p className="text-lg font-medium text-gray-700 dark:text-gray-300">{exp.company}</p>
                    <p className="text-gray-600 dark:text-gray-400 mt-3">{exp.description}</p>
                    <ul className="mt-4 space-y-2">
                      {exp.responsibilities.map((resp, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                          <span className="text-gray-600 dark:text-gray-400">{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                {/* Timeline dot */}
                <div className="order-2 md:order-2 z-10">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>
                
                <div className="order-3 w-full md:w-5/12"></div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Certificates Section */}
        <div>
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Certifications
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {certificates.map((cert, index) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.5, delay: prefersReducedMotion ? 0 : index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{cert.title}</h3>
                    <p className="text-blue-600 dark:text-blue-400 font-medium">{cert.issuer}</p>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">{cert.date}</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{cert.description}</p>
                <button 
                  onClick={() => {
                    setSelectedCertificate(cert);
                    setIsLightboxOpen(true);
                  }}
                  className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium group-hover:underline"
                  aria-label={`View ${cert.title} certificate`}
                >
                  View Certificate
                  <ArrowTopRightOnSquareIcon className="ml-2 h-4 w-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
        
        <CertificateLightbox 
          certificate={selectedCertificate} 
          isOpen={isLightboxOpen} 
          onClose={() => setIsLightboxOpen(false)} 
        />
      </div>
    </div>
  );
}