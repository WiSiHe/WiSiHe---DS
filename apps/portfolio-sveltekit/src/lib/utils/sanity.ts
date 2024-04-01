import type { PortableTextBlock } from '@portabletext/types'
import { createClient } from '@sanity/client'
import type { ImageAsset, Slug } from '@sanity/types'
import groq from 'groq'

import {
  PUBLIC_SANITY_DATASET,
  PUBLIC_SANITY_PROJECT_ID
} from '$env/static/public'

if (!PUBLIC_SANITY_PROJECT_ID || !PUBLIC_SANITY_DATASET) {
  throw new Error('Did you forget to run sanity init --env?')
}

export const client = createClient({
  projectId: PUBLIC_SANITY_PROJECT_ID,
  dataset: PUBLIC_SANITY_DATASET,
  useCdn: false, // `false` if you want to ensure fresh data
  apiVersion: '2023-03-20' // date of setup
})

export async function getPosts(): Promise<Post[]> {
  return await client.fetch(
    groq`*[_type == "post" && defined(slug.current)] | order(_createdAt desc)`
  )
}

export async function getPost(slug: string): Promise<Post> {
  return await client.fetch(
    groq`*[_type == "post" && slug.current == $slug][0]`,
    {
      slug
    }
  )
}

export async function getPaintings(): Promise<any[]> {
  return await client.fetch(
    groq`*[_type == "painting" && defined(slug.current)]{..., "slug":slug.current} | order(_createdAt desc)`
  )
}

export async function getPainting(slug: string): Promise<any> {
  return await client.fetch(
    groq`*[_type == "painting" && slug.current == $slug][0]`,
    {
      slug
    }
  )
}

export async function getHomePage(): Promise<any> {
  return await client.fetch(homePageQuery)
}

export const homePageQuery = groq`
  *[_type == "home"][0]{
    _id,
    title,
    "paintingsCount": count(*[_type == "painting"]),
    paintingsDescription,
    showcasePaintings[]->{
      _type,
      _id,
      altText,
      "slug": slug.current,
      title,
      format,
      image{
        ...,
        "lqip": asset->metadata.lqip
      }
    },
    projectsDescription,
    showcaseProjects[]->{
      _type,
      _id,
      title,
      description,
      projectStart,
      projectEnd,
      status,
      content,
      name,
      "slug": slug.current,
      image{
        ...,
        "lqip": asset->metadata.lqip
      },
    },
  }
`

export interface Post {
  _type: 'post'
  _createdAt: string
  title?: string
  slug: Slug
  excerpt?: string
  mainImage?: ImageAsset
  body: PortableTextBlock[]
}
