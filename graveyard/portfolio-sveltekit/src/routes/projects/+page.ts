import { getProjects } from '$lib/utils/sanity'
import { error } from '@sveltejs/kit'
import type { PageLoad } from '../$types'

// export const ssr = false

export const load = (async () => {
  const data = await getProjects()
  if (data) {
    return {
      projects: data
    }
  }

  throw error(404, 'Not found')
}) satisfies PageLoad
