<script>
  import { onMount } from 'svelte'
  import { gsap } from 'gsap'

  let showSplash = true

  onMount(() => {
    const seenSplash = localStorage.getItem('seenSplash')
    if (seenSplash) {
      showSplash = false
    } else {
      playAnimation()
    }
  })

  function skipSplash() {
    gsap.to('.splash-container', {
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        showSplash = false
      }
    })
    localStorage.setItem('seenSplash', 'true')
  }

  function playAnimation() {
    const timeline = gsap.timeline({ defaults: { ease: 'power1.out' } })

    timeline
      .fromTo(
        '.splash-logo',
        { scale: 0, rotation: 720, opacity: 0 },
        {
          scale: 1.2,
          rotation: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'back.out(1.7)'
        }
      )
      .to('.splash-logo', { scale: 1, duration: 0.3 })
      .fromTo(
        '.splash-title',
        { y: '100%', opacity: 0 },
        { y: '0%', opacity: 1, duration: 0.8 },
        '-=0.4'
      )
      .fromTo(
        '.splash-subtitle',
        { x: '-100%', opacity: 0 },
        { x: '0%', opacity: 1, duration: 0.8, ease: 'elastic.out(1, 0.3)' },
        '-=0.5'
      )
      .fromTo(
        '.splash-image',
        { scale: 0.5, opacity: 0, rotationY: 180 },
        {
          scale: 1,
          opacity: 1,
          rotationY: 0,
          duration: 0.8,
          ease: 'power2.out'
        },
        '-=0.4'
      )
      .fromTo(
        '.splash-cta',
        { opacity: 0, y: 50, scale: 0.8 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'bounce.out' },
        '-=0.4'
      )
      .fromTo(
        '.splash-skip',
        { opacity: 0 },
        { opacity: 1, duration: 0.8 },
        '-=0.4'
      )
  }
</script>

{#if showSplash}
  <div class="splash-container">
    <div class="splash-content">
      <div class="splash-logo">🎨</div>
      <h1 class="splash-title">Henrik Wilhelm Sissener</h1>
      <p class="splash-subtitle">
        Frontend Developer | Digital Artist | Aspiring Game Developer
      </p>
      <div class="splash-image">
        <img
          src="https://cdnb.artstation.com/p/assets/images/images/051/957/643/large/henrik-sissener-refine-man-in-woods-1.jpg?1658597161"
          alt="Digital Art"
        />
      </div>
      <button class="splash-cta" on:click={skipSplash}>Explore My Work</button>
      <button class="splash-skip" on:click={skipSplash}>Skip</button>
    </div>
  </div>
{/if}

<style>
  .splash-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, #4c4c4c, #1a1a1a);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    opacity: 1;
    overflow: hidden;
  }

  .splash-container::before {
    content: '';
    position: absolute;
    width: 300%;
    height: 300%;
    background: conic-gradient(#f04e31, #f08431, #f04e31, #f08431);
    top: -100%;
    left: -100%;
    z-index: -1;
    animation: rotateBackground 10s infinite linear;
    opacity: 0.1;
    mix-blend-mode: screen;
  }

  @keyframes rotateBackground {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .splash-content {
    text-align: center;
    color: white;
    max-width: 90%;
    padding: 20px;
    position: relative;
  }

  .splash-logo {
    font-size: 3em;
    cursor: pointer;
    transform-origin: center center;
    filter: drop-shadow(0 0 15px rgba(240, 78, 49, 0.7));
  }

  .splash-title {
    font-size: 1.8em;
    margin: 0.3em 0;
    text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.7);
  }

  .splash-subtitle {
    font-size: 1.2em;
    margin-bottom: 0.8em;
    color: #ddd;
    text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);
  }

  .splash-image {
    margin: 1em 0;
    perspective: 800px;
    filter: drop-shadow(0 0 15px rgba(0, 0, 0, 0.7));
  }

  .splash-image img {
    max-width: 100%;
    height: auto;
    border-radius: 10px;
    transition: transform 0.5s;
  }

  .splash-image img:hover {
    transform: rotateY(15deg) rotateX(8deg) scale(1.03);
  }

  .splash-cta {
    background-color: #f04e31;
    border: none;
    color: white;
    padding: 0.7em 1.2em;
    font-size: 1em;
    cursor: pointer;
    border-radius: 5px;
    margin-top: 0.8em;
    margin-right: 0.5em;
    transition:
      background-color 0.3s ease,
      transform 0.3s ease,
      box-shadow 0.3s ease;
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
  }

  .splash-cta:hover {
    background-color: #d03b28;
    transform: translateY(-4px);
    box-shadow: 0 12px 18px rgba(0, 0, 0, 0.3);
  }

  .splash-skip {
    background: none;
    border: none;
    color: #bbb;
    font-size: 0.9em;
    cursor: pointer;
    margin-top: 0.8em;
    margin-left: 0.5em;
    transition: color 0.3s ease;
  }

  .splash-skip:hover {
    color: #fff;
  }

  /* Responsive adjustments */
  @media (max-width: 600px) {
    .splash-logo {
      font-size: 2.5em;
    }

    .splash-title {
      font-size: 1.5em;
    }

    .splash-subtitle {
      font-size: 1em;
    }

    .splash-cta {
      padding: 0.6em 1em;
      font-size: 0.9em;
    }

    .splash-skip {
      font-size: 0.8em;
    }
  }
</style>
