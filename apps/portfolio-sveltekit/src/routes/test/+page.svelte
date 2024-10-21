<script lang="ts">
  import { urlFor } from '$lib/sanity/image'
  import {
    getAllPaintingsFilterAndTags,
    type iSanityPainting,
    type iSanityPaintingsTag
  } from '$lib/utils/sanity'
  import { onMount } from 'svelte'

  // Search term, filter (tag _id), pagination page number, and results limit
  export let searchTerm: string = ''
  export let filter: string = ''
  export let pageNumber: number = 1
  export let limit: number = 12

  // Arrays to store fetched paintings and tags
  let paintings: iSanityPainting[] = []
  let tags = []
  let sortedTags: iSanityPaintingsTag[] = []

  // Function to fetch paintings and tags based on search, filter, and pagination
  const fetchPaintingsAndTags = async () => {
    try {
      const data = await getAllPaintingsFilterAndTags({
        searchTerm: searchTerm || '', // Ensure searchTerm is never undefined
        filter: filter || '', // Ensure filter is never undefined
        pageNumber,
        limit
      })

      if (data) {
        paintings = data.paintings
        tags = data.tags

        sortedTags = tags
          .filter(tag => tag.paintingsCount > 2)
          .sort((a, b) => {
            if (a.name === 'Store') return -1
            if (b.name === 'Store') return 1
            return (
              b.paintingsCount - a.paintingsCount ||
              a.name.localeCompare(b.name)
            )
          })
      }
    } catch (err) {
      console.error('Error fetching paintings and tags:', err)
    }
  }

  // Fetch data on component mount
  onMount(() => {
    fetchPaintingsAndTags()
  })

  // Trigger fetching paintings when inputs change
  $: searchTerm, filter, pageNumber, limit, fetchPaintingsAndTags()
</script>

<div>
  <section class="max-w-screen-xl p-4 mx-auto">
    <h2>Paintings</h2>
    <input
      type="text"
      placeholder="Search paintings..."
      bind:value={searchTerm}
      on:input={fetchPaintingsAndTags}
    />

    <select bind:value={filter} on:change={fetchPaintingsAndTags}>
      <option value="">All Tags</option>
      {#each sortedTags as tag}
        <option value={tag._id}>{tag.name} {tag.paintingsCount}</option>
      {/each}
    </select>
  </section>
  {#if paintings.length > 0}
    <ul
      class="grid max-w-screen-xl grid-cols-1 gap-5 p-4 mx-auto sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
    >
      {#each paintings as painting, index}
        <li>
          <strong>
            {painting.title}
          </strong>

          <img
            src={urlFor(painting.image)
              .width(300)
              .height(300)
              .quality(49)
              .format('webp')
              .url()}
            alt={painting.title}
          />
        </li>
      {/each}
    </ul>
    <div class="flex justify-center gap-4">
      <button
        on:click={() => {
          if (pageNumber > 1) {
            pageNumber--
            fetchPaintingsAndTags() // Fetch previous page
          }
        }}
        disabled={pageNumber === 1}
      >
        Previous
      </button>

      <strong>Page: {pageNumber}</strong>

      <button
        on:click={() => {
          pageNumber++
          fetchPaintingsAndTags() // Fetch next page
        }}
      >
        Next
      </button>
    </div>
  {:else}
    <p>No paintings found</p>
  {/if}

  <!-- <h2>Tags</h2>
  {#if sortedTags.length > 0}
    <ul>
      {#each sortedTags as tag}
        <li>{tag.name} ({tag.paintingsCount})</li>
      {/each}
    </ul>
  {:else}
    <p>No tags found</p>
  {/if} -->
</div>
