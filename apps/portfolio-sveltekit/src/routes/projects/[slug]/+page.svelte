<script lang="ts">
  export let data
  import { urlFor } from '$lib/utils/image'

  const { project } = data
</script>

<section class="grid items-start grid-cols-12 gap-4 p-4 pt-16">
  <div class="col-span-8">
    <img
      src={urlFor(project.image).width(400).height(400).url()}
      alt={project.title}
      class="w-full"
    />
  </div>
  <div class="col-span-4 p-4 prose bg-white">
    <h1 class="text-blue-800">
      {project.title}
    </h1>
    <p>
      {project.description}
    </p>
  </div>
</section>
