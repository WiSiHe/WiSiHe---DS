import {
  defineDocuments,
  defineLocations,
  type PresentationPluginOptions,
} from 'sanity/presentation';

type SlugDoc = {
  title?: string | null;
  name?: string | null;
  slug?: string | null;
};

function slugLocations(
  doc: SlugDoc | null,
  basePath: string,
  index: { title: string; href: string },
) {
  const label = doc?.title || doc?.name || 'Untitled';
  const locations = [{ title: index.title, href: index.href }];

  if (doc?.slug) {
    locations.unshift({ title: label, href: `${basePath}/${doc.slug}` });
  }

  return { locations };
}

export const presentationResolve: PresentationPluginOptions['resolve'] = {
  mainDocuments: defineDocuments([
    {
      route: '/',
      filter: `_type == "home" && _id == "home"`,
    },
    {
      route: '/about',
      filter: `_type == "about" && _id == "about"`,
    },
    {
      route: '/paintings/:slug',
      filter: `_type == "painting" && slug.current == $slug`,
    },
    {
      route: '/projects/:slug',
      filter: `_type == "project" && slug.current == $slug`,
    },
    {
      route: '/recipes/:slug',
      filter: `_type == "recipe" && slug.current == $slug`,
    },
    {
      route: '/videos/:slug',
      filter: `_type == "video" && slug.current == $slug`,
    },
    {
      route: '/presentations/:slug',
      filter: `_type == "presentation" && slug.current == $slug`,
    },
  ]),

  locations: {
    home: defineLocations({
      select: { title: 'title' },
      resolve: doc => ({
        locations: [{ title: doc?.title || 'Front page', href: '/' }],
      }),
    }),

    about: defineLocations({
      select: { title: 'heroTitle' },
      resolve: doc => ({
        locations: [
          { title: doc?.title || 'About', href: '/about' },
          { title: 'Contact', href: '/contact' },
        ],
      }),
    }),

    settings: defineLocations({
      select: { title: 'title' },
      resolve: doc => ({
        locations: [{ title: doc?.title || 'Site settings', href: '/' }],
      }),
    }),

    painting: defineLocations({
      select: { title: 'title', slug: 'slug.current' },
      resolve: doc =>
        slugLocations(doc, '/paintings', { title: 'Paintings gallery', href: '/paintings' }),
    }),

    project: defineLocations({
      select: { title: 'name', slug: 'slug.current' },
      resolve: doc => slugLocations(doc, '/projects', { title: 'Projects', href: '/projects' }),
    }),

    recipe: defineLocations({
      select: { title: 'title', slug: 'slug.current' },
      resolve: doc => slugLocations(doc, '/recipes', { title: 'Recipes', href: '/recipes' }),
    }),

    video: defineLocations({
      select: { title: 'title', slug: 'slug.current' },
      resolve: doc => slugLocations(doc, '/videos', { title: 'Videos', href: '/videos' }),
    }),

    presentation: defineLocations({
      select: { title: 'title', slug: 'slug.current' },
      resolve: doc =>
        slugLocations(doc, '/presentations', {
          title: 'Presentations',
          href: '/presentations',
        }),
    }),

    post: defineLocations({
      select: { title: 'title', slug: 'slug.current' },
      resolve: doc => slugLocations(doc, '/posts', { title: 'Blog', href: '/posts' }),
    }),

    tag: defineLocations({
      select: { title: 'name', slug: 'slug.current' },
      resolve: doc => {
        if (!doc?.slug) return { locations: [] };
        return {
          locations: [
            {
              title: doc.title || 'Tag',
              href: `/paintings?tag=${doc.slug}`,
            },
            { title: 'Paintings gallery', href: '/paintings' },
          ],
        };
      },
    }),
  },
};
