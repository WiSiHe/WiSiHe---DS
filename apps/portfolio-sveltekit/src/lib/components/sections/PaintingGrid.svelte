<script lang="ts">
  import type { iSanityPainting, iSanityPaintingsTag } from '$lib/utils/sanity'
  import { onMount } from 'svelte'
  import { goto } from '$app/navigation'
  import { browser } from '$app/environment'
  import PaintingCard from '../PaintingCard.svelte'
  import Select from '../Select.svelte'
  import Dialog from '../Dialog.svelte'
  import { IconFilter, IconX } from '@tabler/icons-svelte'
  import { cn } from '@wisihe/utils'

  let dialog: HTMLDialogElement

  export let paintings: iSanityPainting[] | undefined
  export let tags: iSanityPaintingsTag[] | undefined

  let filteredPaintings: iSanityPainting[] = []
  let selectedTags: string[] = []
  let searchQuery = ''
  let visiblePaintingsCount = 20 // Limit to 20 paintings initially
  let loading = true

  let sortOption = 'random'

  function debounce(fn: (...args: any[]) => void, delay: number) {
    let timeout: ReturnType<typeof setTimeout>

    return function (...args: any[]) {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        fn(...args)
      }, delay)
    }
  }

  const debouncedUpdateFilteredPaintings = debounce(
    updateFilteredPaintings,
    200
  )

  function updateSessionStorage() {
    if (browser) {
      sessionStorage.setItem('selectedTags', JSON.stringify(selectedTags))
      sessionStorage.setItem('sortOption', sortOption)
      sessionStorage.setItem('searchQuery', searchQuery)
    }
  }

  function filterPaintings() {
    return (
      paintings?.filter(painting => {
        const matchesTags =
          selectedTags.length === 0 ||
          selectedTags.every(tag => painting.tagsV2.some(t => t.name === tag))

        const matchesSearch =
          searchQuery === '' ||
          painting.title.toLowerCase().includes(searchQuery.toLowerCase())

        return matchesTags && matchesSearch
      }) || []
    )
  }

  function sortPaintings(paintings: iSanityPainting[]) {
    switch (sortOption) {
      case 'newest':
        return paintings.sort(
          (a, b) =>
            new Date(b.paintedAt).getTime() - new Date(a.paintedAt).getTime()
        )
      case 'oldest':
        return paintings.sort(
          (a, b) =>
            new Date(a.paintedAt).getTime() - new Date(b.paintedAt).getTime()
        )
      case 'mostLiked':
        return paintings.sort((a, b) => b.likes - a.likes)
      case 'mostViewed':
        return paintings.sort((a, b) => b.viewsCount - a.viewsCount)
      case 'random':
        return paintings.sort(() => Math.random() - 0.5)
      default:
        return paintings
    }
  }

  function updateFilteredPaintings() {
    if (paintings) {
      const filtered = filterPaintings()
      filteredPaintings = sortPaintings(filtered)
      updateSessionStorage()
    }
  }

  function loadMorePaintings() {
    visiblePaintingsCount += 20 // Load 20 more paintings on button click
  }

  onMount(() => {
    const urlParams = new URLSearchParams(window.location.search)
    selectedTags = urlParams.getAll('filter')
    sortOption =
      urlParams.get('sort') ||
      (browser && sessionStorage.getItem('sortOption')) ||
      'random'
    searchQuery = (browser && sessionStorage.getItem('searchQuery')) || ''

    if (selectedTags.length === 0 && browser) {
      const storedTags = sessionStorage.getItem('selectedTags')
      if (storedTags) selectedTags = JSON.parse(storedTags)
    }

    updateFilteredPaintings()
  })

  function toggleTag(tag: string) {
    selectedTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag]

    updateFilteredPaintings()
    updateURLParameters()
  }

  function updateURLParameters() {
    const params = new URLSearchParams()
    selectedTags.forEach(tag => params.append('filter', tag))
    if (sortOption !== 'random') params.set('sort', sortOption)
    const queryString = params.toString()
    goto(`?${queryString}`, {
      replaceState: true,
      keepFocus: true,
      noScroll: true
    })
  }

  $: if (browser) {
    updateSessionStorage()
  }

  // Update loading state when paintings and tags are loaded
  $: loading = !paintings || !tags

  // Ensure this reactive statement doesn't cause errors during SSR
  $: if (browser) {
    debouncedUpdateFilteredPaintings()
  }
</script>

<div class="min-h-screen bg-dark">
  <!-- Header Section -->
  <div class="bg-tertiary">
    <div class="max-w-screen-xl p-4 mx-auto prose">
      <h1>Art Gallery</h1>
      <p>
        Welcome to the art gallery! Here you can view all the paintings I've
        created. Use the filters below to find paintings that match your
        interests.
      </p>
    </div>
  </div>

  <!-- Sticky Filter Bar -->
  <div
    style="margin-bottom: 20px;"
    class="sticky top-0 z-20 shadow-xl bg-tertiary"
  >
    <div class="flex flex-wrap items-end max-w-screen-xl gap-2 p-4 mx-auto">
      <!-- Search Input -->
      <div class="flex flex-col">
        <label for="search" class="mb-1 text-sm font-medium">
          Search paintings
        </label>
        <input
          type="text"
          placeholder="Search paintings"
          bind:value={searchQuery}
          name="search"
          id="search"
          class="p-2 py-3 text-sm border rounded"
          on:input={() => debouncedUpdateFilteredPaintings()}
          aria-label="Search paintings"
        />
      </div>

      <!-- Sort Select -->
      <Select
        label="Sort by"
        bind:value={sortOption}
        options={[
          { value: 'random', label: 'Random' },
          { value: 'newest', label: 'Newest' },
          { value: 'oldest', label: 'Oldest' },
          { value: 'mostLiked', label: 'Most Liked' },
          { value: 'mostViewed', label: 'Most Viewed' }
        ]}
        on:change={() => updateFilteredPaintings()}
      />

      <!-- Filter Button -->
      <button
        on:click={() => dialog.showModal()}
        class="flex items-center p-2 py-3 m-0 text-sm text-white rounded-lg bg-primary hover:bg-primary/40"
        aria-label="Filter paintings"
      >
        <IconFilter /> Filters ({selectedTags.length})
      </button>

      <!-- Selected Tags -->
      {#each selectedTags as tag (tag)}
        <button
          on:click={() => toggleTag(tag)}
          class="flex items-center p-2 text-white rounded-lg bg-primary hover:bg-primary/40"
          aria-pressed="true"
        >
          {tag}
          <IconX />
        </button>
      {/each}

      <!-- Clear All Button -->
      {#if selectedTags.length > 0}
        <button
          on:click={() => {
            selectedTags = []
            updateFilteredPaintings()
            updateURLParameters()
          }}
          class="flex items-center p-2 rounded-lg text-dark bg-tertiary ring ring-dark hover:bg-dark/40 hover:text-white"
        >
          Clear All
        </button>
      {/if}
    </div>
  </div>

  <!-- Paintings Count Display -->
  <div class="max-w-screen-xl px-4 pb-2 mx-auto text-center text-tertiary">
    <p>
      Showing {Math.min(visiblePaintingsCount, filteredPaintings.length)} of
      {filteredPaintings.length}
      paintings
    </p>
  </div>

  <!-- Paintings Grid -->
  {#if loading}
    <!-- Loading State -->
    <div
      class="grid max-w-screen-xl grid-cols-1 gap-5 p-4 mx-auto ring sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
    >
      {#each Array(20) as _, index}
        <div class="rounded animate-pulse aspect-portrait bg-tertiary"></div>
      {/each}
    </div>
  {:else if filteredPaintings.length > 0}
    <!-- Paintings Grid -->
    <div
      class="grid max-w-screen-xl grid-cols-1 gap-5 p-4 mx-auto sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
    >
      {#each filteredPaintings.slice(0, visiblePaintingsCount) as painting, index (painting.slug)}
        <PaintingCard {painting} {index} />
      {/each}
    </div>
  {:else if selectedTags.length > 0 || searchQuery !== ''}
    <!-- No Paintings Match Filters -->
    <div class="text-center text-white">
      <p>No paintings match your filters. Try adjusting them.</p>
    </div>
  {:else}
    <!-- No Paintings Available -->
    <div
      class="grid max-w-screen-xl grid-cols-1 gap-5 p-4 mx-auto sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
    >
      {#each Array(20) as _, index}
        <div class="rounded animate-pulse aspect-portrait bg-tertiary"></div>
      {/each}
    </div>
  {/if}

  <!-- Load More Button -->
  {#if filteredPaintings.length > visiblePaintingsCount}
    <div class="p-4 text-center">
      <button
        on:click={loadMorePaintings}
        class="px-4 py-2 text-white rounded bg-primary hover:bg-primary/70"
      >
        Load More
      </button>
    </div>
  {/if}
</div>

<!-- Filter Dialog -->
<Dialog bind:dialog on:close>
  <section class="p-4 rounded bg-tertiary">
    <div class="pb-4">
      <h2>Filter by Tags</h2>
      <p>
        Select tags to filter paintings. Click on a tag to toggle it on or off.
      </p>
    </div>

    {#if tags}
      <ul
        class="grid flex-col grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-8"
      >
        {#each tags as tag}
          <li>
            <button
              on:click={() => toggleTag(tag.name)}
              class={cn(
                'rounded-lg p-2 w-full transition-colors duration-200 ease-in-out',
                selectedTags.includes(tag.name)
                  ? 'bg-primary text-white'
                  : 'bg-white text-black hover:bg-primary hover:text-white'
              )}
              aria-pressed={selectedTags.includes(tag.name)}
            >
              {tag.name} ({tag.paintingsCount})
            </button>
          </li>
        {/each}
      </ul>
    {/if}

    <div class="flex justify-end pt-4">
      <button
        on:click={() => dialog.close()}
        class="p-2 text-white transition-colors duration-200 ease-in-out rounded-lg bg-primary hover:bg-secondary"
      >
        Close
      </button>
    </div>
  </section>
</Dialog>
