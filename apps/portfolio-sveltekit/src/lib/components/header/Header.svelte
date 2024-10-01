<script lang="ts">
  import { navigationItems } from '@wisihe/constants'
  import { cn } from '@wisihe/utils'
  import NavItem from './NavItem.svelte'

  export let isAbsolute = false

  let dialog: HTMLDialogElement

  function openDialog() {
    dialog.showModal()
  }

  function closeDialog() {
    dialog.close()
  }

  // Function to close the dialog when a link is clicked
  function handleLinkClick() {
    closeDialog()
  }
</script>

<header
  class={cn(isAbsolute ? 'fixed' : 'relative', 'top-0 left-0 right-0 z-30')}
>
  <nav
    aria-label="Main Navigation"
    class="flex items-center justify-between px-4 py-2 text-white bg-dark"
  >
    <!-- Logo -->
    <a
      href="/"
      aria-label="Navigate to the homepage"
      class="flex items-center p-1 text-sm transition-transform duration-300 transform focus-visible:ring hover:scale-110"
    >
      <!-- Simplified SVG Logo -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 24 24"
        role="img"
        aria-label="QR Code Logo"
        class="transition-transform duration-300 transform fill-white hover:rotate-12"
      >
        <!-- Simplified path -->
        <path
          d="M3 3h6v6H3V3zm0 12h6v6H3v-6zm12-12h6v6h-6V3zm-6 6h6v6h-6V9zm6 6h6v6h-6v-6z"
        />
      </svg>
    </a>

    <!-- Desktop Navigation -->
    <ul class="items-center hidden gap-4 lg:flex">
      {#each navigationItems as item}
        <li>
          <NavItem {item} />
        </li>
      {/each}
    </ul>

    <!-- Mobile Toggle Button -->
    <button
      on:click={openDialog}
      class="p-2 text-white rounded-md lg:hidden focus-visible:ring"
      aria-label="Toggle navigation"
    >
      <!-- Hamburger Icon -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>
  </nav>
</header>

<!-- Mobile Drawer -->
<dialog
  bind:this={dialog}
  class="fixed inset-0 z-40 w-screen h-screen p-0 m-0 bg-transparent"
>
  <!-- Backdrop -->
  <button
    class="absolute inset-0 bg-black opacity-50"
    on:click={closeDialog}
    aria-label="Close navigation"
  ></button>

  <!-- Drawer Content -->
  <div class="absolute top-0 right-0 w-64 h-full bg-white shadow-lg">
    <button
      on:click={closeDialog}
      class="absolute text-gray-600 top-2 right-2 hover:text-gray-800 focus:outline-none"
      aria-label="Close navigation"
    >
      <!-- Close Icon -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
    <ul class="p-4 mt-12 space-y-4">
      {#each navigationItems as item}
        <li>
          <NavItem {item} on:click={handleLinkClick} />
        </li>
      {/each}
    </ul>
  </div>
</dialog>

<style>
  /* Reset dialog default styles */
  dialog {
    border: none;
    padding: 0;
    margin: 0;
    width: 100%;
    height: 100%;
  }

  /* Ensure the dialog covers the entire viewport */
  dialog::backdrop {
    background: transparent;
  }
</style>
