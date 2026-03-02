<script lang="ts">
// biome-ignore lint/correctness/noUnusedImports: used in template
import { cn } from '@wisihe/utils';
import { cva } from 'class-variance-authority';
import type { StackProps } from './types';

// biome-ignore lint/correctness/noUnusedVariables: used in template
const stack = cva('flex', {
  variants: {
    direction: {
      row: 'flex-row',
      column: 'flex-col',
    },
    gap: {
      none: 'gap-0',
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6',
    },
    align: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
    },
    justify: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
    },
    wrap: {
      true: 'flex-wrap',
      false: 'flex-nowrap',
    },
  },
  defaultVariants: {
    direction: 'column',
    gap: 'md',
    align: 'start',
    justify: 'start',
    wrap: false,
  },
});

let {
  direction = 'column',
  gap = 'md',
  align = 'start',
  justify = 'start',
  wrap = false,
  class: className,
  children,
  // biome-ignore lint/correctness/noUnusedVariables: used in template spread
  ...rest
}: StackProps = $props();
</script>

<div class={cn(stack({ direction, gap, align, justify, wrap }), className)} {...rest}>
  {#if children}
    {@render children()}
  {/if}
</div>
