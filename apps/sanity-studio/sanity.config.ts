/* global process */
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {presentationTool} from 'sanity/presentation'

import {schemaTypes} from './schemas'
import {assist} from '@sanity/assist'
import {media} from 'sanity-plugin-media'

export const projectId = process.env.SANITY_STUDIO_PROJECT_ID
export const dataset = process.env.SANITY_STUDIO_DATASET

// URL for preview functionality, defaults to localhost:3000 if not set
const SANITY_STUDIO_PREVIEW_URL = process.env.SANITY_STUDIO_PREVIEW_URL || 'https://wisihe.no'

//  Main Sanity Studio configuration
export default defineConfig({
  name: 'wisihe-studio',
  title: 'WiSiHe Studio',

  projectId,
  dataset,

  plugins: [
    presentationTool({
      previewUrl: {
        origin: SANITY_STUDIO_PREVIEW_URL,
        previewMode: {
          enable: '/api/draft-mode/enable',
        },
      },
      // resolve: {
      //   // The Main Document Resolver API provides a method of resolving a main document from a given route or route pattern. https://www.sanity.io/docs/presentation-resolver-api#57720a5678d9
      //   mainDocuments: defineDocuments([
      //     {
      //       route: '/:slug',
      //       filter: `_type == "page" && slug.current == $slug || _id == $slug`,
      //     },
      //     {
      //       route: '/posts/:slug',
      //       filter: `_type == "post" && slug.current == $slug || _id == $slug`,
      //     },
      //   ]),
      //   // Locations Resolver API allows you to define where data is being used in your application. https://www.sanity.io/docs/presentation-resolver-api#8d8bca7bfcd7
      //   locations: {
      //     settings: defineLocations({
      //       locations: [homeLocation],
      //       message: 'This document is used on all pages',
      //       tone: 'positive',
      //     }),
      //     page: defineLocations({
      //       select: {
      //         name: 'name',
      //         slug: 'slug.current',
      //       },
      //       resolve: (doc) => ({
      //         locations: [
      //           {
      //             title: doc?.name || 'Untitled',
      //             href: resolveHref('page', doc?.slug)!,
      //           },
      //         ],
      //       }),
      //     }),
      //     post: defineLocations({
      //       select: {
      //         title: 'title',
      //         slug: 'slug.current',
      //       },
      //       resolve: (doc) => ({
      //         locations: [
      //           {
      //             title: doc?.title || 'Untitled',
      //             href: resolveHref('post', doc?.slug)!,
      //           },
      //           {
      //             title: 'Home',
      //             href: '/',
      //           } satisfies DocumentLocation,
      //         ].filter(Boolean) as DocumentLocation[],
      //       }),
      //     }),
      //   },
      // },
    }),
    assist(),
    structureTool(),
    // visionTool(),
    media(),
  ],
  schema: {
    types: schemaTypes,
  },
})
