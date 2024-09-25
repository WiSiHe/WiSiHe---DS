<script>
  import { onMount } from 'svelte'

  let isVisible = false
  const scrollDistance = 200 // Distance from top in pixels to show the button

  // Function to check scroll position
  const handleScroll = () => {
    isVisible = window.scrollY > scrollDistance
  }

  // Scroll back to top when the button is clicked
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  // Add scroll event listener when the component mounts
  onMount(() => {
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  })
</script>

<!-- Button that only appears when `isVisible` is true -->
<button
  class="scroll-to-top {isVisible ? 'visible' : ''} bg-primary"
  on:click={scrollToTop}
>
  ↑
</button>

<style>
  .scroll-to-top {
    /* position: fixed;
    bottom: 20px;
    right: 20px; */

    color: white;
    border: none;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    font-size: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    opacity: 0;
    transition:
      opacity 0.3s ease-in-out,
      transform 0.3s ease-in-out;
    transform: scale(0.5);
  }

  .scroll-to-top.visible {
    opacity: 1;
    transform: scale(1);
  }
</style>
