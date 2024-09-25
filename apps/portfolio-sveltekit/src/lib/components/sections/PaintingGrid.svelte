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

  export let paintings: iSanityPainting[] = []
  export let tags: iSanityPaintingsTag[] = []

  let filteredPaintings: iSanityPainting[] = []
  let selectedTags: string[] = []
  let searchQuery = ''
  let visiblePaintingsCount = 20 // Limit to 20 paintings initially

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

  const debouncedUpdateSessionStorage = debounce(updateSessionStorage, 200)
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

  function updateFilteredPaintings() {
    filteredPaintings = paintings.filter(painting => {
      let matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every(tag => painting.tagsV2.some(t => t.name === tag))

      let matchesSearch =
        searchQuery === '' ||
        painting.title.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesTags && matchesSearch
    })

    if (sortOption === 'newest') {
      filteredPaintings.sort(
        (a, b) =>
          new Date(b.paintedAt).getTime() - new Date(a.paintedAt).getTime()
      )
    } else if (sortOption === 'oldest') {
      filteredPaintings.sort(
        (a, b) =>
          new Date(a.paintedAt).getTime() - new Date(b.paintedAt).getTime()
      )
    } else if (sortOption === 'mostLiked') {
      filteredPaintings.sort((a, b) => b.likes - a.likes)
    } else if (sortOption === 'mostViewed') {
      filteredPaintings.sort((a, b) => b.viewsCount - a.viewsCount)
    }

    updateSessionStorage()
  }

  function loadMorePaintings() {
    visiblePaintingsCount += 20 // Load 20 more paintings on button click
  }

  onMount(() => {
    if (browser) {
      const urlParams = new URLSearchParams(window.location.search)
      selectedTags = urlParams.getAll('filter')
      sortOption =
        urlParams.get('sort') ||
        sessionStorage.getItem('sortOption') ||
        'random'
      searchQuery = sessionStorage.getItem('searchQuery') || ''

      if (selectedTags.length === 0) {
        const storedTags = sessionStorage.getItem('selectedTags')
        if (storedTags) selectedTags = JSON.parse(storedTags)
      }

      debouncedUpdateFilteredPaintings()
    }
  })

  function toggleTag(tag: string) {
    selectedTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag]

    debouncedUpdateFilteredPaintings()
  }
</script>

<div class="min-h-screen bg-dark">
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

  <div
    style="margin-bottom: 20px;"
    class="sticky top-0 z-20 shadow-xl bg-tertiary"
  >
    <div class="flex flex-wrap items-end max-w-screen-xl gap-2 p-4 mx-auto">
      <input
        type="text"
        placeholder="Search paintings"
        bind:value={searchQuery}
        class="p-2 border rounded"
        on:input={debouncedUpdateFilteredPaintings}
      />

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
        on:change={debouncedUpdateFilteredPaintings}
      />
      <button
        on:click={() => dialog.showModal()}
        class="flex items-center p-2 text-white rounded-lg bg-primary hover:bg-primary/40"
      >
        <IconFilter /> Filters ({selectedTags.length})
      </button>

      {#each selectedTags as tag (tag)}
        <button
          on:click={() => toggleTag(tag)}
          class="flex items-center p-2 text-white rounded-lg bg-primary hover:bg-primary/40"
        >
          {tag}
          <IconX />
        </button>
      {/each}

      {#if selectedTags.length > 0}
        <button
          on:click={() => (selectedTags = [])}
          class="flex items-center p-2 text-white rounded-lg bg-primary hover:bg-primary/40"
        >
          Clear All
        </button>
      {/if}
    </div>
  </div>

  <!-- Paintings count display -->
  <div class="p-4 text-center">
    <p>
      Showing {Math.min(visiblePaintingsCount, filteredPaintings.length)} of {filteredPaintings.length}
      paintings
    </p>
  </div>

  <div class="grid max-w-screen-xl grid-cols-12 gap-5 p-4 mx-auto">
    {#each filteredPaintings.slice(0, visiblePaintingsCount) as painting, index (painting.slug)}
      <PaintingCard {painting} {index} />
    {/each}
  </div>

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

<Dialog bind:dialog on:close>
  <section class="p-4 rounded bg-tertiary">
    <div class="pb-4">
      <h2>Filter by Tags</h2>
      <p>
        Select tags to filter paintings. Click on a tag to toggle it on or off.
      </p>
    </div>

    <ul
      class="grid flex-col grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-8"
    >
      {#each tags as tag}
        <li>
          <button
            on:click={() => toggleTag(tag.name)}
            class={cn(
              'rounded-lg',
              'p-2',
              'w-full',
              'border-none',
              'bg-white',
              'text-black',
              'hover:bg-primary',
              'hover:text-white',
              'transition-colors',
              'duration-200',
              'ease-in-out',
              selectedTags.includes(tag.name) && 'bg-primary text-white'
            )}
          >
            {tag.name} ({tag.paintingsCount})
          </button>
        </li>
      {/each}
    </ul>

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
