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
      
      // X-axis movement - increased breadth (-10 to +10 units)
      if (cycleTime < 10) {
        // Moving from left to right (0-10 seconds)
        groupRef.current.position.x = -10 + (cycleTime / 10) * 20;
      } else {
        // Moving from right to left (10-20 seconds)
        groupRef.current.position.x = 10 - ((cycleTime - 10) / 10) * 20;
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

// Advanced scene with dynamic lighting and effects
function Scene() {
  return (
    <>
      {/* Advanced Lighting Setup */}
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={1.2} color="#60a5fa" />
      <pointLight position={[-5, -5, -5]} intensity={0.8} color="#3b82f6" />
      <pointLight position={[0, 10, 0]} intensity={0.7} color="#ffffff" />
      <pointLight position={[0, -10, 0]} intensity={0.5} color="#fbbf24" />
      
      {/* Directional light for realistic shadows */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={0.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      
      {/* Stars with increased coverage for expanded breadth */}
      <Stars 
        radius={200} 
        depth={150} 
        count={15000} 
        factor={15} 
        saturation={0.2} 
        fade 
        speed={0.5} 
      />
      
      {/* Nebula-like glow effect */}
      <mesh position={[0, 0, -20]}>
        <sphereGeometry args={[30, 32, 32]} />
        <meshBasicMaterial 
          color="#3b82f6" 
          transparent 
          opacity={0.05} 
        />
      </mesh>
      
      {/* Realistic astronaut model */}
      <RealisticAstronaut />
    </>
  );
}

export default function ContactIcon3D({ size = 500 }: { size?: number }) {
  return (
    <div 
      className="w-full h-full"
      style={{ width: '100%', height: '100%', minHeight: size, minWidth: size * 4 }}
    >
      <Canvas 
        camera={{ position: [0, 0, 8], fov: 50 }}
        style={{ width: '100%', height: '100%' }}
        shadows
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}