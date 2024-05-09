<script lang="ts">
  import SocialLinks from '../../components/SocialLinks.svelte'
  const mailtoLabel = 'mailto:hws902@gmail.com'

  import bath from '$lib/images/paintings/bathtub.jpg'
  import celestial from '$lib/images/paintings/celestial.jpg'
  import cloud from '$lib/images/paintings/cloud.jpg'
  import creepy from '$lib/images/paintings/creepy.jpg'
  import cute from '$lib/images/paintings/cute.jpg'
  import fire from '$lib/images/paintings/fire.jpg'
  import icecave from '$lib/images/paintings/icecave.png'
  import winter from '$lib/images/paintings/winter.jpg'
  import sunlight from '$lib/images/paintings/sunlight.jpg'
  import woods from '$lib/images/paintings/forest.jpg'

  import { cn } from '@wisihe/utils'
  import { onMount } from 'svelte'
  import SideBar from '../../components/SideBar.svelte'

  let paintings = [
    {
      label: 'Cute',
      src: cute,
      alt: 'cute',
      height: 24,
      aspectRatio: 'aspect-square'
    },
    {
      label: 'Bathtub',
      src: bath,
      alt: 'bathtub',
      height: 32,
      aspectRatio: 'aspect-portrait'
    },
    {
      label: 'Winter',
      src: winter,
      alt: 'winter',
      height: 24,
      aspectRatio: 'aspect-video'
    },
    {
      label: 'Creepy',
      src: creepy,
      alt: 'creepy',
      height: 32,
      aspectRatio: 'aspect-video'
    },
    {
      label: 'Fire',
      src: fire,
      alt: 'fire',
      height: 24,
      aspectRatio: 'aspect-square'
    },
    {
      label: 'Ice Cave',
      src: icecave,
      alt: 'ice cave',
      height: 24,
      aspectRatio: 'aspect-video'
    },
    {
      label: 'Sunlight',
      src: sunlight,
      alt: 'sunlight',
      height: 24,
      aspectRatio: 'aspect-square'
    },
    {
      label: 'Celestial',
      src: celestial,
      alt: 'celestial',
      height: 24,
      aspectRatio: 'aspect-square'
    },
    {
      label: 'Cloud',
      src: cloud,
      alt: 'cloud',
      height: 24,
      aspectRatio: 'aspect-video'
    },
    {
      label: 'Woods',
      src: woods,
      alt: 'woods',
      height: 24,
      aspectRatio: 'aspect-video'
    }
  ]

  onMount(() => {
    paintings = paintings.sort(() => Math.random() - 0.5)
  })
</script>

<section class="grid items-start grid-cols-12 p-4 pt-16">
  <SideBar>
    <h1>Contact</h1>
    <p class="pt-2">
      I&#39;m always happy to hear from you. If you have any questions or
      comments, please feel free to reach out to me via email or social media.
    </p>
    <h2>Commission</h2>
    <p class="">
      Can&#39;t find what you&#39;re looking for? I&#39;m available for
      commissions and custom work. Please contact me for more information.
    </p>
    <a
      href={mailtoLabel}
      class="flex items-center gap-2 px-4 py-3 text-white w-fit bg-primary"
    >
      Email me
    </a>

    <h2>Social links</h2>
    <p class="">
      I&#39;m active on social media. Follow me to stay up to date with my
      latest work and projects.
    </p>
    <SocialLinks />
  </SideBar>
  <section class="col-span-9 columns-3">
    {#each paintings as painting}
      <div
        class={cn(
          'relative rounded mb-4',
          painting.aspectRatio,
          'w-full h-full'
        )}
      >
        <img
          src={painting.src}
          alt={painting.alt}
          class="object-cover w-full h-full rounded"
          loading="lazy"
        />
      </div>
    {/each}
  </section>
</section>
