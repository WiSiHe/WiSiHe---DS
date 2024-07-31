<script lang="ts">
  export let data
  import { urlFor } from '$lib/utils/image'
  import SideBar from '../../components/SideBar.svelte'

  const { projects = [] } = data
</script>

<svelte:head>
  <title>Projects</title>
  <meta
    name="description"
    content="Find my diverse projects: painting time-lapses, game dev, and hand-drawn animations. A chance to learn new skills and experiment creatively."
  />
</svelte:head>

<section class="grid items-start max-w-screen-xl grid-cols-12 pt-16 mx-auto">
  <SideBar>
    <div class="prose">
      <h1 class="text-blue-800">Projects</h1>
      <p>
        Discover a collection of my ongoing and completed projects, each with
        unique learning experiences.
      </p>
    </div>
  </SideBar>
  <ul class="grid w-full grid-cols-12 col-span-8 gap-4 p-4">
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
