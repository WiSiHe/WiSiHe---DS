<script lang="ts">
  import { IconArrowLeft } from '@tabler/icons-svelte'
  import { fly } from 'svelte/transition'
  import { goto } from '$app/navigation'

  function handleGoBack() {
    // Extract existing query parameters
    let sortOption = sessionStorage.getItem('sortOption') || 'random'
    let selectedTags = JSON.parse(
      sessionStorage.getItem('selectedTags') || '[]'
    )

    // Set default values if not available
    if (!sortOption) {
      sortOption = 'defaultSortOption' // Replace with your default sort option
    }

    // Construct the new SLUG
    const slug =
      selectedTags.length > 0
        ? `/paintings?filter=${selectedTags.join(',')}&sort=${sortOption}`
        : `/paintings?sort=${sortOption}`

    // Navigate to the new SLUG
    goto(slug, { replaceState: true })
  }
</script>

<button
  on:click={handleGoBack}
  class="fixed z-20 flex px-4 py-2 text-white transition-all rounded shadow left-2 top-24 group hover:shadow-2xl bg-primary hover:scale-105 hover:bg-highlight hover:text-dark"
  data-sveltekit-noscroll
  in:fly={{ x: -50 }}
  out:fly={{ x: -50 }}
>
  <div in:fly={{ x: -50, delay: 1000 }} out:fly={{ x: 50 }}>
    <IconArrowLeft class="w-6 h-6" />
  </div>
  Back
</button>
