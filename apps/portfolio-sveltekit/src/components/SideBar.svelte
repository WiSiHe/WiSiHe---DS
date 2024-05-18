<script lang="ts">
  export let className = ''
  import { cn } from '@wisihe/utils'
  // import { fly } from 'svelte/transition'
  // in:fly={{ y: -10, duration: 500 }}
  // out:fly={{ y: 10, duration: 500 }}
</script>

<section class={cn('p-4 col-span-full lg:col-span-3', className)}>
  <slot />
</section>
