import { client, type iSanityPainting } from '$lib/utils/sanity'
import type { PageServerLoad } from './$types'

import { paintingQuery } from '$lib/sanity/queries'

export const load: PageServerLoad = async ({
  params,
  locals: { loadQuery }
}) => {
  const { slug } = params

  const initial = await client.fetch<iSanityPainting>(paintingQuery, { slug })

  return {
    initial,
    params: { slug }
  }
}
