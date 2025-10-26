"use client";

import { motion } from "framer-motion";
import { Tilt } from "react-tilt";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export default function About() {
  const prefersReducedMotion = usePrefersReducedMotion();
  
  const defaultOptions = {
    reverse: false,
    max: prefersReducedMotion ? 0 : 35,
    perspective: 1000,
    scale: 1.1,
    speed: prefersReducedMotion ? 0 : 1000,
    transition: !prefersReducedMotion,
    axis: null,
    reset: !prefersReducedMotion,
    easing: "cubic-bezier(.03,.98,.52,.99)",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black py-16">
      <div className="container mx-auto px-4">
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
            <Tilt options={defaultOptions} className="w-full">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-1 shadow-xl">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
                  <div className="aspect-square rounded-xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                    <img 
                      src="/images/profile.JPG" 
                      alt="Mahammad Aftab" 
                      className="w-full h-full object-cover"
                      width={400}
                      height={400}
                    />
                  </div>
                </div>
              </div>
            </Tilt>
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
              As a Computer Science Engineering student.
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              I’m deeply passionate about leveraging technology to solve complex problems and create meaningful solutions. 
              My academic background has provided me with a strong foundation in programming, algorithms, and system design, 
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
                <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400">3 Year</h3>
                <p className="text-gray-600 dark:text-gray-400">Computer Science</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400">15+</h3>
                <p className="text-gray-600 dark:text-gray-400">Projects Completed in GitHub</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400">20+</h3>
                <p className="text-gray-600 dark:text-gray-400">Happy Clients</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400">10+</h3>
                <p className="text-gray-600 dark:text-gray-400">Certifications</p>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.7, delay: prefersReducedMotion ? 0 : 0.4 }}
          className="mt-24"
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            My Journey
          </h2>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-500 to-purple-600"></div>
            
            {/* Timeline items */}
            <div className="mb-12 flex flex-col md:flex-row justify-between items-center w-full left-timeline">
              <div className="order-1 w-full md:w-5/12"></div>
              <div className="order-1 md:order-2 z-10">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="order-2 md:order-3 w-full md:w-5/12 px-6 py-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Senior Frontend Developer</h3>
                <p className="text-blue-600 dark:text-blue-400 font-medium">Tech Corp • 2022 - Present</p>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Leading frontend development for enterprise applications using React, TypeScript, and modern CSS frameworks.
                </p>
              </div>
            </div>

            <div className="mb-12 flex flex-col md:flex-row justify-between items-center w-full right-timeline">
              <div className="order-2 md:order-1 w-full md:w-5/12 px-6 py-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Frontend Developer</h3>
                <p className="text-blue-600 dark:text-blue-400 font-medium">Digital Agency • 2020 - 2022</p>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Developed responsive web applications for clients in various industries using modern JavaScript frameworks.
                </p>
              </div>
              <div className="order-1 md:order-2 z-10">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="order-3 w-full md:w-5/12"></div>
            </div>

            <div className="mb-12 flex flex-col md:flex-row justify-between items-center w-full left-timeline">
              <div className="order-1 w-full md:w-5/12"></div>
              <div className="order-1 md:order-2 z-10">
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="order-2 md:order-3 w-full md:w-5/12 px-6 py-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Junior Developer</h3>
                <p className="text-blue-600 dark:text-blue-400 font-medium">StartUp Inc • 2019 - 2020</p>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Built and maintained web applications using HTML, CSS, and JavaScript. Collaborated with senior developers.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}