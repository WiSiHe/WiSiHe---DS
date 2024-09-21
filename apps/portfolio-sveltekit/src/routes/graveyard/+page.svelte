<script lang="ts">
  import type { iSanityPaintingsTag, iSanityTag } from '$lib/utils/sanity.js'
  import { fade, fly } from 'svelte/transition'

  import { IconFilter, IconInfoCircle } from '@tabler/icons-svelte'

  import { goto } from '$app/navigation'

  type iSortOrderOption = { value: string; label: string }

  export let data

  const { paintings = [], tags = [] } = data

  $: searchString = ''

  import { page } from '$app/stores'
  import PaintingCard from '../../components/PaintingCard.svelte'

  import { IconX } from '@tabler/icons-svelte'
  import { cn } from '@wisihe/utils'
  import ButtonGroup from '../../components/ButtonGroup.svelte'
  import Chip from '../../components/Chip.svelte'
  import FilterBar from '../../components/FilterBar.svelte'
  import FilterDrawer from '../../components/FilterDrawer.svelte'

  let filter: string[] = []

  let filteredTags: iSanityPaintingsTag[] = []

  let filteredPaintings = paintings

  let timeoutId: number

  let sortOrder: iSortOrderOption = {
    value: 'newest',
    label: 'Newest'
  } as const

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
    // Update URL when filters or sort option change
    const searchParams = new URLSearchParams($page.url.searchParams)
    searchParams.delete('filter')
    selectedTags.forEach(tag => searchParams.append('filter', tag))
    searchParams.set('sort', sortOption)
    goto(`?${searchParams.toString()}`, { replaceState: true, noscroll: true })

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

  function setSortOrder(value: { value: string; label: string; Icon?: any }) {
    sortOrder = value
    const newRouteWithSort = `/paintings/?sort=${value.value}`
    if (filter.length > 0) {
      const newParams = filter.map(f => `filter=${f}`).join('&')
      goto(`${newRouteWithSort}&${newParams}`)
    }
    goto(newRouteWithSort)
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

<FilterBar />
<FilterDrawer isOpen={visibleFilters}>
  <ul class="flex flex-wrap gap-1" in:fade out:fade>
    {#each filteredTags as tag}
      <li in:fly={{ x: 50 }} out:fly={{ x: -50 }}>
        <Chip color="primary" onClick={() => handleAddTag(tag)}>
          {tag.name}({tag.paintingsCount})
        </Chip>
      </li>
    {/each}
  </ul>
</FilterDrawer>

<section class="flex flex-col items-start gap-4 p-4 xl:flex-row">
  <div class="w-full p-0 xl:sticky xl:top-4 xl:max-w-96">
    <div
      class="flex flex-col items-center justify-center gap-2 p-4 text-white rounded xl:hidden col-span-full xl:col-span-3 bg-primary"
    >
      <h1>Gallery</h1>
      <p>A gallery of some of my paintings.</p>
    </div>
    <div
      class={cn(
        'transition-all duration-500 ease-in-out rounded xl:p-4 xl:shadow w-full h-fit xl:bg-white'
      )}
    >
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
          class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-primary focus:ring-opacity-50"
        />
      </search>

      <label for="sort" class="">
        <strong> Sort paintings </strong>
      </label>

      <ButtonGroup
        onChange={setSortOrder}
        value={sortOrder}
        options={[
          { label: 'Newest', value: 'newest', Icon: IconInfoCircle },
          { label: 'Oldest', value: 'oldest', Icon: IconInfoCircle },
          { label: 'Random', value: 'random', Icon: IconInfoCircle }
        ]}
      />

      <div class="flex flex-col gap-4 pt-2">
        <button
          on:click={() => (visibleFilters = !visibleFilters)}
          class="flex items-center gap-2 p-4 text-xs text-white capitalize transition-all ease-in-out rounded anchor hover:shadow bg-primary hover:bg-highlight hover:text-dark"
        >
          <IconFilter class="w-4 h-4" />Filters:
        </button>

        {#if filter.length > 0}
          <ul class="flex flex-wrap gap-1" in:fade out:fade>
            {#each filter as tag}
              <li in:fly={{ x: 50 }} out:fly={{ x: -50 }}>
                <Chip color="primary" onClick={() => removeTag(tag)}>
                  {tag}
                  <IconX />
                </Chip>
              </li>
            {/each}
          </ul>
        {/if}

        {#if visibleFilters}
          <hr in:fade out:fade />
          <ul class="flex flex-wrap gap-1" in:fade out:fade>
            {#each filteredTags as tag}
              <li in:fly={{ x: 50 }} out:fly={{ x: -50 }}>
                <Chip color="primary" onClick={() => handleAddTag(tag)}>
                  {tag.name}({tag.paintingsCount})
                </Chip>
              </li>
            {/each}
          </ul>
        {/if}
      </div>
      <div class="pt-4">
        Currently showing: <strong>{filteredPaintings.length}</strong> paintings
      </div>
    </div>
  </div>

  <section
    class="grid w-full grid-cols-12 gap-4 transition-all duration-500 ease-in-out col-span-full"
  >
    <div
      class="flex-col items-center justify-center hidden gap-2 p-4 text-white rounded xl:flex col-span-full xl:col-span-3 2xl:col-span-4 bg-primary"
    >
      <h1>Gallery</h1>
      <p>A gallery of some of my paintings.</p>
    </div>

    {#each filteredPaintings as painting (painting.slug)}
      <PaintingCard {painting} />
    {/each}
  </section>
</section>

<style>
</style>
