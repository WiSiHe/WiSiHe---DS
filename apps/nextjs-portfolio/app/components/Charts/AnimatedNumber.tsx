'use client';

import { useState, useEffect } from 'react';

export const AnimatedNumber = ({
  value,
  suffix = '',
  prefix = '',
  decimals = 0,
  duration = 1.5,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  duration?: number;
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrame: number;
    const startValue = displayValue;
    const endValue = value;

    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);

      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (endValue - startValue) * easeOut;

      setDisplayValue(current);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setDisplayValue(endValue);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [value, duration]);

  return (
    <span className="tabular-nums">
      {prefix}
      {displayValue.toFixed(decimals)}
      {suffix}
    </span>
  );
};


