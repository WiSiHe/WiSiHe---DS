import { getCliClient } from 'sanity/cli';

async function main() {
  const client = await getCliClient({ apiVersion: '2024-10-28' });

  const doc = {
    _id: 'drafts.template-test-presentation',
    _type: 'presentation',
    title: 'Template Test Presentation 🚀',
    slug: {
      _type: 'slug',
      current: 'template-test-presentation',
    },
    description:
      'A test presentation to verify custom components and dynamic layouts in the unified slide deck.',
    noIndex: false,
    tldr: '• Bullet 1: This is a TL;DR summary slide.\n• Bullet 2: It is automatically parsed and formatted.\n• Bullet 3: You can generate it using the built-in AI button in Sanity.',
    tldrPosition: 'top',
    slides: [
      {
        _key: 'slide-1',
        _type: 'titleSlide',
        title: 'Welcome to the Dynamic Slide Deck!',
        subtitle: 'Testing Sanity custom component integration',
        media: {
          mediaType: 'none',
        },
      },
      {
        _key: 'slide-2',
        _type: 'contentSlide',
        title: 'Rich Text & Bullet List',
        subtitle: 'Standard Content Slide',
        content: [
          {
            _key: 'p1',
            _type: 'block',
            style: 'normal',
            markDefs: [],
            children: [
              {
                _key: 's1',
                _type: 'span',
                marks: [],
                text: 'This is a standard content slide demonstrating dynamic text rendering from Sanity. We can include list items like:',
              },
            ],
          },
          {
            _key: 'l1',
            _type: 'block',
            style: 'normal',
            listItem: 'bullet',
            level: 1,
            markDefs: [],
            children: [
              {
                _key: 's2',
                _type: 'span',
                marks: [],
                text: 'Bullet item number one',
              },
            ],
          },
          {
            _key: 'l2',
            _type: 'block',
            style: 'normal',
            listItem: 'bullet',
            level: 1,
            markDefs: [],
            children: [
              {
                _key: 's3',
                _type: 'span',
                marks: [],
                text: 'Bullet item number two with nested sub-bullets',
              },
            ],
          },
        ],
        media: {
          mediaType: 'none',
        },
        status: 'published',
      },
      {
        _key: 'slide-3',
        _type: 'separatorSlide',
        title: 'Custom Showcase Ahead',
      },
      {
        _key: 'slide-4',
        _type: 'contentSlide',
        title: '3D Hero Custom Component',
        subtitle: 'Rendered full-screen',
        content: [],
        media: {
          mediaType: 'custom',
          componentName: 'ThreeDHero',
          componentProps: '{}',
        },
        status: 'published',
      },
      {
        _key: 'slide-5',
        _type: 'contentSlide',
        title: 'Technical Showcase Custom Component',
        subtitle: 'Rendered full-screen',
        content: [],
        media: {
          mediaType: 'custom',
          componentName: 'TechnicalDeck',
          componentProps: '{}',
        },
        status: 'published',
      },
      {
        _key: 'slide-6',
        _type: 'contentSlide',
        title: 'Sources Section Custom Component',
        subtitle: 'Rendered full-screen',
        content: [],
        media: {
          mediaType: 'custom',
          componentName: 'SourcesSection',
          componentProps: '{}',
        },
        status: 'published',
      },
    ],
  };

  console.log('Creating or updating template-test-presentation...');
  await client.createOrReplace(doc);

  // Also create a published version so it is fetched in production/static generation
  const publishedDoc = {
    ...doc,
    _id: 'template-test-presentation',
  };
  await client.createOrReplace(publishedDoc);

  console.log('Successfully created Template Test Presentation in Sanity!');
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
