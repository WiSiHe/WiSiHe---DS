<script lang="ts">
  import { urlFor } from '$lib/utils/image'
  import SideBar from '../../components/SideBar.svelte'

  export let data

  console.log(data)

  const { videos } = data
</script>

<svelte:head>
  <title>Videos</title>
  <meta
    name="description"
    content="Find my diverse videos: painting time-lapses, game dev, and hand-drawn animations. A chance to learn new skills and experiment creatively."
  />
</svelte:head>

<section class="grid items-start grid-cols-12 p-4 pt-20">
  <SideBar>
    <div class="prose">
      <h1 class="text-blue-800">Videos</h1>
      <p>
        Find my diverse videos: painting time-lapses, game dev, and hand-drawn
        animations. A chance to learn new skills and experiment creatively.
      </p>
    </div>
  </SideBar>
  <ul class="grid w-full grid-cols-12 col-span-8 gap-4">
    {#each videos as video}
      <li class="col-span-4">
        <a href={`videos/${video.slug}`} class="">
          <div
            class="flex items-center justify-center text-white aspect-square bg-dark"
          >
            <img
              src={urlFor(video.thumbnail).width(400).height(400).url()}
              alt={video.title}
            />

            <div class="absolute p-2 bg-black bg-opacity-50">
              {video.title}
            </div>
          </div>
        </a>
      </li>
    {/each}
  </ul>
</section>
