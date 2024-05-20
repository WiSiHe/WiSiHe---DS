<script lang="ts">
  import { cn } from '@wisihe/utils'

  export let onClick = () => {}
  export let color: 'primary' | 'secondary' | 'tertiary' | 'highlight' =
    'primary'

  export let size: 'xs' | 'sm' | 'md' | 'lg' = 'sm'
  export let outline = false

  const colors = {
    primary: 'bg-primary text-white hover:bg-primary/90',
    secondary: 'bg-secondary text-white hover:bg-secondary/90',
    tertiary: 'bg-tertiary text-dark hover:bg-tertiary/90',
    highlight: 'bg-highlight text-dark hover:bg-highlight/90'
  }[color]

  const sizes = {
    xs: 'text-xs px-1 py-0.5',
    sm: 'text-sm px-2 py-1',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-6 py-3'
  }[size]

  const outlineStyles = {
    primary: 'border border-primary text-primary',
    secondary: 'border border-secondary text-secondary',
    tertiary: 'border border-tertiary text-tertiary',
    highlight: 'border border-highlight text-highlight'
  }[color]
</script>

<button
  class={cn(
    'flex gap-2 transition-all items-center capitalize rounded ',
    sizes,
    !outline && colors,
    outline && outlineStyles
  )}
  on:click={onClick}
>
  <slot />
</button>
