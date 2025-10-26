"use client";

import { useRef, useState, useEffect } from "react";
import Lottie from "lottie-react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface LottieAnimationProps {
  animationData: unknown;
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
  size?: number | string;
  speed?: number;
  direction?: number;
  segments?: [number, number] | null;
  onComplete?: () => void;
  onLoopComplete?: () => void;
  onEnterFrame?: () => void;
  onSegmentStart?: () => void;
  ariaLabel?: string;
  role?: string;
  playOnHover?: boolean;
  playOnClick?: boolean;
  fallbackIcon?: React.ReactNode;
}

export default function LottieAnimation({
  animationData,
  className = "",
  loop = true,
  autoplay = true,
  size = 100,
  speed = 1,
  direction = 1,
  segments = null,
  onComplete,
  onLoopComplete,
  onEnterFrame,
  onSegmentStart,
  ariaLabel = "Animation",
  role = "img",
  playOnHover = false,
  playOnClick = false,
  fallbackIcon,
}: LottieAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lottieRef = useRef<any>(null); // Using any to avoid type issues
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Handle animation events
  const handleAnimationLoad = (animation: any) => {
    lottieRef.current = animation;
    setIsLoaded(true);
    
    // Set initial speed and direction
    if (animation) {
      animation.setSpeed(speed);
      animation.setDirection(direction);
    }
  };

  // Handle hover interactions
  const handleMouseEnter = () => {
    if (playOnHover && lottieRef.current) {
      lottieRef.current.goToAndPlay(0);
    }
  };

  const handleMouseLeave = () => {
    if (playOnHover && lottieRef.current) {
      lottieRef.current.stop();
    }
  };

  // Handle click interactions
  const handleClick = () => {
    if (playOnClick && lottieRef.current) {
      lottieRef.current.goToAndPlay(0);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (lottieRef.current) {
        lottieRef.current.destroy();
        lottieRef.current = null;
      }
    };
  }, []);

  // Error handling
  if (hasError || !animationData) {
    return (
      <div 
        ref={containerRef}
        className={`flex items-center justify-center ${className}`}
        style={{ width: size, height: size }}
        aria-label={ariaLabel}
        role={role}
      >
        {fallbackIcon || (
          <svg 
            className="w-6 h-6 text-gray-400 dark:text-gray-500" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" 
            />
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
        )}
      </div>
    );
  }

  // If user prefers reduced motion, show simplified version
  if (prefersReducedMotion) {
    return (
      <div 
        ref={containerRef}
        className={`flex items-center justify-center ${className}`}
        style={{ width: size, height: size }}
        aria-label={ariaLabel}
        role={role}
      >
        {fallbackIcon || (
          <svg 
            className="w-6 h-6 text-gray-400 dark:text-gray-500" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" 
            />
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
        )}
      </div>
    );
  }

  // Loading state
  if (!isLoaded) {
    return (
      <div 
        ref={containerRef}
        className={`flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg ${className}`}
        style={{ width: size, height: size }}
        aria-label="Loading animation"
        role="status"
      >
        <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-full w-8 h-8"></div>
      </div>
    );
  }

  const lottieProps: any = {
    animationData,
    loop,
    autoplay: autoplay && !playOnHover && !playOnClick,
    ...(segments && { segments }),
    onComplete,
    onLoopComplete,
    onEnterFrame,
    onSegmentStart,
  };

  return (
    <div 
      ref={containerRef}
      className={className}
      style={{ width: size, height: size }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      aria-label={ariaLabel}
      role={role}
    >
      <Lottie
        {...lottieProps}
        lottieRef={(ref: any) => {
          if (ref) {
            handleAnimationLoad(ref);
          }
        }}
      />
    </div>
  );
}