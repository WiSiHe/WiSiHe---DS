import { cn } from '@wisihe/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { GridCol } from './GridCol';

const grid = cva('grid', {
  variants: {
    columns: {
      1: ['grid-cols-1'],
      2: ['grid-cols-2'],
      3: ['grid-cols-3'],
      4: ['grid-cols-4'],
      5: ['grid-cols-5'],
      6: ['grid-cols-6'],
      7: ['grid-cols-7'],
      8: ['grid-cols-8'],
      9: ['grid-cols-9'],
      10: ['grid-cols-10'],
      11: ['grid-cols-11'],
      12: ['grid-cols-12'],
    },
    rows: {
      1: ['grid-rows-1'],
      2: ['grid-rows-2'],
      3: ['grid-rows-3'],
      4: ['grid-rows-4'],
      5: ['grid-rows-5'],
      6: ['grid-rows-6'],
      7: ['grid-rows-7'],
      8: ['grid-rows-8'],
      9: ['grid-rows-9'],
      10: ['grid-rows-10'],
      11: ['grid-rows-11'],
      12: ['grid-rows-12'],
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
  },
  defaultVariants: {
    columns: 1,
    gap: 4,
  },
});

export interface GridProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof grid> {}

export function Grid({
  className,
  children,
  ...props
}: GridProps): JSX.Element {
  return (
    <div className={cn(grid(props), className)} {...props}>
      {children}
    </div>
  );
}

Grid.Col = GridCol;
