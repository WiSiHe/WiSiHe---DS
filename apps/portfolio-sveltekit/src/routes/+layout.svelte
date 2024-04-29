<script>
  import Header from '../components/Header.svelte'
  import { socialMediaLinks } from '@wisihe/constants'
  import './app.css'
  import SocialLinks from '../components/SocialLinks.svelte'
  import Spash from '../components/Spash.svelte'
  import { fade } from 'svelte/transition'
</script>

<div class="app">
  <Header isAbsolute />

  <main>
    <div in:fade={{ duration: 500 }} out:fade={{ duration: 500 }}>
      <Spash />
    </div>
    <slot />
  </main>

  <footer class="p-10 text-white bg-dark">
    <SocialLinks />

    <p>2024 Henrik Wilhelm Sissener</p>
    <p>Powered by SvelteKit</p>
  </footer>
</div>

<style>
  .app {
    display: flex;
    flex-direction: column;
    min-height: 100dvh;
  }

  main {
    flex: 1;
    display: flex;
    flex-direction: column;
    width: 100%;
    margin: 0 auto;
    box-sizing: border-box;
  }
</style>
