<script lang="ts">
  import { cva } from 'class-variance-authority';
  import { cn } from '@wisihe/utils';
  import type { HTMLButtonAttributes } from 'svelte/elements';

  const button = cva(
    'inline-flex items-center justify-center gap-2 rounded-sm border font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-60',
    {
      variants: {
        variant: {
          primary: 'bg-accent text-accent-contrast border-transparent hover:bg-accent-hover',
          secondary: 'bg-surface text-foreground border-border hover:bg-surface-hover',
          ghost: 'bg-transparent text-accent border-transparent hover:bg-accent-subtle',
          danger: 'bg-danger text-danger-contrast border-transparent hover:bg-danger-text',
        },
        size: {
          sm: 'h-8 px-3 text-sm',
          md: 'h-10 px-4 text-base',
          lg: 'h-12 px-6 text-lg',
        },
        fullWidth: {
          true: 'w-full',
        },
      },
      defaultVariants: {
        variant: 'primary',
        size: 'md',
      },
    },
  );

  export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
  export type ButtonSize = 'sm' | 'md' | 'lg';

  export type ButtonProps = HTMLButtonAttributes & {
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    fullWidth?: boolean;
  };

  let {
    variant = 'primary',
    size = 'md',
    loading = false,
    fullWidth = false,
    class: className,
    disabled = false,
    type = 'button',
    children,
    ...rest
  }: ButtonProps = $props();
</script>

<button
  class={cn(button({ variant, size, fullWidth }), className)}
  disabled={disabled || loading}
  aria-busy={loading}
  {type}
  {...rest}
>
  {#if loading}
    <span
      class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
      aria-hidden="true"
    ></span>
  {/if}
  {#if children}
    {@render children()}
  {/if}
</button>
