import { createSanityImageBuilder } from '@wisihe/sanity-core'

const builder = createSanityImageBuilder({
  // eslint-disable-next-line no-undef
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || '',
  // eslint-disable-next-line no-undef
  dataset: process.env.SANITY_STUDIO_DATASET || '',
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlFor(source: any) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return builder.image(source)
}
