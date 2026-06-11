"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useVelocity, useAnimationFrame } from "framer-motion";

const NUM_PARTICLES = 30;

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  // Directly follow mouse for the inner dot
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Spring physics for the outer ring
  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  // Calculate velocity for stretching effect
  const velocityX = useVelocity(cursorXSpring);
  const velocityY = useVelocity(cursorYSpring);

  const rotate = useMotionValue(0);
  const scaleX = useMotionValue(1);
  const scaleY = useMotionValue(1);

  // Particle pool for the high-performance trail
  const particlesRef = useRef<{ element: HTMLDivElement; x: number; y: number; age: number; vx: number; vy: number; active: boolean }[]>([]);

  useAnimationFrame((time, delta) => {
    const vx = velocityX.get();
    const vy = velocityY.get();
    const velocity = Math.sqrt(vx * vx + vy * vy);
    
    // Only update angle if moving fast enough to avoid jitter
    if (velocity > 20) {
      const angle = Math.atan2(vy, vx) * (180 / Math.PI);
      rotate.set(angle);
    }
    
    // Stretch based on velocity (more velocity = more stretch)
    const stretch = Math.min(velocity / 1500, 0.4); // Limit max stretch
    
    scaleX.set(1 + stretch);
    scaleY.set(1 - stretch * 0.5);

    // Particle emission logic for the trail
    if (velocity > 50 && isVisible) {
      // Find an inactive particle
      const p = particlesRef.current.find(p => !p.active);
      if (p) {
        p.active = true;
        p.age = 0;
        p.x = cursorX.get();
        p.y = cursorY.get();
        // Shoot particles slightly backwards based on velocity, with some random scatter
        p.vx = -vx * 0.005 + (Math.random() - 0.5) * 3;
        p.vy = -vy * 0.005 + (Math.random() - 0.5) * 3;
      }
    }

    // Update active particles
    particlesRef.current.forEach(p => {
      if (p.active) {
        p.age += delta;
        p.x += p.vx;
        p.y += p.vy;
        
        // Friction to slow particles down
        p.vx *= 0.95;
        p.vy *= 0.95;
        
        // Fade out and shrink over 600ms
        const lifeProgress = p.age / 600;
        if (lifeProgress >= 1) {
          p.active = false;
          p.element.style.opacity = "0";
        } else {
          const scale = 1 - lifeProgress;
          const opacity = (1 - lifeProgress) * 0.6; // Max opacity 0.6
          p.element.style.transform = `translate3d(${p.x - 4}px, ${p.y - 4}px, 0) scale(${scale})`;
          p.element.style.opacity = opacity.toString();
        }
      }
    });
  });

  useEffect(() => {
    // Disable on touch devices
    if (typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0)) {
      return; 
    }

    // Initialize particle elements directly in the DOM to avoid React re-renders for every particle update
    particlesRef.current = Array.from({ length: NUM_PARTICLES }).map(() => {
      const el = document.createElement("div");
      el.className = "fixed top-0 left-0 w-2 h-2 rounded-full bg-white mix-blend-difference pointer-events-none z-[9998]";
      el.style.opacity = "0";
      document.body.appendChild(el);
      return { element: el, x: 0, y: 0, age: 0, vx: 0, vy: 0, active: false };
    });

    setIsVisible(true);

    const moveMouse = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Define interactive elements
      if (
        target.closest("a") || 
        target.closest("button") || 
        target.closest("input") || 
        target.closest("textarea") ||
        target.closest("[role='button']") ||
        target.closest(".interactive") ||
        target.tagName.toLowerCase() === "a" ||
        target.tagName.toLowerCase() === "button"
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", moveMouse);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", moveMouse);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mouseover", handleMouseOver);
      
      // Cleanup DOM nodes
      particlesRef.current.forEach(p => {
        if (p.element.parentNode) {
          p.element.parentNode.removeChild(p.element);
        }
      });
    };
  }, [cursorX, cursorY]);

  if (!isVisible) return null;

  return (
    <>
      {/* Outer Trailing Ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          rotate,
          scaleX,
          scaleY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: isHovering ? 64 : 36,
          height: isHovering ? 64 : 36,
          backgroundColor: isHovering ? "rgba(255, 255, 255, 1)" : "rgba(255, 255, 255, 0)",
          border: isHovering ? "0px solid rgba(255, 255, 255, 0)" : "1.5px solid rgba(255, 255, 255, 1)",
          borderRadius: "50%",
        }}
        transition={{
          width: { type: "spring", stiffness: 300, damping: 25 },
          height: { type: "spring", stiffness: 300, damping: 25 },
          backgroundColor: { duration: 0.15 },
          border: { duration: 0.15 },
        }}
      >
        {/* Inner click effect for the ring */}
        <motion.div
          className="w-full h-full rounded-full bg-white opacity-0"
          animate={{
            opacity: isClicking ? 0.3 : 0,
            scale: isClicking ? 0.8 : 1,
          }}
          transition={{ duration: 0.1 }}
        />
      </motion.div>
      
      {/* Inner Dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full bg-white mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: isHovering ? 0 : 8,
          height: isHovering ? 0 : 8,
          opacity: isHovering ? 0 : 1,
          scale: isClicking ? 0.5 : 1,
        }}
        transition={{
          width: { duration: 0.15 },
          height: { duration: 0.15 },
          opacity: { duration: 0.15 },
        }}
      />
    </>
  );
}