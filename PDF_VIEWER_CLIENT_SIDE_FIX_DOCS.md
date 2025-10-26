# PDF Viewer Client-Side Only Fix

## Overview

This document explains the fix implemented for the PDF viewer component to resolve the "DOMMatrix is not defined" error by using client-side only imports.

## Problem Description

The error occurred because:
1. `pdfjs-dist` library requires browser APIs like DOMMatrix
2. Next.js attempts to server-side render components that import browser-only libraries
3. Server-side environment lacks browser APIs needed by pdfjs-dist

## Solution Implemented

### 1. Dynamic Client-Side Import
- Removed static import of `pdfjs-dist`
- Implemented dynamic import using `import()` function
- Only loads the library on the client side after component mounts

### 2. Conditional Rendering
- Added loading state while pdfjs-lib is being imported
- Prevented PDF rendering until library is fully loaded
- Handled error states for failed imports

### 3. Type Safety
- Updated type definitions to work with dynamic imports
- Maintained component functionality while ensuring compatibility

## Code Changes

### Dynamic Import Implementation
```typescript
const [pdfjsLib, setPdfjsLib] = useState<any>(null);

// Dynamically import pdfjs-dist on client side only
useEffect(() => {
  const loadPdfJs = async () => {
    try {
      const pdfjs = await import("pdfjs-dist");
      // Set the worker path for PDF.js
      pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";
      setPdfjsLib(pdfjs);
    } catch (err) {
      console.error("Failed to load pdfjs-dist:", err);
      setError("Failed to load PDF viewer. Please try again later.");
      setLoading(false);
    }
  };
  
  loadPdfJs();
}, []);
```

### Conditional PDF Loading
```typescript
useEffect(() => {
  if (pdfjsLib) {
    loadPDF();
  }

  return () => {
    // Cleanup logic
  };
}, [file, theme, pdfjsLib]);
```

### Loading State
```typescript
// Show loading state while pdfjs-lib is loading
if (!pdfjsLib) {
  return (
    <div className={`flex items-center justify-center h-full ${className}`}>
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}
```

## Benefits of This Approach

### 1. Server-Side Rendering Compatibility
- Component can be server-side rendered without errors
- No browser API dependencies during SSR
- Proper hydration on client side

### 2. Performance Optimization
- PDF library only loaded when needed
- Reduced initial bundle size
- Faster initial page load

### 3. User Experience
- Clear loading indicators
- Graceful error handling
- Progressive enhancement

## Implementation Details

### 1. State Management
- `pdfjsLib` state tracks library loading status
- Loading states provide visual feedback
- Error states handle failed imports gracefully

### 2. Effect Dependencies
- First effect runs only on mount to load library
- Second effect runs when library, file, or theme changes
- Proper cleanup prevents memory leaks

### 3. Type Handling
- Used `any` type for dynamic imports to avoid compilation issues
- Maintained existing functionality with new import method
- Kept component API unchanged for consumers

## Best Practices Implemented

### 1. Client-Side Only Libraries
- Dynamic imports for browser-only dependencies
- Conditional rendering based on library availability
- Proper error boundaries for failed imports

### 2. Resource Management
- Cleanup of PDF documents and render tasks
- Memory leak prevention
- Efficient resource utilization

### 3. User Experience
- Loading spinners during library initialization
- Clear error messages for users
- Graceful degradation when PDFs can't be loaded

## Testing Considerations

### 1. Server-Side Rendering
- Verify component renders without browser APIs
- Check for hydration errors
- Test with JavaScript disabled

### 2. Client-Side Functionality
- Confirm PDF rendering works after library loads
- Test theme switching
- Verify error handling

### 3. Performance
- Monitor bundle size impact
- Check loading times
- Verify memory usage

## Common Issues Addressed

### 1. SSR Incompatibility
- Browser API dependencies during server rendering
- Reference errors for undefined globals
- Hydration mismatches

### 2. Library Loading Failures
- Network issues during dynamic import
- Missing worker files
- Version compatibility problems

### 3. User Experience Gaps
- No feedback during library loading
- Unclear error messages
- Poor handling of edge cases

## Future Improvements

### 1. Enhanced Error Handling
- More specific error types
- Automatic retry mechanisms
- User-friendly recovery options

### 2. Performance Optimizations
- Code splitting for PDF worker
- Caching strategies
- Preloading optimizations

### 3. Feature Enhancements
- Multi-page support
- Zoom and navigation controls
- Text selection capabilities

This approach ensures the PDF viewer component works reliably in both server-side and client-side environments while maintaining good performance and user experience.