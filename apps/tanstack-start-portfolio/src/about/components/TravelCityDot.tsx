'use client';

import { cn } from '@wisihe/utils';
import { MapMarkerTooltip } from './MapMarkerTooltip';

type TravelCityDotProps = {
  label: string;
  tooltipDetail?: string | null;
  selected?: boolean;
  onClick?: () => void;
};

export function TravelCityDot({
  label,
  tooltipDetail,
  selected = false,
  onClick,
}: TravelCityDotProps) {
  const dot = (
    <span
      className={cn(
        'relative block rounded-full bg-neon-yellow-400 ring-1 ring-neon-yellow-200/80 transition-transform',
        selected ? 'size-3 shadow-[0_0_14px_rgba(250,204,21,0.7)]' : 'size-2',
        selected && 'scale-150',
      )}
    />
  );

  const tooltip = <MapMarkerTooltip title={label} detail={tooltipDetail ?? 'Click for details'} />;

  if (!onClick) {
    return (
      <span className='group/marker relative' title={label} role='img' aria-label={label}>
        {tooltip}
        {dot}
      </span>
    );
  }

  return (
    <button
      type='button'
      aria-label={label}
      aria-pressed={selected}
      onClick={event => {
        event.stopPropagation();
        onClick();
      }}
      className='group/marker relative rounded-full p-1 transition-transform hover:scale-125 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-yellow-400/60'
    >
      {tooltip}
      {dot}
    </button>
  );
}
