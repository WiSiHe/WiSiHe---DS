import { error } from '@sveltejs/kit'
import type { PageLoad } from '../../$types'
import { getPainting } from '$lib/utils/sanity'

// export const ssr = false

export const load = (async ({ params }) => {
  const { slug = '' } = params as { slug: string }
  if (!slug) throw error(404, 'Not found')

  const painting = await getPainting(slug)

  if (painting) {
    return { painting } // Return as an object
  }

  throw error(404, 'Painting not found') // More specific error message
}) satisfies PageLoad
