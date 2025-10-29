"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useTransform, useScroll } from "framer-motion";
import Link from "next/link";
import ThreeScene from "@/components/three-scene";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import LottieAnimation from "@/components/lottie-animation";

// Enhanced Space Galaxy Background with multiple layers
function SpaceGalaxy() {
  const galaxyRef = useRef<THREE.Group>(null);
  const nebulaRef = useRef<THREE.Group>(null);
  const starsRef = useRef<THREE.Group>(null);
  
  // Create multiple star layers for depth
  const [distantStars] = useState(() => {
    const points = [];
    for (let i = 0; i < 5000; i++) {
      points.push(
        (Math.random() - 0.5) * 2000,
        (Math.random() - 0.5) * 2000,
        (Math.random() - 0.5) * 2000
      );
    }
    return new Float32Array(points);
  });
  
  const [mediumStars] = useState(() => {
    const points = [];
    for (let i = 0; i < 3000; i++) {
      points.push(
        (Math.random() - 0.5) * 1000,
        (Math.random() - 0.5) * 1000,
        (Math.random() - 0.5) * 1000
      );
    }
    return new Float32Array(points);
  });
  
  const [nearStars] = useState(() => {
    const points = [];
    for (let i = 0; i < 2000; i++) {
      points.push(
        (Math.random() - 0.5) * 500,
        (Math.random() - 0.5) * 500,
        (Math.random() - 0.5) * 500
      );
    }
    return new Float32Array(points);
  });
  
  useFrame((state) => {
    if (galaxyRef.current) {
      // Slow galaxy rotation
      galaxyRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
    
    if (nebulaRef.current) {
      // Nebula pulsing effect
      nebulaRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.1) * 0.01;
    }
    
    if (starsRef.current) {
      // Subtle starfield movement
      starsRef.current.rotation.y = state.clock.elapsedTime * 0.005;
    }
  });
  
  return (
    <>
      {/* Distant star layer */}
      <group ref={starsRef}>
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={distantStars.length / 3}
              array={distantStars}
              itemSize={3}
              args={[distantStars, 3]}
            />
          </bufferGeometry>
          <PointMaterial
            color="#ffffff"
            size={1}
            sizeAttenuation={true}
            transparent={true}
            opacity={0.8}
          />
        </points>
        
        {/* Medium star layer */}
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={mediumStars.length / 3}
              array={mediumStars}
              itemSize={3}
              args={[mediumStars, 3]}
            />
          </bufferGeometry>
          <PointMaterial
            color="#ffffff"
            size={1.5}
            sizeAttenuation={true}
            transparent={true}
            opacity={0.9}
          />
        </points>
        
        {/* Near star layer */}
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={nearStars.length / 3}
              array={nearStars}
              itemSize={3}
              args={[nearStars, 3]}
            />
          </bufferGeometry>
          <PointMaterial
            color="#ffffff"
            size={2}
            sizeAttenuation={true}
            transparent={true}
            opacity={1}
          />
        </points>
      </group>
      
      {/* Colorful nebula clouds with pulsing effect */}
      <group ref={nebulaRef}>
        <mesh position={[30, 20, -80]} rotation={[0, 0, 0.3]}>
          <sphereGeometry args={[60, 64, 64]} />
          <meshBasicMaterial 
            color="#4b0082" 
            transparent 
            opacity={0.05} 
            side={THREE.BackSide}
          />
        </mesh>
        
        <mesh position={[-40, -25, -100]} rotation={[0.5, 0, 0]}>
          <sphereGeometry args={[50, 64, 64]} />
          <meshBasicMaterial 
            color="#8b008b" 
            transparent 
            opacity={0.07} 
            side={THREE.BackSide}
          />
        </mesh>
        
        <mesh position={[0, 40, -120]} rotation={[0, 0.7, 0]}>
          <sphereGeometry args={[45, 64, 64]} />
          <meshBasicMaterial 
            color="#191970" 
            transparent 
            opacity={0.06} 
            side={THREE.BackSide}
          />
        </mesh>
        
        <mesh position={[50, -30, -60]} rotation={[0.2, 0.5, 0.1]}>
          <sphereGeometry args={[35, 64, 64]} />
          <meshBasicMaterial 
            color="#ff4500" 
            transparent 
            opacity={0.04} 
            side={THREE.BackSide}
          />
        </mesh>
      </group>
      
      {/* Additional star layers for extra depth */}
      <Stars 
        radius={400} 
        depth={200} 
        count={20000} 
        factor={15} 
        saturation={0} 
        fade 
        speed={0.2} 
      />
    </>
  );
}

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
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* 3D Space Galaxy Background */}
      <div className="fixed inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 100], fov: 60 }}>
          <SpaceGalaxy />
          <ambientLight intensity={0.05} />
          <pointLight position={[100, 100, 100]} intensity={0.3} color="#4b0082" />
          <pointLight position={[-100, -100, -100]} intensity={0.3} color="#191970" />
        </Canvas>
      </div>
      
      {/* Hero Section */}
      <div ref={containerRef} className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* 3D Scene */}
          <motion.div 
            className="w-full lg:w-1/2 flex justify-center"
            initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.8 }}
            style={{ y: prefersReducedMotion ? 0 : threeSceneY }}
          >
            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl backdrop-blur-sm">
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
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white">
              Hi, I&#39;m <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Mahammad Aftab</span>
            </h1>
            <div className="mt-6">
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-200">
                <span className="inline-block min-w-[280px] text-left">
                  {text}
                  <motion.span 
                    className="ml-1 inline-block h-8 w-1 bg-blue-400"
                    animate={{ opacity: [1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                  />
                </span>
              </h2>
            </div>
            <p className="mt-6 text-lg text-gray-300 max-w-2xl">
              I build exceptional digital experiences that are fast, accessible, visually appealing, and responsive. 
              Even if you don&#39;t hire me, these qualities should be baseline for whatever you build.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/projects"
                className="rounded-md bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-base font-semibold text-white shadow-lg hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all duration-300 transform hover:-translate-y-1 flex items-center"
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
                className="rounded-md bg-white/10 backdrop-blur-sm px-6 py-3 text-base font-semibold text-white shadow-lg ring-1 ring-inset ring-white/20 hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all duration-300 flex items-center"
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
    </div>
  );
}