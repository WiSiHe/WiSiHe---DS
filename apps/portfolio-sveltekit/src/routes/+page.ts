import { title } from './../../../portfolio-next/lib/demo.data'
import { getHomePage } from '$lib/utils/sanity'

import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types'
// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
export const prerender = true

export const load = (async () => {
  const data = await getHomePage()

  if (data) {
    const { showcasePaintings, title = '' } = data
    return { showcasePaintings, title }
  }

  throw error(404, 'Not found')
}) satisfies PageLoad
