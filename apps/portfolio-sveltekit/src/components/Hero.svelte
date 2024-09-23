<script lang="ts">
  import { urlFor } from '$lib/utils/image'
  import { fade } from 'svelte/transition'
  import type { iSanityPainting } from '$lib/utils/sanity'
  import { IconArrowLeft, IconArrowRight } from '@tabler/icons-svelte'

  import Typewriter from 'svelte-typewriter'

  export let paintings: iSanityPainting[] = []

  // Randomly select a painting to showcase

  let selectedIndex = 0

  $: currentPainting = paintings[selectedIndex]

  const handleNext = () => {
    animateSwitch(() => {
      if (selectedIndex < paintings.length - 1) {
        selectedIndex++
      } else {
        selectedIndex = 0
      }
    })
  }

  const handlePrevious = () => {
    animateSwitch(() => {
      if (selectedIndex > 0) {
        selectedIndex--
      } else {
        selectedIndex = paintings.length - 1
      }
    })
  }

  import { spring } from 'svelte/motion'
  import { onMount } from 'svelte'
  import Chip from './Chip.svelte'
  import { cn } from '@wisihe/utils'

  let scale = spring(0.95, {
    // stiffness: 0.1,
    // damping: 0.25
  })

  let translateY = spring(0, {
    // stiffness: 0.1, damping: 0.25
  })

  let translateX = spring(-200, {
    // stiffness: 0.1, damping: 0.25
  })

  const animateSwitch = (updateIndex: { (): void; (): void; (): void }) => {
    // Animate down and scale
    translateY.set(0)
    scale.set(0.9)

    setTimeout(() => {
      // Update the index
      updateIndex()

      // Animate up and scale back to normal
      translateY.set(0)
      scale.set(1)
    }, 300) // Adjust the timeout duration as needed
  }

  onMount(() => {
    selectedIndex = Math.floor(Math.random() * paintings.length)
    scale.set(1)
    translateX.set(0)
  })

  let imgLoaded = false

  function handleImageLoad() {
    imgLoaded = true
  }
</script>

<section
  class="relative flex flex-col justify-start w-full min-h-[600px] xl:min-h-screen px-8 py-10 bg-dark overflow-clip"
>
  <img
    src={currentPainting.image.lqip}
    alt=""
    class="absolute inset-0 object-cover w-full h-full scale-105 opacity-50 blur-xl"
  />
  <div
    class="relative z-10 flex flex-col items-center w-full gap-8 mx-auto max-w-screen-2xl xl:grid xl:grid-cols-12 xl:pt-32 xl:gap-10 xl:items-center"
  >
    <section
      class="z-20 w-full xl:absolute col-span-full xl:col-span-4 xl:col-start-1 top-44"
    >
      <div
        class="relative flex flex-col justify-center h-full gap-4 p-8 text-dark bg-white/40 backdrop-blur-2xl rounded-xl lg:p-10 drop-shadow-2xl"
        style="transform: translatex({$translateX}px);"
      >
        <div class="xl:h-10 overflow-clip">
          <h1 class="text-4xl" in:fade>
            <strong>Henrik Wilhelm Sissener</strong>
          </h1>
        </div>
        <ul class="flex flex-col gap-4 text-lg text-balanced">
          <li>Frontend developer</li>
          <li>Digital artist</li>
          <li>Game developer</li>
        </ul>
      </div>
    </section>
    <section
      class="relative z-10 w-full col-span-full xl:col-span-10 xl:col-start-2"
    >
      <div
        class="relative w-full h-full aspect-video drop-shadow-lg rounded-2xl bg-dark/20"
        style="transform: scale({$scale}) translateY({$translateY}px);"
        style:background-image="url({currentPainting.image.lqip})"
        style:background-size="cover"
        style:background-position="center"
      >
        <picture>
          <source
            srcset={urlFor(currentPainting.image)
              .width(1200)
              .height(720)
              .format('webp')
              .url()}
            media="(min-width: 800px)"
            type="image/webp"
          />
          <source
            srcset={urlFor(currentPainting.image)
              .width(800)
              .height(400)
              .format('webp')
              .url()}
            media="(max-width: 799px)"
          />
          <source
            srcset={urlFor(currentPainting.image)
              .width(1200)
              .height(720)
              .format('jpg')
              .url()}
            media="(min-width: 800px)"
            type="image/jpeg"
          />
          <source
            srcset={urlFor(currentPainting.image)
              .width(800)
              .height(400)
              .format('jpg')
              .url()}
            media="(max-width: 799px)"
          />
          <img
            src={urlFor(currentPainting.image).width(1000).height(520).url()}
            alt={currentPainting.title}
            class={cn(
              'object-cover w-full h-full rounded-2xl',
              imgLoaded ? 'opacity-100' : 'opacity-0'
            )}
            on:load={handleImageLoad}
            decoding="async"
            loading="lazy"
          />
        </picture>
        <div
          class="absolute left-0 right-0 flex items-center justify-center bottom-4 xl:-right-4 xl:left-auto"
        >
          <Chip>
            {currentPainting.title}
          </Chip>
        </div>
      </div>
      <div class="flex items-center justify-between gap-4 pt-8 xl:justify-end">
        <button
          aria-label="Previous painting"
          on:click={handlePrevious}
          class="p-3 font-bold text-white transition-all duration-200 ease-in-out rounded bg-primary hover:scale-125 hover:bg-highlight hover:text-dark hover:shadow-lg"
        >
          <IconArrowLeft class="w-6 h-6" />
        </button>
        <a
          href="/paintings"
          class="px-4 py-3 font-bold text-white uppercase transition-all duration-200 ease-in-out rounded hover:scale-110 hover:text-dark hover:bg-highlight bg-primary hover:shadow-lg"
        >
          Painting gallery
        </a>
        <button
          aria-label="Next painting"
          on:click={handleNext}
          class="p-3 font-bold text-white transition-all duration-200 ease-in-out rounded hover:scale-125 bg-primary hover:bg-highlight hover:text-dark hover:shadow-xl shadow-highlight"
        >
          <IconArrowRight class="w-6 h-6" />
        </button>
      </div>
    </section>
  </div>
</section>
