"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState<Array<{id: number, x: number, y: number, size: number, opacity: number, color: string}>>([]);
  const cursorRef = useRef<HTMLDivElement>(null);
  const lastPosition = useRef({ x: 0, y: 0 });
  const lastTime = useRef(0);
  const trailIdCounter = useRef(0);
  const hue = useRef(0);

  useEffect(() => {
    let hideTimeoutId: NodeJS.Timeout;
    let animationFrameId: number;

    const mouseMoveHandler = (e: MouseEvent) => {
      const currentTime = Date.now();
      const deltaTime = currentTime - lastTime.current;
      
      // Increased frame rate limit for smoother movement
      if (deltaTime > 8) { // ~120fps limit (increased from 16)
        const newX = e.clientX;
        const newY = e.clientY;
        
        // Calculate velocity with enhanced sensitivity
        if (lastTime.current !== 0) {
          const deltaX = newX - lastPosition.current.x;
          const deltaY = newY - lastPosition.current.y;
          const velocityX = deltaX / (deltaTime * 0.5); // Increased velocity sensitivity
          const velocityY = deltaY / (deltaTime * 0.5);
          setVelocity({ x: velocityX, y: velocityY });
        }
        
        setPosition({ x: newX, y: newY });
        lastPosition.current = { x: newX, y: newY };
        lastTime.current = currentTime;
        
        // Show cursor when moving
        setIsVisible(true);
        
        // Update hue for colorful effects at faster rate
        hue.current = (hue.current + 5) % 360; // Increased hue change rate
        
        // Create trail elements with vibrant colors and enhanced responsiveness
        trailIdCounter.current += 1;
        const newSize = Math.min(15, Math.max(3, 5 + Math.abs(velocity.x) + Math.abs(velocity.y) * 2)); // Enhanced size sensitivity
        const newOpacity = Math.min(0.95, 0.3 + (Math.abs(velocity.x) + Math.abs(velocity.y)) * 0.12); // Increased opacity sensitivity
        const newColor = `hsl(${(hue.current + Math.random() * 90) % 360}, 85%, 65%)`; // More vibrant colors
        
        const newTrailPoint = {
          id: trailIdCounter.current,
          x: newX,
          y: newY,
          size: newSize,
          opacity: newOpacity,
          color: newColor
        };
        
        setTrail(prev => [...prev.slice(-30), newTrailPoint]); // Increased trail length
        
        // Remove trail point after shorter delay for more responsive feel
        setTimeout(() => {
          setTrail(prev => prev.filter(p => p.id !== newTrailPoint.id));
        }, 600); // Reduced from 800ms
        
        // Reset hide timeout
        clearTimeout(hideTimeoutId);
        hideTimeoutId = setTimeout(() => setIsVisible(false), 1500); // Reduced from 2000ms
      }
      
      // Use requestAnimationFrame for even smoother updates
      animationFrameId = requestAnimationFrame(() => {
        // This ensures the cursor updates at the browser's refresh rate
      });
    };

    const mouseEnterHandler = () => setIsHovering(true);
    const mouseLeaveHandler = () => setIsHovering(false);

    // Add event listeners to interactive elements
    const interactiveElements = document.querySelectorAll(
      "button, a, input, textarea, .interactive"
    );
    
    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", mouseEnterHandler);
      el.addEventListener("mouseleave", mouseLeaveHandler);
    });

    window.addEventListener("mousemove", mouseMoveHandler);
    window.addEventListener("mouseenter", () => setIsVisible(true));
    window.addEventListener("mouseleave", () => setIsVisible(false));

    // Initial hide timeout
    hideTimeoutId = setTimeout(() => setIsVisible(false), 1500);

    return () => {
      window.removeEventListener("mousemove", mouseMoveHandler);
      window.removeEventListener("mouseenter", () => setIsVisible(true));
      window.removeEventListener("mouseleave", () => setIsVisible(false));
      
      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", mouseEnterHandler);
        el.removeEventListener("mouseleave", mouseLeaveHandler);
      });
      
      clearTimeout(hideTimeoutId);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Don't show custom cursor on touch devices
  useEffect(() => {
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
      setTimeout(() => setIsVisible(false), 0);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Colorful velocity-based trail */}
      {trail.map((point, index) => (
        <motion.div
          key={point.id}
          className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999]"
          style={{
            x: point.x - point.size / 2,
            y: point.y - point.size / 2,
            width: point.size,
            height: point.size,
            background: `radial-gradient(circle, ${point.color} 0%, ${isHovering ? 'rgba(147,51,234,0.7)' : 'rgba(59,130,246,0.7)'} 70%, transparent 100%)`,
            boxShadow: `0 0 18px ${point.color}, 0 0 35px ${isHovering ? 'rgba(147,51,234,0.8)' : 'rgba(59,130,246,0.8)'}`,
            opacity: point.opacity
          }}
          initial={{ scale: 0 }}
          animate={{ 
            scale: [0, 1.2, 0.7],
            opacity: [point.opacity, point.opacity, 0],
            rotate: [0, Math.random() * 420]
          }}
          transition={{ 
            duration: 0.6, // Reduced duration for more responsive feel
            ease: "easeOut" 
          }}
        />
      ))}
      
      {/* Main cursor indicator with gradient ring */}
      <motion.div
        ref={cursorRef}
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9998]"
        style={{
          x: position.x - 15,
          y: position.y - 15,
          width: 20,
          height: 20,
          background: isHovering 
            ? "radial-gradient(circle, rgba(147,51,234,0.5) 0%, transparent 70%)" 
            : "radial-gradient(circle, rgba(59,130,246,0.5) 0%, transparent 70%)",
          border: isHovering 
            ? "2px solid rgba(147,51,234,0.9)" 
            : "2px solid rgba(59,130,246,0.9)",
          opacity: 0.9,
          boxShadow: isHovering 
            ? "0 0 25px rgba(147,51,234,0.7)" 
            : "0 0 25px rgba(59,130,246,0.7)"
        }}
        animate={{
          scale: isHovering ? 1.4 : 1 + Math.abs(velocity.x) * 0.5, // Increased scale sensitivity
          opacity: isHovering ? 1 : 0.8 + Math.abs(velocity.x) * 0.3, // Increased opacity sensitivity
          rotate: 360
        }}
        transition={{ 
          type: "spring", 
          stiffness: 1000, // Increased stiffness for faster response
          damping: 20, // Reduced damping for more responsive movement
          rotate: { 
            duration: 8, // Faster rotation
            repeat: Infinity, 
            ease: "linear" 
          }
        }}
      >
        {/* Inner colorful dot */}
        <div 
          className="absolute top-1/2 left-1/2 rounded-full transform -translate-x-1/2 -translate-y-1/2"
          style={{
            width: isHovering ? 14 : 10,
            height: isHovering ? 14 : 10,
            background: `conic-gradient(from ${hue.current}deg, #3b82f6, #8b5cf6, #ec4899, #f59e0b, #3b82f6)`,
            boxShadow: "0 0 12px rgba(255,255,255,0.9)"
          }}
        />
      </motion.div>
      
      {/* Directional energy effect with rainbow trail */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9997]"
        style={{
          x: position.x - 20 - velocity.x * 6,
          y: position.y - 20 - velocity.y * 6,
          width: 30,
          height: 30,
          background: `conic-gradient(from ${hue.current}deg, rgba(59,130,246,0.4), rgba(139,92,246,0.4), rgba(236,72,153,0.4), rgba(245,158,11,0.4), rgba(59,130,246,0.4))`,
          opacity: 0.6,
          filter: "blur(6px)"
        }}
        animate={{
          x: position.x - 20 - velocity.x * 8,
          y: position.y - 20 - velocity.y * 8,
          scale: 1.8 + Math.abs(velocity.x + velocity.y) * 0.6, // Increased scale sensitivity
          opacity: Math.min(0.9, 0.4 + (Math.abs(velocity.x) + Math.abs(velocity.y)) * 0.15), // Increased opacity sensitivity
          rotate: hue.current
        }}
        transition={{ 
          type: "spring", 
          stiffness: 1200, // Increased stiffness for faster response
          damping: 25 // Reduced damping for more responsive movement
        }}
      />
    </>
  );
}