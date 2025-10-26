"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { 
  OrbitControls, 
  Sphere, 
  MeshDistortMaterial, 
  Float,
  MeshWobbleMaterial,
  MeshReflectorMaterial,
  Environment,
  ContactShadows
} from "@react-three/drei";
import * as THREE from "three";
import { useRef, useState } from "react";

function AnimatedSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Smooth rotation with easing
      meshRef.current.rotation.x += delta * 0.15;
      meshRef.current.rotation.y += delta * 0.2;
      
      // Pulsing effect on hover
      if (hovered) {
        meshRef.current.scale.x = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
        meshRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
        meshRef.current.scale.z = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
      }
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <Sphere 
        args={[1, 64, 128]} // Reduced segments for better performance
        ref={meshRef}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <MeshDistortMaterial
          color="#4f46e5"
          attach="material"
          distort={0.4}
          speed={3}
          roughness={0.3}
          metalness={0.7}
        />
      </Sphere>
    </Float>
  );
}

function FloatingOrbs() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={1} position={[-2, 1, 0]}>
        <Sphere args={[0.3, 16, 16]}> // Reduced segments
          <MeshWobbleMaterial 
            color="#8b5cf6" 
            attach="material" 
            factor={0.5} 
            speed={2}
            transparent
            opacity={0.8}
          />
        </Sphere>
      </Float>
      
      <Float speed={2} rotationIntensity={0.4} floatIntensity={0.8} position={[2, -1, 0]}>
        <Sphere args={[0.25, 16, 16]}> // Reduced segments
          <MeshWobbleMaterial 
            color="#06b6d4" 
            attach="material" 
            factor={0.3} 
            speed={3}
            transparent
            opacity={0.7}
          />
        </Sphere>
      </Float>
      
      <Float speed={1.8} rotationIntensity={0.2} floatIntensity={1.2} position={[0, 2, -1]}>
        <Sphere args={[0.2, 16, 16]}> // Reduced segments
          <MeshWobbleMaterial 
            color="#10b981" 
            attach="material" 
            factor={0.4} 
            speed={2.5}
            transparent
            opacity={0.6}
          />
        </Sphere>
      </Float>
    </group>
  );
}

function GeometricShapes() {
  const torusRef = useRef<THREE.Mesh>(null);
  const boxRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (torusRef.current) {
      torusRef.current.rotation.x += delta * 0.2;
      torusRef.current.rotation.y += delta * 0.3;
    }
    
    if (boxRef.current) {
      boxRef.current.rotation.x += delta * 0.1;
      boxRef.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <>
      <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.6} position={[-1.5, -1.5, 0]}>
        <mesh ref={torusRef}>
          <torusGeometry args={[0.4, 0.1, 8, 64]} /> // Reduced segments
          <meshStandardMaterial 
            color="#ec4899" 
            metalness={0.8} 
            roughness={0.2}
            transparent
            opacity={0.7}
          />
        </mesh>
      </Float>
      
      <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.8} position={[1.5, 1.5, 0]}>
        <mesh ref={boxRef} castShadow>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial 
            color="#f59e0b" 
            metalness={0.6} 
            roughness={0.3}
            transparent
            opacity={0.8}
          />
        </mesh>
      </Float>
    </>
  );
}

function Lighting() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight 
        position={[5, 5, 5]} 
        intensity={1.5} 
        castShadow
        shadow-mapSize-width={512} // Reduced shadow quality for performance
        shadow-mapSize-height={512} // Reduced shadow quality for performance
      />
      <pointLight position={[-5, -5, -5]} intensity={0.5} color="#8b5cf6" />
      <pointLight position={[0, 5, 0]} intensity={0.3} color="#06b6d4" />
    </>
  );
}

export default function ThreeScene() {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 0, 5], fov: 50 }}
      gl={{ 
        antialias: true, 
        alpha: true,
        powerPreference: "high-performance" // Optimize for performance
      }}
      frameloop="always" // Always animate for smooth experience
    >
      <Lighting />
      <AnimatedSphere />
      <FloatingOrbs />
      <GeometricShapes />
      <ContactShadows 
        position={[0, -2, 0]} 
        opacity={0.4} 
        scale={10} 
        blur={2} 
        far={4} 
      />
      <OrbitControls 
        enableZoom={false} 
        autoRotate 
        autoRotateSpeed={0.5}
        enablePan={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 2}
        enableDamping={true}
        dampingFactor={0.05}
      />
      <Environment preset="city" />
    </Canvas>
  );
}