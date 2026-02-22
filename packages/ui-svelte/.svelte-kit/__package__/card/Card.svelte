<script lang="ts">
  import type { CardProps } from './types';
  import { cva } from 'class-variance-authority';
  import { cn } from '@wisihe/utils';

  const card = cva('rounded-lg border text-foreground', {
    variants: {
      variant: {
        default: 'bg-surface border-border',
        elevated: 'bg-surface-subtle border-border shadow-md',
        outlined: 'bg-transparent border-border',
        filled: 'bg-neutral-50 border-transparent',
      },
      padding: {
        none: 'p-0',
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
    },
  });

  let {
    variant = 'default',
    padding = 'md',
    class: className,
    children,
    ...rest
  }: CardProps = $props();
</script>

<div class={cn(card({ variant, padding }), className)} {...rest}>
  {#if children}
    {@render children()}
  {/if}
</div>
