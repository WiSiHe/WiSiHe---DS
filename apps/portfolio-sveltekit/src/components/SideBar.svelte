<script lang="ts">
  export let className = ''
  import { cn } from '@wisihe/utils'
</script>

<section class={cn('p-4 col-span-full xl:col-span-3', className)}>
  <slot />
</section>
