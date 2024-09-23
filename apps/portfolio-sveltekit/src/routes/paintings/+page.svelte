<script>
  import PaintingGrid from '../../components/PaintingGrid.svelte'

  export let data

  const { paintings = [], tags = [] } = data
</script>

<svelte:head>
  <title>Paintings | WiSiHe - Digital Portfolio</title>
  <meta
    name="description"
    content="Browse through my diverse collection of paintings. A chance to learn new skills and experiment creatively."
  />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="index, follow" />
  <meta name="author" content="WiSiHe" />
  <meta
    name="keywords"
    content="paintings, digital art, portfolio, WiSiHe, art collection"
  />

  <!-- Open Graph (OG) tags -->
  <meta property="og:title" content="Paintings | WiSiHe - Digital Portfolio" />
  <meta
    property="og:description"
    content="Browse through my diverse collection of paintings. A chance to learn new skills and experiment creatively."
  />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://yourwebsite.com/paintings" />
  <meta
    property="og:image"
    content="https://yourwebsite.com/path/to/your/image.jpg"
  />
  <meta property="og:site_name" content="WiSiHe - Digital Portfolio" />

  <!-- Twitter Card tags -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Paintings | WiSiHe - Digital Portfolio" />
  <meta
    name="twitter:description"
    content="Browse through my diverse collection of paintings. A chance to learn new skills and experiment creatively."
  />
  <meta
    name="twitter:image"
    content="https://yourwebsite.com/path/to/your/image.jpg"
  />
  <meta name="twitter:site" content="@yourtwitterhandle" />
  <meta name="twitter:creator" content="@yourtwitterhandle" />

  <!-- Additional SEO tags -->
  <link rel="canonical" href="https://yourwebsite.com/paintings" />
</svelte:head>

<PaintingGrid {paintings} {tags} />
