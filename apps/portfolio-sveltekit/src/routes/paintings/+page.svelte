<script lang="ts">
  import type { iSanityPaintingsTag, iSanityTag } from '$lib/utils/sanity.js'
  import { fade, fly } from 'svelte/transition'

  import { IconFilter, IconInfoCircle } from '@tabler/icons-svelte'

  import { goto } from '$app/navigation'

  export let data

  const { paintings = [], tags = [] } = data

  $: searchString = ''

  import { page } from '$app/stores'
  import PaintingCard from '../../components/PaintingCard.svelte'

  import { IconX } from '@tabler/icons-svelte'
  import SideBar from '../../components/SideBar.svelte'

  let filter: string[] = []

  let filteredTags: iSanityPaintingsTag[] = []

  let filteredPaintings = paintings

  let timeoutId: number

  let sortOrder: 'newest' | 'oldest' | 'random' = 'random'

  let visibleFilters = false

  export const slugify = (str: string) => {
    if (!str) return ''
    return str
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-')
  }

  const searchPaintings = (e: Event) => {
    const target = e.target as HTMLInputElement
    clearTimeout(timeoutId) // Clear the timeout if it's already set
    timeoutId = window.setTimeout(() => {
      searchString = target.value
    }, 500) // Set the delay as 500 milliseconds
  }

  $: {
    filter = $page.url.searchParams.getAll('filter') || ['']
    filteredTags = tags.filter(tag => !filter.includes(slugify(tag.name)))
    filteredPaintings = paintings.filter(painting =>
      painting.title.toLowerCase().includes(searchString.toLowerCase())
    )
    filteredPaintings = filteredPaintings.filter(
      painting =>
        painting.tagsV2.some(tag => filter.includes(slugify(tag.name))) ||
        filter.length === 0
    )

    // Sort filteredPaintings based on sortOrder
    if (sortOrder === 'newest') {
      filteredPaintings.sort(
        (a, b) =>
          new Date(b.paintedAt).getTime() - new Date(a.paintedAt).getTime()
      )
    } else if (sortOrder === 'oldest') {
      filteredPaintings.sort(
        (a, b) =>
          new Date(a.paintedAt).getTime() - new Date(b.paintedAt).getTime()
      )
    } else if (sortOrder === 'random') {
      filteredPaintings = [...filteredPaintings].sort(() => Math.random() - 0.5)
    }
  }

  function removeTag(tag: string) {
    const newFilter = filter.filter(f => slugify(f) !== slugify(tag))
    const newParams = newFilter.map(f => `filter=${f}`).join('&')
    const newRouteWithFilters = `/paintings/?${newParams}`
    goto(newRouteWithFilters)
  }

  function handleAddTag(tag: iSanityTag) {
    const newFilter = [...filter, slugify(tag.name)]
    const newParams = newFilter.map(f => `filter=${f}`).join('&')
    const newRouteWithFilters = `/paintings/?${newParams}`
    goto(newRouteWithFilters)
  }
</script>

<svelte:head>
  <title>Paintings</title>
  <meta name="description" content="Portfolio of paintings by artist, WiSiHe" />
  <meta
    name="keywords"
    content="paintings, art, artist, portfolio, gallery, WiSiHe"
  />
</svelte:head>

<div class="grid items-start grid-cols-12 gap-4 p-4 pt-16">
  <SideBar
    className="sticky top-16 shadow-xl h-fit transition-all ease-in-out bg-white"
  >
    <div class="prose">
      <h1>Gallery</h1>
      <p>A gallery of some of my paintings.</p>
    </div>

    <search>
      <label for="search" class="">
        <strong> Search paintings </strong>
      </label>
      <button popovertarget="test">
        <IconInfoCircle />
      </button>
      <div id="test" popover="auto">
        <p>Search for paintings by title</p>
      </div>
      <input
        type="search"
        id="search"
        placeholder="Search paintings"
        on:input={searchPaintings}
        class="w-full p-2 mt-4 border border-gray-300 focus:outline-none focus:ring focus:ring-primary focus:ring-opacity-50"
      />
    </search>

    <select
      class="w-full p-2 mt-4 border border-gray-300 focus:outline-none focus:ring focus:ring-primary focus:ring-opacity-50"
      bind:value={sortOrder}
    >
      <option value="newest">Newest</option>
      <option value="oldest">Oldest</option>
      <option value="random">Random</option>
    </select>

    <div class="flex flex-col gap-4 pt-2">
      <div class="flex justify-between">
        <button
          on:click={() => (visibleFilters = !visibleFilters)}
          class="flex items-center px-3 py-2 text-xs text-white capitalize transition-all ease-in-out anchor hover:shadow bg-primary hover:bg-highlight hover:text-dark"
        >
          <IconFilter class="w-6 h-6" />
          Filters
        </button>
      </div>

      {#if filter.length > 0}
        <ul class="flex flex-wrap gap-1" in:fade out:fade>
          {#each filter as tag}
            <li in:fly={{ x: 50 }} out:fly={{ x: -50 }}>
              <button
                class="flex items-center gap-1 px-3 py-2 text-xs text-white capitalize transition-all ease-in-out overflow-clip group bg-primary hover:bg-highlight hover:text-dark"
                on:click={() => removeTag(tag)}
              >
                {tag}
                <IconX />
              </button>
            </li>
          {/each}
        </ul>
      {/if}

      {#if visibleFilters}
        <hr in:fade out:fade />
        <ul class="flex flex-wrap gap-1" in:fade out:fade>
          {#each filteredTags as tag}
            <li in:fly={{ x: 50 }} out:fly={{ x: -50 }}>
              <button
                class="px-3 py-2 text-xs text-white capitalize transition-all ease-in-out hover:shadow bg-primary hover:bg-highlight hover:text-dark"
                on:click={() => handleAddTag(tag)}
              >
                {tag.name}({tag.paintingsCount})
              </button>
            </li>
          {/each}
        </ul>
      {/if}
    </div>
    <div class="flex items-center justify-center p-4 mt-4 bg-tertiary">
      Results: <strong>{filteredPaintings.length}</strong>
    </div>
  </SideBar>

  <section class="grid grid-cols-12 gap-4 col-span-full xl:col-span-9">
    {#each filteredPaintings as painting (painting.slug)}
      <PaintingCard {painting} />
    {/each}
  </section>
</div>

<style>
  /* ::backdrop {
    backdrop-filter: blur(10px);
  } */
  /* .anchor {
    anchor-name: '--my-anchor';
  }

  .positioned {
    position: absolute;
    position-anchor: '--my-anchor';
    top: anchor(bottom);
  } */
</style>
