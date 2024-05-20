<script lang="ts">
  import { IconArrowLeft } from '@tabler/icons-svelte'
  import { fly } from 'svelte/transition'
  import { goto } from '$app/navigation'

  function handleGoBack() {
    // Extract existing query parameters
    const url = new URL(window.location.href)
    const queryParams = url.searchParams

    // Construct the /paintings URL with preserved filters
    const paintingsUrl = '/paintings?' + queryParams.toString()

    // Navigate back, preserving the query parameters
    // goto(paintingsUrl, { noScroll: true })
    window.history.back()
  }
</script>

<button
  on:click={handleGoBack}
  class="fixed z-20 flex px-4 py-2 text-white transition-all shadow left-2 top-20 group hover:shadow-2xl bg-primary hover:scale-105 hover:bg-highlight hover:text-dark"
  data-sveltekit-noscroll
  in:fly={{ x: -50 }}
  out:fly={{ x: -50 }}
>
  <div in:fly={{ x: -50, duration: 1500, delay: 1000 }} out:fly={{ x: 50 }}>
    <IconArrowLeft class="w-6 h-6" />
  </div>
  Back
</button>
