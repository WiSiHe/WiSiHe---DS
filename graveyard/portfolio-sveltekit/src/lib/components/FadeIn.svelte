<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { writable, type Writable } from 'svelte/store'

  export let isVisible: Writable<boolean> = writable(false)

  let element: HTMLElement
  let observer: IntersectionObserver
  let derivedVisible = false

  $: derivedVisible = $isVisible // Update derivedVisible whenever isVisible changes

  onMount(() => {
    observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        isVisible.set(true)
        observer.unobserve(element)
      }
    })

    observer.observe(element)
  })

  onDestroy(() => {
    observer.disconnect()
  })
</script>

<div bind:this={element} class:visible={derivedVisible}>
  <slot />
</div>

<style>
  div {
    opacity: 0;
    transition: opacity 0.5s ease-in-out;
  }

  div.visible {
    opacity: 1;
  }
</style>
