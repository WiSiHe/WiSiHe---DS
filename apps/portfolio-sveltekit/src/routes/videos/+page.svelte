<script lang="ts">
  import { urlFor } from '$lib/utils/image'
  import SideBar from '../../lib/components/SideBar.svelte'

  export let data

  const { videos } = data
</script>

<svelte:head>
  <title>Videos</title>
  <meta
    name="description"
    content="Find my diverse videos: painting time-lapses, game dev, and hand-drawn animations. A chance to learn new skills and experiment creatively."
  />
</svelte:head>

<section class="grid items-start max-w-screen-xl grid-cols-12 p-4 mx-auto">
  <div class="prose col-span-full">
    <h1 class="text-blue-800">Videos</h1>
    <p>
      Find my diverse videos: painting time-lapses, game dev, and hand-drawn
      animations. A chance to learn new skills and experiment creatively.
    </p>
  </div>

  <ul class="grid w-full grid-cols-12 gap-4 col-span-full">
    {#each videos as video}
      <li class="col-span-6 xl:col-span-4">
        <a href={`videos/${video.slug}`} class="">
          <div
            class="relative flex items-center justify-center text-white rounded-lg overflow-clip aspect-square bg-dark"
          >
            <img
              src={urlFor(video.thumbnail).width(400).height(400).url()}
              alt={video.title}
            />
            <div class="absolute bottom-0 left-0 right-0 p-2 bg-dark">
              {video.title}
            </div>
          </div>
        </a>
      </li>
    {/each}
  </ul>
</section>
