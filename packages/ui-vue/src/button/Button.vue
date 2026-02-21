<script setup lang="ts">
import { cva } from 'class-variance-authority';
import { computed } from 'vue';
import type { ButtonProps } from './Button.types';

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

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
  fullWidth: false,
  disabled: false,
  type: 'button',
});

const classes = computed(() =>
  button({
    variant: props.variant,
    size: props.size,
    fullWidth: props.fullWidth,
  }),
);

const isDisabled = computed(() => props.disabled || props.loading);
</script>

<template>
  <button :class="classes" :disabled="isDisabled" :aria-busy="props.loading || undefined" :type="props.type">
    <span
      v-if="props.loading"
      class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
      aria-hidden="true"
    />
    <slot />
  </button>
</template>
