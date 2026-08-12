import { useEffect, useRef, useState } from 'react';

export function useLazyIframe() {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0]?.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1, rootMargin: '50px' },
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return { isVisible, containerRef };
}
