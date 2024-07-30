<script lang="ts">
  export let data
  import { urlFor } from '$lib/utils/image'
  import SideBar from '../../../components/SideBar.svelte'

  const { project } = data
</script>

<section class="grid items-start grid-cols-12 gap-4 pt-16">
  <div class="xl:col-span-8 col-span-full">
    <img
      src={urlFor(project.image).width(400).height(400).url()}
      alt={project.title}
      class="w-full"
    />
  </div>
  <SideBar>
    <h1 class="text-blue-800">
      {project.title}
    </h1>
    <p>
      {project.description}
    </p>
  </SideBar>
</section>
