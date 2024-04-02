<script lang="ts">
  import { urlFor } from '$lib/utils/image'
  import { fade, fly } from 'svelte/transition'

  export let data

  const { paintings = [] } = data

  $: searchString = ''

  let timeoutId: number

  const searchPaintings = (e: Event) => {
    const target = e.target as HTMLInputElement
    clearTimeout(timeoutId) // Clear the timeout if it's already set
    timeoutId = window.setTimeout(() => {
      searchString = target.value
    }, 500) // Set the delay as 500 milliseconds
  }

  $: filteredPaintings = paintings.filter(painting =>
    painting.title.toLowerCase().includes(searchString.toLowerCase())
  )
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
    />
    <p>Results:</p>
    <strong>Filters:</strong>
  </section>
  <section class="col-span-9 pt-16">
    <section class="grid grid-cols-12 gap-4">
      {#each filteredPaintings as painting (painting.slug)}
        <a
          href={`/paintings/${painting.slug}`}
          class="relative col-span-12 rounded overflow-clip aspect-portrait sm:col-span-6 md:col-span-4 lg:col-span-3"
          data-sveltekit-noscroll
          in:fade={{}}
          out:fade={{}}
        >
          <article class="w-full h-full">
            <div
              class="absolute bottom-0 left-0 right-0 z-10 p-2 text-white bg-dark"
            >
              <p>{painting.title}</p>
            </div>
            <img
              src={urlFor(painting.image).width(400).height(400).url()}
              alt={painting.title}
              class="object-cover w-full h-full bg-dark"
            />
          </article>
        </a>
      {/each}
    </section>
  </section>
</div>
