import type { PortableTextBlock } from '@portabletext/types'
import type { ImageAsset, Slug } from '@sanity/types'
import groq from 'groq'

export const postQuery = groq`*[_type == "post" && slug.current == $slug][0]`

export const postsQuery = groq`*[_type == "post" && defined(slug.current)] | order(_createdAt desc)`

export const paintingQuery = groq`*[_type == "painting" && slug.current == $slug][0]{
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
}`

export interface Post {
  _type: 'post'
  _createdAt: string
  title?: string
  slug: Slug
  excerpt?: string
  mainImage?: ImageAsset
  body: PortableTextBlock[]
}
