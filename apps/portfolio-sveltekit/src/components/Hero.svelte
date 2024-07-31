<script lang="ts">
  import { urlFor } from '$lib/utils/image'
  import { fade } from 'svelte/transition'
  import type { iSanityPainting } from '$lib/utils/sanity'
  import { IconArrowLeft, IconArrowRight } from '@tabler/icons-svelte'

  import Typewriter from 'svelte-typewriter'

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
  <div class="absolute inset-0 scale-150">
    <spline-viewer
      loading-anim-type="spinner-big-light"
      url="https://prod.spline.design/NJPbTHKSakGvCHjI/scene.splinecode"
    />
  </div>
  <img
    src={urlFor(currentPainting.image).width(100).height(100).url()}
    alt=""
    class="absolute inset-0 object-cover w-full h-full scale-105 opacity-50 blur-xl grayscale"
  />
  <div class="absolute inset-0 bg-dark mix-blend-overlay" />
  <div
    class="relative z-10 flex flex-col items-center w-full gap-8 mx-auto max-w-screen-2xl xl:grid xl:grid-cols-12 xl:pt-32 xl:gap-10 xl:items-center"
  >
    <section class="z-10 w-full pt-24 col-span-full xl:col-span-4 xl:pt-0">
      <div
        class="relative flex flex-col justify-center h-full gap-4 p-4 text-white lg:p-10 drop-shadow-2xl"
      >
        <Typewriter mode="scramble" scrambleSlowdown scrambleDuration={500}>
          <h1 class="text-lg text-center font-lemonMilk" in:fade>
            <strong>Henrik Wilhelm Sissener</strong>
          </h1>
        </Typewriter>
        <ul
          class="flex flex-col gap-4 text-4xl text-center f font-lemonMilk text-balanced"
        >
          <li>Frontend developer</li>
          <li>Digital artist</li>
          <li>Game developer</li>
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
          class="absolute flex items-center justify-center text-xs font-bold text-white top-4 right-4 left-4"
        >
          {currentPainting.title}
        </div>
      </div>
      <div class="flex items-center justify-center gap-4 pt-4">
        <button
          aria-label="Previous painting"
          on:click={handlePrevious}
          class="p-3 font-bold text-white transition-all duration-200 ease-in-out rounded-full bg-primary hover:bg-highlight hover:text-dark hover:scale-105 hover:shadow-lg"
        >
          <IconArrowLeft class="w-6 h-6" />
        </button>
        <a
          href="/paintings"
          class="px-4 py-3 font-bold text-white uppercase transition-all duration-200 ease-in-out rounded hover:text-dark hover:bg-highlight bg-primary hover:scale-105 hover:shadow-lg"
        >
          Painting gallery
        </a>
        <button
          aria-label="Next painting"
          on:click={handleNext}
          class="p-3 font-bold text-white transition-all duration-200 ease-in-out rounded-full bg-primary hover:bg-highlight hover:text-dark hover:scale-105 hover:shadow-xl shadow-highlight"
        >
          <IconArrowRight class="w-6 h-6" />
        </button>
      </div>
    </section>
  </div>
</section>

<style>
</style>
