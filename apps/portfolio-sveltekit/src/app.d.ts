// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { LoaderLocals } from '@sanity/svelte-loader'

declare global {
  namespace App {
    // interface Error {}
    interface Locals extends LoaderLocals {}
    // interface PageData {}
    // interface Platform {}
  }
  // add these lines
  interface ViewTransition {
    updateCallbackDone: Promise<void>
    ready: Promise<void>
    finished: Promise<void>
    skipTransition: () => void
  }

  interface Document {
    startViewTransition(updateCallback: () => Promise<void>): ViewTransition
  }
}

export {}
