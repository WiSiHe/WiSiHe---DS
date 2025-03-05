import {
  type iSanityPainting,
  type iSanityPaintingsTag
} from './../../lib/utils/sanity'

// +page.server.ts
import { getAllPaintingsAndTags } from '$lib/utils/sanity'
import { error } from '@sveltejs/kit'

export const prerender = true

// In-memory cache and timestamp

let cachedData: {
  paintings: iSanityPainting[]
  tags: iSanityPaintingsTag[]
} | null = null

let lastFetchTime = 0

// 24 hours in milliseconds
const CACHE_DURATION = 24 * 60 * 60 * 1000

export const load = async () => {
  const currentTime = Date.now()

  // Check if cache is still valid
  if (cachedData && currentTime - lastFetchTime < CACHE_DURATION) {
    return cachedData
  }

  // Fetch data from Sanity if cache is outdated or doesn't exist
  const data = await getAllPaintingsAndTags()

  if (data) {
    const { paintings, tags } = data

    // Process the tags as per your sorting logic
    const sortedTags = tags
      .filter(tag => tag.paintingsCount > 2)
      .sort((a, b) => {
        if (a.name === 'Store') return -1
        if (b.name === 'Store') return 1
        return (
          b.paintingsCount - a.paintingsCount || a.name.localeCompare(b.name)
        )
      })

    // Update the cached data and timestamp
    cachedData = { paintings, tags: sortedTags }
    lastFetchTime = currentTime

    return cachedData
  }

  throw error(404, 'Not found')
}
