<script lang="ts">
  export let data
  import { urlFor } from '$lib/utils/image'
  const { project } = data
  console.log(project)

  const { projectStart, projectEnd, status } = project
</script>

<section class="grid items-start grid-cols-12 gap-4 p-4">
  <div class="w-full max-w-screen-xl px-4 mx-auto col-span-full">
    <img
      src={urlFor(project.image).width(400).height(400).url()}
      alt={project.title}
      class="object-cover w-full aspect-video"
    />
    <p>
      {projectStart} - {projectEnd} ({status})
    </p>
    <div class="prose">
      <h1>
        {project.title}
      </h1>
      <p>
        {project.description}
      </p>
    </div>
  </div>
</section>
