<script lang="ts">
  import { IconClockSearch, IconCross } from '@tabler/icons-svelte'

  export let isOpen = false // Controls the open state of the dialog
  export let title = '' // Dialog title
  export let closeText = 'Close' // Text for the close button

  let dialogRef: HTMLDialogElement // Reference to the dialog element

  // Function to open the dialog
  function show() {
    if (dialogRef && !dialogRef.open) {
      dialogRef.showModal()
    }
  }

  // Function to close the dialog
  function close() {
    if (dialogRef && dialogRef.open) {
      dialogRef.close()
    }
    isOpen = false
  }

  // Watch the 'open' prop to control the dialog's visibility
  $: if (isOpen) {
    show()
  } else {
    close()
  }
</script>

<dialog bind:this={dialogRef}>
  <header class="flex justify-between">
    <h2>{title}</h2>
    <button on:click={close}>
      <IconCross />
    </button>
  </header>

  <main>
    <slot></slot>
  </main>

  <!-- <footer>
    <button on:click={close}>{closeText}</button>
  </footer> -->
</dialog>

<style>
  dialog::backdrop {
    background-color: rgba(0, 0, 0, 0.5);
  }
  dialog {
    border: none;
    border-radius: 8px;
    padding: 1em;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    width: 40%;
  }
</style>
