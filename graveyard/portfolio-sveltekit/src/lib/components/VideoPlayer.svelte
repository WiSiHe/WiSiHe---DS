<script>
  import { cn } from '@wisihe/utils'

  export let videoUrl = 'https://youtu.be/UHaB72yjWJ4'
  export let title = 'Video Player'

  let aspectRatio = 'landscape'
  /**
   * @param {string} url
   */
  function convertYouTubeUrl(url) {
    // Regex for shortened YouTube URL (https://youtu.be/videoID)
    const shortUrlRegex = /https:\/\/youtu\.be\/([a-zA-Z0-9_-]+)/
    // Regex for YouTube shorts URL (https://youtube.com/shorts/videoID)
    const shortsUrlRegex =
      /https:\/\/(www\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/
    // Regex for standard YouTube video URL (https://youtube.com/watch?v=videoID)
    const standardUrlRegex =
      /https:\/\/(www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/

    let match

    // Check if it's a shortened YouTube URL
    match = url.match(shortUrlRegex)
    if (match && match[1]) {
      aspectRatio = 'landscape'
      return `https://www.youtube.com/embed/${match[1]}`
    }

    // Check if it's a YouTube shorts URL
    match = url.match(shortsUrlRegex)
    if (match && match[2]) {
      aspectRatio = 'portrait'
      return `https://www.youtube.com/embed/${match[2]}`
    }

    // Check if it's a standard YouTube URL
    match = url.match(standardUrlRegex)
    if (match && match[2]) {
      aspectRatio = 'landscape'
      return `https://www.youtube.com/embed/${match[2]}`
    }

    // If none of the patterns match, return null or handle accordingly
    return null
  }

  let embedUrl = convertYouTubeUrl(videoUrl)

  let formatStyle = {
    landscape: 'aspect-landscape',
    portrait: 'aspect-portrait'
  }[aspectRatio]
</script>

<div class={cn('w-full  h-full', formatStyle)}>
  {#if embedUrl}
    <iframe
      {title}
      src={embedUrl}
      width="100%"
      height="100%"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
  {:else}
    <p>Invalid YouTube URL</p>
  {/if}
</div>
