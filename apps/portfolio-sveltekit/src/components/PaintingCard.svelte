<script lang="ts">
  export let painting: iSanityPainting
  import { urlFor } from '$lib/utils/image'
  import { IconBoxMultiple, IconShoppingCart } from '@tabler/icons-svelte'
  import { cn, isNotEmptyArray } from '@wisihe/utils'

  const { title, tagsV2, slug, redbubbleUrl, images = [] } = painting

  function isValidUrl(url: string | undefined | null) {
    if (!url) return false
    try {
      new URL(url)
      return true
    } catch (e) {
      return false
    }
  }

  const hasSalesLink = isValidUrl(redbubbleUrl)

  const hasMultipleImages = isNotEmptyArray(images)

  import type { iSanityPainting } from '$lib/utils/sanity'

  import { page } from '$app/stores'
  import { fade } from 'svelte/transition'

  let filter: string[] = []
  let filterContainsNSFW: boolean = false

  $: {
    filter = $page.url.searchParams.getAll('filter') || ['']
    filterContainsNSFW = filter.includes('nsfw')
  }

  let hasNSFWTag = tagsV2.some((tag: { name: string }) =>
    tag.name.toLowerCase().includes('nsfw')
  )
</script>

<a
  href={`/paintings/${slug}`}
  class="relative z-0 col-span-6 transition-transform duration-500 ease-in-out scale-100 outline-none test focus-within:ring xl:col-span-4 group hover:ring-4 hover:z-10 ring-highlight"
  in:fade
  out:fade
>
  <article class="z-0 w-full h-full overflow-clip">
    <div class="relative">
      <div
        class="absolute z-10 flex items-start justify-between gap-1 transition-all duration-500 ease-in-out group-hover:top-2 -top-32 left-2 right-2"
      >
        <ul class="flex flex-wrap gap-1">
          {#each tagsV2 as tag}
            <li
              class="px-2 py-1 text-xs text-white transition-all shrink-0 bg-primary"
            >
              <div>
                {tag.name}
              </div>
            </li>
          {/each}
        </ul>
        <ul class="flex flex-col gap-2">
          {#if hasMultipleImages}
            <li class="bg-tertiary">
              <IconBoxMultiple class="stroke-dark" />
            </li>
          {/if}
          {#if hasSalesLink}
            <li class="bg-highlight">
              <IconShoppingCart class="stroke-dark" />
            </li>
          {/if}
        </ul>
      </div>
      {#if hasNSFWTag && !filterContainsNSFW}
        <div
          class="absolute inset-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50 backdrop-blur"
        >
          <p class="font-semibold text-white">NSFW</p>
        </div>
      {/if}
      <img
        src={urlFor(painting.image).width(400).height(400).url()}
        alt={painting.title}
        class={cn('object-cover w-full')}
      />
      <div
        class="absolute transition-all duration-500 ease-in-out -bottom-32 bg-dark left-2 group-hover:bottom-2"
      >
        <strong class="text-xl text-white">{title}</strong>
      </div>
    </div>
  </article>
</a>

<style>
  @supports (animation-timeline: view()) {
    @media (prefers-reduced-motion: no-preference) {
      @keyframes appear {
        from {
          opacity: 0.9%;
          transform: translateY(100px) scale(0.4);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      .test {
        z-index: 1;
        animation: appear linear;
        animation-timeline: view();
        animation-range: entry -40% contain 5%;
      }
    }
  }
</style>
