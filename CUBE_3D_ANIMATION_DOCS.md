# 3D Cube Animation for Contact Page

## Overview

A 3D-like cube animation has been added below the social media links in the contact page. This animation creates a three-dimensional effect using layered rectangles with varying opacities and timing.

## Features

1. **Three-Layer Cube Effect**
   - Front face (blue) with scaling animation
   - Top face (light blue) with opacity changes
   - Side face (dark blue) with opacity changes

2. **3D Illusion**
   - Layered elements create depth perception
   - Coordinated animations simulate rotation
   - Color gradients enhance 3D appearance

3. **Smooth Animation**
   - 90-frame loop cycle
   - Eased transitions
   - Continuous playback

## Implementation Details

### Animation Placement
```tsx
<div className="mt-8 flex justify-center">
  <div className="relative">
    <LottieAnimation 
      animationData={null}
      size={80}
      loop={true}
      autoplay={true}
      ariaLabel="3D rotating cube animation"
    />
  </div>
</div>
```

### Animation Properties
- **Size**: 80px (optimal for visibility without overwhelming content)
- **Loop**: Continuous playback
- **Autoplay**: Starts automatically when in viewport
- **Position**: Centered below social links with top margin

## Animation Description

The 3D cube animation consists of three distinct layers:
1. **Front Face**: Main blue face with subtle scaling animation
2. **Top Face**: Light blue face that fades in/out to simulate rotation
3. **Side Face**: Dark blue face that fades in/out opposite to top face

The coordinated opacity changes of the top and side faces, combined with the scaling of the front face, create a convincing 3D rotation effect.

## Customization Options

### Adjust Size
```tsx
size={80} // Change to any pixel value
```

### Modify Colors
Colors are defined in the JSON file:
- Front Face: Blue (#467CE0)
- Top Face: Light Blue (#77AFF0)
- Side Face: Dark Blue (#2F61CC)

### Change Animation Timing
The animation timing is controlled in the JSON file:
- Total duration: 90 frames (3 seconds at 30fps)
- Each face has specific keyframes for its animation

## Performance Considerations

1. **Lightweight Design**
   - Simple rectangle shapes for minimal file size
   - Optimized keyframe data
   - Efficient rendering

2. **Smooth Playback**
   - Consistent 30fps frame rate
   - Hardware-accelerated CSS transforms
   - Minimal DOM impact

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
  ariaLabel="3D rotating cube animation"
/>
```

## Animation Sequence Breakdown

### Front Face (Layer 1)
- Frames 0-90: Continuous scaling animation
- Scale: 100% → 110% → 100% (with easing)
- Creates depth effect during "rotation"

### Top Face (Layer 2)
- Frames 0-30: Opacity 100% → 70%
- Frames 30-60: Opacity 70% → 100%
- Frames 60-90: Maintains 100% opacity
- Simulates top face moving away/toward viewer

### Side Face (Layer 3)
- Frames 0-30: Opacity 70% → 100%
- Frames 30-60: Opacity 100% → 70%
- Frames 60-90: Maintains 70% opacity
- Moves in opposition to top face for realistic 3D effect

The staggered timing and opposing movements of the top and side faces create a convincing illusion of a rotating 3D cube.