import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@wisihe/utils';

const flex = cva('flex', {
  variants: {
    direction: {
      row: ['flex-row'],
      column: ['flex-col'],
    },
    wrap: {
      wrap: ['flex-wrap'],
      nowrap: ['flex-nowrap'],
    },
    justify: {
      start: ['justify-start'],
      end: ['justify-end'],
      center: ['justify-center'],
      between: ['justify-between'],
      around: ['justify-around'],
    },
    align: {
      start: ['items-start'],
      end: ['items-end'],
      center: ['items-center'],
      baseline: ['items-baseline'],
      stretch: ['items-stretch'],
    },
    gap: {
      0: ['gap-0'],
      1: ['gap-1'],
      2: ['gap-2'],
      3: ['gap-3'],
      4: ['gap-4'],
      5: ['gap-5'],
      6: ['gap-6'],
      7: ['gap-7'],
      8: ['gap-8'],
      9: ['gap-9'],
      10: ['gap-10'],
      12: ['gap-12'],
      16: ['gap-16'],
      20: ['gap-20'],
      24: ['gap-24'],
      32: ['gap-32'],
      40: ['gap-40'],
      48: ['gap-48'],
      56: ['gap-56'],
      64: ['gap-64'],
    },
  },
  defaultVariants: {
    direction: 'row',
    wrap: 'wrap',
    justify: 'start',
    align: 'start',
    gap: 4,
  },
});
export interface FlexProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof flex> {
  children?: React.ReactNode;
}

export function Flex({
  className,
  children,
  direction,
  wrap,
  justify,
  align,
  gap,
  ...props
}: FlexProps) {
  return (
    <div className={cn(flex({ direction, wrap, justify, align, gap }), className)} {...props}>
      {children}
    </div>
  );
}
