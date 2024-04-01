<script>
  import { urlFor } from '$lib/utils/image'

  export let data
  const { showcasePaintings = [], title } = data

  let selectedIndex = 0

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
  <title>Home</title>
  <meta name="description" content="Svelte demo app" />
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
      <h1 class="text-4xl text-white">{title}</h1>
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
          on:click={handlePrevious}
          class="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
        >
          Previous
        </button>
        <a
          href="/paintings"
          class="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
        >
          paintings
        </a>
        <button
          on:click={handleNext}
          class="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
          >Next</button
        >
      </div>
    </section>
  </div>
</section>
