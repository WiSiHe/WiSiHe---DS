<script lang="ts">
  import type { iSanityPainting, iSanityPaintingsTag } from '$lib/utils/sanity'
  import { onMount } from 'svelte'
  import { page } from '$app/stores'
  import { goto } from '$app/navigation'
  import { browser } from '$app/environment'
  import PaintingCard from './PaintingCard.svelte'
  import Select from './Select.svelte'
  import Dialog from './Dialog.svelte'
  import { IconFilter } from '@tabler/icons-svelte'

  let dialog: HTMLDialogElement

  export let paintings: iSanityPainting[] = []
  export let tags: iSanityPaintingsTag[] = []

  let filteredPaintings: iSanityPainting[] = []
  let selectedTags: string[] = []
  let sortOption = 'random'
  let allTags: string[] = []

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
      filteredPaintings = [...filteredPaintings].sort(() => Math.random() - 0.5)
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
</script>

<div class="min-h-screen">
  <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 20px;">
    Art Gallery
  </h1>
  <div
    style="margin-bottom: 20px;"
    class="sticky top-0 z-20 bg-tertiary shadow-xl p-4"
  >
    <h2 style="font-size: 18px; margin-bottom: 10px;">Filter by Tags</h2>
    <button
      on:click={() => dialog.showModal()}
      class="bg-primary text-white p-3 rounded-lg flex items-center gap-2"
    >
      <IconFilter />
    </button>

    <div>
      <Select
        bind:value={sortOption}
        options={[
          { value: 'random', label: 'Random' },
          { value: 'newest', label: 'Newest' },
          { value: 'oldest', label: 'Oldest' },
          { value: 'mostLiked', label: 'Most Liked' }
        ]}
      />
    </div>
  </div>

  <div class="grid grid-cols-12 gap-4 p-4">
    {#each filteredPaintings as painting (painting.slug)}
      <PaintingCard {painting} />
    {/each}
  </div>
</div>

<Dialog bind:dialog on:close>
  {#each tags as tag}
    <button
      on:click={() => toggleTag(tag.name)}
      style="margin-right: 10px; margin-bottom: 10px; padding: 5px 10px; border-radius: 15px; border: none; background-color: {selectedTags.includes(
        tag.name
      )
        ? '#007bff'
        : '#e9ecef'}; color: {selectedTags.includes(tag.name)
        ? 'white'
        : 'black'};"
    >
      {tag.name} ({tag.paintingsCount})
    </button>
  {/each}
</Dialog>
