<script lang="ts">
  import { urlFor } from '$lib/utils/image'
  import type { iSanityTag, iSanityPaintingsTag } from '$lib/utils/sanity.js'
  import { fade } from 'svelte/transition'

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
    const newFilter = filter.filter(f => f !== slugify(tag))

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

<div class="grid items-start grid-cols-12 gap-4 p-4">
  <section class="sticky col-span-3 p-4 bg-white top-20 drop-shadow">
    <h1>Gallery</h1>
    <p>A gallery of some of my paintings.</p>
    <input
      type="text"
      placeholder="Search paintings"
      on:input={searchPaintings}
      class="w-full p-2 mt-4 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-primary focus:ring-opacity-50"
    />
    <p>Results:</p>
    <strong>Filters:</strong>
    <ul class="flex gap-1">
      {#each filter as tag}
        <li>
          <button
            class="px-2 py-1 text-xs text-white rounded-full bg-primary"
            on:click={() => removeTag(tag)}
          >
            {tag} X
          </button>
        </li>
      {/each}
    </ul>
    <ul class="flex flex-wrap gap-1 pt-4">
      {#each filteredTags as tag}
        <li>
          <button
            class="px-2 py-1 text-xs text-white transition-colors rounded-full bg-primary hover:bg-highlight hover:text-dark"
            on:click={() => handleAddTag(tag)}
          >
            {tag.name}({tag.paintingsCount})
          </button>
        </li>
      {/each}
    </ul>
  </section>
  <section class="col-span-9 pt-16">
    <section class="grid grid-cols-12 gap-4">
      {#each filteredPaintings as painting (painting.slug)}
        <a
          href={`/paintings/${painting.slug}`}
          class="relative col-span-12 rounded overflow-clip aspect-portrait sm:col-span-6 md:col-span-4 lg:col-span-3"
          data-sveltekit-noscroll
          in:fade
          out:fade
        >
          <article class="w-full h-full">
            <div
              class="absolute bottom-0 left-0 right-0 z-10 p-2 text-white bg-dark"
            >
              <p>{painting.title}</p>
            </div>
            <ul class="absolute flex gap-1 top-2 left-2">
              {#each painting.tagsV2 as tag}
                <li
                  class="px-2 py-1 text-xs text-white rounded-full bg-primary"
                >
                  {tag.name}
                </li>
              {/each}
            </ul>
            <img
              src={urlFor(painting.image).width(400).height(600).url()}
              alt={painting.title}
              class="object-cover w-full h-full bg-dark"
            />
          </article>
        </a>
      {/each}
    </section>
  </section>
</div>
