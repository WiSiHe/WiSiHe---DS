'use client';

import { useState } from 'react';

export type MeasurementMode = 'regular' | 'grams';

interface MeasurementToggleProps {
  onMeasurementChange: (mode: MeasurementMode) => void;
  defaultMode?: MeasurementMode;
}

export default function MeasurementToggle({
  onMeasurementChange,
  defaultMode = 'regular',
}: MeasurementToggleProps) {
  const [activeMode, setActiveMode] = useState<MeasurementMode>(defaultMode);

  const measurementModes = [
    { value: 'regular' as const, label: 'Regular', icon: '🥄' },
    { value: 'grams' as const, label: 'Grams', icon: '⚖️' },
  ];

  const handleModeChange = (mode: MeasurementMode) => {
    setActiveMode(mode);
    onMeasurementChange(mode);
  };

  return (
    <div className='flex items-center gap-2 p-2 bg-gray-100 rounded-lg'>
      <span className='text-sm font-medium text-gray-700'>Units:</span>
      <div className='flex gap-1'>
        {measurementModes.map(({ value, label, icon }) => (
          <button
            key={value}
            type='button'
            onClick={() => handleModeChange(value)}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              activeMode === value
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <span className='mr-1'>{icon}</span>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
