<script lang="ts">
  import { urlFor } from '$lib/utils/image'
  import { cn } from '@wisihe/utils'
  import { onMount } from 'svelte'
  import { fly } from 'svelte/transition'
  import BackButton from '$lib/components/BackButton.svelte'
  import Dialog from '$lib/components/Dialog.svelte'
  import SideBar from '$lib/components/SideBar.svelte'
  import { patchPaintingViews, type iSanityPainting } from '$lib/utils/sanity'
  import {
    IconClock,
    IconEye,
    IconChevronLeft,
    IconChevronRight
  } from '@tabler/icons-svelte'
  import Chip from '$lib/components/Chip.svelte'

  export let data: { painting: iSanityPainting }

  const { painting } = data
  const {
    title,
    seoDescription,
    image,
    description,
    tagsV2,
    format,
    paintedAt,
    images = [],
    video,
    views = []
  } = painting
  console.log('painting', painting)

  let formatedPaintedAt = new Date(paintedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

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
    selectedIndex = (selectedIndex + 1) % allImages.length
    selectedImage = allImages[selectedIndex]
  }

  function handlePrevious() {
    selectedIndex = (selectedIndex - 1 + allImages.length) % allImages.length
    selectedImage = allImages[selectedIndex]
  }

  function handleKeyNavigation(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft') {
      handlePrevious()
    } else if (event.key === 'ArrowRight') {
      handleNext()
    } else if (event.key === 'Escape') {
      dialog.close()
    }
  }

  $: selectedImage = allImages[selectedIndex]

  const { lqip } = selectedImage

  onMount(() => {
    handleAddView()
    window.addEventListener('keydown', handleKeyNavigation)

    return () => {
      window.removeEventListener('keydown', handleKeyNavigation)
    }
  })

  function getViewerId(): string {
    let viewerId = localStorage.getItem('viewerId')
    if (!viewerId) {
      viewerId = crypto.randomUUID()
      localStorage.setItem('viewerId', viewerId)
    }
    return viewerId
  }

  async function handleAddView() {
    const viewerId = getViewerId()

    if (!views.find(view => view.viewerId === viewerId)) {
      await patchPaintingViews(painting._id, viewerId)
    }
  }

  let imgLoaded = false

  function handleImageLoad() {
    imgLoaded = true
  }

  // Structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org/',
    '@type': 'VisualArtwork',
    name: title,
    description: seoDescription,
    image: urlFor(image).width(1200).height(630).url(),
    creator: {
      '@type': 'Person',
      name: 'Henrik Wilhelm Sissener'
    },
    dateCreated: paintedAt,
    artMedium: format
  }
</script>

<svelte:head>
  <title>{title} | WiSiHe - Digital Portfolio</title>
  <meta name="description" content={seoDescription} />
  <meta property="og:locale" content="en_US" />
  <meta property="og:locale:alternate" content="no_NO" />
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta
    name="keywords"
    content="WiSiHe, Henrik Wilhelm Sissener, Portfolio, Paintings, Art, Artist"
  />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={seoDescription} />
  <meta
    property="og:image"
    content={urlFor(image).width(1200).height(630).url()}
  />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="WiSiHe - Digital Portfolio" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@wisihe" />
  <meta name="twitter:creator" content="@wisihe" />
  <meta
    name="twitter:image"
    content={urlFor(image).width(1200).height(630).url()}
  />
  <script type="application/ld+json">
    {JSON.stringify(structuredData)}
  </script>
</svelte:head>

<BackButton />

<section
  class={cn(
    'relative flex flex-col xl:grid test min-h-screen max-w-screen-2xl items-start mx-auto grid-cols-12 gap-4 2xl:gap-10 2xl:py-8 '
  )}
>
  <div class="relative w-full col-span-full xl:col-span-9 2xl:col-span-9 h-fit">
    <button
      on:click={() => dialog.showModal()}
      class={cn(
        'relative w-full h-full rounded-none outline-none',
        imageFormatStyle
      )}
      aria-label="Open full-size image"
    >
      <div
        class="relative w-full h-full"
        style:background-image="url({lqip})"
        style:background-size="cover"
        style:background-position="center"
      >
        <img
          src={lqip}
          alt={title}
          class="object-cover w-full h-full scale-105 blur-3xl"
        />
        <picture>
          <source
            srcset={urlFor(selectedImage).format('webp').quality(60).url()}
            media="(min-width: 800px)"
            type="image/webp"
          />
          <source
            srcset={urlFor(selectedImage).format('webp').quality(60).url()}
            media="(max-width: 799px)"
            type="image/webp"
          />
          <img
            src={urlFor(selectedImage).quality(60).url()}
            alt={title}
            class={cn(
              'absolute inset-0 w-full h-full object-cover rounded transition-opacity duration-300',
              imageFormatStyle,
              imgLoaded ? 'opacity-100' : 'opacity-0'
            )}
            loading="lazy"
            decoding="async"
            on:load={handleImageLoad}
          />
        </picture>
      </div>
    </button>

    {#if allImages.length > 1}
      <div
        class="relative flex items-center justify-center gap-4 py-2 overflow-x-auto"
      >
        {#each allImages as img, index (img._id + '-' + index)}
          <button
            on:click={() => handleSelectImage(img)}
            class={cn(
              'flex-shrink-0 transition-transform hover:scale-105 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary',
              index === selectedIndex ? 'ring' : ''
            )}
            aria-label={`Select image ${index + 1}`}
          >
            <img
              loading="lazy"
              src={urlFor(img).width(100).height(100).url()}
              alt={`Thumbnail ${index + 1} for ${title}`}
              class="object-cover w-16 h-16 rounded-lg"
            />
          </button>
        {/each}
      </div>
    {/if}
  </div>

  <section class="p-4 pb-10 xl:p-0 xl:sticky col-span-full top-4 xl:col-span-3">
    <div
      in:fly={{ y: 100, opacity: 0, duration: 300 }}
      out:fly={{ x: 100, opacity: 0, duration: 300 }}
    >
      <div class="">
        <h1 class="text-balance">{title}</h1>

        {#if tagsV2}
          <div class="flex flex-wrap gap-2 pt-3">
            <Chip color="highlight" size="sm">
              <IconClock class="w-4 h-4" />
              {formatedPaintedAt}
            </Chip>
            <Chip>
              <IconEye />
              {views.length}
            </Chip>
            {#each tagsV2 as tag}
              <Chip color="primary">
                {tag.name}
              </Chip>
            {/each}
          </div>
        {/if}
        <div class="pt-2 prose">
          <p>{description}</p>
        </div>
      </div>
    </div>
  </section>

  <Dialog bind:dialog on:close>
    <div class={cn('relative bg-white', imageFormatStyle)}>
      <img
        class={cn('w-full object-cover -z-10 h-full')}
        src={urlFor(selectedImage).quality(80).url()}
        alt={title}
      />
    </div>
    <div class="flex justify-center w-full gap-4 pt-4">
      {#if allImages.length > 1}
        <button
          class="flex items-center gap-1 px-4 py-2 text-white rounded bg-primary"
          on:click={handlePrevious}
          aria-label="Previous image"
        >
          <IconChevronLeft />Previous
        </button>
      {/if}

      <button
        class="px-4 py-3 text-white rounded bg-primary"
        on:click={() => dialog.close()}
        aria-label="Close fullscreen view"
      >
        Close
      </button>
      {#if allImages.length > 1}
        <button
          class="flex items-center gap-1 px-4 py-2 text-white rounded bg-primary"
          on:click={handleNext}
          aria-label="Next image"
        >
          Next <IconChevronRight />
        </button>
      {/if}
    </div>
  </Dialog>
</section>

<style>
  .dialog-open:has(dialog[open]) {
    overflow: hidden;
    height: 100dvh;
  }

  /* Add smooth transitions */
  img {
    transition: opacity 0.3s ease-in-out;
  }

  button {
    transition: transform 0.2s ease-in-out;
  }
</style>
