<script>
  import Header from '../component-lib/Header.svelte'
  import { socialMediaLinks } from '@wisihe/constants'
  import './app.css'
</script>

<div class="app">
  <Header isAbsolute />

  <main>
    <slot />
  </main>

  <footer class="p-10 text-white bg-dark">
    <p>Connect with me on:</p>
    <ul>
      {#each socialMediaLinks as { label, url }}
        <li>
          <a href={url} target="_blank" rel="noopener noreferrer">
            {label}
          </a>
        </li>
      {/each}
    </ul>

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
