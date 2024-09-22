<script lang="ts">
  import { urlFor } from '$lib/utils/image'
  import { IconBoxMultiple, IconShoppingCart } from '@tabler/icons-svelte'
  import { cn, isNotEmptyArray } from '@wisihe/utils'
  import { page } from '$app/stores'
  import { fade } from 'svelte/transition'

  import type { iSanityPainting } from '$lib/utils/sanity'

  export let painting: iSanityPainting

  const { title, tagsV2, slug, redbubbleUrl, images = [] } = painting

  function isValidUrl(url: string | undefined | null): boolean {
    if (!url) return false
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const hasSalesLink = isValidUrl(redbubbleUrl)
  const hasMultipleImages = isNotEmptyArray(images)

  let filter: string[] = []
  let filterContainsNSFW: boolean = false

  $: {
    filter = $page.url.searchParams.getAll('filter') || ['']
    filterContainsNSFW = filter.includes('NSFW')
  }

  const hasNSFWTag = tagsV2.some(tag => tag.name.toLowerCase().includes('nsfw'))
</script>

<article
  class="w-full h-full aspect-portrait overflow-clip relative z-0 col-span-6 transition-transform duration-500 ease-in-out scale-100 rounded outline-none focus-within:ring xl:col-span-3 2xl:col-span-3 group hover:ring-4 hover:z-10 ring-primary within"
>
  <div
    class="absolute z-10 flex pr-16 items-start justify-between gap-1 text-xs transition-all duration-500 ease-in-out group-hover:top-2 -top-32 left-2 right-2"
  >
    <ul class="flex flex-wrap gap-1">
      {#each tagsV2 as tag}
        <li class="text-white text-xs bg-primary px-1 rounded capitalize">
          {tag.name}
        </li>
      {/each}
    </ul>
  </div>
  <div
    class="absolute z-10 flex flex-col group-hover:right-2 gap-1 text-xs top-2 transition-all duration-200 ease-in-out -right-32"
  >
    <ul class="flex flex-col gap-2">
      {#if hasMultipleImages}
        <li class="p-2 bg-primary text-xs text-white rounded-full">
          <IconBoxMultiple />
        </li>
      {/if}
      {#if hasSalesLink}
        <li class="bg-highlight p-2 text-xs rounded-full">
          <IconShoppingCart width={8} height={8} />
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
  <img
    src={urlFor(painting.image).width(200).height(400).url()}
    alt={title}
    class="object-cover w-full h-full"
    loading="lazy"
  />
  <a href={`/paintings/${slug}`}>
    <div
      class="absolute transition-all duration-500 ease-in-out bg-primary/60 backdrop-blur-lg px-4 py-2 left-0 right-0 bottom-0"
    >
      <h2 class="text-lg xl:text-2xl capitalize">
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
