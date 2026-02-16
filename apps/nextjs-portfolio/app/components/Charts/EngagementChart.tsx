'use client';

import { motion } from 'motion/react';
import { AnimatedNumber } from './AnimatedNumber';

export const EngagementChart = () => {
  const metrics = [
    {
      title: 'Session Time',
      value: 5,
      suffix: 'x',
      color: 'var(--color-accent)',
      icon: 'up' as const,
    },
    {
      title: 'Bounce Rate',
      value: 20,
      suffix: '%',
      prefix: '',
      color: 'var(--color-danger)',
      icon: 'down' as const,
      subtitle: 'With 3D (vs 60% without)',
    },
    {
      title: 'Prefer 3D',
      value: 95,
      suffix: '%',
      color: 'var(--color-accent)',
      icon: 'up' as const,
    },
  ];

  return (
    <div className="w-full min-w-0 overflow-hidden max-w-full py-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex flex-col items-center text-center p-4"
          >
            <div className="mb-2" style={{ color: metric.color }}>
              {metric.icon === 'up' ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                  />
                </svg>
              )}
            </div>
            <h3 className="text-xs font-semibold text-foreground/70 mb-2 uppercase tracking-wider">
              {metric.title}
            </h3>
            <div className="text-3xl md:text-4xl font-black mb-1" style={{ color: metric.color }}>
              <AnimatedNumber value={metric.value} suffix={metric.suffix} prefix={metric.prefix} />
            </div>
            {metric.subtitle && (
              <p className="text-xs text-foreground/60 mt-1">{metric.subtitle}</p>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};


