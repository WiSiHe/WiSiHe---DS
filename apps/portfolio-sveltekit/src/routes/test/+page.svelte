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
</section>
