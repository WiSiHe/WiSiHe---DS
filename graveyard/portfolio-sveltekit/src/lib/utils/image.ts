import imageUrlBuilder from '@sanity/image-url'
import type { Image } from '@sanity/types'
import { client } from './sanity'

const builder = imageUrlBuilder(client)

export function urlFor(source: Image) {
  return builder.image(source)
}

export function getAspectRatioClass(aspectRatio: number) {
  if (aspectRatio >= 1.6 && aspectRatio <= 1.85) {
    // Close to 16:9 aspect ratio
    return 'aspect-video'
  } else if (aspectRatio >= 0.5 && aspectRatio <= 0.8) {
    // Close to 9:16 aspect ratio (portrait)
    return 'aspect-portrait'
  } else if (Math.abs(aspectRatio - 1) < 0.1) {
    // Close to 1:1 aspect ratio (square)
    return 'aspect-square'
  } else {
    // Default to aspect-video if unsure
    return 'aspect-video'
  }
}

export function getAspectRatioImageWidth(aspectRatio: number) {
  if (aspectRatio >= 1.6 && aspectRatio <= 1.85) {
    // Close to 16:9 aspect ratio
    return 600
  } else if (aspectRatio >= 0.5 && aspectRatio <= 0.8) {
    // Close to 9:16 aspect ratio (portrait)
    return 400
  } else if (Math.abs(aspectRatio - 1) < 0.1) {
    // Close to 1:1 aspect ratio (square)
    return 400
  } else {
    // Default to aspect-video if unsure
    return 600
  }
}

export function getAspectRatioImageHeight(aspectRatio: number) {
  if (aspectRatio >= 1.6 && aspectRatio <= 1.85) {
    // Close to 16:9 aspect ratio
    return 400
  } else if (aspectRatio >= 0.5 && aspectRatio <= 0.8) {
    // Close to 9:16 aspect ratio (portrait)
    return 600
  } else if (Math.abs(aspectRatio - 1) < 0.1) {
    // Close to 1:1 aspect ratio (square)
    return 400
  } else {
    // Default to aspect-video if unsure
    return 400
  }
}
