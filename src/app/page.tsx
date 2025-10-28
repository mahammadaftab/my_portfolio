"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useTransform, useScroll } from "framer-motion";
import Link from "next/link";
import ThreeScene from "@/components/three-scene";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import LottieAnimation from "@/components/lottie-animation";

export default function Home() {
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const threeSceneY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const heroTextY = useTransform(scrollYProgress, [0, 1], [0, 50]);

  const roles = ["Software Engineer", "Full Stack Developer", "UI/UX Designer", "Problem Solver"];

  useEffect(() => {
    const handleType = () => {
      const i = loopNum % roles.length;
      const fullText = roles[i];

      setText(
        isDeleting
          ? fullText.substring(0, text.length - 1)
          : fullText.substring(0, text.length + 1)
      );

      setTypingSpeed(isDeleting ? 30 : 150);

      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), 500);
      } else if (isDeleting && text === "") {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, typingSpeed]); // roles is intentionally omitted as it's static

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
      {/* Hero Section */}
      <div ref={containerRef} className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* 3D Scene */}
          <motion.div 
            className="w-full lg:w-1/2 flex justify-center"
            initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.8 }}
            style={{ y: prefersReducedMotion ? 0 : threeSceneY }}
          >
            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-2xl">
              <ThreeScene />
            </div>
          </motion.div>
          
          {/* Hero Text */}
          <motion.div 
            className="w-full lg:w-1/2 text-center lg:text-left"
            initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.8, delay: prefersReducedMotion ? 0 : 0.2 }}
            style={{ y: prefersReducedMotion ? 0 : heroTextY }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white">
              Hi, I&#39;m <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Mahammad Aftab</span>
            </h1>
            <div className="mt-6">
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 dark:text-gray-300">
                <span className="inline-block min-w-[280px] text-left">
                  {text}
                  <motion.span 
                    className="ml-1 inline-block h-8 w-1 bg-blue-600"
                    animate={{ opacity: [1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                  />
                </span>
              </h2>
            </div>
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
              I build exceptional digital experiences that are fast, accessible, visually appealing, and responsive. 
              Even if you don&#39;t hire me, these qualities should be baseline for whatever you build.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/projects"
                className="rounded-md bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all duration-300 transform hover:-translate-y-1 flex items-center"
              >
                View Projects
                <LottieAnimation 
                  animationData={null}
                  className="ml-2"
                  size={20}
                  loop={true}
                  autoplay={true}
                  playOnHover={true}
                  ariaLabel="Arrow pointing right"
                />
              </Link>
              <Link
                href="/contact"
                className="rounded-md bg-white dark:bg-gray-800 px-6 py-3 text-base font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all duration-300 flex items-center"
              >
                Contact Me
                <LottieAnimation 
                  animationData={null}
                  className="ml-2"
                  size={20}
                  loop={true}
                  autoplay={true}
                  playOnHover={true}
                  ariaLabel="Arrow pointing right"
                />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        <div className="flex flex-col items-center">
          <span className="text-sm text-gray-500 dark:text-gray-400 mb-2">click above Navigation to explore</span>
          <div className="w-12 h-8 rounded-full border-2 border-gray-300 dark:border-gray-700 flex items-center pb-8">
            <motion.div 
              className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"
              animate={{ x: [0, 20, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}