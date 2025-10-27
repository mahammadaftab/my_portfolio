// This file provides a workaround for React DevTools compatibility issues with React 19
// It completely disables React DevTools in development mode to prevent semver validation errors

// Extend window interface for React DevTools
declare global {
  interface Window {
    __REACT_DEVTOOLS_GLOBAL_HOOK__: any;
  }
}

export const disableReactDevTools = () => {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    // Completely disable React DevTools in development to avoid semver validation errors
    // This is a workaround for React 19 compatibility issues
    try {
      if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
        // Override all methods to prevent errors
        window.__REACT_DEVTOOLS_GLOBAL_HOOK__.inject = function() {};
        window.__REACT_DEVTOOLS_GLOBAL_HOOK__.isDisabled = true;
        window.__REACT_DEVTOOLS_GLOBAL_HOOK__.supportsFiber = true;
        window.__REACT_DEVTOOLS_GLOBAL_HOOK__.renderers = new Map();
        window.__REACT_DEVTOOLS_GLOBAL_HOOK__.onCommitFiberRoot = function() {};
        window.__REACT_DEVTOOLS_GLOBAL_HOOK__.onCommitFiberUnmount = function() {};
        window.__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE = function() {};
      }
    } catch (error) {
      // Silently fail if there are any issues
      console.debug('React DevTools disable attempt completed');
    }
  }
};