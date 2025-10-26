# Performance Optimization Guide

This guide provides detailed information about implementing and maintaining optimal performance for the portfolio website.

## Table of Contents

1. [Overview](#overview)
2. [Core Web Vitals](#core-web-vitals)
3. [Image Optimization](#image-optimization)
4. [Code Splitting](#code-splitting)
5. [Bundle Optimization](#bundle-optimization)
6. [Caching Strategies](#caching-strategies)
7. [Lazy Loading](#lazy-loading)
8. [Font Optimization](#font-optimization)
9. [Server-Side Rendering](#server-side-rendering)
10. [Static Site Generation](#static-site-generation)
11. [Compression](#compression)
12. [Third-Party Scripts](#third-party-scripts)
13. [Performance Monitoring](#performance-monitoring)
14. [Testing and Benchmarking](#testing-and-benchmarking)
15. [Best Practices](#best-practices)
16. [Troubleshooting](#troubleshooting)

## Overview

The portfolio website implements comprehensive performance optimization strategies to achieve:

- **Fast Loading Times**: Sub-second initial page loads
- **Excellent Core Web Vitals**: High scores on Lighthouse metrics
- **Efficient Resource Usage**: Minimal bandwidth and processing
- **Progressive Enhancement**: Graceful degradation for slower connections
- **Mobile Optimization**: Fast performance on mobile devices
- **SEO Benefits**: Better search engine rankings through performance

## Core Web Vitals

### Key Metrics

1. **Largest Contentful Paint (LCP)**: < 2.5 seconds
2. **First Input Delay (FID)**: < 100 milliseconds
3. **Cumulative Layout Shift (CLS)**: < 0.1

### Measurement and Monitoring

```typescript
// src/lib/web-vitals.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

export function sendToAnalytics(metric: any) {
  // Send metrics to your analytics service
  console.log(metric);
  
  // Example: Send to Google Analytics
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      non_interaction: true,
    });
  }
}

export function reportWebVitals() {
  if ('serviceWorker' in navigator) {
    getCLS(sendToAnalytics);
    getFID(sendToAnalytics);
    getFCP(sendToAnalytics);
    getLCP(sendToAnalytics);
    getTTFB(sendToAnalytics);
  }
}
```

### Implementation in Layout

```typescript
// src/app/layout.tsx
"use client";

import { useEffect } from "react";
import { reportWebVitals } from "@/lib/web-vitals";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    reportWebVitals();
  }, []);

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

## Image Optimization

### Next.js Image Component

```tsx
// src/components/optimized-image.tsx
import Image from "next/image";

export function OptimizedImage({ 
  src, 
  alt, 
  width, 
  height,
  priority = false
}: { 
  src: string; 
  alt: string; 
  width: number; 
  height: number;
  priority?: boolean;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      quality={85}
      priority={priority}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      loading="lazy"
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/..."
      style={{
        maxWidth: '100%',
        height: 'auto'
      }}
    />
  );
}
```

### Responsive Images

```tsx
// src/components/responsive-gallery.tsx
import Image from "next/image";

export function ResponsiveGallery() {
  const images = [
    { src: "/images/project1.jpg", alt: "Project 1" },
    { src: "/images/project2.jpg", alt: "Project 2" },
    { src: "/images/project3.jpg", alt: "Project 3" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {images.map((image, index) => (
        <div key={index} className="relative aspect-video">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            quality={80}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/..."
            className="object-cover rounded-lg"
          />
        </div>
      ))}
    </div>
  );
}
```

### Image Format Optimization

```typescript
// next.config.js
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

module.exports = nextConfig;
```

## Code Splitting

### Dynamic Imports

```tsx
// src/components/lazy-component.tsx
import dynamic from "next/dynamic";

// Lazy load heavy components
const HeavyComponent = dynamic(() => import("../components/heavy-component"), {
  loading: () => <p>Loading...</p>,
  ssr: false // Disable SSR if not needed
});

export function LazyLoadedComponent() {
  return (
    <div>
      <h1>Light content</h1>
      <HeavyComponent />
    </div>
  );
}
```

### Route-Based Code Splitting

```tsx
// src/app/projects/page.tsx
import { Suspense } from "react";
import ProjectList from "@/components/project-list";
import ProjectSkeleton from "@/components/project-skeleton";

export default function ProjectsPage() {
  return (
    <Suspense fallback={<ProjectSkeleton />}>
      <ProjectList />
    </Suspense>
  );
}
```

### Conditional Loading

```tsx
// src/components/conditional-component.tsx
import { useMediaQuery } from "@/hooks/use-media-query";

export function ConditionalComponent() {
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");
  
  // Only load heavy component on large screens
  if (isLargeScreen) {
    return <HeavyDesktopComponent />;
  }
  
  return <LightMobileComponent />;
}
```

## Bundle Optimization

### Analyzing Bundle Size

```bash
# Install bundle analyzer
npm install --save-dev @next/bundle-analyzer

# next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // your next config
});
```

### Reducing Bundle Size

```typescript
// next.config.js
const nextConfig = {
  experimental: {
    optimizePackageImports: [
      '@heroicons/react',
      'lottie-react',
      // Add other large packages
    ],
  },
  webpack: (config) => {
    // Remove unused locales from moment.js
    config.plugins.push(
      new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en/)
    );
    
    return config;
  },
};

module.exports = nextConfig;
```

### Tree Shaking

```typescript
// Import only what you need
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

// Instead of importing everything
// import * as Heroicons from "@heroicons/react/24/outline";
```

## Caching Strategies

### Static Asset Caching

```javascript
// next.config.js
const nextConfig = {
  async headers() {
    return [
      {
        source: "/fonts/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable"
          }
        ]
      },
      {
        source: "/images/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable"
          }
        ]
      }
    ];
  }
};

module.exports = nextConfig;
```

### Service Worker Implementation

```typescript
// src/service-worker.ts
const CACHE_NAME = 'portfolio-cache-v1';
const urlsToCache = [
  '/',
  '/about',
  '/projects',
  '/_next/static/css/app.css',
  // Add other critical assets
];

self.addEventListener('install', (event: any) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event: any) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});
```

## Lazy Loading

### Component Lazy Loading

```tsx
// src/components/lazy-section.tsx
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const HeavySection = dynamic(() => import("../components/heavy-section"), {
  loading: () => <div>Loading section...</div>
});

export function LazySection() {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Load component after initial render
    setIsVisible(true);
  }, []);
  
  return (
    <div>
      {isVisible && <HeavySection />}
    </div>
  );
}
```

### Intersection Observer for Lazy Loading

```tsx
// src/hooks/use-intersection-observer.ts
import { useState, useEffect, useRef } from "react";

export function useIntersectionObserver(options = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsIntersecting(true);
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
  
  return [ref, isIntersecting];
}
```

### Lazy Loading with Hook

```tsx
// src/components/lazy-observed-component.tsx
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import dynamic from "next/dynamic";

const HeavyComponent = dynamic(() => import("../components/heavy-component"));

export function LazyObservedComponent() {
  const [ref, isVisible] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "50px"
  });
  
  return (
    <div ref={ref}>
      {isVisible ? <HeavyComponent /> : <div>Loading...</div>}
    </div>
  );
}
```

## Font Optimization

### Next.js Font Optimization

```typescript
// src/app/layout.tsx
import { Inter, Poppins } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

### CSS Font Loading

```css
/* src/app/globals.css */
/* Preload critical fonts */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/inter-regular.woff2') format('woff2');
}

/* Use font-display: swap for all custom fonts */
.font-custom {
  font-family: 'Inter', sans-serif;
  font-display: swap;
}
```

## Server-Side Rendering

### SSR Benefits

1. **Faster Initial Load**: Content is available immediately
2. **Better SEO**: Search engines can index content easily
3. **Improved Performance**: Reduced client-side processing

### SSR Implementation

```tsx
// src/app/projects/page.tsx
import { getProjects } from "@/lib/projects";

// Server-side data fetching
export async function getServerSideProps() {
  const projects = await getProjects();
  
  return {
    props: {
      projects,
    },
  };
}

export default function ProjectsPage({ projects }: { projects: any[] }) {
  return (
    <div>
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
```

### SSR with API Routes

```typescript
// src/app/api/projects/route.ts
import { NextResponse } from "next/server";
import { getProjects } from "@/lib/projects";

export async function GET() {
  try {
    const projects = await getProjects();
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
```

## Static Site Generation

### SSG Benefits

1. **Fastest Loading**: Pre-rendered HTML files
2. **CDN Friendly**: Easy to cache and distribute
3. **Reduced Server Load**: No server-side processing per request

### SSG Implementation

```tsx
// src/app/projects/page.tsx
import { getProjects } from "@/lib/projects";

// Static generation at build time
export async function generateStaticParams() {
  const projects = await getProjects();
  
  return projects.map((project) => ({
    id: project.id.toString(),
  }));
}

export default function ProjectsPage({ projects }: { projects: any[] }) {
  return (
    <div>
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
```

### Incremental Static Regeneration

```typescript
// next.config.js
export const revalidate = 3600; // Revalidate at most every hour

// Or per-page revalidation
export const dynamic = 'force-static';
export const revalidate = 3600;
```

## Compression

### Gzip/Brotli Compression

```javascript
// next.config.js
const CompressionPlugin = require('compression-webpack-plugin');

const nextConfig = {
  webpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      config.plugins.push(
        new CompressionPlugin({
          algorithm: 'brotliCompress',
          test: /\.(js|css|html|svg)$/,
          compressionOptions: {
            level: 11,
          },
          threshold: 10240,
          minRatio: 0.8,
        })
      );
    }
    
    return config;
  },
};

module.exports = nextConfig;
```

### Image Compression

```bash
# Optimize images before deployment
npm install --save-dev imagemin-cli imagemin-mozjpeg imagemin-pngquant

# package.json scripts
{
  "scripts": {
    "optimize-images": "imagemin public/images/* --out-dir=public/images/"
  }
}
```

## Third-Party Scripts

### Script Optimization

```tsx
// src/components/optimized-scripts.tsx
import Script from "next/script";

export function OptimizedScripts() {
  return (
    <>
      {/* Load non-critical scripts after page load */}
      <Script
        src="https://example.com/analytics.js"
        strategy="lazyOnload"
      />
      
      {/* Load critical scripts with specific timing */}
      <Script
        src="https://example.com/critical.js"
        strategy="beforeInteractive"
      />
      
      {/* Load worker scripts in web worker */}
      <Script
        src="https://example.com/worker.js"
        strategy="worker"
      />
    </>
  );
}
```

### Script Prioritization

```typescript
// next.config.js
const nextConfig = {
  experimental: {
    optimizeCss: true,
  },
  webpack: (config) => {
    // Prioritize critical CSS
    config.optimization.splitChunks.cacheGroups = {
      styles: {
        name: 'styles',
        type: 'css/mini-extract',
        chunks: 'all',
        enforce: true,
      },
    };
    
    return config;
  },
};

module.exports = nextConfig;
```

## Performance Monitoring

### Real User Monitoring (RUM)

```typescript
// src/lib/performance-monitoring.ts
export function measurePerformance() {
  if ('performance' in window) {
    // Measure page load time
    window.addEventListener('load', () => {
      const perfData = performance.getEntriesByType('navigation')[0];
      console.log('Page Load Time:', perfData.loadEventEnd - perfData.fetchStart);
    });
    
    // Measure component render times
    performance.mark('component-start');
    // ... component rendering
    performance.mark('component-end');
    performance.measure('component-render', 'component-start', 'component-end');
  }
}
```

### Synthetic Monitoring

```javascript
// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    // Emulate different devices
    viewport: { width: 1280, height: 720 },
    // Measure performance metrics
    extraHTTPHeaders: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    },
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
    {
      name: 'mobile-chrome',
      use: { 
        browserName: 'chromium',
        viewport: { width: 375, height: 667 }
      },
    },
  ],
});
```

## Testing and Benchmarking

### Lighthouse Testing

```bash
# Run Lighthouse tests
npx lighthouse http://localhost:3000 --view

# Automated Lighthouse testing
npx lhci autorun
```

### Performance Budgets

```json
// lighthouserc.json
{
  "ci": {
    "assert": {
      "assertions": {
        "categories:performance": ["error", {"minScore": 0.9}],
        "categories:accessibility": ["error", {"minScore": 0.9}],
        "categories:best-practices": ["error", {"minScore": 0.9}],
        "categories:seo": ["error", {"minScore": 0.9}],
        "first-contentful-paint": ["error", {"maxNumericValue": 1800}],
        "largest-contentful-paint": ["error", {"maxNumericValue": 2500}],
        "cumulative-layout-shift": ["error", {"maxNumericValue": 0.1}],
        "total-blocking-time": ["error", {"maxNumericValue": 300}]
      }
    }
  }
}
```

### Automated Performance Testing

```javascript
// playwright/performance.test.js
import { test, expect } from '@playwright/test';

test('should have good performance metrics', async ({ page }) => {
  const metrics = await page.evaluate(() => {
    return {
      fcp: performance.getEntriesByName('first-contentful-paint')[0]?.startTime,
      lcp: performance.getEntriesByType('largest-contentful-paint')[0]?.renderTime,
      cls: performance.getEntriesByType('layout-shift')[0]?.value,
    };
  });
  
  expect(metrics.fcp).toBeLessThan(1800);
  expect(metrics.lcp).toBeLessThan(2500);
  expect(metrics.cls).toBeLessThan(0.1);
});
```

## Best Practices

### Performance Checklist

1. **Optimize Images**: Use WebP/AVIF formats, proper sizing
2. **Minimize JavaScript**: Remove unused code, tree shake dependencies
3. **Use CDN**: Serve static assets from content delivery networks
4. **Enable Compression**: Use Gzip/Brotli compression
5. **Implement Caching**: Set proper cache headers
6. **Lazy Load**: Load non-critical resources on demand
7. **Preload Critical Resources**: Prioritize above-the-fold content
8. **Minimize Third-Party Scripts**: Audit and optimize external dependencies
9. **Use Web Workers**: Offload heavy computations
10. **Monitor Performance**: Continuously track metrics

### Development Workflow

1. **Profile Regularly**: Use browser dev tools to identify bottlenecks
2. **Test on Mobile**: Ensure performance on slower devices
3. **Audit with Lighthouse**: Run performance audits frequently
4. **Monitor Real Users**: Track actual user experience metrics
5. **Set Performance Budgets**: Define and enforce performance constraints
6. **Optimize Iteratively**: Make small improvements over time
7. **Document Optimizations**: Keep track of what works and what doesn't

### Deployment Optimization

1. **Pre-deployment Testing**: Run full performance suite before deploy
2. **Staging Environment**: Test performance in production-like environment
3. **Rollback Strategy**: Have plan for performance regressions
4. **A/B Testing**: Compare performance of different implementations
5. **Post-deployment Monitoring**: Track impact of changes

## Troubleshooting

### Common Performance Issues

1. **Large Bundle Sizes**: Use bundle analyzer to identify large dependencies
2. **Slow Image Loading**: Optimize formats and implement lazy loading
3. **Blocking JavaScript**: Defer non-critical scripts
4. **Layout Shifts**: Reserve space for dynamic content
5. **Slow API Calls**: Implement caching and optimize server responses

### Debugging Tools

1. **Chrome DevTools**: Performance tab for detailed analysis
2. **Lighthouse**: Automated performance auditing
3. **WebPageTest**: Detailed performance testing
4. **Bundle Analyzer**: Next.js bundle analysis
5. **Network Tab**: Identify slow-loading resources

### Performance Recovery

1. **Identify Bottlenecks**: Use profiling tools to find issues
2. **Prioritize Fixes**: Address highest-impact issues first
3. **Implement Solutions**: Apply appropriate optimization techniques
4. **Verify Improvements**: Test to ensure fixes work
5. **Monitor Long-term**: Continue tracking performance metrics

## Resources

- [Next.js Performance Documentation](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Web.dev Performance Guide](https://web.dev/fast/)
- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [Lighthouse Documentation](https://developer.chrome.com/docs/lighthouse/overview/)
- [Web Fundamentals Performance](https://developers.google.com/web/fundamentals/performance)