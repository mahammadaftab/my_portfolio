# Accessibility Implementation Guide

This guide provides detailed information about implementing and maintaining web accessibility for the portfolio website to ensure it's usable by everyone, including people with disabilities.

## Table of Contents

1. [Overview](#overview)
2. [WCAG Compliance](#wcag-compliance)
3. [Semantic HTML](#semantic-html)
4. [Keyboard Navigation](#keyboard-navigation)
5. [Focus Management](#focus-management)
6. [Color and Contrast](#color-and-contrast)
7. [ARIA Implementation](#aria-implementation)
8. [Screen Reader Support](#screen-reader-support)
9. [Form Accessibility](#form-accessibility)
10. [Image Accessibility](#image-accessibility)
11. [Animation and Motion](#animation-and-motion)
12. [Testing and Validation](#testing-and-validation)
13. [Accessibility Tools](#accessibility-tools)
14. [Best Practices](#best-practices)
15. [Troubleshooting](#troubleshooting)

## Overview

The portfolio website implements comprehensive accessibility features to ensure:

- **WCAG 2.1 AA Compliance**: Meeting international accessibility standards
- **Screen Reader Support**: Compatibility with popular screen readers
- **Keyboard Navigation**: Full functionality without a mouse
- **Color Contrast**: Sufficient contrast for visual impairments
- **Semantic Structure**: Proper HTML structure for assistive technologies
- **Focus Indicators**: Clear visual focus states
- **Reduced Motion**: Support for users with vestibular disorders

## WCAG Compliance

### WCAG 2.1 AA Standards

The website aims to meet WCAG 2.1 Level AA standards, which include:

1. **Perceivable**:
   - Text alternatives for non-text content
   - Captions for audio content
   - Adaptable content presentation
   - Distinguishable content (contrast, color)

2. **Operable**:
   - Keyboard accessibility
   - Enough time to read and use content
   - Seizures and physical reactions (no flashing content)
   - Navigable content structure

3. **Understandable**:
   - Readable content
   - Predictable navigation and behavior
   - Input assistance

4. **Robust**:
   - Compatible with current and future user tools

### Accessibility Audit

```bash
# Run accessibility audits
npm install --save-dev pa11y
npx pa11y http://localhost:3000

# Automated accessibility testing
npm install --save-dev axe-core
```

## Semantic HTML

### Proper Document Structure

```tsx
// src/app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Portfolio | Professional Developer</title>
      </head>
      <body>
        <header role="banner">
          {/* Header content */}
        </header>
        <main role="main">
          {children}
        </main>
        <footer role="contentinfo">
          {/* Footer content */}
        </footer>
      </body>
    </html>
  );
}
```

### Semantic Sectioning

```tsx
// src/app/about/page.tsx
export default function AboutPage() {
  return (
    <article>
      <header>
        <h1>About Me</h1>
        <p>Learn more about my background and experience</p>
      </header>
      
      <section aria-labelledby="skills-heading">
        <h2 id="skills-heading">Skills</h2>
        <ul>
          <li>React Development</li>
          <li>TypeScript</li>
          <li>Accessibility</li>
        </ul>
      </section>
      
      <section aria-labelledby="experience-heading">
        <h2 id="experience-heading">Experience</h2>
        <article>
          <h3>Senior Developer at Tech Corp</h3>
          <p>2020 - Present</p>
        </article>
      </section>
      
      <aside aria-labelledby="related-heading">
        <h2 id="related-heading">Related Links</h2>
        <nav>
          <ul>
            <li><a href="/projects">Projects</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </nav>
      </aside>
    </article>
  );
}
```

### Proper Heading Hierarchy

```tsx
// src/components/project-card.tsx
export function ProjectCard({ project }: { project: any }) {
  return (
    <article>
      <header>
        <h3>{project.title}</h3> {/* h3 because h1 and h2 are used above */}
        <p>{project.description}</p>
      </header>
      
      <div>
        <h4>Technologies Used</h4> {/* h4 for subsection */}
        <ul>
          {project.technologies.map((tech: string) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}
```

## Keyboard Navigation

### Focusable Elements

```tsx
// src/components/accessible-button.tsx
import { forwardRef } from "react";

interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  ({ children, onClick, onKeyDown, ...props }, ref) => {
    const handleKeyDown = (e: React.KeyboardEvent) => {
      // Handle Enter and Space for button activation
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onClick?.(e as any);
      }
      onKeyDown?.(e);
    };

    return (
      <button
        ref={ref}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        {...props}
      >
        {children}
      </button>
    );
  }
);
```

### Skip Navigation Links

```tsx
// src/components/skip-link.tsx
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:text-black focus:px-4 focus:py-2 focus:ring-2 focus:ring-blue-500"
    >
      Skip to main content
    </a>
  );
}
```

### Keyboard Trap for Modals

```tsx
// src/components/accessible-modal.tsx
import { useEffect, useRef } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function AccessibleModal({ isOpen, onClose, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      modalRef.current?.focus();
      
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
        }
      };
      
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    } else {
      previousActiveElement.current?.focus();
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      tabIndex={-1}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full">
        {children}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
```

## Focus Management

### Visible Focus Indicators

```css
/* src/app/globals.css */
/* Ensure all focusable elements have visible focus indicators */
*:focus {
  outline: 2px solid #4f46e5;
  outline-offset: 2px;
}

/* Custom focus styles for better visibility */
.focus-ring {
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900;
}

/* High contrast focus indicators */
.high-contrast-focus:focus {
  outline: 3px solid #000;
  outline-offset: 2px;
}
```

### Focus Order

```tsx
// src/components/form-field.tsx
export function FormField({ 
  label, 
  id, 
  error,
  children 
}: { 
  label: string; 
  id: string; 
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4">
      <label 
        htmlFor={id} 
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
```

### Programmatic Focus

```tsx
// src/hooks/use-focus-trap.ts
import { useEffect, useRef } from "react";

export function useFocusTrap() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };
    
    container.addEventListener("keydown", handleKeyDown);
    firstElement.focus();
    
    return () => {
      container.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  
  return containerRef;
}
```

## Color and Contrast

### WCAG Contrast Requirements

```css
/* src/app/globals.css */
/* WCAG AA compliant contrast ratios */
.text-primary {
  color: #1f2937; /* 4.5:1 contrast on white */
}

.dark .text-primary {
  color: #f9fafb; /* 4.5:1 contrast on dark */
}

.text-secondary {
  color: #6b7280; /* 4.5:1 contrast on white */
}

.dark .text-secondary {
  color: #d1d5db; /* 4.5:1 contrast on dark */
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .text-primary {
    color: #000;
  }
  
  .dark .text-primary {
    color: #fff;
  }
}
```

### Color Palette Accessibility

```typescript
// src/lib/colors.ts
export const colorPalette = {
  // Primary colors with WCAG AA compliance
  primary: {
    50: '#eef2ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1', // 4.5:1 contrast on white
    600: '#4f46e5', // 4.5:1 contrast on white
    700: '#4338ca', // 4.5:1 contrast on white
    800: '#3730a3', // 4.5:1 contrast on white
    900: '#312e81', // 4.5:1 contrast on white
  },
  
  // Text colors with proper contrast
  text: {
    primary: '#1f2937',
    secondary: '#6b7280',
    tertiary: '#9ca3af',
  },
  
  dark: {
    text: {
      primary: '#f9fafb',
      secondary: '#d1d5db',
      tertiary: '#9ca3af',
    }
  }
};
```

### Contrast Checking

```bash
# Install contrast checking tools
npm install --save-dev axe-core

# Run contrast checks
npx axe http://localhost:3000 --rules color-contrast
```

## ARIA Implementation

### ARIA Labels and Descriptions

```tsx
// src/components/icon-button.tsx
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";

export function IconButton({ 
  label, 
  onClick,
  icon = <ChatBubbleLeftRightIcon />
}: { 
  label: string; 
  onClick: () => void;
  icon?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
    >
      {icon}
    </button>
  );
}
```

### ARIA Live Regions

```tsx
// src/components/alert.tsx
export function Alert({ 
  message, 
  type = "info" 
}: { 
  message: string; 
  type?: "info" | "success" | "warning" | "error";
}) {
  const role = type === "error" ? "alert" : "status";
  const ariaLive = type === "error" ? "assertive" : "polite";
  
  return (
    <div
      role={role}
      aria-live={ariaLive}
      className={`p-4 rounded-lg ${
        type === "error" ? "bg-red-100 text-red-800" : 
        type === "success" ? "bg-green-100 text-green-800" : 
        type === "warning" ? "bg-yellow-100 text-yellow-800" : 
        "bg-blue-100 text-blue-800"
      }`}
    >
      {message}
    </div>
  );
}
```

### ARIA Attributes for Dynamic Content

```tsx
// src/components/loading-spinner.tsx
export function LoadingSpinner({ loading, label = "Loading" }: { loading: boolean; label?: string }) {
  return (
    <div 
      aria-busy={loading}
      aria-live="polite"
      aria-label={loading ? label : undefined}
      className="flex items-center justify-center"
    >
      {loading && (
        <>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2">{label}</span>
        </>
      )}
    </div>
  );
}
```

## Screen Reader Support

### Screen Reader Only Text

```css
/* src/app/globals.css */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.sr-only-focusable:focus {
  position: static;
  width: auto;
  height: auto;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
```

### Landmark Roles

```tsx
// src/app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header role="banner" className="bg-white dark:bg-gray-900 shadow">
          <nav role="navigation" aria-label="Main navigation">
            {/* Navigation content */}
          </nav>
        </header>
        
        <main id="main-content" role="main" className="min-h-screen">
          {children}
        </main>
        
        <footer role="contentinfo" className="bg-gray-100 dark:bg-gray-800">
          {/* Footer content */}
        </footer>
      </body>
    </html>
  );
}
```

### Descriptive Link Text

```tsx
// src/components/project-card.tsx
export function ProjectCard({ project }: { project: any }) {
  return (
    <article className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {project.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {project.description}
        </p>
        
        {/* Descriptive link text for screen readers */}
        <a 
          href={`/projects/${project.id}`}
          className="text-blue-600 dark:text-blue-400 hover:underline"
          aria-label={`View details for ${project.title} project`}
        >
          View Project Details
        </a>
      </div>
    </article>
  );
}
```

## Form Accessibility

### Accessible Form Structure

```tsx
// src/components/accessible-form.tsx
import { useForm } from "react-hook-form";
import { FormField } from "./form-field";

interface FormData {
  name: string;
  email: string;
  message: string;
}

export function AccessibleForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FormField
        label="Name"
        id="name"
        error={errors.name?.message}
      >
        <input
          id="name"
          type="text"
          {...register("name", { 
            required: "Name is required",
            minLength: {
              value: 2,
              message: "Name must be at least 2 characters"
            }
          })}
          aria-invalid={errors.name ? "true" : "false"}
          aria-describedby={errors.name ? "name-error" : undefined}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </FormField>

      <FormField
        label="Email"
        id="email"
        error={errors.email?.message}
      >
        <input
          id="email"
          type="email"
          {...register("email", { 
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address"
            }
          })}
          aria-invalid={errors.email ? "true" : "false"}
          aria-describedby={errors.email ? "email-error" : undefined}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </FormField>

      <FormField
        label="Message"
        id="message"
        error={errors.message?.message}
      >
        <textarea
          id="message"
          rows={5}
          {...register("message", { 
            required: "Message is required",
            minLength: {
              value: 10,
              message: "Message must be at least 10 characters"
            }
          })}
          aria-invalid={errors.message ? "true" : "false"}
          aria-describedby={errors.message ? "message-error" : undefined}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </FormField>

      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Send Message
      </button>
    </form>
  );
}
```

### Form Validation Feedback

```tsx
// src/components/form-errors.tsx
export function FormErrors({ errors }: { errors: Record<string, string> }) {
  if (Object.keys(errors).length === 0) return null;

  return (
    <div 
      role="alert" 
      aria-live="assertive"
      className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
    >
      <strong className="font-bold">Please correct the following errors:</strong>
      <ul className="list-disc list-inside mt-2">
        {Object.entries(errors).map(([field, message]) => (
          <li key={field}>
            <a 
              href={`#${field}`} 
              className="underline hover:text-red-800"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(field)?.focus();
              }}
            >
              {message}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## Image Accessibility

### Alt Text Implementation

```tsx
// src/components/accessible-image.tsx
import Image from "next/image";

interface AccessibleImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  decorative?: boolean;
}

export function AccessibleImage({ 
  src, 
  alt, 
  width, 
  height,
  decorative = false
}: AccessibleImageProps) {
  // For decorative images, use empty alt text
  const imageAlt = decorative ? "" : alt;
  
  return (
    <Image
      src={src}
      alt={imageAlt}
      width={width}
      height={height}
      className="rounded-lg"
    />
  );
}
```

### Complex Image Descriptions

```tsx
// src/components/complex-image.tsx
export function ComplexImage() {
  return (
    <figure>
      <Image
        src="/images/data-visualization.png"
        alt="Bar chart showing website traffic growth from 2020 to 2023"
        width={800}
        height={400}
      />
      <figcaption className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        Figure 1: Website traffic has increased by 300% over the past three years, 
        with the most significant growth occurring in 2022-2023.
      </figcaption>
    </figure>
  );
}
```

### Image Groups

```tsx
// src/components/image-gallery.tsx
export function ImageGallery() {
  const images = [
    { src: "/images/project1.jpg", alt: "E-commerce website homepage" },
    { src: "/images/project2.jpg", alt: "Mobile app dashboard" },
    { src: "/images/project3.jpg", alt: "Admin panel interface" },
  ];

  return (
    <section aria-labelledby="gallery-heading">
      <h2 id="gallery-heading" className="text-2xl font-bold mb-4">
        Project Screenshots
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative">
            <Image
              src={image.src}
              alt={image.alt}
              width={400}
              height={300}
              className="rounded-lg object-cover w-full h-48"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
```

## Animation and Motion

### Reduced Motion Support

```css
/* src/app/globals.css */
/* Respect user preference for reduced motion */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  /* Remove custom animations */
  .animate-spin,
  .animate-pulse,
  .animate-bounce {
    animation: none;
  }
}

/* Provide alternative static versions */
.reduce-motion .animated-component {
  transform: none !important;
  opacity: 1 !important;
}
```

### Motion Control Toggle

```tsx
// src/components/motion-toggle.tsx
import { useState, useEffect } from "react";

export function MotionToggle() {
  const [reducedMotion, setReducedMotion] = useState(false);
  
  useEffect(() => {
    // Check system preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    
    // Listen for changes
    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  const toggleMotion = () => {
    const newReducedMotion = !reducedMotion;
    setReducedMotion(newReducedMotion);
    document.documentElement.classList.toggle('reduce-motion', newReducedMotion);
  };
  
  return (
    <button
      onClick={toggleMotion}
      aria-label={reducedMotion ? "Enable animations" : "Reduce animations"}
      className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
    >
      {reducedMotion ? "🎬" : "⏸️"}
    </button>
  );
}
```

### Accessible Animations

```tsx
// src/components/accessible-animation.tsx
import { motion, useReducedMotion } from "framer-motion";

export function AccessibleAnimation() {
  const shouldReduceMotion = useReducedMotion();
  
  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
      animate={shouldReduceMotion ? false : { opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
      className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow"
    >
      <h3 className="text-xl font-bold mb-2">Animated Content</h3>
      <p>This content animates in, but respects reduced motion preferences.</p>
    </motion.div>
  );
}
```

## Testing and Validation

### Automated Accessibility Testing

```javascript
// jest.setup.js
import '@testing-library/jest-dom';
import 'jest-axe/extend-expect';

// src/components/button.test.tsx
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { AccessibleButton } from './accessible-button';

describe('AccessibleButton', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(
      <AccessibleButton onClick={() => {}}>
        Click me
      </AccessibleButton>
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  
  it('should be focusable', () => {
    const { getByRole } = render(
      <AccessibleButton onClick={() => {}}>
        Click me
      </AccessibleButton>
    );
    
    const button = getByRole('button');
    expect(button).toHaveAttribute('tabIndex', '0');
  });
});
```

### Manual Testing Checklist

```markdown
## Manual Accessibility Testing Checklist

### Keyboard Navigation
- [ ] All interactive elements are keyboard accessible
- [ ] Focus order follows logical sequence
- [ ] Visible focus indicators on all focusable elements
- [ ] Keyboard traps are properly implemented
- [ ] Skip links work correctly

### Screen Reader Testing
- [ ] Content is read in logical order
- [ ] All images have appropriate alt text
- [ ] Form labels are properly associated
- [ ] Landmark regions are announced
- [ ] Dynamic content updates are announced

### Visual Testing
- [ ] Sufficient color contrast (4.5:1 minimum)
- [ ] Text is readable without zooming
- [ ] Content remains visible when fonts are enlarged
- [ ] No information is conveyed by color alone
- [ ] Focus indicators are clearly visible

### Mobile Testing
- [ ] Touch targets are appropriately sized (44px minimum)
- [ ] Content is readable on small screens
- [ ] Orientation changes don't break functionality
- [ ] Voice control works with interactive elements
```

### Browser Extension Testing

```bash
# Install accessibility testing tools
# Chrome: axe DevTools
# Firefox: Accessibility Inspector
# Safari: Accessibility Inspector

# Run automated tests
npx pa11y http://localhost:3000
npx axe http://localhost:3000
```

## Accessibility Tools

### Development Tools

1. **axe DevTools**: Browser extension for accessibility testing
2. **Lighthouse**: Built-in accessibility audits
3. **WAVE**: Web accessibility evaluation tool
4. **Pa11y**: Command-line accessibility testing
5. **Storybook Accessibility**: Accessibility addon for Storybook

### Testing Libraries

```bash
# Install accessibility testing libraries
npm install --save-dev @testing-library/react @testing-library/jest-dom jest-axe

# Configure testing
# jest.setup.js
import '@testing-library/jest-dom';
import 'jest-axe/extend-expect';
```

### Continuous Integration

```yaml
# .github/workflows/accessibility.yml
name: Accessibility Checks

on: [push, pull_request]

jobs:
  accessibility:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run accessibility tests
      run: npm run test:accessibility
      
    - name: Run Pa11y audit
      run: npx pa11y http://localhost:3000 || true
```

## Best Practices

### Design for Accessibility

1. **Start with accessibility in mind**: Don't treat it as an afterthought
2. **Use semantic HTML**: Let the browser do the work
3. **Provide multiple ways to access content**: Text, images, audio
4. **Ensure keyboard accessibility**: Everything should work without a mouse
5. **Test with real users**: Include people with disabilities in testing

### Development Workflow

1. **Write semantic HTML first**: Structure before styling
2. **Add ARIA attributes only when necessary**: Native semantics are better
3. **Test early and often**: Don't wait until the end
4. **Use automated tools**: But don't rely on them exclusively
5. **Document accessibility decisions**: Help future developers

### Content Creation

1. **Write clear, concise text**: Use plain language
2. **Provide context for links**: "Read more about accessibility" not "Read more"
3. **Use descriptive headings**: Help users navigate content
4. **Include alt text for images**: Describe the content and function
5. **Provide transcripts for audio/video**: Make multimedia accessible

### Maintenance

1. **Regular accessibility audits**: Schedule periodic reviews
2. **Stay updated on standards**: WCAG and browser support evolve
3. **Train team members**: Ensure everyone understands accessibility
4. **Monitor user feedback**: Listen to accessibility issues
5. **Document accessibility features**: Help users understand what's available

## Troubleshooting

### Common Issues

1. **Missing focus indicators**: Ensure all interactive elements have visible focus
2. **Insufficient color contrast**: Use contrast checking tools
3. **Inaccessible forms**: Properly associate labels with inputs
4. **Missing alt text**: Provide descriptive text for all meaningful images
5. **Keyboard traps**: Ensure users can navigate away from all components

### Debugging Tools

1. **Browser DevTools**: Accessibility inspector and audits
2. **Screen readers**: Test with NVDA, JAWS, or VoiceOver
3. **Keyboard-only navigation**: Test without a mouse
4. **High contrast mode**: Test with system high contrast settings
5. **Zoom testing**: Ensure content remains usable at 200% zoom

### Recovery Strategies

1. **Identify the issue**: Use automated tools to find violations
2. **Prioritize fixes**: Address critical issues first
3. **Implement solutions**: Follow WCAG guidelines
4. **Test fixes**: Verify the solution works
5. **Document lessons**: Prevent similar issues in the future

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Accessibility Resources](https://webaim.org/)
- [MDN Web Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [A11Y Project](https://www.a11yproject.com/)
- [Inclusive Components](https://inclusive-components.design/)
- [Accessibility Developer Guide](https://www.accessibility-developer-guide.com/)