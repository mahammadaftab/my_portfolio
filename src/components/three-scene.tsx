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
  ContactShadows,
  Text,
  RoundedBox,
  Icosahedron,
  Octahedron,
  TorusKnot
} from "@react-three/drei";
import * as THREE from "three";
import { useRef, useState, useMemo } from "react";

// Professional 3D Logo Component
function ProfessionalLogo() {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (groupRef.current) {
      // Gentle rotation
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
      
      // Subtle float effect
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.05;
    }
  });

  return (
    <group ref={groupRef} onPointerEnter={() => setHovered(true)} onPointerLeave={() => setHovered(false)}>
      {/* Central Icosahedron */}
      <Icosahedron args={[0.8, 0]} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color={hovered ? "#8b5cf6" : "#4f46e5"} 
          metalness={0.9} 
          roughness={0.1}
          emissive={hovered ? "#8b5cf6" : "#4f46e5"}
          emissiveIntensity={hovered ? 0.2 : 0.1}
        />
      </Icosahedron>
      
      {/* Surrounding geometric elements */}
      <RoundedBox args={[0.5, 0.5, 0.5]} radius={0.1} position={[1.5, 0, 0]}>
        <meshStandardMaterial 
          color="#ec4899" 
          metalness={0.8} 
          roughness={0.2}
          transparent
          opacity={0.8}
        />
      </RoundedBox>
      
      <Octahedron args={[0.4]} position={[-1.5, 0, 0]}>
        <meshStandardMaterial 
          color="#06b6d4" 
          metalness={0.7} 
          roughness={0.3}
          transparent
          opacity={0.9}
        />
      </Octahedron>
      
      <TorusKnot args={[0.3, 0.1, 128, 32]} position={[0, 1.5, 0]}>
        <meshStandardMaterial 
          color="#10b981" 
          metalness={0.6} 
          roughness={0.4}
          transparent
          opacity={0.7}
        />
      </TorusKnot>
      
      <TorusKnot args={[0.3, 0.1, 128, 32]} position={[0, -1.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial 
          color="#f59e0b" 
          metalness={0.6} 
          roughness={0.4}
          transparent
          opacity={0.7}
        />
      </TorusKnot>
      
      {/* Connecting lines */}
      <mesh>
        <tubeGeometry args={[
          new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(1.5, 0, 0)
          ]), 
          64, 
          0.02, 
          8, 
          false
        ]} />
        <meshStandardMaterial color="#4f46e5" emissive="#4f46e5" emissiveIntensity={0.2} />
      </mesh>
      
      <mesh>
        <tubeGeometry args={[
          new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(-1.5, 0, 0)
          ]), 
          64, 
          0.02, 
          8, 
          false
        ]} />
        <meshStandardMaterial color="#4f46e5" emissive="#4f46e5" emissiveIntensity={0.2} />
      </mesh>
      
      <mesh>
        <tubeGeometry args={[
          new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 1.5, 0)
          ]), 
          64, 
          0.02, 
          8, 
          false
        ]} />
        <meshStandardMaterial color="#4f46e5" emissive="#4f46e5" emissiveIntensity={0.2} />
      </mesh>
      
      <mesh>
        <tubeGeometry args={[
          new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, -1.5, 0)
          ]), 
          64, 
          0.02, 
          8, 
          false
        ]} />
        <meshStandardMaterial color="#4f46e5" emissive="#4f46e5" emissiveIntensity={0.2} />
      </mesh>
    </group>
  );
}

// Floating Particles
function FloatingParticles() {
  const particlesRef = useRef<THREE.InstancedMesh>(null);
  
  // Create particle positions
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 50; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10
        ],
        scale: Math.random() * 0.1 + 0.05
      });
    }
    return temp;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <instancedMesh ref={particlesRef} args={[undefined, undefined, particles.length]}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshStandardMaterial 
        color="#8b5cf6" 
        emissive="#8b5cf6" 
        emissiveIntensity={0.1}
        transparent
        opacity={0.6}
      />
      {particles.map((particle, i) => (
        <group key={i} position={particle.position as [number, number, number]}>
          <mesh scale={[particle.scale, particle.scale, particle.scale]}>
            <sphereGeometry args={[1, 8, 8]} />
            <meshStandardMaterial 
              color="#8b5cf6" 
              emissive="#8b5cf6" 
              emissiveIntensity={0.1}
              transparent
              opacity={0.6}
            />
          </mesh>
        </group>
      ))}
    </instancedMesh>
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
        shadow-mapSize-width={512}
        shadow-mapSize-height={512}
      />
      <pointLight position={[-5, -5, -5]} intensity={0.5} color="#8b5cf6" />
      <pointLight position={[0, 5, 0]} intensity={0.3} color="#06b6d4" />
      <pointLight position={[5, -5, 5]} intensity={0.4} color="#10b981" />
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
        powerPreference: "high-performance"
      }}
      frameloop="always"
    >
      <Lighting />
      <ProfessionalLogo />
      <FloatingParticles />
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