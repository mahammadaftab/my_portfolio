"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";

// Advanced realistic astronaut model with increased breadth movement
function RealisticAstronaut() {
  const groupRef = useRef<THREE.Group>(null);
  const helmetRef = useRef<THREE.Mesh>(null);
  const bodyRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      // Traveling motion - increased breadth (left to right and back)
      const time = state.clock.elapsedTime;
      const cycleTime = time % 20; // 20 second cycle
      
      // X-axis movement - increased breadth (-15 to +15 units for wider movement)
      if (cycleTime < 10) {
        // Moving from left to right (0-10 seconds)
        groupRef.current.position.x = -15 + (cycleTime / 10) * 30;
      } else {
        // Moving from right to left (10-20 seconds)
        groupRef.current.position.x = 15 - ((cycleTime - 10) / 10) * 30;
      }
      
      // Y-axis floating motion
      groupRef.current.position.y = Math.sin(time * 0.8) * 0.5;
      
      // Z-axis subtle movement
      groupRef.current.position.z = Math.cos(time * 0.6) * 0.3;
      
      // Rotational movements
      groupRef.current.rotation.y = time * 0.3;
      groupRef.current.rotation.x = Math.sin(time * 0.4) * 0.2;
      groupRef.current.rotation.z = Math.cos(time * 0.5) * 0.1;
    }
    
    if (helmetRef.current) {
      // Subtle helmet reflection movement
      helmetRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.05;
    }
    
    if (bodyRef.current) {
      // Breathing effect
      bodyRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 1.2) * 0.02;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={[1.2, 1.2, 1.2]}>
      {/* Helmet - Main */}
      <mesh ref={helmetRef} position={[0, 0.7, 0]}>
        <sphereGeometry args={[0.5, 64, 64]} />
        <meshStandardMaterial 
          color="#e0f2fe" 
          metalness={0.95} 
          roughness={0.05}
          emissive="#93c5fd"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Helmet Visor */}
      <mesh position={[0, 0.7, 0.45]}>
        <sphereGeometry args={[0.45, 64, 64, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial 
          color="#93c5fd" 
          metalness={0.98} 
          roughness={0.02}
          transparent
          opacity={0.7}
          emissive="#60a5fa"
          emissiveIntensity={0.5}
        />
      </mesh>
      
      {/* Helmet Details - Gold Stripe */}
      <mesh position={[0, 0.85, 0.3]}>
        <ringGeometry args={[0.4, 0.45, 32]} />
        <meshStandardMaterial 
          color="#fbbf24" 
          metalness={0.9} 
          roughness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Head - Skin Tone */}
      <mesh position={[0, 0.5, 0]}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>
      
      {/* Body Group */}
      <group ref={bodyRef} position={[0, 0, 0]}>
        {/* Chest */}
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[0.8, 0.9, 0.4]} />
          <meshStandardMaterial 
            color="#60a5fa" 
            metalness={0.7} 
            roughness={0.2}
            emissive="#3b82f6"
            emissiveIntensity={0.05}
          />
        </mesh>
        
        {/* Chest Details - White Stripes */}
        <mesh position={[0, 0.3, 0.21]}>
          <boxGeometry args={[0.7, 0.05, 0.02]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0, 0.1, 0.21]}>
          <boxGeometry args={[0.7, 0.05, 0.02]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0, -0.1, 0.21]}>
          <boxGeometry args={[0.7, 0.05, 0.02]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        
        {/* Arms */}
        <group position={[0, 0, 0]}>
          {/* Upper Arms */}
          <mesh position={[0.9, 0.2, 0]} rotation={[0, 0, Math.PI / 8]}>
            <cylinderGeometry args={[0.12, 0.12, 0.6, 16]} />
            <meshStandardMaterial 
              color="#60a5fa" 
              metalness={0.7} 
              roughness={0.2}
            />
          </mesh>
          <mesh position={[-0.9, 0.2, 0]} rotation={[0, 0, -Math.PI / 8]}>
            <cylinderGeometry args={[0.12, 0.12, 0.6, 16]} />
            <meshStandardMaterial 
              color="#60a5fa" 
              metalness={0.7} 
              roughness={0.2}
            />
          </mesh>
          
          {/* Forearms */}
          <mesh position={[1.3, -0.1, 0]} rotation={[0, 0, Math.PI / 4]}>
            <cylinderGeometry args={[0.1, 0.1, 0.5, 16]} />
            <meshStandardMaterial 
              color="#60a5fa" 
              metalness={0.7} 
              roughness={0.2}
            />
          </mesh>
          <mesh position={[-1.3, -0.1, 0]} rotation={[0, 0, -Math.PI / 4]}>
            <cylinderGeometry args={[0.1, 0.1, 0.5, 16]} />
            <meshStandardMaterial 
              color="#60a5fa" 
              metalness={0.7} 
              roughness={0.2}
            />
          </mesh>
          
          {/* Hands */}
          <mesh position={[1.6, -0.4, 0]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color="#fbbf24" />
          </mesh>
          <mesh position={[-1.6, -0.4, 0]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color="#fbbf24" />
          </mesh>
        </group>
        
        {/* Legs */}
        <group position={[0, -0.8, 0]}>
          {/* Thighs */}
          <mesh position={[0.3, -0.3, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 0.7, 16]} />
            <meshStandardMaterial 
              color="#1e40af" 
              metalness={0.8} 
              roughness={0.1}
            />
          </mesh>
          <mesh position={[-0.3, -0.3, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 0.7, 16]} />
            <meshStandardMaterial 
              color="#1e40af" 
              metalness={0.8} 
              roughness={0.1}
            />
          </mesh>
          
          {/* Calves */}
          <mesh position={[0.3, -0.9, 0]}>
            <cylinderGeometry args={[0.13, 0.13, 0.6, 16]} />
            <meshStandardMaterial 
              color="#1e40af" 
              metalness={0.8} 
              roughness={0.1}
            />
          </mesh>
          <mesh position={[-0.3, -0.9, 0]}>
            <cylinderGeometry args={[0.13, 0.13, 0.6, 16]} />
            <meshStandardMaterial 
              color="#1e40af" 
              metalness={0.8} 
              roughness={0.1}
            />
          </mesh>
          
          {/* Feet */}
          <mesh position={[0.3, -1.3, 0.2]}>
            <boxGeometry args={[0.3, 0.2, 0.5]} />
            <meshStandardMaterial 
              color="#4b5563" 
              metalness={0.9} 
              roughness={0.05}
            />
          </mesh>
          <mesh position={[-0.3, -1.3, 0.2]}>
            <boxGeometry args={[0.3, 0.2, 0.5]} />
            <meshStandardMaterial 
              color="#4b5563" 
              metalness={0.9} 
              roughness={0.05}
            />
          </mesh>
        </group>
        
        {/* Backpack */}
        <mesh position={[0, 0, -0.5]}>
          <boxGeometry args={[0.6, 1, 0.3]} />
          <meshStandardMaterial 
            color="#4b5563" 
            metalness={0.85} 
            roughness={0.1}
          />
        </mesh>
        
        {/* Backpack Details */}
        <mesh position={[0, 0.3, -0.6]}>
          <cylinderGeometry args={[0.2, 0.2, 0.1, 32]} />
          <meshStandardMaterial 
            color="#9ca3af" 
            metalness={0.9} 
            roughness={0.05}
          />
        </mesh>
        
        {/* Oxygen Tanks */}
        <group position={[0, 0.2, -0.7]}>
          <mesh position={[0.25, 0, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 0.5, 16]} />
            <meshStandardMaterial 
              color="#9ca3af" 
              metalness={0.95} 
              roughness={0.02}
            />
          </mesh>
          <mesh position={[-0.25, 0, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 0.5, 16]} />
            <meshStandardMaterial 
              color="#9ca3af" 
              metalness={0.95} 
              roughness={0.02}
            />
          </mesh>
          
          {/* Tank Tops */}
          <mesh position={[0.25, 0.3, 0]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial 
              color="#6b7280" 
              metalness={0.9} 
              roughness={0.1}
            />
          </mesh>
          <mesh position={[-0.25, 0.3, 0]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial 
              color="#6b7280" 
              metalness={0.9} 
              roughness={0.1}
            />
          </mesh>
        </group>
        
        {/* Utility Belt */}
        <mesh position={[0, -0.4, 0]}>
          <torusGeometry args={[0.5, 0.08, 16, 32]} />
          <meshStandardMaterial 
            color="#4b5563" 
            metalness={0.9} 
            roughness={0.1}
          />
        </mesh>
        
        {/* Tools on Belt */}
        <mesh position={[0.4, -0.4, 0.1]}>
          <boxGeometry args={[0.1, 0.2, 0.05]} />
          <meshStandardMaterial 
            color="#ef4444" 
            metalness={0.8} 
            roughness={0.2}
          />
        </mesh>
        <mesh position={[-0.4, -0.4, 0.1]}>
          <boxGeometry args={[0.1, 0.2, 0.05]} />
          <meshStandardMaterial 
            color="#10b981" 
            metalness={0.8} 
            roughness={0.2}
          />
        </mesh>
      </group>
    </group>
  );
}

// Space Galaxy Background - Matching the home page implementation
function SpaceGalaxy() {
  const galaxyRef = useRef<THREE.Group>(null);
  const nebulaRef = useRef<THREE.Group>(null);
  const starsRef = useRef<THREE.Group>(null);
  
  // Create multiple star layers for depth
  const distantStars = new Float32Array(5000 * 3);
  const mediumStars = new Float32Array(3000 * 3);
  const nearStars = new Float32Array(2000 * 3);
  
  for (let i = 0; i < 5000; i++) {
    distantStars[i * 3] = (Math.random() - 0.5) * 2000;
    distantStars[i * 3 + 1] = (Math.random() - 0.5) * 2000;
    distantStars[i * 3 + 2] = (Math.random() - 0.5) * 2000;
  }
  
  for (let i = 0; i < 3000; i++) {
    mediumStars[i * 3] = (Math.random() - 0.5) * 1000;
    mediumStars[i * 3 + 1] = (Math.random() - 0.5) * 1000;
    mediumStars[i * 3 + 2] = (Math.random() - 0.5) * 1000;
  }
  
  for (let i = 0; i < 2000; i++) {
    nearStars[i * 3] = (Math.random() - 0.5) * 500;
    nearStars[i * 3 + 1] = (Math.random() - 0.5) * 500;
    nearStars[i * 3 + 2] = (Math.random() - 0.5) * 500;
  }
  
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
          <pointsMaterial
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
          <pointsMaterial
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
          <pointsMaterial
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

// Advanced scene with dynamic lighting and effects
function Scene() {
  return (
    <>
      {/* Advanced Lighting Setup */}
      <ambientLight intensity={0.05} />
      <pointLight position={[100, 100, 100]} intensity={0.3} color="#4b0082" />
      <pointLight position={[-100, -100, -100]} intensity={0.3} color="#191970" />
      
      {/* Directional light for realistic shadows */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={0.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      
      {/* Space galaxy background matching home page */}
      <SpaceGalaxy />
      
      {/* Realistic astronaut model */}
      <RealisticAstronaut />
    </>
  );
}

export default function ContactIcon3D({ size = 300 }: { size?: number }) {
  return (
    <div 
      className="w-full h-full aspect-square"
      style={{ width: '100%', height: '100%', minHeight: size, minWidth: size }}
    >
      <Canvas 
        camera={{ position: [0, 0, 8], fov: 50 }}
        style={{ width: '100%', height: '75%' }}
        shadows
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}