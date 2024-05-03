<script lang="ts">
  export let dialog: HTMLDialogElement
</script>

<dialog bind:this={dialog} on:close>
  <button
    class="text-white bg-primary hover:bg-primary/95"
    type="button"
    on:click={() => dialog.close()}>Close</button
  >
  <slot />
</dialog>

<style>
  dialog {
    margin: 0;
    padding: 0;
    position: fixed;
    inset: 0;
    width: 100%;
    z-index: 1000;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    max-width: 100%;
    max-height: 100%;
    padding: 2rem;
    @media screen and (min-width: 768px) {
      padding: 4rem;
    }
  }

  button {
    position: fixed;
    top: 1rem;
    right: 1rem;
    padding: 0.5rem 1rem;
    border: none;
    cursor: pointer;
    @media screen and (min-width: 768px) {
      top: 3rem;
      right: 3rem;
    }
  }
</style>
