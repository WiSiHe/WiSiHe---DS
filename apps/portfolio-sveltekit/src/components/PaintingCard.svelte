<script lang="ts">
  export let painting
  import { urlFor } from '$lib/utils/image'
  import { cn, isNotEmptyArray } from '@wisihe/utils'
  import { fly } from 'svelte/transition'

  const { title, tagsV2, slug, redBubbleUrl, images = [] } = painting
  const hasMultipleImages = isNotEmptyArray(images)
</script>

<a
  href={`/paintings/${slug}`}
  class="relative z-0 col-span-6 transition-transform duration-500 ease-in-out scale-100 xl:col-span-4 group hover:ring-4 hover:z-10 ring-highlight"
  data-sveltekit-noscroll
  in:fly={{ duration: 1000, y: 100, delay: 1000 }}
  out:fly={{ duration: 1000, y: -100 }}
>
  <article class="w-full h-full overflow-clip">
    <div class="relative">
      <ul
        class="absolute flex flex-wrap gap-1 pt-2 transition-all duration-500 ease-in-out group-hover:top-2 -top-32 left-2 right-2"
      >
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
      {#if hasMultipleImages}
        <div class="absolute right-3 top-3">
          <span>🖼</span>
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
