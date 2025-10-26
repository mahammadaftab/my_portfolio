import { useEffect, useState } from "react";

export function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window !== "undefined" && "matchMedia" in window) {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      // Use setTimeout to avoid setState in effect warning
      setTimeout(() => setPrefersReducedMotion(mediaQuery.matches), 0);
      
      // Listen for changes
      const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener("change", handler);
      
      return () => mediaQuery.removeEventListener("change", handler);
    }
    
    return undefined;
  }, []);

  return prefersReducedMotion;
}