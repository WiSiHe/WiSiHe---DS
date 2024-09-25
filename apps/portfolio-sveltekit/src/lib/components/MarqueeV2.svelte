<script lang="ts">
  import type { SvelteComponent } from 'svelte'

  export let direction: 'left' | 'right' | 'up' | 'down' = 'left'
  export let speed: number = 10
  export let pauseOnHover: boolean = true
  export let loop: boolean = true
  export let delay: number = 0
  export let gap: number = 20 // Gap between objects in pixels

  let animationDirection = {
    left: 'left-marquee',
    right: 'right-marquee',
    up: 'up-marquee',
    down: 'down-marquee'
  }

  let animationClass = `${animationDirection[direction]} ${pauseOnHover ? 'pause-on-hover' : ''}`
</script>

<div
  class={`marquee ${animationClass}`}
  style={`--speed: ${speed}s; --delay: ${delay}s;`}
>
  <div class="marquee-content" style={`--gap: ${gap}px;`}>
    <slot />
  </div>
  <div class="marquee-content" style={`--gap: ${gap}px;`}>
    <slot />
  </div>
</div>

<style>
  .marquee {
    position: relative;
    overflow: hidden;
  }

  .marquee-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    white-space: nowrap;
    gap: var(--gap);
  }

  .left .marquee-content {
    animation: left-marquee var(--speed) linear infinite;
  }

  .right .marquee-content {
    animation: right-marquee var(--speed) linear infinite;
  }

  .up .marquee-content {
    flex-direction: column;
    animation: up-marquee var(--speed) linear infinite;
  }

  .down .marquee-content {
    flex-direction: column;
    animation: down-marquee var(--speed) linear infinite;
  }

  .pause-on-hover:hover .marquee-content {
    animation-play-state: paused;
  }

  @keyframes left-marquee {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-100%);
    }
  }

  @keyframes right-marquee {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(0);
    }
  }

  @keyframes up-marquee {
    0% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(-100%);
    }
  }

  @keyframes down-marquee {
    0% {
      transform: translateY(-100%);
    }
    100% {
      transform: translateY(0);
    }
  }
</style>
