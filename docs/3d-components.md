# 3D Components Documentation

This guide provides detailed information about implementing and customizing 3D components in the portfolio website using React Three Fiber and Drei.

## Table of Contents

1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Basic 3D Scene Setup](#basic-3d-scene-setup)
4. [Core Components](#core-components)
5. [Animation Techniques](#animation-techniques)
6. [Performance Optimization](#performance-optimization)
7. [Customization](#customization)
8. [Advanced Features](#advanced-features)
9. [Troubleshooting](#troubleshooting)
10. [Best Practices](#best-practices)

## Overview

The portfolio website uses React Three Fiber (R3F) and Drei to create interactive 3D experiences. These libraries provide a React-friendly way to work with Three.js, enabling developers to create complex 3D scenes with familiar React patterns.

## Technology Stack

### Core Libraries

1. **React Three Fiber (R3F)**: React renderer for Three.js
2. **Drei**: Useful helpers and abstractions for R3F
3. **Three.js**: 3D library underlying R3F
4. **Framer Motion**: For additional animations (optional)

### Installation

```bash
npm install three @react-three/fiber @react-three/drei
```

## Basic 3D Scene Setup

### Canvas Component

The [Canvas](file:///c%3A/Users/mdaft/OneDrive/Desktop/portfolio/portfolio/node_modules/@react-three/fiber/dist/react-three-fiber.esm.js#L2257-L2296) component is the root container for all 3D content:

```typescript
// src/components/three-scene.tsx
import { Canvas } from "@react-three/fiber";

export default function ThreeScene() {
  return (
    <Canvas>
      {/* 3D content goes here */}
    </Canvas>
  );
}
```

### Basic Scene Structure

```typescript
// src/components/three-scene.tsx
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sphere, MeshDistortMaterial } from "@react-three/drei";

export default function ThreeScene() {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 2, 1]} intensity={1} />
      <Sphere args={[1, 100, 200]}>
        <MeshDistortMaterial
          color="#4f46e5"
          attach="material"
          distort={0.3}
          speed={2}
        />
      </Sphere>
      <OrbitControls enableZoom={false} />
    </Canvas>
  );
}
```

## Core Components

### Geometries

#### Sphere

```typescript
import { Sphere } from "@react-three/drei";

<Sphere args={[radius, widthSegments, heightSegments]}>
  <meshStandardMaterial color="hotpink" />
</Sphere>
```

#### Box

```typescript
import { Box } from "@react-three/drei";

<Box args={[width, height, depth]}>
  <meshStandardMaterial color="orange" />
</Box>
```

#### Plane

```typescript
import { Plane } from "@react-three/drei";

<Plane args={[width, height]}>
  <meshStandardMaterial color="lightblue" />
</Plane>
```

### Materials

#### MeshStandardMaterial

```typescript
<meshStandardMaterial 
  color="hotpink" 
  metalness={0.5}
  roughness={0.5}
/>
```

#### MeshDistortMaterial (Drei)

```typescript
import { MeshDistortMaterial } from "@react-three/drei";

<MeshDistortMaterial
  color="#4f46e5"
  distort={0.3}
  speed={2}
  roughness={0.5}
/>
```

#### MeshNormalMaterial

```typescript
<meshNormalMaterial />
```

### Lights

#### Ambient Light

```typescript
<ambientLight intensity={0.5} />
```

#### Directional Light

```typescript
<directionalLight 
  position={[3, 2, 1]} 
  intensity={1} 
/>
```

#### Point Light

```typescript
<pointLight 
  position={[10, 10, 10]} 
  intensity={1} 
/>
```

### Cameras

#### Perspective Camera

```typescript
<camera 
  position={[0, 0, 5]} 
  fov={75}
/>
```

### Controls

#### Orbit Controls

```typescript
import { OrbitControls } from "@react-three/drei";

<OrbitControls 
  enableZoom={false}
  autoRotate
  autoRotateSpeed={2}
/>
```

## Animation Techniques

### Using useFrame Hook

The [useFrame](file:///c%3A/Users/mdaft/OneDrive/Desktop/portfolio/portfolio/node_modules/@react-three/fiber/dist/react-three-fiber.esm.js#L1897-L1906) hook allows you to run code on every frame:

```typescript
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

function AnimatedSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <Sphere args={[1, 100, 200]} ref={meshRef}>
      <MeshDistortMaterial
        color="#4f46e5"
        attach="material"
        distort={0.3}
        speed={2}
      />
    </Sphere>
  );
}
```

### Using Drei Animations

#### Text Animation

```typescript
import { Text } from "@react-three/drei";

<Text
  color="white"
  fontSize={1}
  maxWidth={10}
  textAlign="center"
  font="/fonts/inter-bold.woff"
>
  Hello World
</Text>
```

#### Floating Animation

```typescript
import { Float } from "@react-three/drei";

<Float speed={2} rotationIntensity={1} floatIntensity={1}>
  <Sphere args={[1, 100, 200]}>
    <MeshDistortMaterial color="#4f46e5" />
  </Sphere>
</Float>
```

### Using Framer Motion

For simpler animations, you can combine Framer Motion with 3D components:

```typescript
import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";

<motion.div
  initial={{ opacity: 0, scale: 0.8 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.8 }}
>
  <Canvas>
    {/* 3D content */}
  </Canvas>
</motion.div>
```

## Performance Optimization

### Geometry Optimization

1. **Reduce segment counts** for simpler geometries
2. **Use buffer geometries** for better performance
3. **Reuse geometries** when possible

```typescript
// Reusing geometry
const geometry = useMemo(() => new THREE.SphereGeometry(1, 32, 32), []);

{return (
  <mesh geometry={geometry}>
    <meshStandardMaterial color="hotpink" />
  </mesh>
)}
```

### Material Optimization

1. **Use fewer materials** when possible
2. **Preload textures** to avoid frame drops
3. **Use cheaper materials** for distant objects

### Instanced Meshes

For multiple similar objects:

```typescript
import { Instances, Instance } from "@react-three/drei";

<Instances limit={100} range={100}>
  <sphereGeometry args={[1, 16, 16]} />
  <meshStandardMaterial color="hotpink" />
  {Array.from({ length: 100 }).map((_, i) => (
    <Instance key={i} position={[i * 2, 0, 0]} />
  ))}
</Instances>
```

### Level of Detail (LOD)

```typescript
import { Detailed } from "@react-three/drei";

<Detailed distances={[0, 10, 20]}>
  <Sphere args={[1, 64, 64]} /> {/* High detail */}
  <Sphere args={[1, 32, 32]} /> {/* Medium detail */}
  <Sphere args={[1, 16, 16]} /> {/* Low detail */}
</Detailed>
```

### Performance Monitoring

```typescript
import { Stats } from "@react-three/drei";

<Stats />
```

## Customization

### Color Customization

```typescript
// Using CSS variables
<Sphere>
  <meshStandardMaterial color="var(--primary-color)" />
</Sphere>

// Using props
function CustomSphere({ color = "#4f46e5" }: { color?: string }) {
  return (
    <Sphere>
      <meshStandardMaterial color={color} />
    </Sphere>
  );
}
```

### Size Customization

```typescript
function CustomSphere({ size = 1 }: { size?: number }) {
  return (
    <Sphere args={[size, 100, 200]}>
      <MeshDistortMaterial color="#4f46e5" />
    </Sphere>
  );
}
```

### Animation Customization

```typescript
function AnimatedSphere({ 
  rotationSpeed = { x: 0.2, y: 0.3 } 
}: { 
  rotationSpeed?: { x: number; y: number } 
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * rotationSpeed.x;
      meshRef.current.rotation.y += delta * rotationSpeed.y;
    }
  });

  return (
    <Sphere args={[1, 100, 200]} ref={meshRef}>
      <MeshDistortMaterial color="#4f46e5" />
    </Sphere>
  );
}
```

## Advanced Features

### Textures

```typescript
import { useTexture } from "@react-three/drei";

function TexturedSphere() {
  const texture = useTexture("/textures/earth.jpg");
  
  return (
    <Sphere>
      <meshStandardMaterial map={texture} />
    </Sphere>
  );
}
```

### Post-Processing

```bash
npm install @react-three/postprocessing
```

```typescript
import { EffectComposer, Bloom } from "@react-three/postprocessing";

<EffectComposer>
  <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} />
</EffectComposer>
```

### Physics

```bash
npm install @react-three/cannon
```

```typescript
import { Physics, useBox } from "@react-three/cannon";

function Box() {
  const [ref] = useBox(() => ({ mass: 1, position: [0, 5, 0] }));
  return (
    <mesh ref={ref}>
      <boxGeometry />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  );
}

<Physics>
  <Box />
</Physics>
```

### GLTF Models

```typescript
import { useGLTF } from "@react-three/drei";

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}
```

## Troubleshooting

### Common Issues

1. **Black screen**: Check if lights are properly configured
2. **Invisible objects**: Verify material and geometry are correctly attached
3. **Performance issues**: Reduce geometry complexity or segment counts
4. **Animation jank**: Use [useFrame](file:///c%3A/Users/mdaft/OneDrive/Desktop/portfolio/portfolio/node_modules/@react-three/fiber/dist/react-three-fiber.esm.js#L1897-L1906) for smooth animations
5. **Import errors**: Ensure proper installation of dependencies

### Debugging Tips

1. **Use wireframe materials** to see geometry structure:
```typescript
<meshStandardMaterial wireframe color="hotpink" />
```

2. **Add axes helper** to visualize coordinate system:
```typescript
import { AxesHelper } from "@react-three/drei";

<AxesHelper args={[5]} />
```

3. **Check browser console** for Three.js warnings and errors

4. **Use React Developer Tools** to inspect component hierarchy

### Performance Debugging

1. **Monitor frame rate** with [Stats](file:///c%3A/Users/mdaft/OneDrive/Desktop/portfolio/portfolio/node_modules/@react-three/drei/core/index.d.ts#L765-L765) component
2. **Check memory usage** in browser dev tools
3. **Profile with React DevTools** to identify rendering bottlenecks

## Best Practices

### Code Organization

1. **Separate concerns** by creating reusable components
2. **Use TypeScript** for better type safety
3. **Memoize expensive operations** with [useMemo](file:///C:/Users/mdaft/AppData/Local/Programs/microsoft%20vs%20code/resources/app/extensions/node_modules/typescript/lib/lib.react.d.ts#L1477-L1482)
4. **Clean up resources** in useEffect cleanup functions

### Performance

1. **Minimize re-renders** by memoizing components
2. **Use instancing** for multiple similar objects
3. **Implement LOD** for distant objects
4. **Preload assets** to avoid frame drops

### Accessibility

1. **Provide fallbacks** for users with WebGL disabled
2. **Respect user preferences** like reduced motion
3. **Include descriptive alt text** for 3D content
4. **Ensure keyboard navigation** works properly

### Mobile Optimization

1. **Reduce complexity** on mobile devices
2. **Disable auto-rotate** on mobile
3. **Optimize for touch interactions**
4. **Test on various devices**

### Security

1. **Validate GLTF models** before loading
2. **Sanitize user inputs** for dynamic 3D content
3. **Use HTTPS** for loading external assets
4. **Implement proper error handling**

## Resources

- [React Three Fiber Documentation](https://docs.pmnd.rs/react-three-fiber)
- [Drei Documentation](https://github.com/pmndrs/drei)
- [Three.js Documentation](https://threejs.org/docs/)
- [Three.js Examples](https://threejs.org/examples/)
- [WebGL Fundamentals](https://webglfundamentals.org/)