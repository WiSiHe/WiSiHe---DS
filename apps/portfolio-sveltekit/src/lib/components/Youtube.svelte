<script>
  export let href = 'https://www.youtube.com/watch?v=1jHJ8Y1v3ZQ'
</script>

<svelte:head></svelte:head>

<div class="w-full aspect-video">
  <p>Youtube Video</p>
  <iframe
    width="100%"
    height="100%"
    src="https://www.youtube.com/embed/nSI66UbwYnM?si=IB-F54nkAGnzlmpw"
    title="YouTube video player"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    referrerpolicy="strict-origin-when-cross-origin"
    allowfullscreen
  ></iframe>
</div>
