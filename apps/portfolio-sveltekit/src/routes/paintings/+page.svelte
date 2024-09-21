<script>
  import PaintingGrid from '../../components/PaintingGrid.svelte'

  export let data

  const { paintings = [], tags = [] } = data
</script>

<PaintingGrid {paintings} {tags} />
