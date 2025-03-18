'use client';
import { useEffect } from 'react';

export default function HydrationFix() {
  useEffect(() => {
    // Force a re-render after hydration is complete
    const timer = setTimeout(() => {
      const event = new Event('hydration-complete');
      window.dispatchEvent(event);
    }, 0);
    
    return () => clearTimeout(timer);
  }, []);
  
  return null;
}