import { getHomePage } from '$lib/utils/sanity'
import { error } from '@sveltejs/kit'

// Prerender this page for optimal performance
export const prerender = true // Uncomment to enable prerendering

// Optional: Simple in-memory cache for homepage data
let cachedHomePageData: { showcasePaintings: any; title: string } | null = null

export const load = async () => {
  // Return cached data if available
  if (cachedHomePageData) {
    return cachedHomePageData
  }

  try {
    // Fetch data from Sanity CMS
    const data = await getHomePage()

    if (data) {
      const { showcasePaintings, title = '' } = data

      // Cache the data to avoid redundant API calls during dev
      cachedHomePageData = { showcasePaintings, title }

      return { showcasePaintings, title }
    }

    // If no data, throw 404
    throw error(404, 'Homepage data not found')
  } catch (err) {
    console.error('Error fetching homepage data:', err)

    // Throw an internal server error if something goes wrong
    throw error(500, 'Unable to load homepage data')
  }
}
