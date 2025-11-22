"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, Text } from "@react-three/drei";
import * as THREE from "three";

// Enhanced 3D Book component for SSLC
function BookIcon({ rotationSpeed = 1 }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const pagesRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * rotationSpeed * 0.5;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
    }
    
    if (pagesRef.current) {
      pagesRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.3;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Book Cover */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.8, 1.2, 0.1]} />
        <meshStandardMaterial color="#3b82f6" metalness={0.4} roughness={0.3} />
      </mesh>
      
      {/* Book Spine */}
      <mesh position={[0, 0, -0.05]}>
        <boxGeometry args={[0.8, 1.2, 0.02]} />
        <meshStandardMaterial color="#1d4ed8" metalness={0.6} roughness={0.2} />
      </mesh>
      
      {/* Pages */}
      <group ref={pagesRef} position={[0.05, 0, 0.02]}>
        <mesh>
          <boxGeometry args={[0.7, 1.15, 0.08]} />
          <meshStandardMaterial color="#f0f9ff" metalness={0.1} roughness={0.5} />
        </mesh>
      </group>
      
      {/* Book Title */}
      <Text
        position={[0, 0.2, 0.06]}
        fontSize={0.15}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        SSLC
      </Text>
    </group>
  );
}

// Enhanced 3D Laboratory component for PUC
function LaboratoryIcon({ rotationSpeed = 1 }) {
  const meshRef = useRef<THREE.Group>(null);
  const flaskRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * rotationSpeed * 0.5;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.03;
    }
    
    if (flaskRef.current) {
      flaskRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 1.5) * 0.1;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Lab Table */}
      <mesh position={[0, -0.4, 0]}>
        <boxGeometry args={[1, 0.1, 0.6]} />
        <meshStandardMaterial color="#8b5cf6" metalness={0.3} roughness={0.4} />
      </mesh>
      
      {/* Lab Table Legs */}
      <mesh position={[0.4, -0.7, 0.2]}>
        <boxGeometry args={[0.1, 0.5, 0.1]} />
        <meshStandardMaterial color="#6b21a8" metalness={0.3} roughness={0.4} />
      </mesh>
      <mesh position={[-0.4, -0.7, 0.2]}>
        <boxGeometry args={[0.1, 0.5, 0.1]} />
        <meshStandardMaterial color="#6b21a8" metalness={0.3} roughness={0.4} />
      </mesh>
      <mesh position={[0.4, -0.7, -0.2]}>
        <boxGeometry args={[0.1, 0.5, 0.1]} />
        <meshStandardMaterial color="#6b21a8" metalness={0.3} roughness={0.4} />
      </mesh>
      <mesh position={[-0.4, -0.7, -0.2]}>
        <boxGeometry args={[0.1, 0.5, 0.1]} />
        <meshStandardMaterial color="#6b21a8" metalness={0.3} roughness={0.4} />
      </mesh>
      
      {/* Chemistry Flask */}
      <group ref={flaskRef} position={[0, -0.1, 0]}>
        <mesh position={[0, 0.2, 0]}>
          <sphereGeometry args={[0.15, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#60a5fa" transparent opacity={0.7} metalness={0.1} roughness={0.1} />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.3, 16]} />
          <meshStandardMaterial color="#93c5fd" transparent opacity={0.5} metalness={0.1} roughness={0.1} />
        </mesh>
      </group>
      
      {/* Bunsen Burner */}
      <mesh position={[-0.3, -0.3, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.2, 8]} />
        <meshStandardMaterial color="#4b5563" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Flame */}
      <mesh position={[-0.3, -0.15, 0]}>
        <coneGeometry args={[0.05, 0.15, 8]} />
        <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

// Enhanced 3D Laptop component for Engineering
function LaptopIcon({ rotationSpeed = 1 }) {
  const meshRef = useRef<THREE.Group>(null);
  const screenRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * rotationSpeed * 0.5;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.02;
    }
    
    if (screenRef.current) {
      screenRef.current.rotation.x = Math.PI / 2 + Math.sin(state.clock.elapsedTime * 0.8) * 0.1;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Laptop Base */}
      <mesh position={[0, -0.2, 0]}>
        <boxGeometry args={[1, 0.05, 0.7]} />
        <meshStandardMaterial color="#4f46e5" metalness={0.5} roughness={0.3} />
      </mesh>
      
      {/* Laptop Screen */}
      <group ref={screenRef} position={[0, -0.05, 0.3]}>
        <mesh position={[0, 0.15, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <boxGeometry args={[0.8, 0.02, 0.5]} />
          <meshStandardMaterial color="#6366f1" metalness={0.4} roughness={0.2} />
        </mesh>
        
        {/* Screen Content */}
        <mesh position={[0, 0.16, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.7, 0.4]} />
          <meshStandardMaterial color="#1e293b" metalness={0.1} roughness={0.8} />
        </mesh>
        
        {/* Code Lines */}
        <Text
          position={[0, 0.161, 0.15]}
          fontSize={0.03}
          color="#10b981"
          anchorX="left"
          anchorY="middle"
        >
          console.log('Hello World');
        </Text>
        <Text
          position={[0, 0.161, 0.1]}
          fontSize={0.03}
          color="#3b82f6"
          anchorX="left"
          anchorY="middle"
        >
          function code() {"{"}
        </Text>
        <Text
          position={[0, 0.161, 0.05]}
          fontSize={0.03}
          color="#f59e0b"
          anchorX="left"
          anchorY="middle"
        >
          return 'Engineering';
        </Text>
        <Text
          position={[0, 0.161, 0]}
          fontSize={0.03}
          color="#3b82f6"
          anchorX="left"
          anchorY="middle"
        >
          {"}"}
        </Text>
      </group>
      
      {/* Keyboard */}
      <mesh position={[0, -0.18, -0.1]}>
        <boxGeometry args={[0.8, 0.01, 0.3]} />
        <meshStandardMaterial color="#6b7280" metalness={0.3} roughness={0.4} />
      </mesh>
      
      {/* Trackpad */}
      <mesh position={[0, -0.17, 0.1]}>
        <boxGeometry args={[0.3, 0.015, 0.15]} />
        <meshStandardMaterial color="#9ca3af" metalness={0.2} roughness={0.5} />
      </mesh>
    </group>
  );
}

// Enhanced 3D Advanced Engineering Workstation for Bachelor of Engineering
function EngineeringWorkstationIcon({ rotationSpeed = 1 }) {
  const meshRef = useRef<THREE.Group>(null);
  const screenRef = useRef<THREE.Group>(null);
  const fanRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * rotationSpeed * 0.3;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.01;
    }
    
    if (screenRef.current) {
      screenRef.current.rotation.x = Math.PI / 2 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
    
    if (fanRef.current) {
      fanRef.current.rotation.z += delta * 5;
    }
    
    if (particlesRef.current) {
      particlesRef.current.rotation.y += delta * 0.2;
    }
  });

  // Create particle geometry for code particles
  const particleCount = 100;
  const particlePositions = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount; i++) {
    particlePositions[i * 3] = (Math.random() - 0.5) * 2;
    particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 2;
    particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 2;
  }

  return (
    <group ref={meshRef}>
      {/* Main Workstation Base */}
      <mesh position={[0, -0.3, 0]}>
        <boxGeometry args={[1.2, 0.1, 0.8]} />
        <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
      </mesh>
      
      {/* Workstation Legs */}
      <mesh position={[0.5, -0.6, 0.3]}>
        <boxGeometry args={[0.1, 0.5, 0.1]} />
        <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[-0.5, -0.6, 0.3]}>
        <boxGeometry args={[0.1, 0.5, 0.1]} />
        <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.5, -0.6, -0.3]}>
        <boxGeometry args={[0.1, 0.5, 0.1]} />
        <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[-0.5, -0.6, -0.3]}>
        <boxGeometry args={[0.1, 0.5, 0.1]} />
        <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Advanced Laptop */}
      <group position={[0, -0.15, 0]}>
        {/* Laptop Base */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1, 0.05, 0.7]} />
          <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.2} />
        </mesh>
        
        {/* Laptop Screen */}
        <group ref={screenRef} position={[0, 0.1, 0.3]}>
          <mesh position={[0, 0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <boxGeometry args={[0.9, 0.02, 0.6]} />
            <meshStandardMaterial color="#475569" metalness={0.5} roughness={0.1} />
          </mesh>
          
          {/* Screen Content - Holographic Display */}
          <mesh position={[0, 0.21, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.8, 0.5]} />
            <meshStandardMaterial 
              color="#0ea5e9" 
              transparent 
              opacity={0.8} 
              emissive="#0ea5e9" 
              emissiveIntensity={0.3}
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
          
          {/* Code Visualization */}
          <Text
            position={[0, 0.211, 0.2]}
            fontSize={0.04}
            color="#10b981"
            anchorX="center"
            anchorY="middle"
          >
            class Engineering {"{"}
          </Text>
          <Text
            position={[0, 0.211, 0.15]}
            fontSize={0.04}
            color="#f59e0b"
            anchorX="center"
            anchorY="middle"
          >
            solveProblems();
          </Text>
          <Text
            position={[0, 0.211, 0.1]}
            fontSize={0.04}
            color="#8b5cf6"
            anchorX="center"
            anchorY="middle"
          >
            buildSolutions();
          </Text>
          <Text
            position={[0, 0.211, 0.05]}
            fontSize={0.04}
            color="#ec4899"
            anchorX="center"
            anchorY="middle"
          >
            innovate();
          </Text>
          <Text
            position={[0, 0.211, 0]}
            fontSize={0.04}
            color="#10b981"
            anchorX="center"
            anchorY="middle"
          >
            {"}"}
          </Text>
        </group>
        
        {/* Keyboard with RGB Lighting */}
        <mesh position={[0, -0.08, -0.1]}>
          <boxGeometry args={[0.9, 0.01, 0.3]} />
          <meshStandardMaterial color="#475569" metalness={0.4} roughness={0.3} />
        </mesh>
        
        {/* Trackpad */}
        <mesh position={[0, -0.07, 0.1]}>
          <boxGeometry args={[0.3, 0.015, 0.15]} />
          <meshStandardMaterial color="#64748b" metalness={0.3} roughness={0.4} />
        </mesh>
      </group>
      
      {/* External Monitor */}
      <group position={[0, 0.2, -0.6]} rotation={[0, Math.PI, 0]}>
        <mesh>
          <boxGeometry args={[0.8, 0.5, 0.02]} />
          <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0, 0.02]}>
          <planeGeometry args={[0.75, 0.45]} />
          <meshStandardMaterial 
            color="#0ea5e9" 
            transparent 
            opacity={0.7} 
            emissive="#0ea5e9" 
            emissiveIntensity={0.2}
          />
        </mesh>
        <mesh position={[0, -0.3, 0.01]}>
          <boxGeometry args={[0.2, 0.02, 0.05]} />
          <meshStandardMaterial color="#475569" metalness={0.5} roughness={0.3} />
        </mesh>
      </group>
      
      {/* Mechanical Keyboard */}
      <group position={[0, -0.15, 0.5]}>
        <mesh>
          <boxGeometry args={[0.6, 0.03, 0.25]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.1} />
        </mesh>
        {/* Keycaps */}
        {Array.from({ length: 12 }).map((_, i) => (
          <mesh key={i} position={[-0.25 + (i * 0.045), -0.13, 0.45]}>
            <boxGeometry args={[0.03, 0.01, 0.03]} />
            <meshStandardMaterial 
              color={i % 4 === 0 ? "#ef4444" : i % 4 === 1 ? "#3b82f6" : i % 4 === 2 ? "#10b981" : "#f59e0b"} 
              metalness={0.9} 
              roughness={0.1} 
            />
          </mesh>
        ))}
      </group>
      
      {/* Gaming Mouse */}
      <group position={[0.4, -0.15, 0.3]}>
        <mesh>
          <boxGeometry args={[0.05, 0.02, 0.08]} />
          <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.2} />
        </mesh>
        <mesh position={[0.015, -0.01, 0.02]}>
          <sphereGeometry args={[0.01, 8, 8]} />
          <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[-0.015, -0.01, 0.02]}>
          <sphereGeometry args={[0.01, 8, 8]} />
          <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.5} />
        </mesh>
      </group>
      
      {/* Cooling System with Fans */}
      <group ref={fanRef} position={[0.55, -0.1, 0]}>
        <mesh>
          <cylinderGeometry args={[0.08, 0.08, 0.01, 8]} />
          <meshStandardMaterial color="#64748b" metalness={0.6} roughness={0.3} />
        </mesh>
        {Array.from({ length: 4 }).map((_, i) => (
          <mesh 
            key={i} 
            position={[
              Math.cos((i * Math.PI * 2) / 4) * 0.05, 
              0, 
              Math.sin((i * Math.PI * 2) / 4) * 0.05
            ]}
            rotation={[0, 0, Math.PI / 4]}
          >
            <boxGeometry args={[0.01, 0.08, 0.01]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.1} />
          </mesh>
        ))}
      </group>
      
      {/* Holographic Particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
            count={particleCount}
            array={particlePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial 
          color="#0ea5e9" 
          size={0.02} 
          transparent 
          opacity={0.7} 
          sizeAttenuation 
        />
      </points>
      
      {/* Cables */}
      <mesh position={[0.2, -0.2, 0.2]} rotation={[Math.PI / 6, 0, 0]}>
        <cylinderGeometry args={[0.005, 0.005, 0.3, 8]} />
        <meshStandardMaterial color="#64748b" />
      </mesh>
      <mesh position={[-0.2, -0.2, 0.2]} rotation={[-Math.PI / 6, 0, 0]}>
        <cylinderGeometry args={[0.005, 0.005, 0.3, 8]} />
        <meshStandardMaterial color="#64748b" />
      </mesh>
    </group>
  );
}

// Scene component for each icon
function IconScene({ type }: { type: "book" | "lab" | "workstation" }) {
  const [rotationSpeed, setRotationSpeed] = useState(0.5);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const distanceFromCenter = Math.abs(e.clientX - centerX);
      const newSpeed = 0.5 + (distanceFromCenter / window.innerWidth) * 2;
      setRotationSpeed(newSpeed);
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      <ambientLight intensity={1} />
      <pointLight position={[10, 10, 10]} intensity={2} />
      <pointLight position={[-10, -10, -10]} intensity={1} color="#3b82f6" />
      <pointLight position={[0, 10, 0]} intensity={0.8} color="#ffffff" />
      <spotLight
        position={[0, 5, 0]}
        angle={0.3}
        penumbra={1}
        intensity={1}
        castShadow
      />
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.3}>
        {type === "book" && <BookIcon rotationSpeed={rotationSpeed} />}
        {type === "lab" && <LaboratoryIcon rotationSpeed={rotationSpeed} />}
        {type === "workstation" && <EngineeringWorkstationIcon rotationSpeed={rotationSpeed} />}
      </Float>
      <OrbitControls 
        enableZoom={false} 
        enablePan={false} 
        autoRotate 
        autoRotateSpeed={rotationSpeed}
      />
    </>
  );
}

// Main component
export default function EducationIcon3D({ 
  type,
  size = 100
}: { 
  type: "book" | "lab" | "workstation";
  size?: number;
}) {
  return (
    <div 
      className="w-full h-full flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
        <IconScene type={type} />
      </Canvas>
    </div>
  );
}