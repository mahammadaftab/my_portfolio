"use client";

import { useRef } from "react";
import Lottie from "lottie-react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface LottieAnimationProps {
  animationData: unknown;
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
  size?: number;
}

export default function LottieAnimation({
  animationData,
  className = "",
  loop = true,
  autoplay = true,
  size = 100,
}: LottieAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  // If user prefers reduced motion, don't show the animation
  if (prefersReducedMotion) {
    return (
      <div 
        ref={containerRef}
        className={`flex items-center justify-center ${className}`}
        style={{ width: size, height: size }}
      >
        <div className="bg-gray-200 dark:bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center">
          <div className="bg-gray-400 dark:bg-gray-500 rounded-full w-4 h-4"></div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={className}
      style={{ width: size, height: size }}
    >
      <Lottie
        animationData={animationData}
        loop={loop}
        autoplay={autoplay}
      />
    </div>
  );
}