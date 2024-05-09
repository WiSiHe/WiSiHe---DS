import { error } from '@sveltejs/kit'
import type { PageLoad } from '../../$types'
import { getPainting } from '$lib/utils/sanity'

// export const ssr = false

export const load = (async ({ params }) => {
  const { slug = '' } = params as { slug: string }
  if (!slug) throw error(404, 'Not found')

  // const post = await getPost(slug);
  const painting = await getPainting(slug)
  if (painting) {
    return painting
  }

  throw error(404, 'Not found')
}) satisfies PageLoad
