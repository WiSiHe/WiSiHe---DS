<script lang="ts">
  export let dialog: HTMLDialogElement
</script>

<dialog bind:this={dialog} on:close>
  <button on:click={() => dialog.close()}>Close</button>
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
    background-color: rgba(0, 0, 0, 0.5);
  }

  dialog::backdrop {
    background-color: rgba(0, 0, 0, 0.5);
  }

  button {
    position: absolute;
    top: 0;
    right: 0;
    padding: 0.5rem;
    background-color: white;
    border: none;
    cursor: pointer;
  }
</style>
