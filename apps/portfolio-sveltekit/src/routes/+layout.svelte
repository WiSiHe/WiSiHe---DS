<script>
  import Header from '../components/Header.svelte'
  import './app.css'
  import SocialLinks from '../components/SocialLinks.svelte'
  import Splash from '../components/Splash.svelte'
</script>

<div class="app">
  <Header isAbsolute />
  <Splash />

  <main>
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
