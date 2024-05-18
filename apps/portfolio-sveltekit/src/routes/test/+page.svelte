<script>
  import { fly } from 'svelte/transition'
  import { cubicOut } from 'svelte/easing'
</script>

<svelte:head>
  <title>3D</title>
  <meta name="description" content="3D page" />
  <script
    type="module"
    src="https://unpkg.com/@splinetool/viewer@1.3.5/build/spline-viewer.js"
  ></script>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<section class="grid items-start grid-cols-12">
  <section class="relative w-full h-screen col-span-full">
    <spline-viewer
      loading-anim-type="spinner-small-dark"
      url="https://prod.spline.design/5pAPQiFtG9yAp36u/scene.splinecode"
    ></spline-viewer>
  </section>

  <!-- <div class="relative grid p-4 text-white col-span-full aspect-video bg-dark">
    <spline-viewer
      class="absolute inset-0"
      loading-anim-type="spinner-small-dark"
      url="https://prod.spline.design/H7BH2oWSul5Gt3NO/scene.splinecode"
    ></spline-viewer>

    <div class="z-10 grid w-full grid-cols-2 text-white pointer-events-none">
      <div class="col-span-2 col-start-1 prose text-white">
        <h2 class="text-white">Title 1</h2>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Est, sapiente
          hic beatae eligendi nostrum perferendis, id ratione quisquam eveniet
          animi ad culpa repellat expedita illum recusandae eaque impedit
          laudantium. Quis!
        </p>

        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Est, sapiente
          hic beatae eligendi nostrum perferendis, id ratione quisquam eveniet
          animi ad culpa repellat expedita illum recusandae eaque impedit
          laudantium. Quis!
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Est, sapiente
          hic beatae eligendi nostrum perferendis, id ratione quisquam eveniet
          animi ad culpa repellat expedita illum recusandae eaque impedit
          laudantium. Quis!
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Est, sapiente
          hic beatae eligendi nostrum perferendis, id ratione quisquam eveniet
          animi ad culpa repellat expedita illum recusandae eaque impedit
          laudantium. Quis!
        </p>
      </div>
      <div class="col-span-1 col-start-2 prose text-white">
        <h2 class="text-white">Title 2</h2>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Est, sapiente
          hic beatae eligendi nostrum perferendis, id ratione quisquam eveniet
          animi ad culpa repellat expedita illum recusandae eaque impedit
          laudantium. Quis!
        </p>
        <img
          src="https://cdnb.artstation.com/p/assets/images/images/071/192/581/large/henrik-sissener-fox.jpg?1704663129"
          alt="fox"
        />
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Est, sapiente
          hic beatae eligendi nostrum perferendis, id ratione quisquam eveniet
          animi ad culpa repellat expedita illum recusandae eaque impedit
          laudantium. Quis!
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Est, sapiente
          hic beatae eligendi nostrum perferendis, id ratione quisquam eveniet
          animi ad culpa repellat expedita illum recusandae eaque impedit
          laudantium. Quis!
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Est, sapiente
          hic beatae eligendi nostrum perferendis, id ratione quisquam eveniet
          animi ad culpa repellat expedita illum recusandae eaque impedit
          laudantium. Quis!
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Est, sapiente
          hic beatae eligendi nostrum perferendis, id ratione quisquam eveniet
          animi ad culpa repellat expedita illum recusandae eaque impedit
          laudantium. Quis!
        </p>
      </div>
    </div>
  </div> -->
</section>
