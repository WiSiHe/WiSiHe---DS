<script lang="ts">
  export let data
  import { urlFor } from '$lib/utils/image'
  import SideBar from '../../../lib/components/SideBar.svelte'

  const { video } = data
</script>

<section class="grid items-start grid-cols-12 gap-4 p-4">
  <div class="col-span-full">
    <h1 class="text-blue-800">
      {video.title}
    </h1>
    <p>
      {video.description}
    </p>
    <img
      src={urlFor(video.thumbnail).width(400).height(400).url()}
      alt={video.title}
      class="w-full"
    />
  </div>
</section>
