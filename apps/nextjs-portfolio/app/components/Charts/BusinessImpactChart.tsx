'use client';

import { MetricCard } from './MetricCard';

export const BusinessImpactChart = () => {
  // Updated with Threekit ROI study and Shopify data
  // Sources:
  // - https://www.shopify.com/blog/3d-ecommerce
  // - https://www.threekit.com/guide-to-roi-in-3d-and-augmented-reality
  const metrics = [
    {
      title: 'Conversion Rate',
      value: 94,
      suffix: '%',
      prefix: '+',
      color: 'var(--color-accent)',
      icon: 'up' as const,
      subtitle: 'Higher vs 2D images',
    },
    {
      title: 'Returns Reduction',
      value: 40,
      suffix: '%',
      prefix: '-',
      color: 'var(--color-danger)',
      icon: 'down' as const,
      subtitle: 'Bridging imagination gap',
    },
    {
      title: 'Photography Costs',
      value: 99,
      suffix: '%',
      prefix: '-',
      color: 'var(--color-danger)',
      icon: 'down' as const,
      subtitle: 'Virtual vs physical shoots',
    },
    {
      title: 'User Engagement',
      value: 82,
      suffix: '%',
      prefix: '',
      color: 'var(--color-accent)',
      icon: 'up' as const,
      subtitle: 'Play with 3D models',
    },
  ];

  return (
    <div className='w-full min-w-0 overflow-hidden max-w-full py-4'>
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
        {metrics.map((metric, index) => (
          <MetricCard
            key={metric.title}
            title={metric.title}
            value={metric.value}
            suffix={metric.suffix}
            prefix={metric.prefix}
            color={metric.color}
            icon={metric.icon}
            delay={index * 0.1}
            subtitle={metric.subtitle}
          />
        ))}
      </div>
    </div>
  );
};
