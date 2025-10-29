"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import LottieAnimation from "@/components/lottie-animation";

const skillCategories = [
  {
    id: "frontend",
    name: "Frontend",
    skills: [
      { name: "React", level: 95 },
      { name: "Next.js", level: 90 },
      { name: "TypeScript", level: 90 },
      { name: "Tailwind CSS", level: 95 },
      { name: "JavaScript", level: 95 },
      { name: "HTML/CSS", level: 98 },
    ]
  },
  {
    id: "backend",
    name: "Backend",
    skills: [
      { name: "Node.js", level: 85 },
      { name: "Express", level: 80 },
      { name: "Python", level: 75 },
      { name: "MongoDB", level: 80 },
      { name: "PostgreSQL", level: 75 },
      { name: "REST APIs", level: 90 },
    ]
  },
  {
    id: "tools",
    name: "Tools & DevOps",
    skills: [
      { name: "Git", level: 90 },
      { name: "Docker", level: 75 },
      { name: "AWS", level: 70 },
      { name: "CI/CD", level: 80 },
      { name: "Webpack", level: 85 },
      { name: "Jest", level: 85 },
    ]
  }
];

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState("frontend");
  const prefersReducedMotion = usePrefersReducedMotion();

  const activeSkills = skillCategories.find(cat => cat.id === activeCategory)?.skills || [];

  // Tech stack data
  const techStack = [
    "Java", "Python", "C", "Next.js", "TypeScript", "Javascript", "MongoDB", "Express.js", 
    "React.js", "Node.js","PostgreSQL", "Prisma", "Html/CSS", "Tailwind CSS"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black py-16">
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">My Skills</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Here&#39;s a breakdown of my technical expertise and proficiency levels.
          </p>
        </motion.div>

        {/* Category Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex rounded-md bg-white dark:bg-gray-800 p-1 shadow">
            {skillCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-3 text-sm font-medium rounded-md transition-all duration-300 flex items-center ${
                  activeCategory === category.id
                    ? "bg-blue-600 text-white shadow"
                    : "text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                }`}
              >
                {category.name}
                {activeCategory === category.id && (
                  <LottieAnimation 
                    animationData={null}
                    className="ml-2"
                    size={16}
                    loop={true}
                    autoplay={true}
                    ariaLabel="Active category indicator"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Skill Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeSkills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.5, delay: prefersReducedMotion ? 0 : index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{skill.name}</h3>
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{skill.level}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <motion.div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2.5 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: prefersReducedMotion ? '100%' : `${skill.level}%` }}
                  transition={{ duration: prefersReducedMotion ? 0 : 1, delay: prefersReducedMotion ? 0 : index * 0.1 }}
                ></motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tech Stack Icons */}
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.7, delay: prefersReducedMotion ? 0 : 0.5 }}
          className="mt-24"
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Technologies I Work With
          </h2>
          <div className="flex flex-wrap justify-center gap-6">
            {techStack.map((tech, index) => (
              <motion.div
                key={tech}
                initial={prefersReducedMotion ? { opacity: 1 } : { 
                  opacity: 0, 
                  y: 20,
                  scale: 0.9 
                }}
                animate={prefersReducedMotion ? { opacity: 1 } : { 
                  opacity: 1, 
                  y: 0,
                  scale: 1 
                }}
                transition={{ 
                  duration: 0.5, 
                  delay: prefersReducedMotion ? 0 : index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={prefersReducedMotion ? {} : { 
                  y: -10, 
                  scale: 1.05,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  transition: { duration: 0.2 }
                }}
                whileTap={prefersReducedMotion ? {} : { 
                  scale: 0.95 
                }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg flex items-center justify-center w-32 h-32 cursor-pointer"
              >
                <div className="text-center">
                  <div className="mb-2 flex justify-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {tech.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">{tech}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}