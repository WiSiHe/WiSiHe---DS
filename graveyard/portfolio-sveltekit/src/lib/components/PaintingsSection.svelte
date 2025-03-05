<script lang="ts">
  import { urlFor } from '$lib/utils/image'
  import type { iSanityPainting } from '$lib/utils/sanity'
  import { cn } from '$lib/utils/string'

  import { fade, fly } from 'svelte/transition'
  import Chip from './Chip.svelte'

  export let paintings: iSanityPainting[] = []

  // randomize the order of paintings
  paintings = paintings.sort(() => Math.random() - 0.5)

  let imgLoaded = false

  function handleImageLoad() {
    imgLoaded = true
  }
</script>

<section class="bg-dark" id="about">
  <div class="relative w-full px-4 py-14 xl:py-24 lg:px-10">
    <div class="prose">
      <h2 class="text-4xl text-white col-span-full">Paintings</h2>
      <p class="text-white">
        As a Digital Artist, my passion leans towards creating stylized
        portraits, ethereal landscapes, and artwork that transports you into the
        cosmos. I also occasionally take up commissioned work. <a
          class="text-white underline hover:text-primary"
          href="/paintings">Check out my gallery</a
        >
      </p>
    </div>
    <section class="relative">
      <div
        class="absolute top-0 bottom-0 right-0 z-10 w-1/3 h-full pointer-events-none from-transparent via-transparent to-dark bg-gradient-to-r"
      ></div>
      <ul
        in:fly={{ y: 200, duration: 2000 }}
        out:fade
        class="flex relative items-stretch w-full gap-4 pt-8 pb-8 h-72 lg:h-[520px] pr-32 overflow-x-scroll scrollbar-hide"
      >
        {#each paintings as painting (painting.slug)}
          <li
            class={cn(
              'relative flex-shrink-0 h-full rounded-lg group within hover:shadow-lg transition-all duration-500 ease-in-out',
              'aspect-square'
            )}
            style="background-image: url({painting.image
              .lqip}); background-size: cover; background-position: center;"
          >
            <a href={`/paintings/${painting.slug}`}>
              <article class="relative w-full h-full rounded overflow-clip">
                <div
                  class="absolute z-10 flex justify-center w-full left-4 bottom-4"
                >
                  <Chip>{painting.title}</Chip>
                </div>

                <img
                  src={urlFor(painting.image)
                    .width(400)
                    .fit('max')
                    .quality(50)
                    .format('webp')
                    .url()}
                  alt={painting.title}
                  class={cn(
                    'absolute inset-0 object-cover w-full h-full transition-all duration-500 ease-in-out scale-105 object-fit group-hover:scale-110',
                    imgLoaded ? 'opacity-100' : 'opacity-0'
                  )}
                  on:load={handleImageLoad}
                  decoding="async"
                  loading="lazy"
                />
              </article>
            </a>
          </li>
        {/each}
      </ul>
    </section>
  </div>
</section>

<style>
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
</style>
