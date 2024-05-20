<script lang="ts">
  import { urlFor } from '$lib/utils/image'
  import { cn } from '@wisihe/utils'
  import { onMount } from 'svelte'
  import { fade, fly } from 'svelte/transition'
  import BackButton from '../../../components/BackButton.svelte'
  import Dialog from '../../../components/Dialog.svelte'
  import SideBar from '../../../components/SideBar.svelte'
  import Youtube from '../../../components/Youtube.svelte'

  import { IconClock } from '@tabler/icons-svelte'

  export let data
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
    video
  } = data
  console.log(data)

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

  // style={`view-transition-name: image-${data.slug}`}
  // <!-- on:click|preventDefault={() => window.history.back()} -->
  // data-sveltekit-noscroll
</script>

<svelte:head>
  <title>{title} | WiSiHe - Digital Portfolio</title>
  <meta name="description" content={seoDescription} />
  <meta property="og:locale" content="en_US" />
  <meta property="og:locale:alternate" content="no_NO" />
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta
    name="kewords"
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

<BackButton />

<section
  class="grid items-start min-h-screen grid-cols-12 gap-4 p-4 pt-16 bg-stone-50"
>
  <div class="relative col-span-full xl:col-span-9">
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
          src={urlFor(selectedImage).width(1200).height(1200).url()}
          alt={title}
          class={cn(
            'w-full absolute h-full inset-0 object-cover',
            imageFormatStyle
          )}
        />
      </picture>
    </button>
    {#if allImages.length > 1}
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
    {#if video}
      Videos:
      <Youtube href={video} />
    {/if}
  </div>

  <SideBar className="p-4 xl:p-0">
    <div
      in:fly={{ y: 100, opacity: 0, duration: 1000 }}
      out:fade
      class="xl:p-4 xl:pt-4 xl:bg-white xl:shadow-xl xl:sticky xl:top-16"
    >
      <div
        class="flex items-center gap-1 px-2 py-1 mt-2 text-xs bg-secondary/10 w-fit"
      >
        <IconClock class="w-4 h-4" />
        {formatedPaintedAt}
      </div>
      {#if tagsV2}
        <ul class="flex flex-wrap gap-2 pt-3">
          {#each tagsV2 as tag}
            <li class="text-xs">
              <div class="px-2 py-1 text-white bg-primary">
                {tag.name}
              </div>
            </li>
          {/each}
        </ul>
      {/if}
      <div class="prose">
        <h1 style={`view-transition-name: title-${data.slug}`}>{title}</h1>
        <p>{description}</p>
      </div>
    </div>
  </SideBar>
</section>

<Dialog bind:dialog on:close>
  <img
    class="object-cover min-w-full min-h-full"
    src={urlFor(selectedImage).width(1200).height(1200).url()}
    alt={title}
  />
</Dialog>
