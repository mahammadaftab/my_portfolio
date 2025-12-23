"use client";

import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import EducationIcon3D from "@/components/education-icon-3d";

export default function About() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black py-16">
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">About Me</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Get to know me, my background, and what drives my passion for technology.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.7 }}
            className="w-full lg:w-1/2"
          >
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-1 shadow-xl">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
                <div className="aspect-square rounded-xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                  <img 
                    src="/images/profile.jpg" 
                    alt="Mahammad Aftab" 
                    className="w-full h-full object-cover"
                    width={400}
                    height={400}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.7, delay: prefersReducedMotion ? 0 : 0.2 }}
            className="w-full lg:w-1/2"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Crafting Digital Experiences
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              As a Computer Science Engineering student pursuing my Bachelor's degree.
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              I'm deeply passionate about leveraging technology to solve complex problems and create meaningful solutions. 
              My educational journey has provided me with a strong foundation in programming, algorithms, and system design, 
              along with hands-on experience in languages like C, Java, and Website Design.
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              I believe in writing clean, maintainable code and creating intuitive user 
              experiences. My approach combines technical expertise with an eye for design, 
              ensuring that the applications I build are not only functional but also 
              visually appealing and accessible.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400">3rd Year</h3>
                <p className="text-gray-600 dark:text-gray-400">Computer Science Engineering</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400">Rural Engineering College</h3>
                <p className="text-gray-600 dark:text-gray-400">Hulkoti, Gadag</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400">15+</h3>
                <p className="text-gray-600 dark:text-gray-400">Projects Completed</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400">10+</h3>
                <p className="text-gray-600 dark:text-gray-400">Certifications</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Education Section */}
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.7, delay: prefersReducedMotion ? 0 : 0.4 }}
          className="mt-24"
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            My Education
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* SSLC Education Card */}
            <motion.div
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
              animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: prefersReducedMotion ? 0 : 0.1 }}
              whileHover={prefersReducedMotion ? {} : { 
                y: -10, 
                scale: 1.03,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                transition: { duration: 0.3 }
              }}
              whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg cursor-pointer relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-4">
                  <EducationIcon3D type="book" size={40} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">SSLC (10th Grade)</h3>
                  <p className="text-sm text-blue-600 dark:text-blue-400">2021</p>
                </div>
              </div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Royal English Medium High School Gadag</h4>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Completed SSLC with a strong academic performance of 85.12%. Developed foundational skills in mathematics, science, and languages.
              </p>
              <div className="flex items-center text-sm">
                <span className="font-medium text-gray-900 dark:text-white mr-2">Percentage:</span>
                <span className="text-gray-600 dark:text-gray-400">85.12%</span>
              </div>
            </motion.div>

            {/* PUC Education Card */}
            <motion.div
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
              animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: prefersReducedMotion ? 0 : 0.2 }}
              whileHover={prefersReducedMotion ? {} : { 
                y: -10, 
                scale: 1.03,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                transition: { duration: 0.3 }
              }}
              whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg cursor-pointer relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-indigo-600"></div>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-4">
                  <EducationIcon3D type="lab" size={40} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Pre-University College</h3>
                  <p className="text-sm text-blue-600 dark:text-blue-400">2021-2023</p>
                </div>
              </div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">KLE Societies Jagadguru Tontadarya P.U College, Gadag</h4>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Completed Pre-University Course in Science stream with Physics, Chemistry, Mathematics, and Biology.
              </p>
              <div className="flex items-center text-sm">
                <span className="font-medium text-gray-900 dark:text-white mr-2">Percentage:</span>
                <span className="text-gray-600 dark:text-gray-400">70%</span>
              </div>
            </motion.div>

            {/* Engineering Education Card */}
            <motion.div
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
              animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: prefersReducedMotion ? 0 : 0.3 }}
              whileHover={prefersReducedMotion ? {} : { 
                y: -10, 
                scale: 1.03,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                transition: { duration: 0.3 }
              }}
              whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg cursor-pointer relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-blue-600"></div>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mr-4">
                  <EducationIcon3D type="workstation" size={40} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Bachelor of Engineering</h3>
                  <p className="text-sm text-blue-600 dark:text-blue-400">2023-Present</p>
                </div>
              </div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Rural Engineering College Hulkoti</h4>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Currently pursuing Computer Science Engineering with hands-on experience in programming and web development.
              </p>
              <div className="flex items-center text-sm">
                <span className="font-medium text-gray-900 dark:text-white mr-2">Year:</span>
                <span className="text-gray-600 dark:text-gray-400">3rd Year</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}