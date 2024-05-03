<script lang="ts">
  import { urlFor } from '$lib/utils/image'
  import type { iSanityPainting } from '$lib/utils/sanity'

  import { fade, fly } from 'svelte/transition'

  export let paintings: iSanityPainting[] = []
</script>

<section>
  <div class="relative w-full text-white py-14 xl:py-24">
    <div class="px-4 prose">
      <h2 class="text-4xl text-blue-800 col-span-full">Paintings</h2>
      <p>
        As a Digital Artist, my passion leans towards creating stylized
        portraits, ethereal landscapes, and artwork that transports you into the
        cosmos. I also occasionally take up commissioned work. <a
          href="/paintings">Check out my gallery</a
        >
      </p>
    </div>

    <ul
      class="flex items-stretch w-full gap-4 pt-8 pb-8 pl-8 pr-4 h-72 lg:h-[520px] overflow-x-scroll scroll-px-4"
    >
      {#each paintings as painting (painting.slug)}
        <li
          class="relative flex-shrink-0 h-full bg-white rounded-lg hover:drop-shadow-lg group"
        >
          <a href={`/paintings/${painting.slug}`} data-sveltekit-noscroll>
            <article
              in:fly={{ y: 200, duration: 2000 }}
              out:fade
              class="w-full h-full rounded-lg overflow-clip"
            >
              <div
                in:fade={{ duration: 2000 }}
                out:fade
                class="absolute inset-0 right-0 z-10 flex items-center justify-center invisible p-2 text-white transition-all duration-500 group-hover:visible bg-dark/20"
              >
                <p>{painting.title}</p>
              </div>

              <img
                src={urlFor(painting.image).width(400).height(400).url()}
                alt={painting.title}
                class="w-full h-full transition-all ease-in-out group-hover:scale-105"
              />
            </article>
          </a>
        </li>
      {/each}
    </ul>
  </div>
</section>

<style>
</style>
