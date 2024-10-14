<script lang="ts">
  import VideoPlayer from '$lib/components/VideoPlayer.svelte'
  import { IconArrowLeft } from '@tabler/icons-svelte'
  import { fly } from 'svelte/transition'
  export let data

  const { video } = data
  const { videoUrl, title, description } = video
</script>

<a
  href="/videos"
  class="fixed z-20 flex px-4 py-2 text-white transition-all rounded shadow left-4 top-24 group hover:shadow-2xl bg-primary hover:scale-105 hover:bg-highlight hover:text-dark"
  data-sveltekit-noscroll
  in:fly={{ x: -50 }}
  out:fly={{ x: -50 }}
>
  <div in:fly={{ x: -50, delay: 1000 }} out:fly={{ x: 50 }}>
    <IconArrowLeft class="w-6 h-6" />
  </div>
  Back
</a>

<section class="grid items-start min-h-screen grid-cols-12 gap-4 p-4 bg-dark">
  <div
    class="w-full h-full max-w-screen-xl px-4 mx-auto col-span-full aspect-video"
  >
    <VideoPlayer {videoUrl} />
  </div>
  <div class="w-full max-w-screen-xl px-4 mx-auto prose col-span-full">
    <h1 class="text-white">
      {title}
    </h1>
    <p class="text-white">
      {description}
    </p>
  </div>
</section>

<style>
  /* h1,
  h2,
  h3,
  h4,
  h5,
  h6, */
  h1 {
    text-wrap: balance;
  }
  p {
    max-width: 65ch;
    text-wrap: pretty;
  }

  /* header,
  footer,
  main,
  article,  */
  section {
    container-type: inline-size;
  }
</style>
