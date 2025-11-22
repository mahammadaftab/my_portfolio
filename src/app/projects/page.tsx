"use client";

import { useState, useRef } from "react";
import { motion, useTransform, useScroll } from "framer-motion";
import projectsData from "@/data/projects.json";
import ProjectModal from "@/components/project-modal";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import LottieAnimation from "@/components/lottie-animation";

// Define the project type to match our new structure
interface ProjectUrl {
  label: string;
  url: string;
}

interface ProjectMedia {
  url: string;
  label: string;
  type: "image" | "video";
}

interface Project {
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
}

// Create a function to properly type the project data
const castToProject = (project: any): Project => {
  return {
    ...project,
    images: project.images?.map((img: any) => ({
      ...img,
      type: img.type as "image" | "video"
    })) || [],
    videos: project.videos?.map((video: any) => ({
      ...video,
      type: video.type as "image" | "video"
    })) || [],
    urls: project.urls || []
  };
};

export default function Projects() {
  const [filter, setFilter] = useState("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const projectsY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  
  // Get all unique tags for filtering
  const allTags = Array.from(new Set(projectsData.flatMap(project => project.tags)));
  
  // Cast projects data to proper type
  const typedProjectsData = projectsData.map(castToProject);
  
  const filteredProjects = filter === "all" 
    ? typedProjectsData 
    : typedProjectsData.filter(project => project.tags.includes(filter));

  // Get the first image for the project card
  const getProjectImage = (project: Project) => {
    // If images array exists and has items, use the first one
    if (project.images && project.images.length > 0) {
      return project.images[0].url;
    }
    // If single image exists, use that
    if (project.image) {
      return project.image;
    }
    // Default fallback
    return "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black py-16">
      <div ref={containerRef} className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">My Projects</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Here&#39;s a selection of my recent work. Each project reflects my passion for clean code, 
            intuitive design, and solving real-world problems.
          </p>
        </motion.div>

        {/* Project Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center ${
              filter === "all"
                ? "bg-blue-600 text-white shadow"
                : "bg-white dark:bg-gray-800 text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            All Projects
            {filter === "all" && (
              <LottieAnimation 
                animationData={null}
                className="ml-2"
                size={16}
                loop={false}
                autoplay={false}
                playOnClick={true}
                ariaLabel="Checkmark animation"
              />
            )}
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setFilter(tag)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center ${
                filter === tag
                  ? "bg-blue-600 text-white shadow"
                  : "bg-white dark:bg-gray-800 text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              {tag}
              {filter === tag && (
                <LottieAnimation 
                  animationData={null}
                  className="ml-2"
                  size={16}
                  loop={false}
                  autoplay={false}
                  playOnClick={true}
                  ariaLabel="Checkmark animation"
                />
              )}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          style={{ y: projectsY }}
        >
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.5, delay: prefersReducedMotion ? 0 : index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group"
            >
              <div 
                className="relative h-48 overflow-hidden cursor-pointer"
                onClick={() => {
                  setSelectedProject(project);
                  setIsModalOpen(true);
                }}
              >
                <div className="w-full h-full flex items-center justify-center">
                  {getProjectImage(project) ? (
                    <img 
                      src={getProjectImage(project)} 
                      alt={project.title}
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
                  ) : (
                    <div className="bg-gray-200 dark:bg-gray-700 w-full h-full flex items-center justify-center">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <div className="text-white text-sm font-medium">Click to view details</div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{project.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span 
                      key={tag} 
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs font-medium rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        <ProjectModal 
          project={selectedProject} 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
      </div>
    </div>
  );
}