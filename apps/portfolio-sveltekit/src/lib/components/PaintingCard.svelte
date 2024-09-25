<script lang="ts">
  import { urlFor } from '$lib/utils/image'
  import { IconBoxMultiple, IconShoppingCart } from '@tabler/icons-svelte'
  import { cn } from '@wisihe/utils'
  import { page } from '$app/stores'

  import type { iSanityPainting } from '$lib/utils/sanity'

  export let painting: iSanityPainting
  export let index: number

  const { title, tagsV2, slug, image, isForSale, imagesCount = 0 } = painting

  const { lqip } = image

  let filter: string[] = []
  let filterContainsNSFW: boolean = false

  $: {
    filter = $page.url.searchParams.getAll('filter') || ['']
    filterContainsNSFW = filter.includes('NSFW')
  }

  const hasNSFWTag = tagsV2.some(tag => tag.name.toLowerCase().includes('nsfw'))

  let imgLoaded = false

  function handleImageLoad() {
    imgLoaded = true
  }
</script>

<article
  class={cn(
    'relative z-0 w-full h-full duration-500 ease-in-out scale-100 rounded outline-none overflow-clip focus-within:ring  group hover:ring-4 hover:z-10 ring-primary within',
    'transition-transform',
    'col-span-full sm:col-span-6 md:col-span-4 xl:col-span-3'
  )}
>
  <div
    class="absolute z-10 flex items-start justify-between gap-1 pr-16 text-xs transition-all duration-500 ease-in-out group-hover:top-2 -top-32 left-2 right-2"
  >
    <ul class="flex flex-wrap gap-1">
      {#each tagsV2 as tag}
        <li class="px-1 text-xs text-white capitalize rounded bg-primary">
          <strong>
            {tag.name}
          </strong>
        </li>
      {/each}
    </ul>
  </div>
  <div
    class="absolute z-10 flex flex-col gap-1 text-xs transition-all duration-200 ease-in-out right-2 top-2"
  >
    <ul class="flex flex-col gap-2">
      {#if isForSale}
        <li
          class="relative flex items-center justify-center text-xs rounded-full w-fit h-fit"
        >
          <div
            class="absolute inset-0 w-full h-full rounded-full shrink-0 animate-ping bg-highlight"
          />
          <div class="z-10 p-2 rounded-full shrink-0 bg-highlight">
            <IconShoppingCart />
          </div>
        </li>
      {/if}
      {#if imagesCount >= 1}
        <li
          class="p-2 text-xs text-white transition-all duration-500 ease-in-out rounded-full bg-primary translate-x-52 group-hover:translate-x-0"
        >
          <IconBoxMultiple />
        </li>
      {/if}
    </ul>
  </div>
  {#if hasNSFWTag && !filterContainsNSFW}
    <div
      class="absolute inset-0 flex items-center justify-center w-full h-full bg-primary/40 backdrop-blur-xl"
    >
      <p class="font-semibold text-white">NSFW</p>
    </div>
  {/if}
  <div
    class="relative w-full h-full bg-dark aspect-portrait"
    style:background-image="url({lqip})"
    style:background-size="cover"
    style:background-position="center"
  >
    <picture>
      <source
        srcset={urlFor(image).width(300).height(400).url()}
        media="(max-width: 640px)"
        type="image/webp"
      />
      <source
        srcset={urlFor(image).width(200).height(400).url()}
        media="(max-width: 1024px)"
        type="image/webp"
      />
      <source
        srcset={urlFor(image).width(300).height(600).url()}
        media="(max-width: 1280px)"
        type="image/webp"
      />
      <img
        src={urlFor(image).width(200).height(400).url()}
        alt={title}
        class={cn(
          'absolute inset-0 w-full h-full object-cover rounded transition-opacity duration-300',
          imgLoaded ? 'opacity-100' : 'opacity-0'
        )}
        loading={index < 10 ? 'eager' : 'lazy'}
        decoding={index < 10 ? 'auto' : 'async'}
        on:load={handleImageLoad}
      />
    </picture>
  </div>
  <a href={`/paintings/${slug}`}>
    <div
      class="absolute bottom-0 left-0 right-0 px-4 py-2 transition-all duration-500 ease-in-out bg-dark/60 backdrop-blur-lg"
    >
      <h2 class="text-lg capitalize xl:text-2xl">
        <strong class="text-white text-balance">
          {title}
        </strong>
      </h2>
    </div>
  </a>
</article>

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
        animation: appear linear;
        animation-timeline: view();
        animation-range: entry 0% cover 25%;
      }
    }
  }

  a::before {
    content: '';
    position: absolute;
    inset: 0;
  }
</style>
