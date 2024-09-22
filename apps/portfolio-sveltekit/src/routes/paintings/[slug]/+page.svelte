<script lang="ts">
  import { urlFor } from '$lib/utils/image'
  import { cn } from '@wisihe/utils'
  import { onMount } from 'svelte'
  import { fly } from 'svelte/transition'
  import BackButton from '../../../components/BackButton.svelte'
  import Dialog from '../../../components/Dialog.svelte'
  import SideBar from '../../../components/SideBar.svelte'
  import { patchPaintingViews } from '$lib/utils/sanity'
  import { IconClock, IconEye } from '@tabler/icons-svelte'
  import Chip from '../../../components/Chip.svelte'

  // Typing for the painting data
  interface Painting {
    title: string
    seoDescription: string
    image: any
    description: string
    tagsV2: Array<{ name: string }>
    format: 'portrait' | 'landscape' | 'square'
    paintedAt: string
    images?: any[]
    redbubbleUrl?: string
    video?: string
    views: Array<{ viewerId: string }>
  }

  export let data: { painting: Painting }

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
    redbubbleUrl,
    video,
    views = []
  } = painting

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
    handleAddView()
    window.addEventListener('keydown', handleKeyLeft)
    window.addEventListener('keydown', handleKeyRight)

    return () => {
      window.removeEventListener('keydown', handleKeyLeft)
      window.removeEventListener('keydown', handleKeyRight)
    }
  })

  function getViewerId(): string {
    let viewerId = localStorage.getItem('viewerId')
    if (!viewerId) {
      viewerId = crypto.randomUUID() // Generate a new UUID for the viewer
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

  // Debouncing event handlers for better performance
  function debounce(fn: Function, delay: number) {
    let timeoutId: ReturnType<typeof setTimeout>
    return (...args: any) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => fn(...args), delay)
    }
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
</svelte:head>

<BackButton />

<section
  class={cn(
    'relative flex flex-col xl:grid test min-h-screen max-w-screen-xl items-start mx-auto grid-cols-12 gap-8 p-4'
  )}
>
  <div class="relative col-span-full w-full xl:col-span-8 h-fit">
    <button
      on:click={() => dialog.showModal()}
      class={cn(
        'relative w-full h-full rounded-none outline-none',
        imageFormatStyle
      )}
    >
      <picture>
        <source
          srcset={urlFor(selectedImage).width(1200).height(1200).url()}
          media="(min-width: 800px)"
        />
        <source
          srcset={urlFor(selectedImage).width(600).height(600).url()}
          media="(max-width: 799px)"
        />
        <img
          loading="lazy"
          src={urlFor(selectedImage).width(1200).height(1200).url()}
          alt={title}
          class={cn(
            'w-full absolute h-full rounded inset-0 object-cover',
            imageFormatStyle
          )}
        />
      </picture>
    </button>

    {#if allImages.length > 1}
      <div class="relative flex items-center justify-center gap-4 pt-4">
        <button on:click={() => handleSelectImage(image)}>
          <img
            loading="lazy"
            src={urlFor(image).width(100).height(100).url()}
            alt={title}
            class="object-cover w-16 h-16 rounded-lg"
          />
        </button>
        {#each images as img, index (img._id + '-' + index)}
          <button on:click={() => handleSelectImage(img)}>
            <img
              loading="lazy"
              src={urlFor(img).width(100).height(100).url()}
              alt={title}
              class="object-cover w-16 h-16 rounded-lg"
            />
          </button>
        {/each}
      </div>
    {/if}
  </div>

  <SideBar className="p-0 xl:p-4 pb-10 xl:bg-white xl:sticky xl:top-16">
    <div in:fly={{ y: 100, opacity: 0 }} out:fly={{ x: 100, opacity: 0 }}>
      <div class="pt-2">
        <h1 class="text-balance">{title}</h1>

        {#if tagsV2}
          <ul class="flex flex-wrap gap-2 pt-3">
            <Chip color="highlight" size="sm">
              <IconClock class="w-4 h-4" />
              {formatedPaintedAt}
            </Chip>
            <Chip>
              <IconEye />
              {views.length}
            </Chip>
            {#each tagsV2 as tag}
              <Chip color="primary" onClick={() => {}}>
                {tag.name}
              </Chip>
            {/each}
          </ul>
        {/if}
        <div class="prose pt-2">
          <p>{description}</p>
        </div>
      </div>
    </div>
  </SideBar>

  <Dialog bind:dialog on:close>
    <img
      class="object-cover min-w-full min-h-full"
      src={urlFor(selectedImage).width(1200).height(1200).url()}
      alt={title}
    />
    <div class="flex justify-center w-full pt-4">
      <button
        class="px-4 py-3 text-white bg-primary"
        on:click={() => dialog.close()}>Close</button
      >
    </div>
  </Dialog>
</section>

<style>
  .dialog-open:has(dialog[open]) {
    overflow: hidden;
    height: 100dvh;
  }
</style>
