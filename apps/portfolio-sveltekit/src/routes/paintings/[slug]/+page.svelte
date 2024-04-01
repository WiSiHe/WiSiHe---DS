<script>
  import { urlFor } from '$lib/utils/image'
  //   import type { PageData } from '../$types'

  export let data
  const { title, image, description } = data
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content="Portfolio of paintings by artist, WiSiHe" />
</svelte:head>

<section class="grid items-start grid-cols-12 gap-4 p-4 pt-16 bg-stone-50">
  <a
    href="/paintings"
    class="fixed px-4 py-2 text-white rounded left-2 top-20 bg-primary"
    data-sveltekit-noscroll
  >
    Back to Paintings
  </a>
  <div class="col-span-full xl:col-span-8">
    <img
      src={urlFor(image).width(1200).height(1200).url()}
      alt={title}
      class="w-full rounded"
    />
  </div>
  <div
    class="prose xl:p-4 xl:bg-white xl:sticky col-span-full xl:col-span-4 xl:top-10 xl:drop-shadow"
  >
    <h1 class="text-blue-800">{title}</h1>
    <p>{description}</p>
  </div>
</section>
