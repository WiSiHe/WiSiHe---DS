<script lang="ts">
  import {
    getAspectRatioClass,
    getAspectRatioImageHeight,
    getAspectRatioImageWidth,
    urlFor
  } from '$lib/utils/image'
  import type { iSanityPainting } from '$lib/utils/sanity'
  import { cn } from '$lib/utils/string'

  import { fade, fly } from 'svelte/transition'
  import Chip from './Chip.svelte'

  export let paintings: iSanityPainting[] = []

  // randomize the order of paintings
  paintings = paintings.sort(() => Math.random() - 0.5)
</script>

<section class="bg-dark">
  <div class="relative w-full py-14 xl:py-24 lg:px-10">
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
        class="h-full from-transparent via-transparent pointer-events-none to-dark bg-gradient-to-r z-10 absolute right-0 top-0 bottom-0 w-1/3"
      />
      <ul
        in:fly={{ y: 200, duration: 2000 }}
        out:fade
        class="flex relative items-stretch w-full gap-4 pt-8 pb-8 h-72 lg:h-[520px] pr-32 overflow-x-scroll scrollbar-hide"
      >
        {#each paintings as painting (painting.slug)}
          <li
            class={cn(
              'relative flex-shrink-0 h-full bg-white rounded-lg group within hover:shadow-lg transition-all duration-500 ease-in-out',
              getAspectRatioClass(painting.image.aspectRatio)
            )}
          >
            <a href={`/paintings/${painting.slug}`}>
              <article class="w-full h-full relative overflow-clip rounded">
                <div
                  class="absolute left-4 bottom-4 flex justify-center w-full z-10"
                >
                  <Chip>{painting.title}</Chip>
                </div>

                <img
                  src={urlFor(painting.image)
                    .width(getAspectRatioImageWidth(painting.image.aspectRatio))
                    .height(
                      getAspectRatioImageHeight(painting.image.aspectRatio)
                    )
                    .url()}
                  alt={painting.title}
                  class="w-full h-full absolute inset-0 transition-all duration-500 scale-105 object-fit object-cover ease-in-out group-hover:scale-110"
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
  @supports (animation-timeline: view()) {
    @media (prefers-reduced-motion: no-preference) {
      @keyframes appear {
        from {
          opacity: 0.9%;
          transform: translateY(100px) scale(0.9);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      .within {
        z-index: 1;
        animation: appear linear;
        animation-timeline: view();
        animation-range: entry -40% contain 5%;
      }
    }
  }
</style>
