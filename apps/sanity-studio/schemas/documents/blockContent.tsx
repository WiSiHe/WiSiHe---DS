import { defineArrayMember, defineType, defineField, ValidationContext } from 'sanity';

/**
 * This is the schema definition for the rich text fields used for
 * for this blog studio. When you import it in schemas.js it can be
 * reused in other parts of the studio with:
 *  {
 *    name: 'someName',
 *    title: 'Some title',
 *    type: 'blockContent'
 *  }
 *
 * Learn more: https://www.sanity.io/docs/block-content
 */
export default defineType({
  title: 'Block Content',
  name: 'blockContent',
  type: 'array',
  of: [
    defineArrayMember({
      title: 'Block',
      type: 'block',
      // Styles let you set what your user can mark up blocks with. These
      // correspond with HTML tags, but you can set any title or value
      // you want and decide how you want to deal with it where you want to
      // use your content.
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'H1', value: 'h1' },
        { title: 'H2', value: 'h2' },
        { title: 'H3', value: 'h3' },
        { title: 'H4', value: 'h4' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [{ title: 'Bullet', value: 'bullet' }],
      marks: {
        // Decorators usually describe a single property – e.g. a typographic
        // preference or highlighting by editors.
        decorators: [
          { title: 'Strong', value: 'strong' },
          { title: 'Emphasis', value: 'em' },
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [
              defineField({
                name: 'linkType',
                title: 'Link Type',
                type: 'string',
                initialValue: 'href',
                options: {
                  list: [
                    { title: 'URL', value: 'href' },
                    { title: 'slug', value: 'slug' },
                    // {title: 'Page', value: 'page'},
                    // {title: 'Post', value: 'post'},
                    { title: 'Painting', value: 'painting' },
                  ],
                  layout: 'radio',
                },
              }),
              defineField({
                name: 'href',
                title: 'URL',
                type: 'url',
                hidden: ({ parent }: { parent?: { linkType?: string } }) =>
                  parent?.linkType !== 'href' && parent?.linkType != null,
                validation: Rule =>
                  Rule.custom((value, context: ValidationContext) => {
                    const parent = context.parent as { linkType?: string } | undefined;
                    if (parent?.linkType === 'href' && !value) {
                      return 'URL is required when Link Type is URL';
                    }
                    return true;
                  }),
              }),
              //   defineField({
              //     name: 'page',
              //     title: 'Page',
              //     type: 'reference',
              //     to: [{type: 'page'}],
              //     hidden: ({parent}) => parent?.linkType !== 'page',
              //     validation: (Rule) =>
              //       Rule.custom((value, context: any) => {
              //         if (context.parent?.linkType === 'page' && !value) {
              //           return 'Page reference is required when Link Type is Page'
              //         }
              //         return true
              //       }),
              //   }),
              defineField({
                name: 'slug',
                title: 'Slug',
                type: 'string',
                hidden: ({ parent }: { parent?: { linkType?: string } }) =>
                  parent?.linkType !== 'slug',
                validation: Rule =>
                  Rule.custom((value, context: ValidationContext) => {
                    const parent = context.parent as { linkType?: string } | undefined;
                    if (parent?.linkType === 'slug' && !value) {
                      return 'Slug is required when Link Type is Slug';
                    }
                    return true;
                  }),
              }),
              defineField({
                name: 'painting',
                title: 'Painting',
                type: 'reference',
                to: [{ type: 'painting' }],
                hidden: ({ parent }: { parent?: { linkType?: string } }) =>
                  parent?.linkType !== 'painting',
                validation: Rule =>
                  Rule.custom((value, context: ValidationContext) => {
                    const parent = context.parent as { linkType?: string } | undefined;
                    if (parent?.linkType === 'painting' && !value) {
                      return 'Painting reference is required when Link Type is Painting';
                    }
                    return true;
                  }),
              }),
              defineField({
                name: 'openInNewTab',
                title: 'Open in new tab',
                type: 'boolean',
                initialValue: false,
              }),
            ],
          },
        ],
      },
    }),
    // Add image support to Portable Text
    defineArrayMember({
      type: 'image',
      options: {
        hotspot: true, // Enables the hotspot feature for better image cropping
      },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for SEO and accessibility.',
          validation: Rule => Rule.required(),
        }),
        defineField({
          name: 'caption',
          type: 'string',
          title: 'Caption',
          description: 'Optional caption to display below the image.',
        }),
      ],
    }),
  ],
});
