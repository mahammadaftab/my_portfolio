# Animation System Documentation

This guide provides detailed information about implementing and customizing animations in the portfolio website using Framer Motion, Lottie, and other animation libraries.

## Table of Contents

1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Framer Motion Implementation](#framer-motion-implementation)
4. [Lottie Animations](#lottie-animations)
5. [CSS Animations](#css-animations)
6. [3D Animations](#3d-animations)
7. [Performance Optimization](#performance-optimization)
8. [Accessibility](#accessibility)
9. [Custom Animation Hooks](#custom-animation-hooks)
10. [Advanced Techniques](#advanced-techniques)
11. [Testing](#testing)
12. [Troubleshooting](#troubleshooting)
13. [Best Practices](#best-practices)

## Overview

The portfolio website implements a comprehensive animation system using multiple libraries to create engaging user experiences:

- **Framer Motion**: For page transitions and complex UI animations
- **Lottie**: For lightweight micro-animations
- **CSS Animations**: For simple transitions and effects
- **React Three Fiber**: For 3D animations
- **Intersection Observer**: For scroll-triggered animations

## Technology Stack

### Core Libraries

1. **Framer Motion**: Production-ready motion library for React
2. **Lottie React**: Lightweight animation library
3. **React Intersection Observer**: Scroll-based animations
4. **React Three Fiber**: 3D animations
5. **Tailwind CSS**: Utility classes for animations

### Installation

```bash
npm install framer-motion lottie-react react-intersection-observer
```

## Framer Motion Implementation

### Basic Animation

```typescript
// src/components/animated-component.tsx
import { motion } from "framer-motion";

export function AnimatedComponent() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      Content
    </motion.div>
  );
}
```

### Variants System

```typescript
// src/components/animated-list.tsx
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function AnimatedList() {
  return (
    <motion.ul
      variants={container}
      initial="hidden"
      animate="show"
    >
      {[1, 2, 3].map((item) => (
        <motion.li key={item} variants={item}>
          Item {item}
        </motion.li>
      ))}
    </motion.ul>
  );
}
```

### Gestures

```typescript
// src/components/interactive-card.tsx
import { motion } from "framer-motion";

export function InteractiveCard() {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
    >
      Interactive Card
    </motion.div>
  );
}
```

### Layout Animations

```typescript
// src/components/layout-animation.tsx
import { motion } from "framer-motion";
import { useState } from "react";

export function LayoutAnimation() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <motion.div
      layout
      onClick={() => setIsOpen(!isOpen)}
      className="bg-blue-500 rounded-lg cursor-pointer"
      style={{
        width: isOpen ? 300 : 100,
        height: isOpen ? 200 : 100
      }}
    >
      Click me
    </motion.div>
  );
}
```

### Scroll-Based Animations

```typescript
// src/components/scroll-animation.tsx
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export function ScrollAnimation() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-xl"
    >
      This animates when scrolled into view
    </motion.div>
  );
}
```

## Lottie Animations

### Basic Lottie Implementation

```typescript
// src/components/lottie-animation.tsx
import Lottie from "lottie-react";
import animationData from "@/public/animations/loading.json";

export function LottieAnimation() {
  return (
    <Lottie 
      animationData={animationData}
      loop={true}
      autoplay={true}
      style={{ width: 200, height: 200 }}
    />
  );
}
```

### Interactive Lottie

```typescript
// src/components/interactive-lottie.tsx
import Lottie from "lottie-react";
import animationData from "@/public/animations/button.json";
import { useState } from "react";

export function InteractiveLottie() {
  const [isPlaying, setIsPlaying] = useState(false);
  
  return (
    <Lottie 
      animationData={animationData}
      loop={false}
      autoplay={false}
      isStopped={!isPlaying}
      onClick={() => setIsPlaying(!isPlaying)}
      style={{ width: 100, height: 100, cursor: "pointer" }}
    />
  );
}
```

### Lottie with Framer Motion

```typescript
// src/components/animated-lottie.tsx
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import animationData from "@/public/animations/success.json";

export function AnimatedLottie() {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
    >
      <Lottie 
        animationData={animationData}
        loop={false}
        autoplay={true}
        style={{ width: 150, height: 150 }}
      />
    </motion.div>
  );
}
```

## CSS Animations

### Tailwind Animation Classes

```tsx
// Using Tailwind animation utilities
<div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-4 w-32"></div>
<div className="animate-bounce text-2xl">↓</div>
<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
```

### Custom CSS Animations

```css
/* src/app/globals.css */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.gradient-animation {
  background: linear-gradient(270deg, #4f46e5, #7c3aed, #db2777);
  background-size: 600% 600%;
  animation: gradientShift 3s ease infinite;
}
```

### CSS Transition Classes

```tsx
// Smooth transitions with Tailwind
<button className="transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
  Hover me
</button>

<div className="transform transition-transform duration-300 hover:-translate-y-1">
  Card
</div>
```

## 3D Animations

### React Three Fiber Integration

```typescript
// src/components/3d-animation.tsx
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

function RotatingBox() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta;
      meshRef.current.rotation.y += delta;
    }
  });
  
  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  );
}

export function ThreeDAnimation() {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <RotatingBox />
    </Canvas>
  );
}
```

### Drei Helpers

```typescript
// src/components/3d-scene.tsx
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Float, Text } from "@react-three/drei";

export function Scene() {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Float speed={2} rotationIntensity={1} floatIntensity={1}>
        <Text
          color="white"
          fontSize={1}
          maxWidth={10}
          textAlign="center"
        >
          Hello 3D World
        </Text>
      </Float>
      <OrbitControls enableZoom={false} />
    </Canvas>
  );
}
```

## Performance Optimization

### Animation Performance Tips

1. **Use transform and opacity** for best performance
2. **Avoid animating layout properties** (width, height, margin, padding)
3. **Use will-change property** for complex animations
4. **Limit concurrent animations** to prevent jank

```css
/* src/app/globals.css */
.optimized-animation {
  will-change: transform, opacity;
  transform: translateZ(0); /* Create a new compositing layer */
}
```

### Lazy Loading Animations

```typescript
// src/components/lazy-animation.tsx
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export function LazyAnimation() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.5 }}
    >
      This animation loads only when in view
    </motion.div>
  );
}
```

### Animation Reduction

```typescript
// src/components/reduced-motion-wrapper.tsx
import { motion } from "framer-motion";
import { useReducedMotion } from "framer-motion";

export function ReducedMotionWrapper({ children }: { children: React.ReactNode }) {
  const shouldReduceMotion = useReducedMotion();
  
  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
      animate={shouldReduceMotion ? false : { opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
    >
      {children}
    </motion.div>
  );
}
```

## Accessibility

### Respect Reduced Motion

```css
/* src/app/globals.css */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Skip Animations for Users

```typescript
// src/components/accessibility-toggle.tsx
import { useState, useEffect } from "react";

export function AccessibilityToggle() {
  const [reduceMotion, setReduceMotion] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);
  
  return (
    <button
      onClick={() => {
        // Toggle animation preference
        document.documentElement.classList.toggle('reduce-motion');
      }}
      aria-label="Toggle animations"
    >
      {reduceMotion ? 'Enable Animations' : 'Reduce Animations'}
    </button>
  );
}
```

### Focus Management

```typescript
// src/components/focus-animation.tsx
import { motion } from "framer-motion";

export function FocusAnimation() {
  return (
    <motion.button
      whileFocus={{ scale: 1.05 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
    >
      Animated Button
    </motion.button>
  );
}
```

## Custom Animation Hooks

### useScrollProgress Hook

```typescript
// src/hooks/use-scroll-progress.ts
import { useState, useEffect } from "react";

export function useScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);
  
  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(progress);
    };
    
    window.addEventListener("scroll", updateScrollProgress);
    updateScrollProgress(); // Initial call
    
    return () => window.removeEventListener("scroll", updateScrollProgress);
  }, []);
  
  return scrollProgress;
}
```

### useInView Animation Hook

```typescript
// src/hooks/use-in-view-animation.ts
import { useState, useEffect, useRef } from "react";

export function useInViewAnimation(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.unobserve(entry.target);
      }
    }, options);
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [options]);
  
  return [ref, inView];
}
```

## Advanced Techniques

### Staggered Animations

```typescript
// src/components/staggered-animation.tsx
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function StaggeredList() {
  return (
    <motion.ul
      variants={container}
      initial="hidden"
      animate="show"
    >
      {['Item 1', 'Item 2', 'Item 3'].map((text, index) => (
        <motion.li key={index} variants={item}>
          {text}
        </motion.li>
      ))}
    </motion.ul>
  );
}
```

### Spring Physics

```typescript
// src/components/spring-animation.tsx
import { motion } from "framer-motion";

export function SpringAnimation() {
  return (
    <motion.div
      whileHover={{ 
        scale: 1.1,
        transition: { type: "spring", stiffness: 400, damping: 10 }
      }}
      whileTap={{ 
        scale: 0.9,
        transition: { type: "spring", stiffness: 400, damping: 10 }
      }}
    >
      Springy Button
    </motion.div>
  );
}
```

### Keyframe Animations

```typescript
// src/components/keyframe-animation.tsx
import { motion } from "framer-motion";

const keyframes = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.2, 1],
    transition: {
      duration: 2,
      times: [0, 0.5, 1],
      repeat: Infinity
    }
  }
};

export function KeyframeAnimation() {
  return (
    <motion.div
      variants={keyframes}
      initial="initial"
      animate="animate"
      className="w-16 h-16 bg-blue-500 rounded-full"
    />
  );
}
```

## Testing

### Unit Testing Animations

```typescript
// src/components/animated-component.test.tsx
import { render, screen } from "@testing-library/react";
import { motion } from "framer-motion";
import { AnimatedComponent } from "./animated-component";

// Mock framer-motion for testing
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe("AnimatedComponent", () => {
  it("renders correctly", () => {
    render(<AnimatedComponent />);
    expect(screen.getByText("Content")).toBeInTheDocument();
  });
});
```

### Visual Regression Testing

```javascript
// cypress/e2e/animations.cy.js
describe("Animations", () => {
  it("shows animated elements", () => {
    cy.visit("/");
    cy.get("[data-testid='animated-element']")
      .should("be.visible")
      .and("have.css", "opacity", "1");
  });
});
```

## Troubleshooting

### Common Issues

1. **Animations not working**: Check if CSS classes are applied correctly
2. **Performance issues**: Reduce animation complexity or use [will-change](file:///C:/Users/mdaft/AppData/Local/Programs/microsoft%20vs%20code/resources/app/extensions/css-language-features/server/cssServer.js#L1-L1)
3. **Layout shifts**: Use transform instead of layout properties
4. **Mobile performance**: Reduce animations on mobile devices

### Debugging Tips

1. **Use browser dev tools** to inspect animations
2. **Check console for errors** related to animation libraries
3. **Test with reduced motion** enabled
4. **Profile performance** with Chrome DevTools

### Browser Compatibility

```css
/* src/app/globals.css */
/* Add prefixes for older browsers */
@supports (animation: opacity 0.3s ease) {
  .fade-in {
    animation: fadeIn 0.3s ease;
  }
}

/* Fallback for browsers without animation support */
.no-js .fade-in {
  opacity: 1;
}
```

## Best Practices

### Animation Design

1. **Purposeful animations**: Every animation should serve a purpose
2. **Consistent timing**: Use consistent durations and easing functions
3. **Meaningful motion**: Animations should guide user attention
4. **Subtle effects**: Avoid overwhelming users with excessive motion

### Performance

1. **Use hardware acceleration** with transform and opacity
2. **Limit concurrent animations** to prevent jank
3. **Optimize animation assets** (Lottie files, etc.)
4. **Test on various devices** for performance

### Accessibility

1. **Respect user preferences** for reduced motion
2. **Provide non-animated alternatives** when possible
3. **Ensure animations don't interfere** with screen readers
4. **Maintain focus indicators** during animations

### Implementation

1. **Use CSS for simple animations** when possible
2. **Leverage Framer Motion** for complex UI animations
3. **Use Lottie for micro-animations** and illustrations
4. **Implement proper loading states** for animated content

### Maintenance

1. **Document animation behaviors** in code comments
2. **Create reusable animation components** for consistency
3. **Monitor performance** regularly
4. **Update dependencies** to benefit from performance improvements

## Resources

- [Framer Motion Documentation](https://www.framer.com/docs/)
- [Lottie Documentation](https://lottiefiles.com/blog/working-with-lottie/getting-started-with-lottie-animations-in-react)
- [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)
- [CSS Animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Using_CSS_animations)
- [prefers-reduced-motion Media Query](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)