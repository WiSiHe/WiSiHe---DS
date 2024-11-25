import { defineQuery } from 'next-sanity';

export const settingsQuery = defineQuery(`*[_type == "settings"][0]`);

const postFields = /* groq */ `
  _id,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "title": coalesce(title, "Untitled"),
  "slug": slug.current,
  excerpt,
  coverImage,
  "date": coalesce(date, _updatedAt),
  "author": author->{firstName, lastName, picture},
`;

const linkFields = /* groq */ `
  link {
      ...,
      _type == "link" => {
        "page": page->slug.current,
        "post": post->slug.current
        }
      }
`;

// const showCasePaintingFields = /* groq */ `
//     showcasePaintings[]->{
//       _type,
//       _id,
//       altText,
//       "slug": slug.current,
//       title,
//       format,
//       image{
//         ...,
//         "lqip": asset->metadata.lqip,
//         "aspectRatio": asset->metadata.dimensions.aspectRatio
//       }
//     },
// `;

export const getPageQuery = defineQuery(`
  *[_type == 'page' && slug.current == $slug][0]{
    _id,
    name,
    slug,
    heading,
    subheading,
    "pageBuilder": pageBuilder[]{
      ...,
      _type == "callToAction" => {
        ...,
        ${linkFields},
      }
    },
  }
`);

export const allPostsQuery = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(date desc, _updatedAt desc) {
    ${postFields}
  }
`);

export const allPaintingsQuery = defineQuery(`
    *[_type == "painting" && defined(slug.current)] | order(date desc, _updatedAt desc) {
        _id,
        title,
        slug,
        image,
        "date": coalesce(date, _updatedAt),
    }
    `);

export const morePostsQuery = defineQuery(`
  *[_type == "post" && _id != $skip && defined(slug.current)] | order(date desc, _updatedAt desc) [0...$limit] {
    ${postFields}
  }
`);

export const postQuery = defineQuery(`
  *[_type == "post" && slug.current == $slug] [0] {
    content[]{
    ...,
    markDefs[]{
      ...,
      ${linkFields}
    }
  },
    ${postFields}
  }
`);

export const paintingQuery = defineQuery(`
  *[_type == "painting" && slug.current == $slug][0] {
    _id,
    title,
    'slug': slug.current,
    description,
    seoDescription,
    format,
    "likesCount": count(likes),
    "viewsCount": count(views),
    paintedAt,
    artstationUrl,
    format,
    redbubbleUrl,
    society6Url,
    inPrintUrl,
    image{
      ...,
      "lqip": asset->metadata.lqip,
      "aspectRatio": asset->metadata.dimensions.aspectRatio,
      "altText": altText
    },
    "images": coalesce(
      images[]{
        ...,
        "lqip": asset->metadata.lqip,
        "aspectRatio": asset->metadata.dimensions.aspectRatio,
        "altText": altText
      },
      []
    ),
    tagsV2[]->{name},
    video
  }
`);

export const projectQuery = defineQuery(`
  *[_type == "project" && slug.current == $slug][0] {
    ...,
    "slug": slug.current,
    tags[]->{
      "name": coalesce(name, "")
    },
    "connectedPage": coalesce(connectedPage.current, ""),
    connectedVideo->{
      "videoUrl": videoUrl
    },
    "connectedPaintings": coalesce(
      connectedPaintings[]->{
        "title": coalesce(title, ""),
        "slug": coalesce(slug.current, ""),
        "format": coalesce(format, ""),
        "image": coalesce(image, null)
      },
      []
    ),
    "image": image{
      ...,
      "lqip": asset->metadata.lqip
    }
  }
`);

export const postPagesSlugs = defineQuery(`
  *[_type == "post" && defined(slug.current)]
  {"slug": slug.current}
`);

export const paintingsSlugs = defineQuery(`
  *[_type == "painting" && defined(slug.current)]
  {"slug": slug.current}
`);

export const projectsSlugs = defineQuery(`
  *[_type == "project" && defined(slug.current)]
  {"slug": slug.current}
`);

export const pagesSlugs = defineQuery(`
  *[_type == "page" && defined(slug.current)]
  {"slug": slug.current}
`);

export const homePageQuery = defineQuery(`
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
      tagsV2[]->{name},
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
      seoDescription,
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
`);

export const getAllPaintingsandTags = defineQuery(`
    {
      "paintings": *[_type == "painting" && defined(slug.current)] | order(date desc, _updatedAt desc) {
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
      },
      "tags": *[_type == "tag"] | order(name asc) { _id, name, "paintingsCount": count(*[_type == "painting" && references(^._id)].title)}
    }
    `);

export const getAllProjects = defineQuery(`
    {
      "projects": *[_type == "project" && defined(slug.current)] | order(projectStart desc, _updatedAt desc) {
        _id,
        "slug":slug.current,
        title,
        description,
        seoDescription,
        projectStart,
        projectEnd,
        status,
        content,
        name,
        image{
          ...,
          "lqip": asset->metadata.lqip
        },
      },
    }
    `);
