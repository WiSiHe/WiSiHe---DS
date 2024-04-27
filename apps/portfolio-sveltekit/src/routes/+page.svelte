<script lang="ts">
  import { urlFor } from '$lib/utils/image'
  import { fade, fly } from 'svelte/transition'
  import { aboutMeBulletPoints } from '@wisihe/constants'

  export let data
  const { showcasePaintings = [], title } = data

  // Randomly select a painting to showcase
  let selectedIndex = Math.floor(Math.random() * showcasePaintings.length)

  $: currentPainting = showcasePaintings[selectedIndex]

  const handleNext = () => {
    if (selectedIndex < showcasePaintings.length - 1) {
      selectedIndex++
    } else {
      selectedIndex = 0
    }
  }

  const handlePrevious = () => {
    if (selectedIndex > 0) {
      selectedIndex--
    } else {
      selectedIndex = showcasePaintings.length - 1
    }
  }
</script>

<svelte:head>
  <title>Home | WiSiHe</title>
  <meta name="description" content="Portfolio of paintings by artist, WiSiHe" />
</svelte:head>

<section
  class="relative w-full min-h-[600px] bg-dark flex flex-col justify-center px-4 py-10 h-fit xl:min-h-screen overflow-clip"
>
  <img
    src={urlFor(currentPainting.image).width(400).height(400).url()}
    alt={showcasePaintings.title}
    class="absolute inset-0 object-cover w-full h-full scale-105 blur-xl"
  />
  <div
    class="relative z-10 flex flex-col items-center w-full gap-8 mx-auto max-w-screen-2xl xl:grid xl:grid-cols-12 xl:pt-32 xl:gap-10 xl:items-center"
  >
    <section class="z-10 w-full pt-24 col-span-full xl:col-span-4 xl:pt-0">
      <div
        class="relative flex flex-col justify-center h-full gap-4 p-4 lg:p-10 rounded-xl backdrop-blur-sm bg-white/40 overflow-clip drop-shadow-xl"
      >
        <h1 class="text-4xl">
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
        <img
          src={urlFor(currentPainting.image).width(400).height(400).url()}
          alt={showcasePaintings.title}
          class="object-cover w-full h-full"
        />
      </div>
      <div class="flex items-center justify-center gap-4 pt-4">
        <button
          aria-label="Previous painting"
          on:click={handlePrevious}
          class="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
        >
          Previous
        </button>
        <a
          href="/paintings"
          class="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
        >
          painting gallery
        </a>
        <button
          aria-label="Next painting"
          on:click={handleNext}
          class="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
          >Next</button
        >
      </div>
    </section>
  </div>
</section>
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
      {#each showcasePaintings as painting (painting.slug)}
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
