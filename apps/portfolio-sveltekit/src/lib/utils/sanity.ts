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
  PUBLIC_SANITY_PROJECT_ID,
  PUBLIC_SANITY_API_READ_WRITE_TOKEN
} from '$env/static/public'

if (!PUBLIC_SANITY_PROJECT_ID || !PUBLIC_SANITY_DATASET) {
  throw new Error('Did you forget to run sanity init --env?')
}

export const client = createClient({
  projectId: PUBLIC_SANITY_PROJECT_ID,
  dataset: PUBLIC_SANITY_DATASET,
  useCdn: false, // `false` if you want to ensure fresh data
  apiVersion: '2023-03-20', // date of setup
  token: PUBLIC_SANITY_API_READ_WRITE_TOKEN
})

export async function getPaintings(): Promise<iSanityPainting[]> {
  return await client.fetch(
    groq`*[_type == "painting" && defined(slug.current) && published == true]{..., "slug":slug.current} | order(_createdAt desc)`
  )
}

export async function getAllPaintingsAndTags(): Promise<{
  paintings: iSanityPainting[]
  tags: iSanityPaintingsTag[]
}> {
  return await client.fetch(
    groq`{
      "paintings": *[_type == "painting" && defined(slug.current)]{
      _id,
      "slug":slug.current,
      title,
      tagsV2[]->{name},
      "viewsCount": count(views),
      paintedAt,
      video,
      "imagesCount": coalesce(count(images), 0),
      "isForSale": defined(redbubbleUrl) || defined(society6Url) || defined(artstationUrl) || defined(inPrintUrl),
      image{
        ...,
        "lqip": asset->metadata.lqip,
        "aspectRatio": asset->metadata.dimensions.aspectRatio
      }
      } | order(_createdAt desc),
      "tags": *[_type == "tag"] | order(name asc) { _id, name, "paintingsCount": count(*[_type == "painting" && references(^._id)].title)}
    }`
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
      "views": select(defined(views) => views[]{ viewerId, timestamp }, []), // Using select to handle undefined views
      "viewsCount": count(views),
      paintedAt,
      artstationUrl,
      redbubbleUrl,
      society6Url,
      inPrintUrl,
      image{
        ...,
        "lqip": asset->metadata.lqip,
        "aspectRatio": asset->metadata.dimensions.aspectRatio
      },
      altText,
      images,
      tagsV2[]->{name},
      video
    }`,
    { slug }
  )
}

export async function patchPaintingLikes(paintingId: string): Promise<void> {
  await client.patch(paintingId).inc({ likes: 1 }).commit()
}

export async function patchPaintingViews(
  paintingId: string,
  viewerId: string
): Promise<void> {
  await client
    .patch(paintingId)
    .setIfMissing({ views: [] })
    .append('views', [
      { _key: viewerId, viewerId, timestamp: new Date().toISOString() }
    ])
    .commit()
}

export async function getHomePage(): Promise<iSanityHomePage> {
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
        "lqip": asset->metadata.lqip,
        "aspectRatio": asset->metadata.dimensions.aspectRatio
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

export async function getProjects(): Promise<iSanityProject[]> {
  return await client.fetch(
    groq`*[_type == "project" && defined(slug.current)]{..., "slug":slug.current} | order(_createdAt desc)`
  )
}

export async function getProject(slug: string): Promise<iSanityProject> {
  return await client.fetch(
    groq`*[_type == "project" && slug.current == $slug][0]{
      _id,
      title,
      description,
      projectStart,
      projectEnd,
      status,
      content,
      name,
      image{
        ...,
        "lqip": asset->metadata.lqip
      },
      "slug": slug.current
    }`,
    {
      slug
    }
  )
}

export async function getVideos(): Promise<Video[]> {
  return await client.fetch(
    groq`*[_type == "video" && defined(slug.current)]{..., "slug":slug.current} | order(_createdAt desc)`
  )
}

export async function getVideo(slug: string): Promise<Video> {
  return await client.fetch(
    groq`*[_type == "video" && slug.current == $slug][0]{
      _id,
      title,
      url,
      description,
      slug,
      mainImage{
        ...,
        "lqip": asset->metadata.lqip
      },
      thumbnail{
        ...,
        "lqip": asset->metadata.lqip
      }
    }`,
    {
      slug
    }
  )
}

export interface Video {
  _type: 'video'
  _id: string
  title: string
  url: string
  description: string
  slug: Slug
  mainImage: ImageAsset
  thumbnail: ImageAsset
}
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
  image: Image & { lqip?: string; aspectRatio: number }
  images?: Image[]
  imagesCount?: number
  redbubbleUrl?: string | null
  society6Url?: string | null
  artstationUrl?: string | null
  inPrintUrl?: string | null
  description?: string
  seoDescription?: string
  likes: number
  paintedAt: string
  slug: string
  tagsV2: iSanityTag[]
  tagCount?: number | null
  title: string
  video?: string | null
  altText?: string
  isForSale?: boolean
  views: {
    viewerId: string
    timestamp: string
  }[]
  viewsCount: number
}

export interface iSanityTag {
  _id?: string
  name: string
  description?: string | null
}

export interface iSanityPaintingsTag extends iSanityTag {
  paintingsCount: number
}

export interface iSanityProject {
  _id: string
  content: PortableTextBlock[]
  description: string
  image: Image
  name: string
  projectEnd: string
  projectStart: string
  slug: string
  status: string
  title: string
}

export interface iSanityHomePage {
  _id: string
  title: string
  paintingsCount: number
  paintingsDescription: string
  showcasePaintings: iSanityPainting[]
  projectsDescription: string
  showcaseProjects: iSanityProject[]
}
