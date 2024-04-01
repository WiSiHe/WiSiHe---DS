<script>
  import Header from './Header.svelte'
  import './app.css'
</script>

<div class="app">
  <Header isAbsolute />

  <main>
    <slot />
  </main>

  <footer class="p-10 text-white bg-dark">
    <p>© 2021 Henrik Wilhelm Sissener</p>
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
