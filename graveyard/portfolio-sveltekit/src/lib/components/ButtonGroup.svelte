<script lang="ts">
  export let className = ''
  import { cn } from '@wisihe/utils'

  type Option = { label: string; value: string; Icon?: any }

  export let value: Option = { label: '', value: '', Icon: null }
  export let options: Option[] = []
  export let onChange = (option: Option) => {}
</script>

<section class={cn('flex h-fit relative justify-between w-full ', className)}>
  {#each options as option, index}
    <button
      class={cn(
        'p-2 flex w-full first:rounded-l gap-0.5 justify-center items-center last:rounded-r z-10 transition-all duration-200 ease-in-out',
        option.value === value.value ? ' text-white bg-primary' : ''
      )}
      on:click={() => onChange(option)}
    >
      {#if option.Icon}
        <svelte:component this={option.Icon} class="w-5 h-5" />
      {/if}
      {option.label}
    </button>
  {/each}
  <!-- Active Indicator
  <div
    class="absolute top-0 bottom-0 left-0 text-white transition-all duration-200 ease-in-out bg-primary"
    style="transform: translateX(calc(100% * {options.findIndex(
      o => o.value === value.value
    )})); width: calc(100% / {options.length});"
  /> -->
</section>
