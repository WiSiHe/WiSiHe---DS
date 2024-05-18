<script>
  import SocialLinks from '../components/SocialLinks.svelte'
  import Header from '../components/header/Header.svelte'

  import './app.css'

  import '@fontsource-variable/inter'
  import '@fontsource-variable/oswald'

  import { dev } from '$app/environment'
  import { inject } from '@vercel/analytics'
  inject({ mode: dev ? 'development' : 'production' })

  import { onNavigate } from '$app/navigation'

  onNavigate(navigation => {
    if (!document.startViewTransition) return

    return new Promise(resolve => {
      document.startViewTransition(async () => {
        resolve()
        await navigation.complete
      })
    })
  })
</script>

<div class="app">
  <Header isAbsolute />
  <!-- <Splash /> -->

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
  :global(body) {
    font-family: 'Inter Variable', sans-serif;
    /* font-family: 'Oswald Variable', sans-serif; */
  }

  :global(h1, h2, h3, h4, h5, h6) {
    font-family: 'Oswald Variable', sans-serif;
  }
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
