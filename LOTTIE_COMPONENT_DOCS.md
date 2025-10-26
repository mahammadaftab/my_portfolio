# Advanced Lottie Animation Component

## Overview

The improved Lottie animation component provides a professional and advanced implementation with enhanced features, accessibility, performance optimizations, and error handling.

## Features

1. **Enhanced Animation Controls**
   - Speed adjustment
   - Direction control
   - Segment playback
   - Event handling (onComplete, onLoopComplete, etc.)

2. **Interactive Modes**
   - Play on hover
   - Play on click
   - Auto-play control

3. **Accessibility Features**
   - Reduced motion support
   - ARIA labels and roles
   - Proper fallback icons

4. **Performance Optimizations**
   - Loading states
   - Error handling
   - Memory cleanup

5. **Professional Fallbacks**
   - Custom fallback icons
   - Loading indicators
   - Error states

## Usage Examples

### Basic Usage
```tsx
<LottieAnimation 
  animationData={animationData}
  size={100}
  loop={true}
  autoplay={true}
/>
```

### Interactive Animation
```tsx
<LottieAnimation 
  animationData={animationData}
  size={100}
  loop={false}
  autoplay={false}
  playOnHover={true}
  playOnClick={true}
  ariaLabel="Interactive button animation"
/>
```

### Advanced Configuration
```tsx
<LottieAnimation 
  animationData={animationData}
  size={100}
  loop={true}
  autoplay={true}
  speed={1.5}
  direction={1}
  segments={[0, 30]}
  onComplete={() => console.log("Animation completed")}
  onLoopComplete={() => console.log("Loop completed")}
  ariaLabel="Advanced animation"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| animationData | unknown | - | Lottie animation JSON data |
| className | string | "" | Additional CSS classes |
| loop | boolean | true | Loop the animation |
| autoplay | boolean | true | Auto-play the animation |
| size | number/string | 100 | Width and height of the animation |
| speed | number | 1 | Animation speed multiplier |
| direction | number | 1 | Animation direction (1 forward, -1 backward) |
| segments | [number, number] | null | Play specific segments |
| onComplete | function | - | Callback when animation completes |
| onLoopComplete | function | - | Callback when loop completes |
| onEnterFrame | function | - | Callback on each frame |
| onSegmentStart | function | - | Callback when segment starts |
| ariaLabel | string | "Animation" | ARIA label for accessibility |
| role | string | "img" | ARIA role |
| playOnHover | boolean | false | Play animation on hover |
| playOnClick | boolean | false | Play animation on click |
| fallbackIcon | ReactNode | - | Custom fallback icon |

## Best Practices

1. **Performance**: Use `playOnHover` and `playOnClick` for better performance instead of auto-playing multiple animations
2. **Accessibility**: Always provide meaningful `ariaLabel` props
3. **Size**: Specify appropriate sizes to avoid layout shifts
4. **Fallbacks**: Provide custom fallback icons for better user experience
5. **Error Handling**: The component handles errors gracefully with fallback icons

## Lottie Animation Files

Place your Lottie JSON files in the `public/lotties/` directory to access them directly:

```tsx
// For files in public/lotties/
// Access via: /lotties/animation.json
```

## Browser Support

The component supports all modern browsers and includes fallbacks for:
- Browsers that don't support Lottie
- Users with reduced motion preferences
- Loading states
- Error states

## Customization

You can customize the fallback icons by passing your own React components:

```tsx
<LottieAnimation 
  animationData={animationData}
  fallbackIcon={
    <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
    </svg>
  }
/>
```