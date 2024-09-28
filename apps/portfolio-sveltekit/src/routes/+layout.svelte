<script>
  import SocialLinks from '$lib/components/SocialLinks.svelte'
  import Header from '$lib/components/header/Header.svelte'

  import './fonts.css'
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

  import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit'

  injectSpeedInsights()
</script>

<div class="app">
  <Header />
  <main class="bg-tertiary">
    <slot />
  </main>

  <footer class="p-10 text-white bg-dark">
    <div class="container flex flex-col items-center mx-auto">
      <SocialLinks />
      <p class="mt-4">&copy; 2024 Henrik Wilhelm Sissener</p>
      <p class="mt-2">Powered by SvelteKit</p>
      <div class="flex mt-4 space-x-4">
        <a
          href="https://twitter.com/yourhandle"
          aria-label="Follow Henrik Wilhelm Sissener on Twitter"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg
            class="w-6 h-6 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.897-.959-2.178-1.555-3.594-1.555-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124-4.087-.205-7.713-2.165-10.141-5.144-.422.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 14.002-7.496 14.002-13.986 0-.21 0-.423-.015-.634.961-.689 1.8-1.56 2.46-2.548l-.047-.02z"
            />
          </svg>
        </a>
        <a
          href="https://github.com/yourhandle"
          aria-label="Follow Henrik Wilhelm Sissener on GitHub"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg
            class="w-6 h-6 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              d="M12 0C5.373 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.111.82-.261.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.757-1.333-1.757-1.089-.744.083-.729.083-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.834 2.809 1.304 3.495.997.108-.775.418-1.305.762-1.605-2.665-.305-5.466-1.332-5.466-5.93 0-1.31.469-2.381 1.236-3.221-.124-.303-.536-1.523.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.046.138 3.004.404 2.291-1.552 3.297-1.23 3.297-1.23.655 1.653.243 2.873.12 3.176.77.84 1.235 1.911 1.235 3.221 0 4.61-2.805 5.621-5.475 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.218.694.825.576C20.565 21.796 24 17.3 24 12c0-6.627-5.373-12-12-12z"
            />
          </svg>
        </a>
        <!-- Add more social media links as needed -->
      </div>
    </div>
  </footer>
</div>

<style>
  :global(body) {
    font-family: 'Inter Variable', sans-serif;
    /* font-family: 'Oswald Variable', sans-serif; */
  }

  :global(h1, h2, h3, h4, h5, h6) {
    /* font-family: 'Oswald Variable', sans-serif; */
    font-family: 'LemonMilk', sans-serif;
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

  @view-transition {
    navigation: auto;
  }
</style>
