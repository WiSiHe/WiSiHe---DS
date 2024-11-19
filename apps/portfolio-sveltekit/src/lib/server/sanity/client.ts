import { SANITY_API_READ_TOKEN } from '$env/static/private'
import { PUBLIC_SANITY_API_READ_WRITE_TOKEN } from '$env/static/public'
import { assertEnvVar } from '$lib/sanity/api'

import { client } from '$lib/sanity/client'

export const token = assertEnvVar(
  SANITY_API_READ_TOKEN,
  'SANITY_API_READ_TOKEN'
)

export const writeToken = assertEnvVar(
  PUBLIC_SANITY_API_READ_WRITE_TOKEN,
  'PUBLIC_SANITY_API_READ_WRITE_TOKEN'
)

export const serverClient = client.withConfig({
  token,
  useCdn: false,
  stega: true
})
