import { useEffect, useRef, useState } from 'react';

// Hook to lazy load iframes based on visibility
export const useLazyIframe = () => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Keep observing to unload if far off-screen (optional optimization)
        }
      },
      { threshold: 0.1, rootMargin: '50px' },
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return { isVisible, containerRef };
};
