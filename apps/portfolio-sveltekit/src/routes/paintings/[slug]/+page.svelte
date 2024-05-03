<script lang="ts">
  import { urlFor } from '$lib/utils/image'
  import { cn } from '@wisihe/utils'
  import Dialog from '../../../components/Dialog.svelte'
  import { onMount } from 'svelte'

  export let data
  const {
    title,
    seoDescription,
    image,
    description,
    tagsV2,
    format,
    paintedAt,
    images = []
  } = data

  const imageFormatStyle = {
    portrait: 'aspect-portrait',
    landscape: 'aspect-video',
    square: 'aspect-square'
  }[format]

  let dialog: HTMLDialogElement

  let allImages = [image, ...(images || [])]
  let selectedIndex = 0
  let selectedImage = allImages[selectedIndex]

  function handleSelectImage(img: any) {
    selectedImage = img
    selectedIndex = allImages.findIndex(image => image._id === img._id)
  }

  function handleNext() {
    if (selectedIndex < allImages.length - 1) {
      selectedIndex++
    } else {
      selectedIndex = 0
    }
    selectedImage = allImages[selectedIndex]
  }

  function handlePrevious() {
    if (selectedIndex > 0) {
      selectedIndex--
    } else {
      selectedIndex = allImages.length - 1
    }
    selectedImage = allImages[selectedIndex]
  }

  function handleKeyLeft(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft') {
      handlePrevious()
    }
  }

  function handleKeyRight(event: KeyboardEvent) {
    if (event.key === 'ArrowRight') {
      handleNext()
    }
  }

  $: selectedImage = allImages[selectedIndex]

  onMount(() => {
    window.addEventListener('keydown', handleKeyLeft)
    window.addEventListener('keydown', handleKeyRight)
    return () => {
      window.removeEventListener('keydown', handleKeyLeft)
      window.removeEventListener('keydown', handleKeyRight)
    }
  })
</script>

<svelte:head>
  <title>{title} | WiSiHe - Digital Portfolio</title>
  <meta name="description" content={seoDescription} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={seoDescription} />
  <meta
    property="og:image"
    content={urlFor(image).width(1200).height(630).url()}
  />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:type" content="article" />
  <meta property="og:url" content={window.location.href} />
  <meta property="og:site_name" content="WiSiHe - Digital Portfolio" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@wisihe" />
  <meta name="twitter:creator" content="@wisihe" />
  <meta
    name="twitter:image"
    content={urlFor(image).width(1200).height(630).url()}
  />
</svelte:head>

<section class="grid items-start grid-cols-12 gap-4 p-4 pt-16 bg-stone-50">
  <a
    href="/paintings"
    on:click|preventDefault={() => window.history.back()}
    class="fixed z-10 px-4 py-2 text-white left-2 top-20 bg-primary"
    data-sveltekit-noscroll
  >
    Back
  </a>
  <div class="relative col-span-full xl:col-span-8">
    <button
      on:click={() => dialog.showModal()}
      class={cn('relative w-full h-full rounded-none ', imageFormatStyle)}
    >
      <img
        src={urlFor(selectedImage).width(1200).height(1200).url()}
        alt={title}
        class={cn(
          'w-full absolute h-full inset-0 object-cover',
          imageFormatStyle
        )}
      />
    </button>
    {#if images?.length > 1}
      <div class="flex items-center justify-center gap-4 pt-4">
        <button on:click={() => handleSelectImage(image)}>
          <img
            src={urlFor(image).width(100).height(100).url()}
            alt={title}
            class="object-cover w-16 h-16 rounded-lg"
          />
        </button>
        {#each images as img}
          <button on:click={() => handleSelectImage(img)}>
            <img
              src={urlFor(img).width(100).height(100).url()}
              alt={title}
              class="object-cover w-16 h-16 rounded-lg"
            />
          </button>
        {/each}
      </div>
    {/if}
  </div>
  <div
    class="xl:p-8 xl:bg-white xl:sticky col-span-full xl:col-span-4 xl:top-10 xl:shadow-lg"
  >
    <h1>{title}</h1>
    {#if tagsV2}
      <ul class="flex flex-wrap gap-2 pt-3">
        {#each tagsV2 as tag}
          <li class="">
            <div class="px-2 py-1 text-white bg-primary">
              {tag.name}
            </div>
          </li>
        {/each}
      </ul>
    {/if}
    {#if paintedAt}
      <p class="">{paintedAt}</p>
    {/if}
    <div class="prose">
      <p class="">{description}</p>
    </div>
  </div>
</section>

<Dialog bind:dialog on:close>
  <img
    class="object-cover min-w-full min-h-full"
    src={urlFor(selectedImage).width(1200).height(1200).url()}
    alt={title}
  />
</Dialog>
