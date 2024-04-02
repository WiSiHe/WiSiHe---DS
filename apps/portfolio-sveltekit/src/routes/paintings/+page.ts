import { getAllPaintingsAndTags, getPaintings } from '$lib/utils/sanity'
import { error } from '@sveltejs/kit'
import type { PageLoad } from '../$types'

export const ssr = false

export const load = (async () => {
  const data = await getAllPaintingsAndTags()

  if (data) {
    const { paintings, tags } = data
    const sortedTags = tags
      .filter(tag => tag.paintingsCount > 2)
      .sort((a, b) => {
        // Put the "Store" tag first
        if (a.name === 'Store') return -1
        if (b.name === 'Store') return 1

        // Sort by paintingsCount in descending order
        if (b.paintingsCount !== a.paintingsCount) {
          return b.paintingsCount - a.paintingsCount
        }

        // Sort by name if paintingsCount is the same
        return a.name.localeCompare(b.name)
      })

    const newData = { paintings, tags: sortedTags }

    return newData
  }

  throw error(404, 'Not found')
}) satisfies PageLoad
