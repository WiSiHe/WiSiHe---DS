import { error } from '@sveltejs/kit'
import { getPainting } from '$lib/utils/sanity'
import type { PageServerLoad } from './$types'

// Uncomment these if the page can be statically generated
// export const ssr = true; // Enable SSR
// export const prerender = true; // Enable prerendering for static pages

// Caching utility (example using an in-memory cache)
const cache = new Map<string, any>()

export const load: PageServerLoad = async ({ params }) => {
  const { slug = '' } = params as { slug: string }

  // Return 404 early if the slug is empty
  if (!slug) {
    throw error(404, 'Painting not found')
  }

  // Check cache first to avoid redundant API calls
  if (cache.has(slug)) {
    return { painting: cache.get(slug) }
  }

  try {
    // Fetch painting from API or CMS
    const painting = await getPainting(slug)

    if (painting) {
      // Cache the painting data for subsequent requests
      cache.set(slug, painting)

      return { painting } // Return the painting object
    } else {
      // Painting not found - throw a specific error
      throw error(404, 'Painting not found')
    }
  } catch (err) {
    console.error(`Failed to load painting with slug "${slug}":`, err)

    // Return a user-friendly error message
    throw error(500, 'Unable to load painting at this time')
  }
}
