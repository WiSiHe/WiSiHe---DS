<script lang="ts">
  import type { iSanityPainting, iSanityPaintingsTag } from '$lib/utils/sanity'
  import { onMount } from 'svelte'
  import { page } from '$app/stores'
  import { goto } from '$app/navigation'
  import { browser } from '$app/environment'
  import PaintingCard from './PaintingCard.svelte'
  import Select from './Select.svelte'
  import Dialog from './Dialog.svelte'
  import { IconFilter, IconX } from '@tabler/icons-svelte'
  import { cn } from '@wisihe/utils'

  let dialog: HTMLDialogElement

  export let paintings: iSanityPainting[] = []
  console.log({ paintings })
  export let tags: iSanityPaintingsTag[] = []

  let filteredPaintings: iSanityPainting[] = []
  let selectedTags: string[] = []

  let sortOption = 'random'

  function updateSessionStorage() {
    if (browser) {
      sessionStorage.setItem('selectedTags', JSON.stringify(selectedTags))
      sessionStorage.setItem('sortOption', sortOption)
    }
  }

  function updateURLParams() {
    if (browser) {
      const url = new URL(window.location.href)
      url.searchParams.delete('filter')
      selectedTags.forEach(tag => url.searchParams.append('filter', tag))
      url.searchParams.set('sort', sortOption)
      goto(url.toString(), { replaceState: true, noScroll: true })
    }
  }

  $: {
    // Filter and sort paintings
    filteredPaintings = paintings.filter(
      painting =>
        selectedTags.length === 0 ||
        selectedTags.every(tag => painting.tagsV2.some(t => t.name === tag))
    )

    if (sortOption === 'random') {
      filteredPaintings = paintings
    } else if (sortOption === 'newest') {
      filteredPaintings = [...filteredPaintings].sort(
        (a, b) =>
          new Date(b.paintedAt).getTime() - new Date(a.paintedAt).getTime()
      )
    } else if (sortOption === 'oldest') {
      filteredPaintings = [...filteredPaintings].sort(
        (a, b) =>
          new Date(a.paintedAt).getTime() - new Date(b.paintedAt).getTime()
      )
    } else if (sortOption === 'mostLiked') {
      filteredPaintings = [...filteredPaintings].sort(
        (a, b) => b.likes - a.likes
      )
    } else if (sortOption === 'mostViewed') {
      filteredPaintings = [...filteredPaintings].sort(
        (a, b) => b.viewsCount - a.viewsCount
      )
    }

    // Update session storage and URL params
    updateSessionStorage()
    updateURLParams()
  }

  onMount(() => {
    if (browser) {
      // Initialize filters and sort option from URL parameters or session storage
      const urlParams = new URLSearchParams($page.url.searchParams)
      selectedTags = urlParams.getAll('filter')
      sortOption =
        urlParams.get('sort') ||
        sessionStorage.getItem('sortOption') ||
        'random'

      if (selectedTags.length === 0) {
        const storedTags = sessionStorage.getItem('selectedTags')
        if (storedTags) {
          selectedTags = JSON.parse(storedTags)
        }
      }

      // Update URL params to reflect initial state
      updateURLParams()
    }
  })

  function toggleTag(tag: string) {
    selectedTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag]
  }
  console.log({ selectedTags })
</script>

<div class="min-h-screen bg-dark">
  <div class=" bg-tertiary">
    <div class="max-w-screen-xl p-4 mx-auto prose">
      <h1>Art Gallery</h1>
      <p class="">
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
      />
      <button
        on:click={() => dialog.showModal()}
        class="flex items-center p-2 text-white rounded-lg bg-primary hover:bg-primary/40"
      >
        <IconFilter />Filters ({selectedTags.length})
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

  <div class="grid max-w-screen-xl grid-cols-12 gap-5 p-4 mx-auto">
    {#each filteredPaintings as painting, index (painting.slug)}
      <PaintingCard {painting} {index} />
    {/each}
  </div>
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
            {tag.name} ({tag.paintingsCount})</button
          >
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
