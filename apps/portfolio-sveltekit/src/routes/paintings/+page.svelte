<script>
  import { urlFor } from '$lib/utils/image'
  import { fade, fly } from 'svelte/transition'

  /** @type {import('./$types').PageData} */
  export let data

  const { paintings = [] } = data
</script>

<section class="p-4 pt-16">
  <div class="pb-4">
    <h1 class="text-4xl text-blue-800">My paintings</h1>
  </div>
  <section class="grid grid-cols-12 gap-4">
    {#each paintings as painting (painting.slug)}
      <a
        href={`/paintings/${painting.slug}`}
        class="relative col-span-12 rounded overflow-clip sm:col-span-6 md:col-span-4 lg:col-span-3"
        data-sveltekit-noscroll
      >
        <article in:fly={{ y: 200, duration: 2000 }} out:fade>
          <div
            class="absolute bottom-0 left-0 right-0 z-10 p-2 text-white bg-dark"
          >
            <p>{painting.title}</p>
          </div>
          <img
            src={urlFor(painting.image).width(400).height(400).url()}
            alt={painting.title}
            class="w-full"
          />
        </article>
      </a>
    {/each}
  </section>
</section>
