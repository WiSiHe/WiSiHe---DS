<script lang="ts">
  import Hero from '$lib/components/sections/Hero.svelte'
  import PaintingsSection from '$lib/components/PaintingsSection.svelte'

  export let data
  const { showcasePaintings = [], title } = data

  const painting = '$lib/images/paintings/cloud.jpg'
</script>

<svelte:head>
  <title>{title ? `${title} | Home` : 'Home'} | Portfolio of WiSiHe</title>
  <meta
    name="description"
    content={title
      ? `Explore the stunning portfolio of ${title}, an artist known for unique and captivating paintings.`
      : 'Portfolio of WiSiHe, showcasing a diverse range of captivating paintings.'}
  />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta
    name="keywords"
    content="paintings, art portfolio, WiSiHe, artist paintings, artwork collection, modern art"
  />
  <meta property="og:title" content="Portfolio of {title}" />
  <meta
    property="og:description"
    content="Explore the stunning artwork collection of {title}, featuring unique paintings."
  />
  <meta property="og:type" content="website" />
  <meta property="og:image" content={painting} />
  <!-- Add an image to make the page more attractive on social media -->
  <meta property="og:url" content="https://wisihe.no" />
</svelte:head>

<Hero paintings={showcasePaintings} />
<PaintingsSection paintings={showcasePaintings} />
