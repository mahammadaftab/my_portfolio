"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import LottieAnimation from "@/components/lottie-animation";

export default function NotFound() {
  const prefersReducedMotion = usePrefersReducedMotion();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black flex items-center justify-center p-4">
      <div className="text-center max-w-2xl">
        <motion.h1 
          className="text-9xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
        >
          404
        </motion.h1>
        
        <motion.h2 
          className="text-3xl font-bold text-gray-900 dark:text-white mt-4 flex items-center justify-center gap-2"
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.5, delay: prefersReducedMotion ? 0 : 0.1 }}
        >
          Page Not Found
          <LottieAnimation 
            animationData={null}
            size={40}
            loop={true}
            autoplay={!prefersReducedMotion}
            ariaLabel="Warning animation"
          />
        </motion.h2>
        
        <motion.p 
          className="text-gray-600 dark:text-gray-400 mt-4 text-lg"
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.5, delay: prefersReducedMotion ? 0 : 0.2 }}
        >
          Sorry, the page you&#39;re looking for doesn&#39;t exist or has been moved.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.5, delay: prefersReducedMotion ? 0 : 0.3 }}
          className="mt-8"
        >
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow hover:shadow-lg transition-all duration-300"
          >
            <LottieAnimation 
              animationData={null}
              size={20}
              className="mr-2"
              loop={true}
              autoplay={!prefersReducedMotion}
              ariaLabel="Arrow pointing left"
            />
            Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
}