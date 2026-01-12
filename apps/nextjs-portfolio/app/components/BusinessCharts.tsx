'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { businessStats } from '../data/stats';

type ViewType = 'impact' | 'preference';

const COLORS = {
  positive: 'hsl(var(--accent))',
  negative: '#ef4444',
  neutral: 'rgba(255, 255, 255, 0.2)',
};

// Animated Number Component
interface AnimatedNumberProps {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  duration?: number;
}

const AnimatedNumber = ({ 
  value, 
  suffix = '', 
  prefix = '', 
  decimals = 0,
  duration = 1.5 
}: AnimatedNumberProps) => {
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

      // Easing function (ease-out)
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

// Metric Card Component
interface MetricCardProps {
  title: string;
  value: number;
  suffix: string;
  prefix?: string;
  subtitle: string;
  source?: { text: string; url?: string };
  color: string;
  icon: 'up' | 'down' | 'multiply';
  delay?: number;
}

const MetricCard = ({ 
  title, 
  value, 
  suffix, 
  prefix = '', 
  subtitle, 
  source, 
  color,
  icon,
  delay = 0 
}: MetricCardProps) => {
  const getIcon = () => {
    switch (icon) {
      case 'up':
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        );
      case 'down':
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
          </svg>
        );
      case 'multiply':
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-surface-elevated/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 flex flex-col items-center text-center"
    >
      <div className="mb-4" style={{ color }}>
        {getIcon()}
      </div>
      <h3 className="text-sm font-semibold text-foreground/70 mb-2 uppercase tracking-wider">
        {title}
      </h3>
      <div 
        className="text-5xl md:text-6xl font-black mb-2"
        style={{ color }}
      >
        <AnimatedNumber 
          value={value} 
          suffix={suffix} 
          prefix={prefix}
          decimals={suffix === 'x' ? 0 : 0}
        />
      </div>
      <p className="text-sm text-foreground/60 mb-4">{subtitle}</p>
      {source && source.url && (
        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-accent hover:underline"
        >
          Source: {source.text}
        </a>
      )}
    </motion.div>
  );
};

export default function BusinessCharts() {
  const [activeView, setActiveView] = useState<ViewType>('impact');

  // Prepare Preference Data (Pie Chart)
  const preferenceData = [
    { name: '3D Experience', value: businessStats.preference.value3D },
    { name: 'Video', value: businessStats.preference.valueVideo },
  ];

  return (
    <div className="w-full bg-surface-elevated/50 backdrop-blur-sm text-foreground rounded-lg p-6 border border-border/50">
      {/* Toggle Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveView('impact')}
          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
            activeView === 'impact'
              ? 'bg-accent text-accent-foreground'
              : 'bg-surface text-foreground/70 hover:bg-surface/80 hover:text-foreground'
          }`}
        >
          Impact Metrics
        </button>
        <button
          onClick={() => setActiveView('preference')}
          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
            activeView === 'preference'
              ? 'bg-accent text-accent-foreground'
              : 'bg-surface text-foreground/70 hover:bg-surface/80 hover:text-foreground'
          }`}
        >
          User Preference
        </button>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeView === 'impact' && (
          <motion.div
            key="impact"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MetricCard
                title="Conversion Rate"
                value={businessStats.conversion.value}
                suffix="%"
                prefix="+"
                subtitle="Increase in conversion rate"
                source={businessStats.conversion.source}
                color={COLORS.positive}
                icon="up"
                delay={0}
              />
              <MetricCard
                title="Returns"
                value={businessStats.returns.value}
                suffix="%"
                prefix="-"
                subtitle="Reduction in returns"
                source={businessStats.returns.source}
                color={COLORS.negative}
                icon="down"
                delay={0.1}
              />
              <MetricCard
                title="Engagement"
                value={businessStats.engagement.value}
                suffix="x"
                subtitle="Longer session times"
                source={businessStats.engagement.source}
                color={COLORS.positive}
                icon="multiply"
                delay={0.2}
              />
            </div>
          </motion.div>
        )}

        {activeView === 'preference' && (
          <motion.div
            key="preference"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <div className="flex flex-col items-center justify-center space-y-8 py-8">
              <h3 className="text-2xl font-bold text-foreground mb-4">User Preference</h3>
              
              {/* Split Comparison */}
              <div className="grid grid-cols-2 gap-8 w-full max-w-2xl">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-center"
                >
                  <div className="text-6xl md:text-7xl font-black mb-2" style={{ color: COLORS.positive }}>
                    <AnimatedNumber value={businessStats.preference.value3D} suffix="%" />
                  </div>
                  <p className="text-lg font-semibold text-foreground">Prefer 3D</p>
                  <div className="mt-4 h-4 bg-surface rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${businessStats.preference.value3D}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                      className="h-full"
                      style={{ backgroundColor: COLORS.positive }}
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-center"
                >
                  <div className="text-6xl md:text-7xl font-black mb-2" style={{ color: COLORS.neutral }}>
                    <AnimatedNumber value={businessStats.preference.valueVideo} suffix="%" />
                  </div>
                  <p className="text-lg font-semibold text-foreground">Prefer Video</p>
                  <div className="mt-4 h-4 bg-surface rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${businessStats.preference.valueVideo}%` }}
                      transition={{ duration: 1, delay: 0.4 }}
                      className="h-full"
                      style={{ backgroundColor: COLORS.neutral }}
                    />
                  </div>
                </motion.div>
              </div>

              {/* Alternative: Donut Chart */}
              <div className="w-full max-w-md mt-8">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={preferenceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {preferenceData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={index === 0 ? COLORS.positive : COLORS.neutral}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-6 mt-4">
                  {preferenceData.map((entry, index) => (
                    <div key={entry.name} className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: index === 0 ? COLORS.positive : COLORS.neutral }}
                      />
                      <span className="text-sm text-foreground/70">{entry.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {businessStats.preference.source.text && (
                <p className="text-xs text-foreground/60 mt-4">
                  Source: {businessStats.preference.source.text}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

