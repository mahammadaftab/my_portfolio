"use client";

import { useState, useRef } from "react";
import { motion, useInView, useTransform, useScroll } from "framer-motion";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import experienceData from "@/data/experience.json";
import CertificateLightbox from "@/components/certificate-lightbox";
import HackathonLightbox from "@/components/hackthon-lightbox";
import InternshipLightbox from "@/components/internship-lightbox";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

// Define the proper types for certificate and hackathon media
interface Media {
  type: "image" | "pdf" | "video";
  url: string;
  caption?: string;
}

interface Certificate {
  id: number;
  title: string;
  issuer: string;
  date: string;
  description: string;
  media: Media[];
}

interface Hackathon {
  id: number;
  title: string;
  issuer: string;
  date: string;
  description: string;
  media: Media[];
}

interface Internship {
  id: number;
  title: string;
  issuer: string;
  date: string;
  description: string;
  media: Media[];
}

export default function Experience() {
  const { experiences, certificates, internships, hackthons } = experienceData;
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [selectedHackathon, setSelectedHackathon] = useState<Hackathon | null>(null);
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);
  const [isCertificateLightboxOpen, setIsCertificateLightboxOpen] = useState(false);
  const [isHackathonLightboxOpen, setIsHackathonLightboxOpen] = useState(false);
  const [isInternshipLightboxOpen, setIsInternshipLightboxOpen] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll-based animations
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Create refs for each experience item to trigger animations on scroll
  const experienceRefs = experiences.map(() => useRef(null));
  const isInView = experienceRefs.map(ref => useInView(ref, { once: true, margin: "-100px" }));

  // Transform scroll progress to animation values
  const experienceY = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black py-16">
      <div ref={containerRef} className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
          className="text-center mb-16"
          style={{ y: prefersReducedMotion ? 0 : experienceY }}
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Experience & Certificates</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            A timeline of my professional journey and certifications that showcase my expertise.
          </p>
        </motion.div>

        {/* Experience Timeline */}
        <div className="mb-24">
          <motion.h2 
            className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12"
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.5, delay: prefersReducedMotion ? 0 : 0.1 }}
          >
            Professional Experience
          </motion.h2>
          
          <div className="relative">
            {/* Vertical line with scroll animation */}
            <motion.div 
              className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-500 to-purple-600 hidden md:block"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            ></motion.div>
            
            {experiences.map((exp, index) => (
              <div 
                key={exp.id} 
                ref={experienceRefs[index]}
                className={`mb-12 flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} justify-between items-center w-full`}
              >
                {/* Content that slides in from left or right */}
                <motion.div
                  className={`order-1 w-full md:w-5/12 ${index % 2 === 0 ? '' : 'md:text-right'}`}
                  initial={prefersReducedMotion ? { opacity: 1 } : { 
                    opacity: 0, 
                    x: index % 2 === 0 ? (prefersReducedMotion ? 0 : -100) : (prefersReducedMotion ? 0 : 100) 
                  }}
                  animate={prefersReducedMotion ? { opacity: 1 } : { 
                    opacity: isInView[index] ? 1 : 0, 
                    x: isInView[index] ? 0 : (index % 2 === 0 ? -100 : 100) 
                  }}
                  transition={{ 
                    duration: 0.7, 
                    ease: "easeOut",
                    delay: prefersReducedMotion ? 0 : 0.1 
                  }}
                >
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="flex items-center mb-2">
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded">
                        {exp.period}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-2">{exp.title}</h3>
                    <p className="text-lg font-medium text-gray-700 dark:text-gray-300">{exp.company}</p>
                    <p className="text-gray-600 dark:text-gray-400 mt-3">{exp.description}</p>
                    {exp.responsibilities && exp.responsibilities.length > 0 && (
                      <ul className="mt-4 space-y-2">
                        {exp.responsibilities.map((resp, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-blue-600 dark:text-blue-400 mr-2 mt-1">•</span>
                            <span className="text-gray-600 dark:text-gray-400">{resp}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </motion.div>
                
                {/* Timeline dot with animation */}
                <motion.div 
                  className="order-2 md:order-2 z-10"
                  initial={prefersReducedMotion ? { scale: 1 } : { scale: 0 }}
                  animate={prefersReducedMotion ? { scale: 1 } : { 
                    scale: isInView[index] ? 1 : 0 
                  }}
                  transition={{ 
                    duration: 0.5, 
                    delay: prefersReducedMotion ? 0 : 0.2,
                    type: "spring", 
                    stiffness: 300 
                  }}
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </motion.div>
                
                {/* Empty div for spacing */}
                <div className="order-3 w-full md:w-5/12"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Certificates Section */}
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.5, delay: prefersReducedMotion ? 0 : 0.3 }}
          className="mb-24"
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Certifications
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {certificates.map((cert, index) => {
              // Convert the certificate data to the proper type
              const typedCertificate: Certificate = {
                id: cert.id,
                title: cert.title,
                issuer: cert.issuer,
                date: cert.date,
                description: cert.description,
                media: cert.media ? cert.media.map(media => ({
                  type: media.type as "image" | "pdf" | "video",
                  url: media.url,
                  caption: media.caption
                })) : []
              };
              
              const certRef = useRef(null);
              const isCertInView = useInView(certRef, { once: true, margin: "-50px" });
              
              return (
                <motion.div
                  key={cert.id}
                  ref={certRef}
                  initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 50 }}
                  animate={prefersReducedMotion ? { opacity: 1 } : { 
                    opacity: isCertInView ? 1 : 0, 
                    y: isCertInView ? 0 : 50 
                  }}
                  transition={{ 
                    duration: 0.5, 
                    delay: prefersReducedMotion ? 0 : index * 0.1,
                    ease: "easeOut" 
                  }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-2"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{cert.title}</h3>
                      <p className="text-blue-600 dark:text-blue-400 font-medium">{cert.issuer}</p>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                      {cert.date}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{cert.description}</p>
                  <button 
                    onClick={() => {
                      setSelectedCertificate(typedCertificate);
                      setIsCertificateLightboxOpen(true);
                    }}
                    className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium group-hover:underline"
                    aria-label={`View ${cert.title} certificate`}
                  >
                    View Certificate
                    <ArrowTopRightOnSquareIcon className="ml-2 h-4 w-4" />
                  </button>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Internships Section */}
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.5, delay: prefersReducedMotion ? 0 : 0.4 }}
          className="mb-24"
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Internships
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {internships.map((internship, index) => {
              const internshipRef = useRef(null);
              const isInternshipInView = useInView(internshipRef, { once: true, margin: "-50px" });
              
              // Convert the internship data to the proper type
              const typedInternship: Internship = {
                id: internship.id,
                title: internship.title,
                issuer: internship.issuer,
                date: internship.date,
                description: internship.description,
                media: internship.media.map(media => ({
                  type: media.type as "image" | "pdf" | "video",
                  url: media.url,
                  caption: media.caption
                }))
              };
              
              return (
                <motion.div
                  key={internship.id}
                  ref={internshipRef}
                  initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 50 }}
                  animate={prefersReducedMotion ? { opacity: 1 } : { 
                    opacity: isInternshipInView ? 1 : 0, 
                    y: isInternshipInView ? 0 : 50 
                  }}
                  transition={{ 
                    duration: 0.5, 
                    delay: prefersReducedMotion ? 0 : index * 0.1,
                    ease: "easeOut" 
                  }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-2"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{internship.title}</h3>
                      <p className="text-blue-600 dark:text-blue-400 font-medium">{internship.issuer}</p>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                      {internship.date}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{internship.description}</p>
                  <button 
                    onClick={() => {
                      setSelectedInternship(typedInternship);
                      setIsInternshipLightboxOpen(true);
                    }}
                    className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium group-hover:underline"
                    aria-label={`View ${internship.title} internship`}
                  >
                    View Internship
                    <ArrowTopRightOnSquareIcon className="ml-2 h-4 w-4" />
                  </button>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Hackathons Section */}
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.5, delay: prefersReducedMotion ? 0 : 0.4 }}
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Hackathons
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hackthons.map((hackathon, index) => {
              const hackathonRef = useRef(null);
              const isHackathonInView = useInView(hackathonRef, { once: true, margin: "-50px" });
              
              // Convert the hackathon data to the proper type
              const typedHackathon: Hackathon = {
                id: hackathon.id,
                title: hackathon.title,
                issuer: hackathon.issuer,
                date: hackathon.date,
                description: hackathon.description,
                media: hackathon.media.map(media => ({
                  type: media.type as "image" | "pdf" | "video",
                  url: media.url,
                  caption: media.caption
                }))
              };
              
              return (
                <motion.div
                  key={hackathon.id}
                  ref={hackathonRef}
                  initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 50 }}
                  animate={prefersReducedMotion ? { opacity: 1 } : { 
                    opacity: isHackathonInView ? 1 : 0, 
                    y: isHackathonInView ? 0 : 50 
                  }}
                  transition={{ 
                    duration: 0.5, 
                    delay: prefersReducedMotion ? 0 : index * 0.1,
                    ease: "easeOut" 
                  }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-2"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{hackathon.title}</h3>
                      <p className="text-blue-600 dark:text-blue-400 font-medium">{hackathon.issuer}</p>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                      {hackathon.date}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{hackathon.description}</p>
                  <button 
                    onClick={() => {
                      setSelectedHackathon(typedHackathon);
                      setIsHackathonLightboxOpen(true);
                    }}
                    className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium group-hover:underline"
                    aria-label={`View ${hackathon.title} hackathon`}
                  >
                    View Hackathon
                    <ArrowTopRightOnSquareIcon className="ml-2 h-4 w-4" />
                  </button>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <CertificateLightbox 
          certificate={selectedCertificate} 
          isOpen={isCertificateLightboxOpen} 
          onClose={() => setIsCertificateLightboxOpen(false)} 
        />
        
        <HackathonLightbox 
          hackathon={selectedHackathon} 
          isOpen={isHackathonLightboxOpen} 
          onClose={() => setIsHackathonLightboxOpen(false)} 
        />
        
        <InternshipLightbox 
          internship={selectedInternship} 
          isOpen={isInternshipLightboxOpen} 
          onClose={() => setIsInternshipLightboxOpen(false)} 
        />
      </div>
    </div>
  );
}