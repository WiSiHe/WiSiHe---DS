<script lang="ts">
  import type { BadgeProps } from './types';
  import { cva } from 'class-variance-authority';
  import { cn } from '@wisihe/utils';

  const badge = cva(
    'inline-flex items-center rounded-full border font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
    {
      variants: {
        variant: {
          default: 'bg-accent text-accent-contrast border-transparent hover:bg-accent-hover',
          secondary: 'bg-surface-hover text-foreground border-transparent hover:bg-surface-active',
          success: 'bg-success text-success-contrast border-transparent hover:bg-success-text',
          warning: 'bg-warning text-warning-contrast border-transparent hover:bg-warning-text',
          danger: 'bg-danger text-danger-contrast border-transparent hover:bg-danger-text',
          outline: 'bg-transparent text-foreground border-border hover:bg-surface-hover',
        },
        size: {
          sm: 'px-2 py-0.5 text-xs',
          md: 'px-2.5 py-0.5 text-xs',
          lg: 'px-3 py-1 text-sm',
        },
      },
      defaultVariants: {
        variant: 'default',
        size: 'md',
      },
    },
  );

  let {
    variant = 'default',
    size = 'md',
    class: className,
    children,
    ...rest
  }: BadgeProps = $props();
</script>

<span class={cn(badge({ variant, size }), className)} {...rest}>
  {#if children}
    {@render children()}
  {/if}
</span>
