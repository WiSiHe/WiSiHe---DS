<script lang="ts">
  import { page } from '$app/stores'
</script>

<section
  class="flex items-center justify-center w-full h-full max-w-screen-xl min-h-screen px-4 mx-auto"
>
  <h1>{$page.status}: {$page.error ? $page.error.message : 'Unknown error'}</h1>
</section>
