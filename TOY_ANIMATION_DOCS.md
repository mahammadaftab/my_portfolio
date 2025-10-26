# Toy Animation for Contact Page

## Overview

A playful toy-like Lottie animation has been added below the social media links in the contact page to create a fun and engaging user experience.

## Features

1. **Bouncing Ball Animation**
   - Red ball that moves horizontally across the container
   - Squash and stretch effect for realistic physics
   - Smooth easing transitions

2. **Rotating Star**
   - Yellow star that moves vertically
   - Continuous 360-degree rotation
   - Complementary movement to the ball

3. **Playful Design**
   - Bright, cheerful colors (red and yellow)
   - Simple geometric shapes
   - Smooth, looping animation

4. **Accessibility Support**
   - Proper ARIA labeling
   - Reduced motion support
   - Appropriate sizing

## Implementation Details

### Animation Placement
```tsx
<div className="mt-8 flex justify-center">
  <LottieAnimation 
    animationData={null}
    size={80}
    loop={true}
    autoplay={true}
    ariaLabel="Playful toy animation"
  />
</div>
```

### Animation Properties
- **Size**: 80px (large enough to be noticeable but not overwhelming)
- **Loop**: Continuous playback
- **Autoplay**: Starts automatically when in viewport
- **Position**: Centered below social links with top margin

## Animation Description

The toy animation features two elements:
1. A red ball that bounces horizontally from left to right with a squash effect
2. A yellow star that moves vertically while rotating 360 degrees

The combination creates a playful, toy-like effect that suggests movement and energy.

## Customization Options

### Adjust Size
```tsx
size={80} // Change to any pixel value
```

### Modify Colors
Colors are defined in the JSON file:
- Ball: Red (#EA5757)
- Star: Yellow (#F9D737)

### Change Animation Speed
The animation timing is controlled in the JSON file with keyframes at:
- 0 frames: Initial position
- 60 frames: Mid-point position
- 120 frames: Return to initial position

## Performance Considerations

1. **Lightweight Animation**
   - Simple vector shapes for small file size
   - Optimized keyframe interpolation
   - Minimal computational overhead

2. **Efficient Rendering**
   - Hardware-accelerated CSS transforms
   - Single DOM element for animation container
   - No complex masking or filters

## Browser Support

The implementation works in all modern browsers that support:
- CSS transforms
- JSON parsing
- React components

Fallbacks are provided for users with JavaScript disabled or reduced motion preferences.

## Usage Example

```tsx
<LottieAnimation 
  animationData={null}
  size={80}
  loop={true}
  autoplay={true}
  ariaLabel="Playful toy animation"
/>
```