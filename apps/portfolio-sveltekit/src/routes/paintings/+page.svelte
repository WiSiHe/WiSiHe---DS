<script lang="ts">
  import { urlFor } from '$lib/utils/image'
  import type { iSanityTag, iSanityPaintingsTag } from '$lib/utils/sanity.js'
  import { fade, fly } from 'svelte/transition'

  import { goto } from '$app/navigation'

  export let data

  const { paintings = [], tags = [] } = data

  $: searchString = ''

  import { page } from '$app/stores'

  let filter: string[] = []

  let filteredTags: iSanityPaintingsTag[] = []

  let filteredPaintings = paintings

  let timeoutId: number

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
  }

  function removeTag(tag: string) {
    console.log(slugify(tag))
    const newFilter = filter.filter(f => slugify(f) !== slugify(tag))
    console.log(filter, newFilter)
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
</svelte:head>

<div class="grid items-start grid-cols-12 gap-4 p-4 pt-16">
  <section
    class="p-4 rounded shadow col-span-full xl:sticky xl:col-span-3 xl:top-20 bg-tertiary"
  >
    <div class="prose">
      <h1>Gallery</h1>
      <p>A gallery of some of my paintings.</p>
    </div>
    <label for="search" class="">
      <strong> Search paintings </strong>
    </label>
    <input
      type="text"
      id="search"
      placeholder="Search paintings"
      on:input={searchPaintings}
      class="w-full p-2 mt-4 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-primary focus:ring-opacity-50"
    />
    <div>
      Results: {filteredPaintings.length} paintings
    </div>
    <strong>Active filters:</strong>
    {#if filter.length === 0}
      <p>No filters applied</p>
    {/if}
    {#if filter.length > 0}
      <ul class="flex flex-wrap gap-1" in:fade out:fade>
        {#each filter as tag}
          <li
            in:fly={{ duration: 1000, x: 50, delay: 1000 }}
            out:fly={{ duration: 1000, x: -50 }}
          >
            <button
              class="flex items-center gap-1 px-3 py-2 text-xs text-white capitalize transition-all duration-500 ease-in-out rounded-full overflow-clip group hover:scale-150 bg-primary hover:bg-highlight hover:text-dark"
              on:click={() => removeTag(tag)}
            >
              {tag}
              <div
                class="w-0 transition-all duration-500 ease-in-out delay-100 scale-0 translate-x-10 group-hover:w-auto group-hover:scale-100 group-hover:translate-x-0"
              >
                x
              </div>
            </button>
          </li>
        {/each}
      </ul>
    {/if}
    <hr class="py-2" />
    <ul class="flex flex-wrap gap-1 pt-4">
      {#each filteredTags as tag}
        <li
          in:fly={{ duration: 1000, x: 50, delay: 1000 }}
          out:fly={{ duration: 1000, x: -50 }}
        >
          <button
            class="px-3 py-2 text-xs text-white capitalize transition-all duration-500 ease-in-out rounded-full hover:shadow hover:scale-150 dura bg-primary hover:bg-highlight hover:text-dark"
            on:click={() => handleAddTag(tag)}
          >
            {tag.name}({tag.paintingsCount})
          </button>
        </li>
      {/each}
    </ul>
  </section>

  <section class="grid grid-cols-12 gap-2 xl:gap-4 col-span-full xl:col-span-9">
    {#each filteredPaintings as painting (painting.slug)}
      <a
        href={`/paintings/${painting.slug}`}
        class="relative z-0 col-span-12 transition-transform duration-500 ease-in-out scale-100 bg-white rounded hover:z-20 hover:scale-105 sm:col-span-6 md:col-span-4 lg:col-span-3 group hover:shadow-lg"
        data-sveltekit-noscroll
      >
        <article class="w-full h-full p-4">
          <div class="relative aspect-square">
            <img
              src={urlFor(painting.image).width(400).height(600).url()}
              alt={painting.title}
              class="object-cover w-full rounded"
            />
            <ul class="absolute flex flex-wrap gap-1 pt-2 bottom-2 left-2">
              {#each painting.tagsV2 as tag}
                <li
                  class="px-2 py-1 text-xs text-white rounded-full bg-primary"
                >
                  {tag.name}
                </li>
              {/each}
            </ul>
          </div>

          <div class="relative">
            <strong>{painting.title}</strong>
            <p class="text-xs line-clamp-2">{painting.description}</p>
          </div>
        </article>
      </a>
    {/each}
  </section>
</div>
