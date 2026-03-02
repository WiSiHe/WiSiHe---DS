'use client';

import { motion } from 'motion/react';
import { AnimatedNumber } from './AnimatedNumber';

export const MetricCard = ({
  title,
  value,
  suffix,
  prefix = '',
  color,
  icon,
  delay = 0,
  subtitle,
}: {
  title: string;
  value: number;
  suffix: string;
  prefix?: string;
  color: string;
  icon: 'up' | 'down';
  delay?: number;
  subtitle?: string;
}) => {
  const getIcon = () => {
    if (icon === 'up') {
      return (
        <svg
          className='w-6 h-6'
          aria-label='Trending up'
          role='img'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <title>Trending up</title>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'
          />
        </svg>
      );
    } else {
      return (
        <svg
          className='w-6 h-6'
          aria-label='Trending down'
          role='img'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <title>Trending down</title>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M13 17h8m0 0V9m0 8l-8-8-4 4-6-6'
          />
        </svg>
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className='flex flex-col items-center text-center p-4'
    >
      <div className='mb-2' style={{ color }}>
        {getIcon()}
      </div>
      <h3 className='text-xs font-semibold text-foreground/70 mb-2 uppercase tracking-wider'>
        {title}
      </h3>
      <div className='text-3xl md:text-4xl font-black' style={{ color }}>
        <AnimatedNumber value={value} suffix={suffix} prefix={prefix} />
      </div>
      {subtitle && (
        <p className='text-xs text-foreground/60 mt-2 text-center max-w-[200px]'>{subtitle}</p>
      )}
    </motion.div>
  );
};
