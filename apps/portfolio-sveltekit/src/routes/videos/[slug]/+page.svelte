<script lang="ts">
  import VideoPlayer from '$lib/components/VideoPlayer.svelte'
  export let data

  const { video } = data
  const { videoUrl } = video
</script>

<section class="grid items-start min-h-screen grid-cols-12 gap-4 p-4 bg-dark">
  <div
    class="w-full h-full max-w-screen-xl px-4 pt-10 mx-auto col-span-full aspect-video"
  >
    <VideoPlayer {videoUrl} />
  </div>
  <div class="max-w-screen-xl px-4 mx-auto prose col-span-full">
    <h1 class="text-white">
      {video.title}
    </h1>
    <p class="text-white">
      {video.description}
    </p>
  </div>
</section>
