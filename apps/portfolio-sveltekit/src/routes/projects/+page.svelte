<script lang="ts">
  export let data
  import { urlFor } from '$lib/utils/image'

  const { projects = [] } = data
</script>

<section class="grid items-start grid-cols-12 p-4 pt-16">
  <div class="col-span-2">
    <h1 class="text-blue-800">Projects</h1>
    <h2>Projects</h2>
    <p>Painting details here</p>
  </div>
  <ul class="grid w-full grid-cols-12 col-span-10 gap-4">
    {#each projects as project}
      <li class="col-span-4">
        <a href={`projects/${project.slug}`} class="">
          <div
            class="flex items-center justify-center text-white aspect-square bg-dark"
          >
            <img
              src={urlFor(project.image).width(400).height(400).url()}
              alt={project.title}
            />
            <div class="absolute p-2 bg-black bg-opacity-50">
              {project.title}
            </div>
          </div></a
        >
      </li>
    {/each}
  </ul>
</section>
