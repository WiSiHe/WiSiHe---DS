import { defineQuery } from 'groq';

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
    "views": select(defined(views) => views[]{ viewerId, timestamp }, []), // Using select to handle undefined views
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
    "connectedPage": coalesce(connectedPage, ""),
    "type": coalesce(projectType, ""),
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
    },
    "seo": {
      "title": coalesce(seo.title, title, ""),
      "description": coalesce(seo.description,  ""),
      "image": seo.image,
      "noIndex": seo.noIndex == true
    },
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
      "seo": {
        "title": coalesce(seo.title, title, ""),
        "description": coalesce(seo.description,  ""),
        "image": seo.image,
        "noIndex": seo.noIndex == true
      },
      name,
      "tags": tags[]->{name},
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
    "paintings": *[_type == "painting" && defined(slug.current)]
      {
        _id,
        "slug": slug.current,
        title,
        tagsV2[]->{name},
        "viewsCount": count(views),
        paintedAt,
        video,
        "imagesCount": coalesce(count(images), 0),
        "isForSale": defined(redbubbleUrl) || defined(society6Url) || defined(artstationUrl) || defined(inPrintUrl),
        image {
          ...,
          "lqip": asset->metadata.lqip,
          "aspectRatio": asset->metadata.dimensions.aspectRatio
        }
      },
    "tags": *[
      _type == "tag" &&
      count(*[_type == "painting" && references(^._id)]) > 0
    ]
    | order(name asc) {
      _id,
      name,
      "paintingsCount": count(*[_type == "painting" && references(^._id)].title)
    }
  }
  `);

export const getPaginatedPaintings = defineQuery(`
  *[_type == "painting" && defined(slug.current)]
  | order(paintedAt desc, _updatedAt desc) [$start...$end] {
    _id,
    "slug": slug.current,
    title,
    tagsV2[]->{name},
    "viewsCount": count(views),
    paintedAt,
    video,
    "imagesCount": coalesce(count(images), 0),
    "isForSale": defined(redbubbleUrl) || defined(society6Url) || defined(artstationUrl) || defined(inPrintUrl),
    image {
      ...,
      "lqip": asset->metadata.lqip,
      "aspectRatio": asset->metadata.dimensions.aspectRatio
    }
  }
`);

export const getPaintingsCount = defineQuery(`
  count(*[_type == "painting" && defined(slug.current)])
`);

export const getFilteredPaginatedPaintings = defineQuery(`
  *[_type == "painting" && defined(slug.current) && (
    ($filter0 == "" || $filter0 in tagsV2[]->name)
    && ($filter1 == "" || $filter1 in tagsV2[]->name)
    && ($filter2 == "" || $filter2 in tagsV2[]->name)
    && ($filter3 == "" || $filter3 in tagsV2[]->name)
    && ($filter4 == "" || $filter4 in tagsV2[]->name)
  )]
  | order(paintedAt desc, _updatedAt desc) [$start...$end] {
    _id,
    "slug": slug.current,
    title,
    tagsV2[]->{name},
    "viewsCount": count(views),
    paintedAt,
    video,
    "imagesCount": coalesce(count(images), 0),
    "isForSale": defined(redbubbleUrl) || defined(society6Url) || defined(artstationUrl) || defined(inPrintUrl),
    image {
      ...,
      "lqip": asset->metadata.lqip,
      "aspectRatio": asset->metadata.dimensions.aspectRatio
    }
  }
`);

export const getFilteredPaintingsCount = defineQuery(`
  count(*[_type == "painting" && defined(slug.current) && (
    ($filter0 == "" || $filter0 in tagsV2[]->name)
    && ($filter1 == "" || $filter1 in tagsV2[]->name)
    && ($filter2 == "" || $filter2 in tagsV2[]->name)
    && ($filter3 == "" || $filter3 in tagsV2[]->name)
    && ($filter4 == "" || $filter4 in tagsV2[]->name)
  )])
`);

export const getAllProjects = defineQuery(`
    {
      "ongoingProjects": *[_type == "project" && defined(slug.current) && status in ["inProgress", "onHold", "notStarted", "planned"]]
        | order(projectStart desc) {
          _id,
          "slug": slug.current,
          title,
          description,
          seoDescription,
          projectType,
          projectStart,
          projectEnd,
          status,
          content,
          name,
          "tags": tags[]->{name},
          image {
            ...,
            "lqip": asset->metadata.lqip
          }
        },
      "pastProjects": *[_type == "project" && defined(slug.current) && status in ["completed", "cancelled", "abandoned"] && defined(projectEnd)]
        | order(projectEnd desc) {
          _id,
          "slug": slug.current,
          title,
          description,
          seoDescription,
          projectType,
          projectStart,
          projectEnd,
          status,
          content,
          name,
          "tags": tags[]->{name},
          image {
            ...,
            "lqip": asset->metadata.lqip
          }
        },
      "tags": *[
        _type == "tag" &&
        count(*[_type == "project" && references(^._id)]) > 0
      ]
      | order(count(*[_type == "project" && references(^._id)]) desc, name asc) {
        _id,
        name,
        "count": count(*[_type == "project" && references(^._id)]),
        "projectsCount": count(*[_type == "project" && references(^._id)])
      }
    }
    `);

export const getAllVideos = defineQuery(`
      {
        "videos": *[_type == "video" && defined(slug.current)]
        | order(date desc, _updatedAt desc) {
          _id,
          "slug": slug.current,
          title,
          "featured": featured == true,
          description,
          videoUrl,
          "linkedPainting": coalesce(linkedPainting->{
            _id,
            "slug": slug.current,
            title,
            image{
              ...,
              "lqip": asset->metadata.lqip
            }
          }, null),
          tags[]->{name},
          thumbnail {
            ...,
            "lqip": asset->metadata.lqip
          }
        }
      }
    `);

export const generateStaticSlugs = defineQuery(`
  *[_type == $type && defined(slug.current)]{
    "slug": slug.current,
    _updatedAt
  }
`);

export const REDIRECTS_QUERY = defineQuery(`
  *[_type == "redirect" && isEnabled == true] {
      source,
      destination,
      permanent
  }
`);

export const OG_IMAGE_QUERY = defineQuery(`
  *[_id == $id][0]{
    title,
    image {
      ...,
      "palette": asset->metadata.palette,
    },
  }
`);

export const SITEMAP_QUERY = defineQuery(`
  *[_type in ["page", "post"] && defined(slug.current)] {
      "href": select(
        _type == "page" => "/" + slug.current,
        _type == "post" => "/posts/" + slug.current,
        slug.current
      ),
      _updatedAt
  }
  `);

export const getAllRecipes = defineQuery(`
  *[_type == "recipe" && defined(slug.current)]
  | order(publishedAt desc, _updatedAt desc) {
    _id,
    "slug": slug.current,
    title,
    description,
    mainImage {
      ...,
      "lqip": asset->metadata.lqip,
      "aspectRatio": asset->metadata.dimensions.aspectRatio
    },
    cookingTime,
    prepTime,
    totalTime,
    servings,
    difficulty,
    publishedAt,
    tags[]->{name}
  }
`);

export const getRecipe = defineQuery(`
  *[_type == "recipe" && slug.current == $slug][0] {
    _id,
    "slug": slug.current,
    title,
    description,
    mainImage {
      ...,
      "lqip": asset->metadata.lqip,
      "aspectRatio": asset->metadata.dimensions.aspectRatio
    },
    ingredientCategories[]{
      categoryName,
              ingredients[]{
          ingredient,
          photo {
            ...,
            "lqip": asset->metadata.lqip,
            "aspectRatio": asset->metadata.dimensions.aspectRatio
          },
          amount,
          unit,
          isDiscrete,
          notes
        }
    },
    instructions[]{
      title,
      content
    },
    tips[]{
      title,
      content,
      icon
    },
    cookingTime,
    prepTime,
    totalTime,
    servings,
    difficulty,
    publishedAt,
    tags[]->{name}
  }
`);

export const getRecipeSlugs = defineQuery(`
  *[_type == "recipe" && defined(slug.current)]
  {"slug": slug.current}
`);

export const randomPaintingsQuery = defineQuery(`
  *[_type == "painting" && defined(slug.current) && defined(image)] | order(_createdAt desc) [0...50] {
    _id,
    title,
    "slug": slug.current,
    tagsV2[]->{name},
    image{
      ...,
      "lqip": asset->metadata.lqip,
      "aspectRatio": asset->metadata.dimensions.aspectRatio
    }
  }
`);

export const presentationQuery = defineQuery(`
  *[_type == "presentation" && slug.current == $slug][0] {
    _id,
    title,
    description,
    "slug": slug.current,
    tags[]->{
      _id,
      name
    },
    slides[] {
      _type,
      status,
      _type == "contentSlide" => {
        title,
        subtitle,
        content,
        slideDesign,
        media {
          mediaType,
          mediaType == "image" => {
            image {
              ...,
              "url": asset->url,
              "lqip": asset->metadata.lqip,
              "aspectRatio": asset->metadata.dimensions.aspectRatio,
              alt
            },
            imageAspectRatio
          },
          mediaType == "video" => {
            videoUrl
          },
          mediaType == "iframe" => {
            iframeUrl,
            iframeAspectRatio
          },
          mediaType == "numbers" => {
            metrics[] {
              label,
              value,
              description,
              color
            }
          },
          mediaType == "graph" => {
            chartType
          },
          mediaType == "custom" => {
            componentName,
            componentProps
          }
        },
        category->{
          _id,
          name,
          description,
          color
        },
        sources[] {
          text,
          url
        },
        tools[] {
          name,
          description,
          url,
          category,
          workshopUrl,
          nerdLevel
        },
        examples[] {
          name,
          description,
          image {
            ...,
            "url": asset->url,
            "lqip": asset->metadata.lqip,
            "aspectRatio": asset->metadata.dimensions.aspectRatio
          },
          iframe,
          url
        }
      },
      _type == "titleSlide" => {
        title,
        subtitle,
        slideDesign,
        media {
          mediaType,
          mediaType == "image" => {
            image {
              ...,
              "url": asset->url,
              "lqip": asset->metadata.lqip,
              "aspectRatio": asset->metadata.dimensions.aspectRatio,
              alt
            },
            imageAspectRatio
          },
          mediaType == "video" => {
            videoUrl
          },
          mediaType == "iframe" => {
            iframeUrl,
            iframeAspectRatio
          },
          mediaType == "numbers" => {
            metrics[] {
              label,
              value,
              description,
              color
            }
          },
          mediaType == "graph" => {
            chartType
          },
          mediaType == "custom" => {
            componentName,
            componentProps
          }
        }
      },
      _type == "separatorSlide" => {
        title,
        slideDesign,
        category->{
          _id,
          name,
          description,
          color
        }
      }
    }
  }
`);

export const allPresentationsQuery = defineQuery(`
  *[_type == "presentation"] | order(_createdAt desc) {
    _id,
    title,
    description,
    "slug": slug.current,
    "slidesCount": count(slides),
    tags[]->{
      _id,
      name
    }
  }
`);
export const getPaginatedProjects = defineQuery(`
  *[_type == "project" && defined(slug.current)]
  | order(projectStart desc, _updatedAt desc) [$start...$end] {
    _id,
    "slug": slug.current,
    title,
    description,
    seoDescription,
    projectType,
    projectStart,
    projectEnd,
    status,
    content,
    name,
    "tags": tags[]->{name},
    image {
      ...,
      "lqip": asset->metadata.lqip
    }
  }
`);

export const getProjectsCount = defineQuery(`
  count(*[_type == "project" && defined(slug.current)])
`);

export * from './sanity.types';
