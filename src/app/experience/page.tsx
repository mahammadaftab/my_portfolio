"use client";

import { useState, useRef } from "react";
import { motion, useInView, useTransform, useScroll } from "framer-motion";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import experienceData from "@/data/experience.json";
import CertificateLightbox from "@/components/certificate-lightbox";
import BootcampLightbox from "@/components/bootcamp-lightbox";
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
  achievement?: string;
  highlighted?: boolean;
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

interface Bootcamp {
  id: number;
  title: string;
  issuer: string;
  date: string;
  description: string | string[];
  media: Media[];
}

export default function Experience() {
  const { experiences, certificates, internships, bootcamps, hackthons } = experienceData;
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [selectedBootcamp, setSelectedBootcamp] = useState<Bootcamp | null>(null);
  const [selectedHackathon, setSelectedHackathon] = useState<Hackathon | null>(null);
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);
  const [isCertificateLightboxOpen, setIsCertificateLightboxOpen] = useState(false);
  const [isBootcampLightboxOpen, setIsBootcampLightboxOpen] = useState(false);
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
          <div className="relative mb-12 text-center">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-10 dark:opacity-20 blur-3xl rounded-full"></div>
            <div className="relative inline-block mx-auto px-8 py-4 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-blue-900/30 dark:via-purple-900/30 dark:to-pink-900/30 rounded-2xl border-2 border-blue-200 dark:border-blue-700 shadow-lg">
              <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400">
                <span className="flex items-center justify-center gap-3">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  Certifications
                </span>
              </h2>
            </div>
          </div>
          
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
          <div className="relative mb-12 text-center">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 opacity-10 dark:opacity-20 blur-3xl rounded-full"></div>
            <div className="relative inline-block mx-auto px-8 py-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-900/30 dark:via-teal-900/30 dark:to-cyan-900/30 rounded-2xl border-2 border-emerald-200 dark:border-emerald-700 shadow-lg">
              <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400">
                <span className="flex items-center justify-center gap-3">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Internships
                </span>
              </h2>
            </div>
          </div>
          
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

        {/* Bootcamps Section */}
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.5, delay: prefersReducedMotion ? 0 : 0.35 }}
          className="mb-24"
        >
          <div className="relative mb-4 text-center">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 opacity-10 dark:opacity-20 blur-3xl rounded-full"></div>
            <div className="relative inline-block mx-auto px-8 py-4 bg-gradient-to-r from-orange-50 via-amber-50 to-yellow-50 dark:from-orange-900/30 dark:via-amber-900/30 dark:to-yellow-900/30 rounded-2xl border-2 border-orange-200 dark:border-orange-700 shadow-lg">
              <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 dark:from-orange-400 dark:via-amber-400 dark:to-yellow-400">
                <span className="flex items-center justify-center gap-3">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  BootCamps
                </span>
              </h2>
            </div>
          </div>
          <h3 className="text-2xl font-semibold text-center text-blue-600 dark:text-blue-400 mb-4">
            𝟱 𝗗𝐀𝐘𝐒 | 𝗜𝗗𝗘 𝗕𝗼𝗼𝘁𝐂𝗮𝗺𝗽
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-center mb-12">
            𝗧𝗵𝗲 𝟯𝗿𝗱 𝗘𝗱𝗶𝘁𝗶𝗼𝗻 𝗼𝗳 𝘁𝗵𝗲 𝗜𝗻𝗻𝗼𝘃𝗮𝘁𝗶𝗼𝗻, 𝗗𝗲𝘀𝗶𝗴𝗻 𝗮𝗻𝗱 𝗘𝗻𝘁𝗿𝗲𝗽𝗿𝗲𝗻𝗲𝘂𝗿𝘀𝗵𝗶𝗽 (𝗜𝗗𝗘) 𝗕𝗼𝗼𝘁𝗖𝗮𝗺𝗽 (𝗣𝗵𝗮𝘀𝗲 𝟭) — organized by 𝗧𝗵𝗲 𝗠𝗶𝗻𝗶𝘀𝘁𝗲𝗿 𝗼𝗳 𝗘𝗱𝘂𝗰𝗮𝘁𝗶𝗼𝗻, 𝐀𝐥𝐥 𝐈𝐧𝐝𝐢𝐚 𝐂𝐨𝐮𝐧𝐜𝐢𝐥 𝐟𝐨𝐫 𝐓𝐞𝐜𝐡𝐧𝐢𝐜𝐚𝐥 𝐄𝐝𝐮𝐜𝐚𝐭𝐢𝐨𝐧 (𝐀𝐈𝐂𝐓𝐄), 𝐖𝐚𝐝𝐡𝐰𝐚𝐧𝐢 𝐅𝐨𝐮𝐧𝐝𝐚𝐭𝐢𝐨𝐧, and 𝐒𝐁𝐈 𝐅𝐨𝐮𝐧𝐝𝐚𝐭𝐢𝐨𝐧, hosted at 𝐉𝐚𝐰𝐚𝐡𝐚𝐫𝐥𝐚𝐥 𝐍𝐞𝐡𝐫𝐮 𝐍𝐞𝐰 𝐂𝐨𝐥𝐥𝐞𝐠𝐞 𝐨𝐟 𝐄𝐧𝐠𝐢𝐧𝐞𝐞𝐫𝐢𝐧𝐠 𝐒𝐡𝐢𝐯𝐚𝐦𝐨𝐠𝐠𝐚.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bootcamps.map((bootcamp, index) => {
              const bootcampRef = useRef(null);
              const isBootcampInView = useInView(bootcampRef, { once: true, margin: "-50px" });
              
              // Convert the bootcamp data to the proper type
              const typedBootcamp: Bootcamp = {
                id: bootcamp.id,
                title: bootcamp.title,
                issuer: bootcamp.issuer,
                date: bootcamp.date,
                description: bootcamp.description,
                media: bootcamp.media.map(media => ({
                  type: media.type as "image" | "pdf" | "video",
                  url: media.url,
                  caption: media.caption
                }))
              };
              
              return (
                <motion.div
                  key={bootcamp.id}
                  ref={bootcampRef}
                  initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 50 }}
                  animate={prefersReducedMotion ? { opacity: 1 } : { 
                    opacity: isBootcampInView ? 1 : 0, 
                    y: isBootcampInView ? 0 : 50 
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
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{bootcamp.title}</h3>
                      <p className="text-blue-600 dark:text-blue-400 font-medium">{bootcamp.issuer}</p>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                      {bootcamp.date}
                    </span>
                  </div>
                  <div className="mb-4">
                    {Array.isArray(bootcamp.description) ? (
                      <ul className="space-y-2">
                        {bootcamp.description.map((item, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-blue-600 dark:text-blue-400 mr-2 mt-1">•</span>
                            <span className="text-gray-600 dark:text-gray-400">{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-600 dark:text-gray-400">{bootcamp.description}</p>
                    )}
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedBootcamp(typedBootcamp);
                      setIsBootcampLightboxOpen(true);
                    }}
                    className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium group-hover:underline"
                    aria-label={`View ${bootcamp.title} bootcamp`}
                  >
                    View BootCamp Images
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
          <div className="relative mb-12 text-center">
            <div className="absolute inset-0 bg-gradient-to-r from-rose-600 via-pink-600 to-fuchsia-600 opacity-10 dark:opacity-20 blur-3xl rounded-full"></div>
            <div className="relative inline-block mx-auto px-8 py-4 bg-gradient-to-r from-rose-50 via-pink-50 to-fuchsia-50 dark:from-rose-900/30 dark:via-pink-900/30 dark:to-fuchsia-900/30 rounded-2xl border-2 border-rose-200 dark:border-rose-700 shadow-lg">
              <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-pink-600 to-fuchsia-600 dark:from-rose-400 dark:via-pink-400 dark:to-fuchsia-400">
                <span className="flex items-center justify-center gap-3">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Hackathons
                </span>
              </h2>
            </div>
          </div>
          
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
                achievement: hackathon.achievement,
                highlighted: hackathon.highlighted,
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
                  className={`rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-2 relative overflow-hidden ${
                    hackathon.highlighted 
                      ? 'bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 dark:from-yellow-900/20 dark:via-amber-900/20 dark:to-orange-900/20 border-2 border-yellow-400 dark:border-yellow-500' 
                      : 'bg-white dark:bg-gray-800'
                  }`}
                >
                  {hackathon.highlighted && (
                    <>
                      {/* Animated shine effect */}
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/20 to-transparent"
                        animate={{ 
                          x: ['-200%', '200%']
                        }}
                        transition={{ 
                          repeat: Infinity, 
                          duration: 3,
                          ease: "linear"
                        }}
                      />
                      
                      {/* Achievement badge */}
                      <div className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 text-white px-3 py-1 rounded-bl-xl rounded-tr-xl shadow-lg z-10">
                        <span className="text-xs font-bold flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                          </svg>
                          {hackathon.achievement}
                        </span>
                      </div>
                      
                      {/* Crown icon */}
                      <div className="absolute top-4 left-4 text-4xl animate-bounce" style={{ animationDuration: '2s' }}>
                        👑
                      </div>
                    </>
                  )}
                  
                  <div className={`flex justify-between items-start mb-4 ${hackathon.highlighted ? 'mt-8' : ''}`}>
                    <div>
                      <h3 className={`font-bold ${hackathon.highlighted ? 'text-2xl text-gray-900 dark:text-white' : 'text-xl text-gray-900 dark:text-white'}`}>
                        {hackathon.title}
                      </h3>
                      <p className={`font-medium ${hackathon.highlighted ? 'text-lg text-amber-600 dark:text-amber-400' : 'text-blue-600 dark:text-blue-400'}`}>
                        {hackathon.issuer}
                      </p>
                    </div>
                    <span className={`text-sm whitespace-nowrap px-2 py-1 rounded ${
                      hackathon.highlighted 
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    }`}>
                      {hackathon.date}
                    </span>
                  </div>
                  <p className={`mb-4 ${hackathon.highlighted ? 'text-gray-700 dark:text-gray-300 font-medium' : 'text-gray-600 dark:text-gray-400'}`}>
                    {hackathon.description}
                  </p>
                  
                  {hackathon.highlighted && (
                    <div className="mb-4 p-3 bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 rounded-lg border border-yellow-300 dark:border-yellow-600">
                      <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-300 flex items-center gap-2">
                        <span className="text-xl">🎯</span>
                        <span>Key Achievement: Ranked #2 among 50+ competing teams</span>
                      </p>
                    </div>
                  )}
                  
                  <button 
                    onClick={() => {
                      setSelectedHackathon(typedHackathon);
                      setIsHackathonLightboxOpen(true);
                    }}
                    className={`inline-flex items-center font-medium group-hover:underline ${
                      hackathon.highlighted 
                        ? 'text-amber-600 dark:text-amber-400 font-bold' 
                        : 'text-blue-600 dark:text-blue-400'
                    }`}
                    aria-label={`View ${hackathon.title} hackathon`}
                  >
                    {hackathon.highlighted ? 'View Achievement' : 'View Hackathon'}
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
        
        <BootcampLightbox 
          bootcamp={selectedBootcamp} 
          isOpen={isBootcampLightboxOpen} 
          onClose={() => setIsBootcampLightboxOpen(false)} 
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