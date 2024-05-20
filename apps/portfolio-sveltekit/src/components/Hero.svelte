<script lang="ts">
  import { urlFor } from '$lib/utils/image'
  import { fade } from 'svelte/transition'
  import { aboutMeBulletPoints } from '@wisihe/constants'
  import type { iSanityPainting } from '$lib/utils/sanity'
  import { IconArrowLeft, IconArrowRight } from '@tabler/icons-svelte'

  export let paintings: iSanityPainting[] = []

  // Randomly select a painting to showcase
  let selectedIndex = Math.floor(Math.random() * paintings.length)

  $: currentPainting = paintings[selectedIndex]

  const handleNext = () => {
    if (selectedIndex < paintings.length - 1) {
      selectedIndex++
    } else {
      selectedIndex = 0
    }
  }

  const handlePrevious = () => {
    if (selectedIndex > 0) {
      selectedIndex--
    } else {
      selectedIndex = paintings.length - 1
    }
  }
</script>

<section
  class="relative w-full min-h-[600px] bg-dark flex flex-col justify-center px-4 py-10 h-fit xl:min-h-screen overflow-clip"
>
  <!-- <img
    src={urlFor(currentPainting.image).width(400).height(400).url()}
    alt={paintings.title}
    class="absolute inset-0 object-cover w-full h-full scale-105 blur-xl"
  /> -->
  <div class="absolute inset-0 scale-150">
    <spline-viewer
      loading-anim-type="spinner-big-light"
      url="https://prod.spline.design/NJPbTHKSakGvCHjI/scene.splinecode"
    />
  </div>
  <div
    class="relative z-10 flex flex-col items-center w-full gap-8 mx-auto max-w-screen-2xl xl:grid xl:grid-cols-12 xl:pt-32 xl:gap-10 xl:items-center"
  >
    <section class="z-10 w-full pt-24 col-span-full xl:col-span-4 xl:pt-0">
      <div
        class="relative flex flex-col justify-center h-full gap-4 p-4 lg:p-10 rounded-xl backdrop-blur-sm bg-white/40 overflow-clip drop-shadow-xl"
      >
        <h1 class="" in:fade>
          <strong>Henrik Wilhelm Sissener</strong>
        </h1>
        <ul class="flex flex-col gap-4">
          {#each aboutMeBulletPoints as bullet}
            <li>
              <span>{bullet}</span>
            </li>
          {/each}
        </ul>
      </div>
    </section>
    <section class="relative z-10 w-full col-span-full xl:col-span-8">
      <div
        class="relative w-full h-full aspect-video drop-shadow-lg rounded-2xl bg-dark/20 overflow-clip"
      >
        <picture>
          <source
            srcset={urlFor(currentPainting.image).width(1200).height(600).url()}
            media="(min-width: 800px)"
          />
          <source
            srcset={urlFor(currentPainting.image).width(800).height(400).url()}
            media="(max-width: 799px)"
          />
          <img
            src={urlFor(currentPainting.image).width(1200).height(600).url()}
            alt={currentPainting.title}
            class="object-cover w-full h-full"
          />
        </picture>
        <div
          class="absolute flex items-center justify-center text-2xl font-bold text-white bottom-4 right-4 left-4"
        >
          {currentPainting.title}
        </div>
      </div>
      <div class="flex items-center justify-center gap-4 pt-4">
        <button
          aria-label="Previous painting"
          on:click={handlePrevious}
          class="px-4 py-2 font-bold rounded text-dark bg-highlight"
        >
          <IconArrowLeft class="w-6 h-6" />
        </button>
        <a
          href="/paintings"
          class="px-4 py-2 font-bold text-white rounded bg-primary"
        >
          Painting gallery
        </a>
        <button
          aria-label="Next painting"
          on:click={handleNext}
          class="px-4 py-2 font-bold rounded text-dark bg-highlight"
        >
          <IconArrowRight class="w-6 h-6" />
        </button>
      </div>
    </section>
  </div>
</section>
