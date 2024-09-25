<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte'

  interface Option {
    value: string
    label: string
  }

  export let options: Option[] = []
  export let value: string = ''
  export let label: string = 'Select an option'
  export let id: string = 'dropdown-' + Math.random().toString(36).substr(2, 9)

  let isOpen: boolean = false
  let selectedLabel: string = ''
  let dropdownRef: HTMLElement

  const dispatch = createEventDispatcher<{ change: string }>()

  $: selectedLabel =
    options.find(opt => opt.value === value)?.label || 'Please select an option'

  function toggleDropdown(): void {
    isOpen = !isOpen
  }

  function selectOption(option: Option): void {
    value = option.value
    selectedLabel = option.label
    isOpen = false
    dispatch('change', value)
  }

  function handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      isOpen = false
    } else if (event.key === 'ArrowDown' && !isOpen) {
      isOpen = true
    }
  }

  onMount(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef && !dropdownRef.contains(event.target as Node)) {
        isOpen = false
      }
    }

    document.addEventListener('click', handleClickOutside)

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  })
</script>

<div class="relative" bind:this={dropdownRef}>
  <label for={id} class="block mb-1 text-sm font-medium">
    {label}
  </label>
  <button
    {id}
    type="button"
    on:click={toggleDropdown}
    on:keydown={handleKeydown}
    aria-haspopup="listbox"
    aria-expanded={isOpen}
    class="relative w-full py-3 pl-3 pr-10 text-left bg-white border border-gray-300 rounded-md shadow-sm cursor-default min-w-36 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
  >
    <span class="block truncate">{selectedLabel}</span>
    <span
      class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none"
    >
      <svg
        class="w-5 h-5 text-dark"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fill-rule="evenodd"
          d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
          clip-rule="evenodd"
        />
      </svg>
    </span>
  </button>

  {#if isOpen}
    <ul
      class="absolute z-10 w-full mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
      tabindex="-1"
      role="listbox"
      aria-labelledby={id}
    >
      {#each options as option (option.value)}
        <li
          class="relative py-2 pl-3 cursor-default select-none pr-9 hover:bg-primary hover:text-white hover:fill-white"
          role="option"
          aria-selected={value === option.value}
          on:click={() => selectOption(option)}
        >
          <span class="block font-normal truncate">
            {option.label}
          </span>
          {#if value === option.value}
            <span class="absolute inset-y-0 right-0 flex items-center pr-4">
              <svg
                class="w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </span>
          {/if}
        </li>
      {/each}
    </ul>
  {/if}
</div>
