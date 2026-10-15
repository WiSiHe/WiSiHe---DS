'use client';

import { motion } from 'motion/react';
import type { Metric } from '@/lib/presentations/types';

type NumbersProps = {
  metrics: Metric[];
};

export function Numbers({ metrics }: NumbersProps) {
  if (!metrics?.length) return null;

  const getValueType = (value: string): 'positive' | 'negative' | 'neutral' => {
    if (value.startsWith('+')) return 'positive';
    if (value.startsWith('-')) return 'negative';
    return 'neutral';
  };

  const getMetricColor = (metric: Metric): string => {
    if (metric.color) return metric.color;

    const valueType = getValueType(metric.value);
    if (valueType === 'positive') return '#22c55e';
    if (valueType === 'negative') return '#ef4444';
    return '#3b82f6';
  };

  return (
    <div className='flex h-full w-full items-center justify-center p-8'>
      <div className='w-full max-w-6xl'>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {metrics.map((metric, index) => {
            const color = getMetricColor(metric);

            return (
              <motion.div
                key={`${metric.label}-${metric.value}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className='rounded-xl border border-border/50 bg-surface-elevated p-6 transition-all duration-300 hover:border-accent/50 hover:shadow-lg'
              >
                <div className='mb-3'>
                  <h3 className='text-sm font-semibold tracking-wider text-foreground/70 uppercase'>
                    {metric.label}
                  </h3>
                </div>
                <div className='mb-3'>
                  <span className='text-4xl font-black md:text-5xl' style={{ color }}>
                    {metric.value}
                  </span>
                </div>
                {metric.description ? (
                  <p className='text-sm leading-relaxed text-foreground/60'>{metric.description}</p>
                ) : null}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
