# Enhanced Scroll Animations

## Overview

The enhanced experience page implements professional scroll-triggered animations that create a dynamic journey through your professional history. Content slides in from alternating sides (left and right) as you scroll down the page.

## Features

1. **Alternating Slide-In Animations**
   - Content slides in from the left on odd items
   - Content slides in from the right on even items
   - Smooth, professional transitions

2. **Scroll-Triggered Animations**
   - Animations trigger as elements enter the viewport
   - Uses Framer Motion's `useInView` hook for precise triggering
   - Elements animate only once for performance

3. **Accessibility Support**
   - Respects user's reduced motion preferences
   - Smooth animations that don't cause motion sickness
   - Proper ARIA attributes

4. **Visual Enhancements**
   - Timeline with animated dots
   - Hover effects on cards
   - Gradient accents
   - Parallax effects on section headers

## Implementation Details

### Animation Logic
```tsx
// Content slides in from alternating sides
initial={prefersReducedMotion ? { opacity: 1 } : { 
  opacity: 0, 
  x: index % 2 === 0 ? (prefersReducedMotion ? 0 : -100) : (prefersReducedMotion ? 0 : 100) 
}}
animate={prefersReducedMotion ? { opacity: 1 } : { 
  opacity: isInView[index] ? 1 : 0, 
  x: isInView[index] ? 0 : (index % 2 === 0 ? -100 : 100) 
}}
```

### Scroll Detection
```tsx
// Create refs for each experience item
const experienceRefs = experiences.map(() => useRef(null));
const isInView = experienceRefs.map(ref => useInView(ref, { once: true, margin: "-100px" }));
```

### Accessibility Handling
```tsx
// Respect user's motion preferences
const prefersReducedMotion = usePrefersReducedMotion();

// Disable animations for users who prefer reduced motion
initial={prefersReducedMotion ? { opacity: 1 } : { 
  opacity: 0, 
  x: index % 2 === 0 ? 0 : 100 
}}
```

## Customization Options

### Adjust Animation Timing
```tsx
transition={{ 
  duration: 0.7, 
  ease: "easeOut",
  delay: 0.1 
}}
```

### Modify Trigger Margin
```tsx
useInView(ref, { once: true, margin: "-50px" })
```

### Change Animation Direction
```tsx
// Modify this condition to change which side content comes from
x: index % 2 === 0 ? -100 : 100
```

## Performance Considerations

1. **Once Animation**: Elements animate only once (`once: true`) to prevent performance issues
2. **Margin Triggering**: Animations trigger before elements are fully in view (`margin: "-100px"`)
3. **Reduced Motion Support**: Animations are disabled for users who prefer reduced motion
4. **Efficient Hooks**: Uses `useInView` for efficient scroll detection

## Browser Support

The implementation works in all modern browsers that support:
- Intersection Observer API
- CSS transforms
- CSS transitions
- React hooks

Fallbacks are provided for users with JavaScript disabled or reduced motion preferences.