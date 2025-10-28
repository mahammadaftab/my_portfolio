"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, Float } from "@react-three/drei";
import * as THREE from "three";

function Particle({ index }: { index: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      const angle = (index / 20) * Math.PI * 2;
      const radius = 1.5;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = Math.sin(state.clock.elapsedTime * 2 + index) * 0.2;
      meshRef.current.position.set(x, y, z);
    }
  });
  
  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.02, 8, 8]} />
      <meshStandardMaterial 
        color="#818cf8" 
        emissive="#4f46e5" 
        emissiveIntensity={0.3}
      />
    </mesh>
  );
}

function EngineeringLaptop() {
  const laptopRef = useRef<THREE.Group>(null);
  const screenRef = useRef<THREE.Mesh>(null);
  const fanRef = useRef<THREE.Group>(null);
  const logoRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (laptopRef.current) {
      laptopRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.4;
      laptopRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.07;
    }
    
    if (screenRef.current) {
      screenRef.current.rotation.x = Math.PI / 2 + Math.sin(state.clock.elapsedTime * 1.0) * 0.2;
    }
    
    if (fanRef.current) {
      fanRef.current.rotation.z += 0.4;
    }
    
    if (logoRef.current) {
      logoRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.3;
    }
  });

  return (
    <group ref={laptopRef} scale={[1.2, 1.2, 1.2]}>
      {/* Laptop Base */}
      <mesh position={[0, -0.3, 0]}>
        <boxGeometry args={[1.5, 0.1, 1]} />
        <meshStandardMaterial color="#4f46e5" metalness={0.9} roughness={0.05} />
      </mesh>
      
      {/* Laptop Base Highlight */}
      <mesh position={[0, -0.24, 0]}>
        <boxGeometry args={[1.4, 0.02, 0.9]} />
        <meshStandardMaterial color="#818cf8" metalness={0.7} roughness={0.1} />
      </mesh>
      
      {/* Laptop Screen */}
      <group ref={screenRef} position={[0, -0.1, 0.45]}>
        <mesh position={[0, 0.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <boxGeometry args={[1.3, 0.05, 0.8]} />
          <meshStandardMaterial color="#6366f1" metalness={0.8} roughness={0.08} />
        </mesh>
        
        {/* Screen Bezel */}
        <mesh position={[0, 0.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <boxGeometry args={[1.25, 0.055, 0.75]} />
          <meshStandardMaterial color="#4f46e5" metalness={0.9} roughness={0.05} />
        </mesh>
        
        {/* Screen Content */}
        <mesh position={[0, 0.32, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.2, 0.7]} />
          <meshStandardMaterial color="#0f172a" metalness={0.1} roughness={0.95} />
        </mesh>
        
        {/* Code Display */}
        <Text
          position={[0, 0.321, 0.25]}
          fontSize={0.08}
          color="#10b981"
          anchorX="center"
          anchorY="middle"
        >
          COMPUTER SCIENCE
        </Text>
        <Text
          position={[0, 0.321, 0.15]}
          fontSize={0.07}
          color="#3b82f6"
          anchorX="left"
          anchorY="middle"
        >
          {"function engineer() {"}
        </Text>
        <Text
          position={[0, 0.321, 0.07]}
          fontSize={0.07}
          color="#f59e0b"
          anchorX="left"
          anchorY="middle"
        >
          {"  return 'Innovation';"}
        </Text>
        <Text
          position={[0, 0.321, -0.01]}
          fontSize={0.07}
          color="#3b82f6"
          anchorX="left"
          anchorY="middle"
        >
          {"}"}
        </Text>
        <Text
          position={[0, 0.321, -0.12]}
          fontSize={0.06}
          color="#ef4444"
          anchorX="center"
          anchorY="middle"
        >
          {"// 3rd Year Student"}
        </Text>
        
        {/* Glowing Border */}
        <mesh position={[0, 0.32, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.62, 0.6, 64]} />
          <meshStandardMaterial 
            color="#818cf8" 
            emissive="#4f46e5" 
            emissiveIntensity={0.5} 
            side={THREE.DoubleSide}
            transparent
            opacity={0.8}
          />
        </mesh>
      </group>
      
      {/* Keyboard */}
      <mesh position={[0, -0.23, -0.25]}>
        <boxGeometry args={[1.3, 0.03, 0.5]} />
        <meshStandardMaterial color="#6b7280" metalness={0.6} roughness={0.2} />
      </mesh>
      
      {/* Individual Keys */}
      <group position={[0, -0.22, -0.25]}>
        {[...Array(3)].map((_, row) => (
          [...Array(10)].map((_, col) => (
            <mesh 
              key={`${row}-${col}`} 
              position={[-0.4 + col * 0.09, 0, -0.2 + row * 0.09]}
            >
              <boxGeometry args={[0.07, 0.035, 0.07]} />
              <meshStandardMaterial color="#9ca3af" metalness={0.5} roughness={0.3} />
            </mesh>
          ))
        ))}
      </group>
      
      {/* Trackpad */}
      <mesh position={[0, -0.22, 0.15]}>
        <boxGeometry args={[0.5, 0.035, 0.3]} />
        <meshStandardMaterial color="#9ca3af" metalness={0.5} roughness={0.3} />
      </mesh>
      
      {/* Touch ID */}
      <mesh ref={logoRef} position={[0, -0.21, -0.1]}>
        <cylinderGeometry args={[0.03, 0.03, 0.01, 32]} />
        <meshStandardMaterial 
          color="#4b5563" 
          metalness={0.95} 
          roughness={0.05} 
          emissive="#6b7280"
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Ventilation Grille */}
      <group position={[0, -0.18, -0.4]}>
        {[...Array(8)].map((_, i) => (
          <mesh key={i} position={[-0.35 + i * 0.1, 0, 0]}>
            <boxGeometry args={[0.03, 0.01, 0.02]} />
            <meshStandardMaterial color="#4b5563" metalness={0.95} roughness={0.05} />
          </mesh>
        ))}
      </group>
      
      {/* Fan */}
      <group ref={fanRef} position={[0, -0.18, -0.4]}>
        {[...Array(6)].map((_, i) => (
          <mesh 
            key={i} 
            position={[0, 0, 0]}
            rotation={[0, 0, (Math.PI / 3) * i]}
          >
            <boxGeometry args={[0.22, 0.01, 0.035]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
          </mesh>
        ))}
      </group>
      
      {/* Hinge */}
      <mesh position={[0, -0.2, 0.45]}>
        <cylinderGeometry args={[0.03, 0.03, 0.15, 32]} />
        <meshStandardMaterial color="#374151" metalness={0.95} roughness={0.05} />
      </mesh>
      
      {/* Stand */}
      <mesh position={[0, -0.35, -0.4]}>
        <boxGeometry args={[0.4, 0.05, 0.05]} />
        <meshStandardMaterial color="#4f46e5" metalness={0.8} roughness={0.1} />
      </mesh>
      
      {/* Logo on Base */}
      <Text
        position={[0, -0.29, 0.3]}
        fontSize={0.12}
        color="#c7d2fe"
        anchorX="center"
        anchorY="middle"
      >
        ENGINEERING
      </Text>
      
      {/* Particles around laptop */}
      <group>
        {[...Array(20)].map((_, i) => (
          <Particle key={i} index={i} />
        ))}
      </group>
    </group>
  );
}

export default function EngineeringLaptop3D() {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 3.5], fov: 50 }}>
        <ambientLight intensity={1.5} />
        <pointLight position={[10, 10, 10]} intensity={2.5} />
        <pointLight position={[-10, -10, -10]} intensity={1.2} color="#3b82f6" />
        <pointLight position={[0, 10, 0]} intensity={0.9} color="#ffffff" />
        <spotLight
          position={[0, 5, 0]}
          angle={0.3}
          penumbra={1}
          intensity={1.5}
          castShadow
        />
        <Float speed={2} rotationIntensity={0.7} floatIntensity={0.7}>
          <EngineeringLaptop />
        </Float>
      </Canvas>
    </div>
  );
}