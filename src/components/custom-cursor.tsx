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

    const mouseMoveHandler = (e: MouseEvent) => {
      const currentTime = Date.now();
      const deltaTime = currentTime - lastTime.current;
      
      if (deltaTime > 16) { // ~60fps limit
        const newX = e.clientX;
        const newY = e.clientY;
        
        // Calculate velocity
        if (lastTime.current !== 0) {
          const deltaX = newX - lastPosition.current.x;
          const deltaY = newY - lastPosition.current.y;
          const velocityX = deltaX / deltaTime;
          const velocityY = deltaY / deltaTime;
          setVelocity({ x: velocityX, y: velocityY });
        }
        
        setPosition({ x: newX, y: newY });
        lastPosition.current = { x: newX, y: newY };
        lastTime.current = currentTime;
        
        // Show cursor when moving
        setIsVisible(true);
        
        // Update hue for colorful effects
        hue.current = (hue.current + 2) % 360;
        
        // Create trail elements with vibrant colors
        trailIdCounter.current += 1;
        const newSize = Math.min(12, Math.max(4, 6 + Math.abs(velocity.x) + Math.abs(velocity.y)));
        const newOpacity = Math.min(0.9, 0.4 + (Math.abs(velocity.x) + Math.abs(velocity.y)) * 0.08);
        const newColor = `hsl(${(hue.current + Math.random() * 60) % 360}, 80%, 60%)`;
        
        const newTrailPoint = {
          id: trailIdCounter.current,
          x: newX,
          y: newY,
          size: newSize,
          opacity: newOpacity,
          color: newColor
        };
        
        setTrail(prev => [...prev.slice(-25), newTrailPoint]);
        
        // Remove trail point after delay
        setTimeout(() => {
          setTrail(prev => prev.filter(p => p.id !== newTrailPoint.id));
        }, 800);
        
        // Reset hide timeout
        clearTimeout(hideTimeoutId);
        hideTimeoutId = setTimeout(() => setIsVisible(false), 2000);
      }
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
    hideTimeoutId = setTimeout(() => setIsVisible(false), 2000);

    return () => {
      window.removeEventListener("mousemove", mouseMoveHandler);
      window.removeEventListener("mouseenter", () => setIsVisible(true));
      window.removeEventListener("mouseleave", () => setIsVisible(false));
      
      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", mouseEnterHandler);
        el.removeEventListener("mouseleave", mouseLeaveHandler);
      });
      
      clearTimeout(hideTimeoutId);
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
            background: `radial-gradient(circle, ${point.color} 0%, ${isHovering ? 'rgba(147,51,234,0.6)' : 'rgba(59,130,246,0.6)'} 70%, transparent 100%)`,
            boxShadow: `0 0 15px ${point.color}, 0 0 30px ${isHovering ? 'rgba(147,51,234,0.7)' : 'rgba(59,130,246,0.7)'}`,
            opacity: point.opacity
          }}
          initial={{ scale: 0 }}
          animate={{ 
            scale: [0, 1, 0.8],
            opacity: [point.opacity, point.opacity, 0],
            rotate: [0, Math.random() * 360]
          }}
          transition={{ 
            duration: 0.8, 
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
            ? "radial-gradient(circle, rgba(147,51,234,0.4) 0%, transparent 70%)" 
            : "radial-gradient(circle, rgba(59,130,246,0.4) 0%, transparent 70%)",
          border: isHovering 
            ? "2px solid rgba(147,51,234,0.8)" 
            : "2px solid rgba(59,130,246,0.8)",
          opacity: 0.8,
          boxShadow: isHovering 
            ? "0 0 20px rgba(147,51,234,0.6)" 
            : "0 0 20px rgba(59,130,246,0.6)"
        }}
        animate={{
          scale: isHovering ? 1.2 : 1 + Math.abs(velocity.x) * 0.3,
          opacity: isHovering ? 1 : 0.7 + Math.abs(velocity.x) * 0.2,
          rotate: 360
        }}
        transition={{ 
          type: "spring", 
          stiffness: 500, 
          damping: 28,
          rotate: { 
            duration: 10, 
            repeat: Infinity, 
            ease: "linear" 
          }
        }}
      >
        {/* Inner colorful dot */}
        <div 
          className="absolute top-1/2 left-1/2 rounded-full transform -translate-x-1/2 -translate-y-1/2"
          style={{
            width: isHovering ? 12 : 8,
            height: isHovering ? 12 : 8,
            background: `conic-gradient(from ${hue.current}deg, #3b82f6, #8b5cf6, #ec4899, #f59e0b, #3b82f6)`,
            boxShadow: "0 0 10px rgba(255,255,255,0.8)"
          }}
        />
      </motion.div>
      
      {/* Directional energy effect with rainbow trail */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9997]"
        style={{
          x: position.x - 20 - velocity.x * 4,
          y: position.y - 20 - velocity.y * 4,
          width: 30,
          height: 30,
          background: `conic-gradient(from ${hue.current}deg, rgba(59,130,246,0.3), rgba(139,92,246,0.3), rgba(236,72,153,0.3), rgba(245,158,11,0.3), rgba(59,130,246,0.3))`,
          opacity: 0.5,
          filter: "blur(8px)"
        }}
        animate={{
          x: position.x - 20 - velocity.x * 6,
          y: position.y - 20 - velocity.y * 6,
          scale: 1.5 + Math.abs(velocity.x + velocity.y) * 0.4,
          opacity: Math.min(0.8, 0.3 + (Math.abs(velocity.x) + Math.abs(velocity.y)) * 0.1),
          rotate: hue.current
        }}
        transition={{ 
          type: "spring", 
          stiffness: 800, 
          damping: 30 
        }}
      />
    </>
  );
}