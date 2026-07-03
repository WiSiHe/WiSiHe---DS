import { defineQuery } from 'groq';

/** Omit pre-launch / NDA projects from public listings and detail pages. */
const PUBLIC_PROJECT_FILTER = 'coalesce(seo.noIndex, false) != true';

export * from './sanity.types';

export const settingsQuery = defineQuery(`*[_type == "settings"][0]`);

export const aboutQuery = defineQuery(`
  *[_type == "about" && _id == "about"][0] {
    heroTitle,
    heroSubtitle,
    bio,
    jobTitle,
    portrait { ..., "lqip": asset->metadata.lqip },
    seoTitle,
    seoDescription,
    knowsAbout,
    journeyItems[] {
      _key,
      year,
      title,
      content,
      placeName,
      locationType,
      coordinates,
      mapZoom,
      funFact,
      stats[] { label, value },
      image { ..., "lqip": asset->metadata.lqip }
    },
    visitedCountries[] {
      _key,
      country,
      countryCode,
      placeName,
      coordinates,
      notes,
      cities[] {
        _key,
        name,
        coordinates,
        isHighlight,
        notes,
        funFact,
        stats[] { label, value },
        image { ..., "lqip": asset->metadata.lqip },
        place-> {
          _id,
          name,
          kind,
          countryName,
          countryCode,
          coordinates,
          isHighlight,
          funFact,
          notes,
          stats[] { label, value },
          image { ..., "lqip": asset->metadata.lqip }
        }
      }
    },
    adventurePlaces[] {
      _key,
      name,
      placeName,
      coordinates,
      notes,
      funFact,
      stats[] { label, value },
      image { ..., "lqip": asset->metadata.lqip },
      place-> {
        _id,
        name,
        kind,
        countryName,
        countryCode,
        coordinates,
        isHighlight,
        funFact,
        notes,
        stats[] { label, value },
        image { ..., "lqip": asset->metadata.lqip }
      }
    },
    ctaTitle,
    ctaDescription,
    ctaButtonText,
    ctaButtonUrl,
    socialLinks[] { _key, platform, url }
  }
`);

export const aboutTravelPhotographyQuery = defineQuery(`
  *[_type == "photography" && (
    defined(place) ||
    defined(country) && country != "" ||
    defined(countryCode) && countryCode != ""
  )] | order(isFeatured desc, capturedAt desc) {
    _id,
    title,
    "slug": slug.current,
    country,
    countryCode,
    placeName,
    isFeatured,
    capturedAt,
    place-> {
      _id,
      name,
      countryName,
      countryCode
    },
    image {
      ...,
      "lqip": asset->metadata.lqip
    }
  }
`);

export const photographyListQuery = defineQuery(`
  *[_type == "photography" && defined(slug.current) && defined(image)]
  | order(isFeatured desc, capturedAt desc, _updatedAt desc) {
    _id,
    title,
    "slug": slug.current,
    caption,
    isFeatured,
    capturedAt,
    place-> {
      _id,
      name,
      countryName,
      countryCode
    },
    image {
      ...,
      alt,
      "lqip": asset->metadata.lqip,
      "aspectRatio": asset->metadata.dimensions.aspectRatio,
      "width": asset->metadata.dimensions.width,
      "height": asset->metadata.dimensions.height
    }
  }
`);

export const photographyQuery = defineQuery(`
  *[_type == "photography" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    caption,
    capturedAt,
    camera,
    isFeatured,
    "likesCount": count(likes),
    viewsCount,
    place-> {
      _id,
      name,
      countryName,
      countryCode,
      kind,
      coordinates
    },
    tagsV2[]->{ _id, name },
    image {
      ...,
      alt,
      "lqip": asset->metadata.lqip,
      "blurhash": asset->metadata.blurhash,
      "aspectRatio": asset->metadata.dimensions.aspectRatio,
      "width": asset->metadata.dimensions.width,
      "height": asset->metadata.dimensions.height,
      "hasAlpha": asset->metadata.hasAlpha,
      "isOpaque": asset->metadata.isOpaque,
      "palette": asset->metadata.palette,
      "location": asset->metadata.location,
      "exif": asset->metadata.exif,
      "mimeType": asset->mimeType,
      "fileSize": asset->size,
      "originalFilename": asset->originalFilename
    }
  }
`);

export const photographySlugs = defineQuery(`
  *[_type == "photography" && defined(slug.current)]{ "slug": slug.current }
`);

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
    "seo": {
      "title": coalesce(seo.title, title, ""),
      "description": coalesce(seo.description, seoDescription, ""),
      "image": coalesce(seo.image, image),
      "noIndex": seo.noIndex == true
    },
    format,
    medium,
    isFeatured,
    isFanArt,
    isNSFW,
    isForSale,
    "likesCount": count(likes),
    viewsCount,
    paintedAt,
    format,
    redbubbleUrl,
    gelatoUrl,
    image{
      ...,
      "lqip": asset->metadata.lqip,
      "blurhash": asset->metadata.blurhash,
      "aspectRatio": asset->metadata.dimensions.aspectRatio,
      "width": asset->metadata.dimensions.width,
      "height": asset->metadata.dimensions.height,
      "hasAlpha": asset->metadata.hasAlpha,
      "isOpaque": asset->metadata.isOpaque,
      "altText": altText,
      "palette": asset->metadata.palette
    },
    "images": coalesce(
      images[]{
        ...,
        "lqip": asset->metadata.lqip,
        "blurhash": asset->metadata.blurhash,
        "aspectRatio": asset->metadata.dimensions.aspectRatio,
        "width": asset->metadata.dimensions.width,
        "height": asset->metadata.dimensions.height,
        "hasAlpha": asset->metadata.hasAlpha,
        "isOpaque": asset->metadata.isOpaque,
        "altText": altText,
        "palette": asset->metadata.palette
      },
      []
    ),
    tagsV2[]->{name},
    video
  }
`);

export const projectQuery = defineQuery(`
  *[_type == "project" && slug.current == $slug && ${PUBLIC_PROJECT_FILTER}][0] {
    ...,
    "slug": slug.current,
    "likesCount": count(likes),
    viewsCount,
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
      "lqip": asset->metadata.lqip,
      "aspectRatio": asset->metadata.dimensions.aspectRatio
    },
    "extraImages": extraImages[]{
      ...,
      "lqip": asset->metadata.lqip,
      "aspectRatio": asset->metadata.dimensions.aspectRatio
    },
    "seo": {
      "title": coalesce(seo.title, name, ""),
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
  *[_type == "project" && defined(slug.current) && ${PUBLIC_PROJECT_FILTER}]
  {"slug": slug.current}
`);

export const pagesSlugs = defineQuery(`
  *[_type == "page" && defined(slug.current)]
  {"slug": slug.current}
`);

export const homeSectionCopyQuery = defineQuery(`
  *[_type == "home"][0]{
    title,
    "overview": sections[_type == "homeHeroSection"][0].overview,
    paintingsTitle,
    paintingsDescription,
    projectsTitle,
    projectsListingDescription,
  }
`);

export const homePageQuery = defineQuery(`
  *[_type == "home"][0]{
    _id,
    title,
    paintingsTitle,
    projectsTitle,
    paintingsDescription,
    projectsListingDescription,
    "paintingsCount": count(*[_type == "painting"]),
    "overview": sections[_type == "homeHeroSection"][0].overview,
    sections[]{
      _key,
      _type,
      _type == "homeHeroSection" => {
        overview
      },
      _type == "homeProjectsSection" => {
        description,
        showcaseProjects[]->{
          _type,
          _id,
          description,
          seoDescription,
          projectStart,
          projectEnd,
          status,
          content,
          "seo": {
            "title": coalesce(seo.title, name, ""),
            "description": coalesce(seo.description, ""),
            "image": seo.image,
            "noIndex": seo.noIndex == true
          },
          name,
          client,
          "tags": tags[]->{name},
          "slug": slug.current,
          image{
            ...,
            "lqip": asset->metadata.lqip,
            "aspectRatio": asset->metadata.dimensions.aspectRatio
          }
        }
      },
      _type == "homePaintingsSection" => {
        description,
        "showcasePaintingsCurated": count(showcasePaintings) > 0,
        "showcasePaintings": coalesce(
          showcasePaintings[]->{
            _type, _id, altText,
            "slug": slug.current,
            title, format, isFeatured, isNSFW, medium, paintedAt,
            tagsV2[]->{name},
            image{ ..., "lqip": asset->metadata.lqip, "aspectRatio": asset->metadata.dimensions.aspectRatio, "palette": asset->metadata.palette }
          },
          *[_type == "painting" && defined(slug.current) && isNSFW != true && defined(image.asset)] | order(paintedAt desc) [0...20] {
            _type, _id, altText,
            "slug": slug.current,
            title, format, isFeatured, isNSFW, medium, paintedAt,
            tagsV2[]->{name},
            image{ ..., "lqip": asset->metadata.lqip, "aspectRatio": asset->metadata.dimensions.aspectRatio, "palette": asset->metadata.palette }
          }
        )
      },
      _type == "homeAboutTeaserSection" => {
        eyebrow,
        title,
        description,
        primaryLabel,
        secondaryLabel,
        journeyEyebrow,
        journeyLinkLabel
      },
      _type == "homeVideosTeaserSection" => {
        intro {
          eyebrow,
          title,
          description,
          linkLabel
        }
      },
      _type == "homeShopTeaserSection" => {
        intro {
          eyebrow,
          title,
          description,
          linkLabel
        }
      },
      _type == "homeSkillsSection" => {
        eyebrow,
        title
      },
      _type == "homeContactCtaSection" => {
        eyebrow,
        title,
        description,
        primaryLabel,
        primaryUrl,
        secondaryLabel,
        secondaryUrl
      }
    }
  }
`);

export const homeExtrasQuery = defineQuery(`{
  "videos": *[_type == "video" && defined(slug.current)]
    | order(featured desc, coalesce(date, _updatedAt) desc) [0...3] {
      _id,
      "slug": slug.current,
      title,
      "featured": featured == true,
      description,
      tags[]->{name},
      thumbnail {
        ...,
        "lqip": asset->metadata.lqip
      }
    },
  "forSalePaintings": *[_type == "painting" && defined(slug.current) && isNSFW != true && (
      isForSale == true || defined(redbubbleUrl) || defined(gelatoUrl)
    )] | order(paintedAt desc) [0...3] {
      _id,
      "slug": slug.current,
      title,
      isForSale,
      redbubbleUrl,
      gelatoUrl,
      tagsV2[]->{name},
      paintedAt,
      image {
        ...,
        "lqip": asset->metadata.lqip,
        "aspectRatio": asset->metadata.dimensions.aspectRatio
      }
    },
  "forSalePaintingsCount": count(*[_type == "painting" && defined(slug.current) && isNSFW != true && (
      isForSale == true || defined(redbubbleUrl) || defined(gelatoUrl)
    )])
}`);

export const getAllPaintingsandTags = defineQuery(`
  {
    "paintings": *[_type == "painting" && defined(slug.current)]
      {
        _id,
        "slug": slug.current,
        title,
        medium,
        isFeatured,
        isFanArt,
        isNSFW,
        isForSale,
        tagsV2[]->{name},
        viewsCount,
        paintedAt,
        video,
        "imagesCount": coalesce(count(images), 0),
        image {
          ...,
          "lqip": asset->metadata.lqip,
          "aspectRatio": asset->metadata.dimensions.aspectRatio,
          "palette": asset->metadata.palette
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
  | order(isFeatured desc, paintedAt desc, _updatedAt desc) [$start...$end] {
    _id,
    "slug": slug.current,
    title,
    medium,
    isFeatured,
    isFanArt,
    isNSFW,
    isForSale,
    tagsV2[]->{name},
    viewsCount,
    paintedAt,
    video,
    "imagesCount": coalesce(count(images), 0),
    image {
      ...,
      "lqip": asset->metadata.lqip,
      "aspectRatio": asset->metadata.dimensions.aspectRatio,
      "palette": asset->metadata.palette
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
  | order(isFeatured desc, paintedAt desc, _updatedAt desc) [$start...$end] {
    _id,
    "slug": slug.current,
    title,
    medium,
    isFeatured,
    isFanArt,
    isNSFW,
    isForSale,
    tagsV2[]->{name},
    viewsCount,
    paintedAt,
    video,
    "imagesCount": coalesce(count(images), 0),
    image {
      ...,
      "lqip": asset->metadata.lqip,
      "aspectRatio": asset->metadata.dimensions.aspectRatio,
      "palette": asset->metadata.palette
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
      "ongoingProjects": *[_type == "project" && defined(slug.current) && ${PUBLIC_PROJECT_FILTER} && status in ["inProgress", "onHold", "notStarted", "planned"] && coalesce(excludeFromOngoingSpotlight, false) != true]
        | order(projectStart desc) {
          _id,
          "slug": slug.current,
          "seoDescription": coalesce(seo.description, ""),
          projectType,
          projectStart,
          projectEnd,
          status,
          name,
          client,
          summary,
          "tags": tags[]->{name},
          image {
            ...,
            "lqip": asset->metadata.lqip
          }
        },
      "pastProjects": *[_type == "project" && defined(slug.current) && ${PUBLIC_PROJECT_FILTER} && (
          (status in ["completed", "cancelled", "abandoned"] && defined(projectEnd))
          || (status in ["inProgress", "onHold", "notStarted", "planned"] && excludeFromOngoingSpotlight == true)
        )]
        | order(coalesce(projectEnd, projectStart) desc) {
          _id,
          "slug": slug.current,
          "seoDescription": coalesce(seo.description, ""),
          projectType,
          projectStart,
          projectEnd,
          status,
          name,
          client,
          summary,
          "tags": tags[]->{name},
          image {
            ...,
            "lqip": asset->metadata.lqip
          }
        },
      "tags": *[
        _type == "tag" &&
        count(*[_type == "project" && references(^._id) && ${PUBLIC_PROJECT_FILTER}]) > 0
      ]
      | order(isFeatured desc, count(*[_type == "project" && references(^._id) && ${PUBLIC_PROJECT_FILTER}]) desc, name asc) {
        _id,
        name,
        isFeatured,
        "count": count(*[_type == "project" && references(^._id) && ${PUBLIC_PROJECT_FILTER}]),
        "projectsCount": count(*[_type == "project" && references(^._id) && ${PUBLIC_PROJECT_FILTER}])
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

export const videoBySlugQuery = defineQuery(`
  *[_type == "video" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    description,
    "seo": {
      "title": coalesce(seo.title, title, ""),
      "description": coalesce(seo.description, description, ""),
      "image": coalesce(seo.image, thumbnail),
      "noIndex": seo.noIndex == true
    },
    videoUrl,
    "featured": featured == true,
    "viewsCount": coalesce(viewsCount, 0),
    "likesCount": count(likes),
    "linkedPainting": coalesce(linkedPainting->{
      _id,
      "slug": slug.current,
      title,
      description,
      image{
        ...,
        "lqip": asset->metadata.lqip,
        "aspectRatio": asset->metadata.dimensions.aspectRatio
      }
    }, null),
    tags[]->{name},
    thumbnail {
      ...,
      "lqip": asset->metadata.lqip
    }
  }
`);

export const videosSlugs = defineQuery(`
  *[_type == "video" && defined(slug.current)] { "slug": slug.current }
`);

export const generateStaticSlugs = defineQuery(`
  *[
    _type == $type
    && defined(slug.current)
    && coalesce(seo.noIndex, false) != true
    && !(_type == "painting" && isNSFW == true)
  ]{
    "slug": slug.current,
    _updatedAt
  }
`);

export const indexableContentSlugs = defineQuery(`
  *[
    _type in ["painting", "project", "recipe", "video", "presentation", "photography"]
    && defined(slug.current)
    && coalesce(seo.noIndex, false) != true
    && !(_type == "painting" && isNSFW == true)
  ]{
    _type,
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
  *[_type == "recipe" && defined(slug.current) && (language == "en" || !defined(language))]
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
    averageRating,
    ratingCount,
    nutrition {
      calories,
      protein,
      carbohydrates,
      fat,
      fiber,
      sugar,
      sodium,
      notes
    },
    tags[]->{name}
  }
`);

export const getRecipe = defineQuery(`
  *[_type == "recipe" && slug.current == $slug && (language == "en" || !defined(language))][0] {
    _id,
    language,
    "slug": slug.current,
    title,
    description,
    story,
    _updatedAt,
    "seo": {
      "title": coalesce(seo.title, title, ""),
      "description": coalesce(seo.description, description, ""),
      "image": seo.image,
      "noIndex": seo.noIndex == true
    },
    mainImage {
      ...,
      "lqip": asset->metadata.lqip,
      "aspectRatio": asset->metadata.dimensions.aspectRatio
    },
    additionalImages[] {
      ...,
      "lqip": asset->metadata.lqip,
      "aspectRatio": asset->metadata.dimensions.aspectRatio
    },
    ingredientCategories[]{
      categoryName,
      ingredients[]{
        "ingredient": ingredient->name,
        "photo": ingredient->photo {
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
    recipeCategory,
    recipeCuisine,
    publishedAt,
    viewsCount,
    averageRating,
    ratingCount,
    nutrition {
      calories,
      protein,
      carbohydrates,
      fat,
      fiber,
      sugar,
      sodium,
      notes
    },
    tags[]->{name}
  }
`);

export const getRecipeSlugs = defineQuery(`
  *[_type == "recipe" && defined(slug.current) && (language == "en" || !defined(language))]
  {"slug": slug.current}
`);

/** Home / featured paintings pool: newest first, capped; excludes NSFW-tagged works (same tag name as `PaintingCard` / `cleanTagName` + `'NSFW'`). */
export const randomPaintingsQuery = defineQuery(`
  *[
    _type == "painting" &&
    defined(slug.current) &&
    defined(image) &&
    isNSFW != true
  ] | order(_createdAt desc) [0...50] {
    _id,
    title,
    "slug": slug.current,
    isFeatured,
    tagsV2[]->{name},
    image{
      ...,
      "lqip": asset->metadata.lqip,
      "aspectRatio": asset->metadata.dimensions.aspectRatio,
      "palette": asset->metadata.palette
    }
  }
`);

export const presentationQuery = defineQuery(`
  *[_type == "presentation" && slug.current == $slug][0] {
    _id,
    title,
    description,
    "slug": slug.current,
    noIndex,
    tldr,
    tldrPosition,
    "seo": {
      "title": coalesce(seo.title, title, ""),
      "description": coalesce(seo.description, description, ""),
      "image": seo.image,
      "noIndex": seo.noIndex == true
    },
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
  *[_type == "presentation" && defined(slug.current)] | order(_createdAt desc) {
    _id,
    title,
    description,
    "slug": slug.current,
    "slidesCount": count(slides),
    _createdAt,
    tags[]->{
      _id,
      name
    },
    "coverImage": coalesce(
      slides[_type == "titleSlide" && media.mediaType == "image"][0].media.image {
        ...,
        alt,
        "lqip": asset->metadata.lqip,
        "aspectRatio": asset->metadata.dimensions.aspectRatio
      },
      slides[_type == "contentSlide" && media.mediaType == "image"][0].media.image {
        ...,
        alt,
        "lqip": asset->metadata.lqip,
        "aspectRatio": asset->metadata.dimensions.aspectRatio
      },
      null
    )
  }
`);

export const presentationSlugsQuery = defineQuery(`
  *[_type == "presentation" && defined(slug.current)] { "slug": slug.current }
`);
export const getPaginatedProjects = defineQuery(`
  *[_type == "project" && defined(slug.current) && ${PUBLIC_PROJECT_FILTER}]
  | order(projectStart desc, _updatedAt desc) [$start...$end] {
    _id,
    "slug": slug.current,
    description,
    seoDescription,
    projectType,
    projectStart,
    projectEnd,
    status,
    content,
    name,
    client,
    "tags": tags[]->{name},
    image {
      ...,
      "lqip": asset->metadata.lqip
    }
  }
`);

export const getProjectsCount = defineQuery(`
  count(*[_type == "project" && defined(slug.current) && ${PUBLIC_PROJECT_FILTER}])
`);

export * from './sanity.types';
