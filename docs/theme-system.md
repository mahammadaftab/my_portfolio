# Theme System Documentation

This guide provides detailed information about implementing and customizing the theme system in the portfolio website using next-themes.

## Table of Contents

1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Basic Setup](#basic-setup)
4. [Theme Provider Configuration](#theme-provider-configuration)
5. [Dark Mode Implementation](#dark-mode-implementation)
6. [Customizing Themes](#customizing-themes)
7. [System Preference Detection](#system-preference-detection)
8. [Theme Persistence](#theme-persistence)
9. [Component-Level Theming](#component-level-theming)
10. [Advanced Features](#advanced-features)
11. [Performance Considerations](#performance-considerations)
12. [Accessibility](#accessibility)
13. [Testing](#testing)
14. [Troubleshooting](#troubleshooting)

## Overview

The portfolio website implements a comprehensive theme system using [next-themes](https://github.com/pacocoursey/next-themes), which provides:

- Light and dark mode support
- System preference detection
- Theme persistence across sessions
- Smooth theme transitions
- SSR compatibility
- Custom theme support

## Technology Stack

### Core Libraries

1. **next-themes**: Theme management for Next.js applications
2. **Next.js**: React framework with App Router
3. **Tailwind CSS**: Utility-first CSS framework
4. **CSS Variables**: For dynamic theme values

### Installation

```bash
npm install next-themes
```

## Basic Setup

### Theme Provider

The theme provider wraps the entire application in [src/app/layout.tsx](file:///c%3A/Users/mdaft/OneDrive/Desktop/portfolio/portfolio/src/app/layout.tsx):

```typescript
// src/components/theme-provider.tsx
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
```

### Root Layout Integration

```typescript
// src/app/layout.tsx
import { ThemeProvider } from "@/components/theme-provider"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

## Theme Provider Configuration

### Provider Props

The ThemeProvider accepts several configuration options:

```typescript
<ThemeProvider
  attribute="class"           // HTML attribute to apply theme to
  defaultTheme="system"       // Default theme ('light', 'dark', 'system')
  enableSystem={true}         // Enable system theme detection
  disableTransitionOnChange={false} // Disable transition on theme change
  themes={['light', 'dark']}  // Available themes
  storageKey="theme"          // localStorage key
  nonce=""                    // CSP nonce
>
  {children}
</ThemeProvider>
```

### Attribute Options

1. **class**: Applies theme as CSS class (recommended for Tailwind)
2. **data-theme**: Applies theme as data attribute
3. **style**: Applies theme as inline styles

## Dark Mode Implementation

### CSS Class Approach (Tailwind)

Tailwind CSS uses the `class` strategy for dark mode:

```css
/* tailwind.config.js */
module.exports = {
  darkMode: 'class',
  // ...
}
```

### HTML Structure

```html
<!-- Light mode -->
<html class="light">

<!-- Dark mode -->
<html class="dark">
```

### Styling with Tailwind

```tsx
// Using Tailwind classes
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  Content
</div>
```

### Theme Toggle Component

```tsx
// src/components/theme-toggle.tsx
"use client"

import { useTheme } from "next-themes"
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <SunIcon className="h-5 w-5" />
      ) : (
        <MoonIcon className="h-5 w-5" />
      )}
    </button>
  )
}
```

## Customizing Themes

### Adding Custom Themes

```typescript
// src/components/theme-provider.tsx
<ThemeProvider
  themes={['light', 'dark', 'purple', 'green']}
  defaultTheme="light"
>
  {children}
</ThemeProvider>
```

### CSS Variable Approach

Define theme colors using CSS variables:

```css
/* src/app/globals.css */
:root {
  --background: #ffffff;
  --foreground: #171717;
  --primary: #3b82f6;
}

.dark {
  --background: #0a0a0a;
  --foreground: #ededed;
  --primary: #60a5fa;
}

.purple {
  --background: #f5f3ff;
  --foreground: #4c1d95;
  --primary: #8b5cf6;
}

[data-theme="green"] {
  --background: #f0fdf4;
  --foreground: #14532d;
  --primary: #22c55e;
}

body {
  background: var(--background);
  color: var(--foreground);
}
```

### Using CSS Variables in Components

```tsx
// src/components/card.tsx
export function Card() {
  return (
    <div 
      className="p-6 rounded-lg shadow"
      style={{ 
        backgroundColor: 'var(--background)',
        color: 'var(--foreground)',
        border: '1px solid var(--primary)'
      }}
    >
      Card content
    </div>
  )
}
```

## System Preference Detection

### Automatic Detection

The system automatically detects user preferences:

```typescript
<ThemeProvider
  attribute="class"
  defaultTheme="system"
  enableSystem={true}
>
  {children}
</ThemeProvider>
```

### Media Query Support

```css
/* CSS media query for system preference */
@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}
```

### JavaScript Detection

```typescript
// src/lib/theme-utils.ts
export function getSystemTheme() {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? 'dark' 
      : 'light'
  }
  return 'light'
}
```

## Theme Persistence

### localStorage Storage

Themes are automatically persisted in localStorage:

```typescript
// Default storage key
const storageKey = "theme"

// Stored value
localStorage.getItem("theme") // "dark"
```

### Custom Storage Key

```typescript
<ThemeProvider storageKey="my-theme-key">
  {children}
</ThemeProvider>
```

### Server-Side Rendering

The theme is properly handled during SSR:

```typescript
// src/app/layout.tsx
<html lang="en" suppressHydrationWarning>
```

The `suppressHydrationWarning` prop prevents hydration mismatches.

## Component-Level Theming

### Using useTheme Hook

```tsx
// src/components/theme-aware-component.tsx
"use client"

import { useTheme } from "next-themes"

export function ThemeAwareComponent() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  
  return (
    <div>
      <p>Current theme: {theme}</p>
      <p>Resolved theme: {resolvedTheme}</p>
      <button onClick={() => setTheme("dark")}>
        Set dark theme
      </button>
    </div>
  )
}
```

### Theme-Specific Rendering

```tsx
export function ConditionalComponent() {
  const { resolvedTheme } = useTheme()
  
  return (
    <>
      {resolvedTheme === "dark" && <DarkModeContent />}
      {resolvedTheme === "light" && <LightModeContent />}
    </>
  )
}
```

### Theme Change Effects

```tsx
import { useEffect } from "react"
import { useTheme } from "next-themes"

export function ThemeEffects() {
  const { resolvedTheme } = useTheme()
  
  useEffect(() => {
    // Apply theme-specific effects
    if (resolvedTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [resolvedTheme])
  
  return <div>Content</div>
}
```

## Advanced Features

### Theme Change Events

Listen for theme changes:

```tsx
import { useEffect } from "react"
import { useTheme } from "next-themes"

export function ThemeListener() {
  const { theme } = useTheme()
  
  useEffect(() => {
    // Handle theme change
    console.log("Theme changed to:", theme)
    
    // Custom logic for theme change
    if (theme === "dark") {
      // Dark mode specific logic
    }
  }, [theme])
  
  return <div>Content</div>
}
```

### Forced Theme

Temporarily force a theme:

```tsx
import { useTheme } from "next-themes"

export function ForceThemeExample() {
  const { setTheme, forcedTheme } = useTheme()
  
  return (
    <div>
      <button onClick={() => setTheme("dark", { force: true })}>
        Force dark theme
      </button>
      {forcedTheme && <p>Theme is forced: {forcedTheme}</p>}
    </div>
  )
}
```

### Theme Status

Check theme loading status:

```tsx
import { useTheme } from "next-themes"

export function ThemeStatus() {
  const { status } = useTheme()
  
  if (status === "loading") {
    return <div>Loading theme...</div>
  }
  
  return <div>Theme loaded</div>
}
```

## Performance Considerations

### Minimize Re-renders

Use React.memo for theme-aware components:

```tsx
import { memo } from "react"
import { useTheme } from "next-themes"

const ThemeAwareComponent = memo(() => {
  const { theme } = useTheme()
  
  return <div>Theme: {theme}</div>
})

export default ThemeAwareComponent
```

### Lazy Loading

Load theme-aware components conditionally:

```tsx
import { useTheme } from "next-themes"
import dynamic from "next/dynamic"

const DarkModeComponent = dynamic(() => import("../components/dark-mode"))

export function ConditionalThemeComponent() {
  const { resolvedTheme } = useTheme()
  
  return resolvedTheme === "dark" ? <DarkModeComponent /> : null
}
```

### CSS Optimization

Use CSS variables efficiently:

```css
/* Define variables once */
:root {
  --transition-speed: 0.3s;
}

/* Use in components */
.button {
  transition: background-color var(--transition-speed);
}
```

## Accessibility

### Reduced Motion Support

Respect user motion preferences:

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

### Focus Styles

Ensure proper focus indicators in all themes:

```css
/* src/app/globals.css */
.focus-ring {
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2;
}

.dark .focus-ring {
  @apply focus:ring-offset-gray-900;
}
```

### Contrast Ratios

Maintain proper contrast for accessibility:

```css
/* WCAG AA compliant contrast ratios */
.text-primary {
  color: #1f2937; /* 4.5:1 contrast on white */
}

.dark .text-primary {
  color: #f9fafb; /* 4.5:1 contrast on dark */
}
```

## Testing

### Unit Testing

Test theme-aware components:

```tsx
// src/components/theme-toggle.test.tsx
import { render, screen } from "@testing-library/react"
import { ThemeProvider } from "next-themes"
import { ThemeToggle } from "./theme-toggle"

describe("ThemeToggle", () => {
  it("renders correctly", () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )
    
    expect(screen.getByLabelText("Toggle theme")).toBeInTheDocument()
  })
})
```

### Integration Testing

Test theme switching:

```tsx
import { render, screen, fireEvent } from "@testing-library/react"
import { ThemeProvider } from "next-themes"
import { ThemeToggle } from "./theme-toggle"

describe("ThemeToggle", () => {
  it("switches themes when clicked", () => {
    render(
      <ThemeProvider defaultTheme="light">
        <ThemeToggle />
      </ThemeProvider>
    )
    
    const button = screen.getByLabelText("Toggle theme")
    fireEvent.click(button)
    
    // Check if theme changed
  })
})
```

### Visual Regression Testing

Test theme appearance with visual testing tools:

```js
// cypress/e2e/theme.cy.js
describe("Theme Switching", () => {
  it("switches to dark mode", () => {
    cy.visit("/")
    cy.get("[aria-label='Toggle theme']").click()
    cy.get("html").should("have.class", "dark")
  })
})
```

## Troubleshooting

### Common Issues

1. **Theme not persisting**: Check localStorage and storageKey configuration
2. **Flash of incorrect theme**: Ensure proper SSR setup with suppressHydrationWarning
3. **System theme not detected**: Verify enableSystem is true
4. **Transition issues**: Check disableTransitionOnChange setting

### Debugging Tips

1. **Check localStorage**: `localStorage.getItem("theme")`
2. **Inspect HTML**: Look for theme classes on html element
3. **Console logging**: Use useTheme hook to log theme values
4. **Network tab**: Check for CSS loading issues

### Migration from v0.1.x to v0.2.x

```typescript
// Old (v0.1.x)
import { ThemeProvider } from "next-themes/dist/types"

// New (v0.2.x)
import { ThemeProvider } from "next-themes"
```

## Best Practices

### Theme Design

1. **Consistent color palette** across themes
2. **Meaningful theme names** (light, dark, not theme1, theme2)
3. **Proper contrast ratios** for accessibility
4. **Smooth transitions** between themes

### Implementation

1. **Use CSS variables** for dynamic theming
2. **Minimize theme-specific components** when possible
3. **Test on multiple devices** and browsers
4. **Provide user controls** for theme selection
5. **Respect system preferences** by default
6. **Handle loading states** properly

### Performance

1. **Avoid expensive operations** in theme change handlers
2. **Use CSS transitions** instead of JavaScript animations
3. **Preload critical theme assets**
4. **Minimize re-renders** with React.memo

### Accessibility

1. **Maintain proper contrast** in all themes
2. **Provide sufficient focus indicators**
3. **Respect reduced motion preferences**
4. **Use semantic HTML** for theme controls
5. **Test with screen readers**

## Resources

- [next-themes Documentation](https://github.com/pacocoursey/next-themes)
- [Tailwind CSS Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [prefers-color-scheme Media Query](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)
- [Web Content Accessibility Guidelines (WCAG)](https://www.w3.org/WAI/standards-guidelines/wcag/)