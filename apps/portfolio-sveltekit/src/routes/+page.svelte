<script lang="ts">
  import Hero from '../components/Hero.svelte'
  import PaintingsSection from '../components/PaintingsSection.svelte'

  export let data
  const { showcasePaintings = [], title } = data
</script>

<svelte:head>
  <title>Home | {title}</title>
  <meta name="description" content="Portfolio of paintings by artist, WiSiHe" />
  <script
    type="module"
    src="https://unpkg.com/@splinetool/viewer@1.1.9/build/spline-viewer.js"
  ></script>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<Hero paintings={showcasePaintings} />
<PaintingsSection paintings={showcasePaintings} />
