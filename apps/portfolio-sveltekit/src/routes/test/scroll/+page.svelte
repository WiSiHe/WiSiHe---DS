<script>
  import FadeIn from '../../../components/FadeIn.svelte'

  import { writable } from 'svelte/store'

  const isVisible = writable(false) // C
</script>

<svelte:head>
  <title>3D Scrolling Effects</title>
  <meta name="description" content="3D Scrolling Effects page" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <script
    type="module"
    src="https://unpkg.com/@splinetool/viewer@1.3.5/build/spline-viewer.js"
  ></script>
</svelte:head>

<div class="relative bg-[#F2EFEB] scroll-smooth">
  <div class="sticky-container">
    <spline-viewer
      loading-anim-type="spinner-small-dark"
      url="https://prod.spline.design/RRecKKgY135teLty/scene.splinecode"
    />
  </div>
  <section class="flex items-center h-screen p-4">
    <div class="prose test">
      <h1>Title 1</h1>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Est, sapiente
        hic beatae eligendi nostrum perferendis, id ratione quisquam eveniet
        animi ad culpa repellat expedita illum recusandae eaque impedit
        laudantium. Quis!
      </p>
    </div>
  </section>
  <section class="flex items-center justify-start h-screen p-4">
    <div class="prose test">
      <h2>Title 2</h2>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Est, sapiente
        hic beatae eligendi nostrum perferendis, id ratione quisquam eveniet
        animi ad culpa repellat expedita illum recusandae eaque impedit
        laudantium. Quis!
      </p>
    </div>
  </section>
  <!-- <section class="flex items-center w-full h-screen p-4">
    <FadeIn {isVisible}>
      <div class="prose">
        <h2>Title 3</h2>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Est, sapiente
          hic beatae eligendi nostrum perferendis, id ratione quisquam eveniet
          animi ad culpa repellat expedita illum recusandae eaque impedit
          laudantium. Quis!
        </p>
      </div>
    </FadeIn>
  </section> -->
</div>
<section class="flex items-center w-full h-screen p-4 bg-dark/5 test">
  <div class="">
    <div class="prose">
      <h1>Title 3</h1>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Est, sapiente
        hic beatae eligendi nostrum perferendis, id ratione quisquam eveniet
        animi ad culpa repellat expedita illum recusandae eaque impedit
        laudantium. Quis!
      </p>
    </div>
  </div>
</section>

<style>
  .scroll-smooth {
    scroll-behavior: smooth;
  }

  .sticky-container {
    position: sticky;
    top: 0;
    z-index: 10;
    height: 100vh;
    margin-top: -100vh;
  }

  @supports (animation-timeline: view()) {
    @media (prefers-reduced-motion: no-preference) {
      @keyframes appear {
        from {
          opacity: 0;
          scale: 0.8;
        }
        to {
          opacity: 1;
          scale: 1;
        }
        exit {
          opacity: 0;
          scale: 0.8;
        }
      }

      .test {
        animation: appear linear;
        animation-timeline: view();
        animation-range: entry 5% cover 10%;
      }
    }
  }
</style>
