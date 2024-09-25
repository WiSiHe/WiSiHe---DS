<script lang="ts">
  import { cn } from '@wisihe/utils' // Or your preferred classnames utility

  interface MarqueeItem {
    type: 'text' | 'image'
    content: string
  }

  export let items: MarqueeItem[] = []
  export let duration: number = 30 // Default duration
  export let gap: string = '1rem' // Default gap
  export let pauseOnHover: boolean = false

  let style = {
    '--duration': `${duration}s`,
    '--gap': gap
  }

  $: animationClass = cn('marquee__content', {
    'marquee--hover-pause': pauseOnHover
  })
</script>

<div
  class={cn('marquee enable-animation', pauseOnHover && 'marquee--hover-pause')}
  style={`
      --duration: ${duration}s;
      --gap: ${gap};
    `}
>
  <div class={animationClass}>
    {#each items as item}
      {#if item.type === 'text'}
        <span class="marquee-text">{item.content}</span>
      {:else if item.type === 'image'}
        <img src={item.content} alt="" class="marquee-image" />
      {/if}
    {/each}
  </div>

  <div class={animationClass}>
    {#each items as item}
      {#if item.type === 'text'}
        <span class="marquee-text">{item.content}</span>
      {:else if item.type === 'image'}
        <img src={item.content} alt="" class="marquee-image" />
      {/if}
    {/each}
  </div>
</div>

<style>
  /* Marquee Styles */
  .marquee {
    --duration: 30s;
    --gap: 1rem;
    position: relative;
    display: flex;
    overflow: hidden;
    user-select: none;
    gap: var(--gap);
  }

  .marquee__content {
    flex-shrink: 0;
    display: flex;
    justify-content: space-around;
    gap: var(--gap);
    min-width: 100%;
  }

  @keyframes scroll {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(calc(-100% - var(--gap)));
    }
  }

  /* Pause animation when reduced-motion is set */
  @media (prefers-reduced-motion: reduce) {
    .marquee__content {
      animation-play-state: paused !important;
    }
  }

  /* Enable animation */
  .enable-animation .marquee__content {
    animation: scroll var(--duration) linear infinite; /* Dynamic duration from variable */
  }

  /* Reverse animation (if needed) */
  .marquee--reverse .marquee__content {
    animation-direction: reverse;
  }

  /* Pause on hover (conditional based on prop) */
  .marquee--hover-pause:hover .marquee__content {
    animation-play-state: paused;
  }

  /* Content styles */
  .marquee__content > * {
    flex: 0 0 auto;
    border-radius: 0.25rem;
    text-align: center;
  }

  .marquee-text {
    color: white;
    background: dodgerblue;
  }

  .marquee-image {
    height: 350px;
    object-fit: cover;
  }

  /* * {
    box-sizing: border-box;
  } */

  /* .scroller {
    max-width: 600px;
  }

  .scroller__inner {
    padding-block: 1rem;
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .scroller[data-animated='true'] {
    overflow: hidden;
    -webkit-mask: linear-gradient(
      90deg,
      transparent,
      white 20%,
      white 80%,
      transparent
    );
    mask: linear-gradient(
      90deg,
      transparent,
      white 20%,
      white 80%,
      transparent
    );
  }

  .scroller[data-animated='true'] .scroller__inner {
    width: max-content;
    flex-wrap: nowrap;
    animation: scroll var(--_animation-duration, 40s)
      var(--_animation-direction, forwards) linear infinite;
  }

  .scroller[data-direction='right'] {
    --_animation-direction: reverse;
  }

  .scroller[data-direction='left'] {
    --_animation-direction: forwards;
  }

  .scroller[data-speed='fast'] {
    --_animation-duration: 20s;
  }

  .scroller[data-speed='slow'] {
    --_animation-duration: 60s;
  }

  @keyframes scroll {
    to {
      transform: translate(calc(-50% - 0.5rem));
    }
  }

  .tag-list {
    margin: 0;
    padding-inline: 0;
    list-style: none;
  }

  .tag-list li {
    padding: 1rem;
  } */
</style>
