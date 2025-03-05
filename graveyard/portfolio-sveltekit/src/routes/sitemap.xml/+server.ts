import { getStaticSlugs } from '$lib/utils/sanity'

const site = 'https://wisihe.no' // change this to reflect your domain
const pages: string[] = [
  '',
  'projects',
  'videos',
  'style',
  'about',
  'contact',
  'paintings',
  '404'
] // populate this with all the slugs you wish to include

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
  const paintingSlugs = await getStaticSlugs('painting')

  const paintings = paintingSlugs.map(slug => {
    return `paintings/${slug.slug}`
  })

  const videoSlugs = await getStaticSlugs('video')

  const videos = videoSlugs.map(slug => {
    return `videos/${slug.slug}`
  })

  const projectSlugs = await getStaticSlugs('project')

  const projects = projectSlugs.map(slug => {
    return `projects/${slug.slug}`
  })
  const allPages = [...pages, ...paintings, ...videos, ...projects]
  const body = sitemap(allPages)
  const response = new Response(body)
  response.headers.set('Cache-Control', 'max-age=0, s-maxage=3600')
  response.headers.set('Content-Type', 'application/xml')
  return response
}

const sitemap = (pages: string[]) => `<?xml version="1.0" encoding="UTF-8" ?>
<urlset
  xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:news="https://www.google.com/schemas/sitemap-news/0.9"
  xmlns:xhtml="https://www.w3.org/1999/xhtml"
  xmlns:mobile="https://www.google.com/schemas/sitemap-mobile/1.0"
  xmlns:image="https://www.google.com/schemas/sitemap-image/1.1"
  xmlns:video="https://www.google.com/schemas/sitemap-video/1.1"
>
  ${pages
    .map(
      page => `
  <url>
    <loc>${site}/${page}</loc>
    <changefreq>daily</changefreq>
    <priority>0.5</priority>
  </url>
  `
    )
    .join('')}
</urlset>`
