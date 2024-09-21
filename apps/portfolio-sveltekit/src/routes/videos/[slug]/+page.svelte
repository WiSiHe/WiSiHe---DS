<script lang="ts">
  export let data
  import { urlFor } from '$lib/utils/image'
  import SideBar from '../../../components/SideBar.svelte'

  const { video } = data
  console.log(video)
</script>

<section class="grid items-start grid-cols-12 gap-4">
  <div class="col-span-8">
    <img
      src={urlFor(video.thumbnail).width(400).height(400).url()}
      alt={video.title}
      class="w-full"
    />
  </div>
  <SideBar>
    <h1 class="text-blue-800">
      {video.title}
    </h1>
    <p>
      {video.description}
    </p>
  </SideBar>
</section>
