<script>
  import ScrollToTop from './ScrollToTop.svelte'
  let isVisible = false
</script>

<div
  class="fixed bottom-0 left-0 right-0 z-10 flex items-end justify-between w-full p-4 drop-shadow-xl"
>
  <ScrollToTop />
  <div class="relative">
    <button
      class="px-6 py-3 bg-white rounded-full hover:bg-primary hover:text-white"
      on:click={() => (isVisible = !isVisible)}
    >
      Sort
    </button>
    {#if isVisible}
      <nav class="absolute px-4 text-center bg-white rounded w-fit bottom-14">
        <ul class="py-4 space-y-4">
          <li>
            <button>Newest</button>
          </li>
          <li>
            <button>Oldest</button>
          </li>
          <li>
            <button>Random</button>
          </li>
        </ul>
      </nav>
    {/if}
  </div>
  <button class="px-6 py-3 bg-white rounded-full">Filters</button>
</div>

<style>
</style>
