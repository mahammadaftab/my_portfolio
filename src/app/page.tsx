"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useTransform, useScroll } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import ThreeScene from "@/components/three-scene";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars, Float, Sparkles, Icosahedron } from "@react-three/drei";
import { Physics, useSphere, useBox } from "@react-three/cannon";
import * as THREE from "three";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import LottieAnimation from "@/components/lottie-animation";

// --- Physics Components ---

// Invisible sphere that tracks the mouse and repels physical objects
const MouseCollider = () => {
  const { viewport } = useThree();
  const [ref, api] = useSphere(() => ({
    type: "Kinematic",
    args: [6], // Size of the invisible cursor collider
    position: [0, 0, 0]
  }));

  useFrame((state) => {
    // Map normalized device coordinates (-1 to +1) to 3D world units
    const x = (state.pointer.x * viewport.width) / 2;
    const y = (state.pointer.y * viewport.height) / 2;
    
    // The collider stays at z=0 to interact with foreground objects
    api.position.set(x, y, 0);
  });

  return (
    <mesh ref={ref as any}>
      <sphereGeometry args={[6, 16, 16]} />
      <meshBasicMaterial visible={false} />
    </mesh>
  );
};

// A floating physical asteroid/crystal that bounces off the cursor
const FloatingObject = ({ position, scale }: { position: [number, number, number], scale: number }) => {
  const [ref] = useBox(() => ({
    mass: 1,
    position,
    args: [scale, scale, scale],
    angularDamping: 0.1, // Slows down spinning slightly
    linearDamping: 0.1,  // Slows down movement slightly to prevent endless floating away
  }));

  return (
    <mesh ref={ref as any}>
      <icosahedronGeometry args={[scale, 0]} />
      <meshStandardMaterial 
        color="#8b5cf6" 
        emissive="#3b82f6" 
        emissiveIntensity={0.2}
        roughness={0.2} 
        metalness={0.8}
        wireframe={Math.random() > 0.7} // Some are wireframes for a techy look
      />
    </mesh>
  );
};

const AntigravityField = () => {
  return (
    // Gravity is [0,0,0] for the anti-gravity float effect
    <Physics gravity={[0, 0, 0]} broadphase="SAP">
      <MouseCollider />
      {/* Spawn floating elements */}
      {Array.from({ length: 30 }).map((_, i) => (
        <FloatingObject
          key={i}
          position={[
            (Math.random() - 0.5) * 60, // Spread across X
            (Math.random() - 0.5) * 40, // Spread across Y
            (Math.random() - 0.5) * 10  // Keep them near Z=0 for collisions
          ]}
          scale={Math.random() * 1.5 + 0.5}
        />
      ))}
    </Physics>
  );
};

// --- End Physics Components ---

// 3D Planet Component
const Planet = ({ position, color, size, hasRings = false, rotationSpeed = 0.005 }: any) => {
  const planetRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (planetRef.current) planetRef.current.rotation.y += rotationSpeed;
    if (ringRef.current) ringRef.current.rotation.z -= rotationSpeed * 0.5;
  });

  return (
    <group position={position} ref={planetRef}>
      {/* Solid Planet Core */}
      <mesh>
        <sphereGeometry args={[size, 64, 64]} />
        <meshStandardMaterial 
          color={color} 
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>
      
      {/* Atmospheric Glow */}
      <mesh>
        <sphereGeometry args={[size * 1.05, 64, 64]} />
        <meshBasicMaterial 
          color={color} 
          transparent={true} 
          opacity={0.15} 
          side={THREE.BackSide} 
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Optional Planetary Rings */}
      {hasRings && (
        <mesh ref={ringRef} rotation={[Math.PI / 2.5, 0, 0]}>
          <ringGeometry args={[size * 1.4, size * 2.2, 128]} />
          <meshStandardMaterial 
            color={color} 
            transparent={true} 
            opacity={0.8} 
            side={THREE.DoubleSide}
            roughness={0.5}
          />
        </mesh>
      )}
    </group>
  );
};

// 3D Alien Spaceship Component
const AlienSpaceship = () => {
  const shipRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (shipRef.current) {
      const t = state.clock.elapsedTime;
      
      // 25-second cycle for a majestic, single-direction flyby
      const cycle = 25;
      const progress = (t % cycle) / cycle; // Loops from 0.0 to 1.0
      
      // Fly from the front-right (big) deep into the back-left (small)
      // X: 400 (far right) to -400 (far left)
      const x = 400 - (progress * 800); 
      // Y: Bobbing up and down, slowly gaining altitude
      const y = 20 + Math.sin(t * 2) * 5 + (progress * 30); 
      // Z: 100 (close to camera) to -600 (very far away in the background)
      const z = 100 - (progress * 700); 
      
      shipRef.current.position.set(x, y, z);
      
      // Fixed cinematic banking for the diagonal trajectory
      shipRef.current.rotation.x = 0.2; // Pitch forward to indicate momentum
      shipRef.current.rotation.z = 0.15; // Bank slightly towards the camera
      
      // Spin the saucer engine core extremely fast
      shipRef.current.rotation.y += 0.15;
    }
  });

  return (
    <group ref={shipRef} scale={1.0}>
      {/* Metallic Saucer Body */}
      <mesh>
        <cylinderGeometry args={[12, 12, 1.5, 64]} />
        <meshStandardMaterial color="#888888" metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Upper Glass Dome (Cockpit) */}
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[6, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial 
          color="#00ffff" 
          transparent={true} 
          opacity={0.7} 
          emissive="#00ffff" 
          emissiveIntensity={0.4}
          roughness={0}
          metalness={0.1}
        />
      </mesh>
      
      {/* Lower Engine Glow */}
      <mesh position={[0, -0.75, 0]}>
        <sphereGeometry args={[4, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
        <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={2} />
      </mesh>
      
      {/* Outer Glowing Light Ring */}
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[12.5, 0.4, 16, 64]} />
        <meshBasicMaterial color="#00ffcc" />
      </mesh>
      
      {/* Dynamic Lighting from the UFO */}
      <pointLight color="#00ffcc" intensity={300} distance={100} />
      <pointLight color="#ff00ff" position={[0, -5, 0]} intensity={500} distance={150} />
    </group>
  );
};

// Enhanced Space Galaxy Background
function SpaceGalaxy() {
  const galaxyRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (galaxyRef.current) {
      // Very slow global rotation
      galaxyRef.current.rotation.y = state.clock.elapsedTime * 0.01;
      galaxyRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.05) * 0.05;
    }
  });
  
  return (
    <group ref={galaxyRef}>
      {/* Dense, realistic background stars */}
      <Stars 
        radius={300} 
        depth={150} 
        count={15000} 
        factor={7} 
        saturation={0.5} 
        fade 
        speed={1} 
      />
      
      {/* Sparkling magic dust/mini-stars in the foreground */}
      <Sparkles count={2000} scale={200} size={3} speed={0.4} opacity={0.3} color="#ffffff" />

      {/* Animated UFO / Spaceship flying through the stars */}
      <AlienSpaceship />
    </group>
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
  }, [text, isDeleting, loopNum, typingSpeed]);

  return (
    <div className="flex-1 bg-black relative overflow-hidden flex flex-col">
      {/* High Quality Space Background Image */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/images/space-bg-wide.png"
          alt="Space Galaxy Background with Astronaut"
          fill
          priority
          className="object-cover object-bottom"
          quality={100}
        />
        {/* Subtle overlay so text remains perfectly readable without a box */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent pointer-events-none" />
      </div>

      {/* Advanced 3D Space Galaxy Background */}
      <div className="fixed inset-0 z-[1] pointer-events-none sm:pointer-events-auto">
        <Canvas camera={{ position: [0, 0, 100], fov: 60 }}>
          {/* Base ambient light for the scene */}
          <ambientLight intensity={0.2} />
          
          {/* Main directional "sun" light */}
          <directionalLight position={[200, 100, 50]} intensity={2.5} color="#ffffff" />
          
          {/* Subtle fill lights to illuminate the dark side of planets */}
          <pointLight position={[-100, -100, -100]} intensity={1} color="#4b0082" />
          <pointLight position={[100, -100, 100]} intensity={0.5} color="#191970" />
          
          <SpaceGalaxy />
        </Canvas>
      </div>
      
      {/* Hero Section */}
      {/* Hero Section */}
      <div ref={containerRef} className="container mx-auto px-4 relative z-10 flex-1 flex flex-col justify-center">
        <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-12">
          {/* 3D Scene (Foreground Element) */}
          <motion.div 
            className="w-full lg:w-1/2 flex justify-center"
            initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.8 }}
            style={{ y: prefersReducedMotion ? 0 : threeSceneY }}
          >
            <div className="relative w-48 h-48 md:w-64 md:h-64 lg:w-72 lg:h-72 rounded-full overflow-hidden border-4 border-white/20 shadow-[0_0_50px_rgba(138,43,226,0.3)] backdrop-blur-sm">
              <ThreeScene />
            </div>
          </motion.div>
          
          {/* Hero Text */}
          <motion.div 
            className="w-full lg:w-1/2 text-center lg:text-left z-20"
            initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.8, delay: prefersReducedMotion ? 0 : 0.2, ease: "easeOut" }}
            style={{ y: prefersReducedMotion ? 0 : heroTextY }}
          >
            {/* Elegant intro badge */}
            <motion.div 
              className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 rounded-full border border-white/30 bg-white/10 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.8)]"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_10px_rgba(74,222,128,1)]" />
              <span className="text-xs md:text-sm font-bold tracking-wide text-white drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">Available for new opportunities</span>
            </motion.div>

            {/* Massive modern typography for the name */}
            <h1 className="text-4xl md:text-6xl lg:text-[4.5rem] font-black tracking-tighter text-white leading-none mb-3 drop-shadow-[0_0_30px_rgba(0,0,0,1)]">
              <span className="block text-lg md:text-xl font-bold tracking-normal text-white mb-1 drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">Hi, I&#39;m</span>
              <span className="bg-gradient-to-r from-blue-300 via-purple-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(168,85,247,0.8)]">
                Mahammad Aftab
              </span>
            </h1>

            {/* Highly stylized typing effect */}
            <div className="h-8 mt-1 mb-5">
              <h2 className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-400 tracking-tight drop-shadow-[0_0_20px_rgba(0,0,0,1)]">
                <span className="inline-block text-left">
                  {text}
                  <motion.span 
                    className="ml-1 inline-block h-[0.8em] w-[3px] bg-purple-400 translate-y-1 shadow-[0_0_15px_rgba(192,132,252,1)]"
                    animate={{ opacity: [1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.9, ease: "circInOut" }}
                  />
                </span>
              </h2>
            </div>

            {/* Professional, elegant paragraph */}
            <p className="text-sm md:text-base text-white max-w-xl leading-relaxed font-medium mb-8 mx-auto lg:mx-0 drop-shadow-[0_0_15px_rgba(0,0,0,1)]">
              I build exceptional digital experiences that are fast, accessible, visually appealing, and responsive. 
              <span className="block mt-1 text-white font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">Even if you don&#39;t hire me, these qualities should be baseline for whatever you build.</span>
            </p>

            {/* Advanced Level Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/projects"
                className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-black text-sm font-semibold rounded-full overflow-hidden transition-transform active:scale-95"
              >
                {/* Button hover sweep effect */}
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-gray-200 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                <span className="relative z-10">View Projects</span>
                <LottieAnimation 
                  animationData={null}
                  className="relative z-10 transition-transform duration-300 group-hover:translate-x-1"
                  size={18}
                  loop={true}
                  autoplay={true}
                  playOnHover={true}
                  ariaLabel="Arrow pointing right"
                />
              </Link>

              <Link
                href="/contact"
                className="group inline-flex items-center justify-center gap-2 px-6 py-3 bg-transparent text-white text-sm font-semibold rounded-full border border-white/20 hover:border-white/60 hover:bg-white/5 backdrop-blur-sm transition-all duration-300 active:scale-95"
              >
                Contact Me
                <span className="opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                  👋
                </span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}