<script>
// biome-ignore lint/correctness/noUnusedVariables: Svelte 5 Rune
let count = $state(0);

// biome-ignore lint/correctness/noUnusedVariables: Svelte 5 Rune
function increment() {
  count += 1;
}
</script>

<div style="padding: 1rem; border: 1px solid #ff3e00; border-radius: 8px; margin: 1rem 0;">
  <h3>Svelte Component (Runes)</h3>
  <p>Count: {count}</p>
  <button onclick={increment} style="padding: 0.5rem 1rem; cursor: pointer;"> Increment </button>
</div>
