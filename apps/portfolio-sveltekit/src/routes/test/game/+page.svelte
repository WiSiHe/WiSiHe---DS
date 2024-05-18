<svelte:head>
  <title>3D Game</title>
  <meta name="description" content="3D game page" />
  <script
    type="module"
    src="https://unpkg.com/@splinetool/viewer@1.3.5/build/spline-viewer.js"
  ></script>
</svelte:head>

<section class="w-full h-screen bg-[#F2EFEB]">
  <!-- <div class="sticky top-16">
    <h1>3D Game</h1>
  </div> -->

  <spline-viewer
    loading-anim-type="spinner-big-dark"
    url="https://prod.spline.design/xMW3TzxpdddOZTH5/scene.splinecode"
  ></spline-viewer>
</section>
