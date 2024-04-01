import type { PortableTextBlock } from '@portabletext/types'
import { createClient } from '@sanity/client'
import type {
  Image,
  ImageAsset,
  ImageCrop,
  ImageHotspot,
  Slug
} from '@sanity/types'
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

export async function getPainting(slug: string): Promise<iSanityPainting> {
  return await client.fetch(
    groq`*[_type == "painting" && slug.current == $slug][0]{
      _id,
      title,
      'slug': slug.current,
      description,
      seoDescription,
      format,
      likes,
      paintedAt,
      artstationUrl,
      redbubbleUrl,
      society6Url,
      inPrintUrl,
      image{
        ...,
        "lqip": asset->metadata.lqip
      },
      altText,
      images,
      tagsV2[]->{name},
      video
    }`,
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

type iPaintingFormat = 'square' | 'landscape' | 'portrait'

export interface iSanityTag {
  _id?: string
  name: string
  description?: string | null
}

export interface iSanityImageAsset {
  _ref: string
  _type: string
}

export interface iSanityImage {
  _type: string
  _key?: string
  asset: iSanityImageAsset
  crop?: ImageCrop
  hotspot?: ImageHotspot
  lqip?: string
}

export interface iSanityPainting {
  _id: string
  format: iPaintingFormat
  image: Image
  images?: Image[]
  imagesCount: number | null
  redbubbleUrl?: string | null
  society6Url?: string | null
  artstationUrl?: string | null
  inPrintUrl?: string | null
  description?: string
  seoDescription?: string
  likes?: number
  paintedAt: string
  slug: string
  tagsV2: iSanityTag[]
  tagCount?: number | null
  title: string
  video?: string | null
  altText?: string
}
