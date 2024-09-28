<script lang="ts">
  import { socialMediaLinks } from '@wisihe/constants'
</script>

{#if socialMediaLinks}
  <ul class="flex gap-4 p-0 m-0 list-none">
    {#each socialMediaLinks as { label, url }}
      <li>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          class="underline text-tertiary underline-offset-2 hover:text-primary hover:no-underline"
        >
          {label}
        </a>
      </li>
    {/each}
  </ul>
{/if}
