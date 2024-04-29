<script>
  import { fade, fly } from 'svelte/transition'
  import { cubicOut } from 'svelte/easing'
  import { cn } from '@wisihe/utils'
  import { onMount } from 'svelte'
  import { flip } from 'svelte/animate'
  import { quintOut } from 'svelte/easing'
  let visible = true

  let step1 = false
  let step2 = false
  let step3 = false
  let step4 = false
  let step5 = false
  // Logic to hide the splash screen after 5 seconds
  //   setTimeout(() => {
  //     visible = false
  //   }, 5000) // 5000 milliseconds = 5 seconds

  setTimeout(() => {
    step1 = true
  }, 1000)

  setTimeout(() => {
    step1 = false
    step2 = true
  }, 2000)

  setTimeout(() => {
    step3 = true
  }, 3000)

  setTimeout(() => {
    step4 = true
  }, 4000)

  setTimeout(() => {
    step5 = true
  }, 5000)

  // Logic to hide the splash screen when the user clicks on it
  const handleClick = () => {
    visible = false
  }

  const name = 'Henrik Wilhelm Sissener'
  const letters = name.split()

  onMount(() => {
    animate = true
  })

  import { backOut } from 'svelte/easing'

  let animate = false
</script>

<div
  class={cn(
    'splash-container w-full h-full bg-dark z-50 flex justify-center items-center text-white flex-col absolute inset-0',
    visible ? 'visible' : 'hidden'
  )}
>
  <!-- <button on:click={() => (animate = !animate)}> toggle </button> -->

  <h1 class="lines">
    {#if step1}
      <div
        in:fly={{
          duration: 300,
          easing: backOut,
          x: 100
        }}
        out:fly={{
          duration: 300,
          easing: backOut,
          x: -100
        }}
      >
        Hi!
      </div>
    {/if}
    {#if step2}
      <div>My Name is</div>
    {/if}

    {#each letters as word, i}
      {#if step3}
        <span
          in:fly={{
            delay: 300 * i,
            duration: 300,
            easing: backOut,
            y: 100
          }}
        >
          {word}
        </span>
      {/if}
    {/each}
  </h1>
</div>

<style>
  span {
    display: inline-block;
  }
</style>
