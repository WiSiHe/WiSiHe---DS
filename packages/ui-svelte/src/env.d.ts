declare module '*.svelte' {
  import type { Component } from 'svelte';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // biome-ignore lint/suspicious/noExplicitAny: generic module declaration
  const component: Component<any, any>;
  export default component;
}
