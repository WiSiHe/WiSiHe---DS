'use client';

import { motion } from 'motion/react';
import type { Metric } from '@/lib/three-d/types';

interface NumbersProps {
  metrics: Metric[];
}

export function Numbers({ metrics }: NumbersProps) {
  if (!metrics || metrics.length === 0) {
    return null;
  }

  // Helper to determine if value is positive/negative
  const getValueType = (value: string): 'positive' | 'negative' | 'neutral' => {
    if (value.startsWith('+')) return 'positive';
    if (value.startsWith('-')) return 'negative';
    return 'neutral';
  };

  // Helper to get color for metric
  const getMetricColor = (metric: Metric): string => {
    if (metric.color) return metric.color;

    const valueType = getValueType(metric.value);
    if (valueType === 'positive') return '#22c55e'; // green
    if (valueType === 'negative') return '#ef4444'; // red
    return '#3b82f6'; // blue (neutral)
  };

  return (
    <div className='w-full h-full flex items-center justify-center p-8'>
      <div className='w-full max-w-6xl'>
        {/* Metrics Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {metrics.map((metric, index) => {
            void getValueType(metric.value);
            const color = getMetricColor(metric);

            return (
              <motion.div
                key={`${metric.label}-${metric.value}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className='bg-surface-elevated rounded-xl p-6 border border-border/50 hover:border-accent/50 transition-all duration-300 hover:shadow-lg'
              >
                {/* Label */}
                <div className='mb-3'>
                  <h3 className='text-sm font-semibold text-foreground/70 uppercase tracking-wider'>
                    {metric.label}
                  </h3>
                </div>

                {/* Value */}
                <div className='mb-3'>
                  <span className='text-4xl md:text-5xl font-black' style={{ color }}>
                    {metric.value}
                  </span>
                </div>

                {/* Description */}
                {metric.description && (
                  <p className='text-sm text-foreground/60 leading-relaxed'>{metric.description}</p>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
