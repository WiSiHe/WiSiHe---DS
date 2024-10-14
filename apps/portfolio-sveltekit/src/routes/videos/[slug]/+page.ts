import { getVideo } from '$lib/utils/sanity'
import { error } from '@sveltejs/kit'
import type { PageLoad } from '../$types'

// export const ssr = false
// export const prerender = true

export const load = (async ({ params }) => {
  const { slug = '' } = params as { slug: string }
  if (!slug) throw error(404, 'Not found')
  const data = await getVideo(slug)

  if (data) {
    return {
      video: data
    }
  }

  throw error(404, 'Not found')
}) satisfies PageLoad
