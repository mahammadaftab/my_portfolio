# Contact Page Lottie Animations

## Overview

The contact page now features special Lottie animations in the "Connect with me" section to enhance user engagement and visual appeal.

## Features

1. **Header Animation**
   - Animated circles that pulse and expand
   - Blue, purple, and green color scheme
   - Continuous looping animation

2. **Social Link Animations**
   - Small animated icons next to each social link
   - Play on hover for interactive feedback
   - Subtle but engaging micro-interactions

3. **Accessibility Support**
   - Proper ARIA labels for screen readers
   - Reduced motion support
   - Meaningful animation descriptions

## Implementation Details

### Social Header Animation
```tsx
<LottieAnimation 
  animationData={null}
  className="ml-2"
  size={24}
  loop={true}
  autoplay={true}
  ariaLabel="Social connection animation"
/>
```

### Social Link Animations
```tsx
<LottieAnimation 
  animationData={null}
  className="ml-1"
  size={16}
  loop={true}
  autoplay={true}
  playOnHover={true}
  ariaLabel={`Animated icon for ${social.name}`}
/>
```

## Animation Files

### social.json
A pulsing circle animation with three concentric circles that expand at different intervals:
- Blue outer circle (primary brand color)
- Purple middle circle (secondary accent)
- Green inner circle (success/positive color)

The animation creates a ripple effect that suggests connectivity and communication.

## Customization Options

### Adjust Animation Size
```tsx
size={24} // Change to any pixel value
```

### Modify Animation Behavior
```tsx
loop={true}        // Set to false for single play
autoplay={true}    // Set to false for manual trigger
playOnHover={true} // Enable hover interaction
```

### Change Colors
The colors are defined in the JSON file:
- Primary: Blue (#467CE0)
- Secondary: Purple (#BA57EA)
- Tertiary: Green (#2ED975)

## Performance Considerations

1. **Efficient Animations**
   - Simple vector shapes for lightweight files
   - Optimized keyframes
   - Small file size (< 5KB)

2. **Loading Strategy**
   - Animations only load when in viewport
   - Fallback to static icons if loading fails
   - Reduced motion support for accessibility

## Browser Support

The implementation works in all modern browsers that support:
- JSON parsing
- CSS animations
- React components

Fallbacks are provided for users with JavaScript disabled or reduced motion preferences.

## Usage Examples

### Basic Implementation
```tsx
<LottieAnimation 
  animationData={null}
  size={24}
  loop={true}
  autoplay={true}
/>
```

### Interactive Implementation
```tsx
<LottieAnimation 
  animationData={null}
  size={16}
  loop={true}
  autoplay={false}
  playOnHover={true}
/>
```