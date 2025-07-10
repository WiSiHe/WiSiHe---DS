import CustomPortableText from '@/app/components/PortableText/PortableText';

// Sample content to test all block types
const sampleContent = [
  {
    _type: 'block',
    _key: 'heading1',
    style: 'h1',
    children: [
      {
        _type: 'span',
        _key: 'heading1-text',
        text: 'Testing Enhanced Block Content',
      },
    ],
  },
  {
    _type: 'block',
    _key: 'normal',
    style: 'normal',
    children: [
      {
        _type: 'span',
        _key: 'normal-text',
        text: 'This is a normal paragraph with ',
      },
      {
        _type: 'span',
        _key: 'strong-text',
        text: 'strong text',
        marks: ['strong'],
      },
      {
        _type: 'span',
        _key: 'normal-text-2',
        text: ', ',
      },
      {
        _type: 'span',
        _key: 'em-text',
        text: 'emphasized text',
        marks: ['em'],
      },
      {
        _type: 'span',
        _key: 'normal-text-3',
        text: ', ',
      },
      {
        _type: 'span',
        _key: 'code-text',
        text: 'inline code',
        marks: ['code'],
      },
      {
        _type: 'span',
        _key: 'normal-text-4',
        text: ', ',
      },
      {
        _type: 'span',
        _key: 'underline-text',
        text: 'underlined text',
        marks: ['underline'],
      },
      {
        _type: 'span',
        _key: 'normal-text-5',
        text: ', and ',
      },
      {
        _type: 'span',
        _key: 'strike-text',
        text: 'strikethrough text',
        marks: ['strike-through'],
      },
      {
        _type: 'span',
        _key: 'normal-text-6',
        text: '.',
      },
    ],
  },
  {
    _type: 'block',
    _key: 'heading2',
    style: 'h2',
    children: [
      {
        _type: 'span',
        _key: 'heading2-text',
        text: 'Lists',
      },
    ],
  },
  {
    _type: 'block',
    _key: 'bullet-list',
    style: 'normal',
    listItem: 'bullet',
    children: [
      {
        _type: 'span',
        _key: 'bullet1',
        text: 'Bullet list item 1',
      },
    ],
  },
  {
    _type: 'block',
    _key: 'bullet-list2',
    style: 'normal',
    listItem: 'bullet',
    children: [
      {
        _type: 'span',
        _key: 'bullet2',
        text: 'Bullet list item 2',
      },
    ],
  },
  {
    _type: 'block',
    _key: 'number-list',
    style: 'normal',
    listItem: 'number',
    children: [
      {
        _type: 'span',
        _key: 'number1',
        text: 'Numbered list item 1',
      },
    ],
  },
  {
    _type: 'block',
    _key: 'number-list2',
    style: 'normal',
    listItem: 'number',
    children: [
      {
        _type: 'span',
        _key: 'number2',
        text: 'Numbered list item 2',
      },
    ],
  },
  {
    _type: 'block',
    _key: 'heading3',
    style: 'h2',
    children: [
      {
        _type: 'span',
        _key: 'heading3-text',
        text: 'Callouts',
      },
    ],
  },
  {
    _type: 'callout',
    _key: 'info-callout',
    type: 'info',
    title: 'Information Callout',
    content: [
      {
        _type: 'block',
        _key: 'info-content',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'info-text',
            text: 'This is an informational callout with some important information.',
          },
        ],
      },
    ],
  },
  {
    _type: 'callout',
    _key: 'warning-callout',
    type: 'warning',
    title: 'Warning Callout',
    content: [
      {
        _type: 'block',
        _key: 'warning-content',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'warning-text',
            text: 'This is a warning callout. Please pay attention!',
          },
        ],
      },
    ],
  },
  {
    _type: 'callout',
    _key: 'success-callout',
    type: 'success',
    title: 'Success Callout',
    content: [
      {
        _type: 'block',
        _key: 'success-content',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'success-text',
            text: 'Great! This operation was successful.',
          },
        ],
      },
    ],
  },
  {
    _type: 'callout',
    _key: 'error-callout',
    type: 'error',
    title: 'Error Callout',
    content: [
      {
        _type: 'block',
        _key: 'error-content',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'error-text',
            text: 'Something went wrong. Please try again.',
          },
        ],
      },
    ],
  },
  {
    _type: 'block',
    _key: 'heading4',
    style: 'h2',
    children: [
      {
        _type: 'span',
        _key: 'heading4-text',
        text: 'Code Block',
      },
    ],
  },
  {
    _type: 'code',
    _key: 'code-block',
    code: `function helloWorld() {
  console.log("Hello, World!");
  return "Hello from enhanced block content!";
}

// This is a comment
const result = helloWorld();`,
    language: 'javascript',
  },
  {
    _type: 'block',
    _key: 'heading5',
    style: 'h2',
    children: [
      {
        _type: 'span',
        _key: 'heading5-text',
        text: 'Video Embed',
      },
    ],
  },
  {
    _type: 'videoEmbed',
    _key: 'video-embed',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    title: 'Sample Video',
    caption: 'This is a sample video embed',
  },
  {
    _type: 'block',
    _key: 'heading6',
    style: 'h2',
    children: [
      {
        _type: 'span',
        _key: 'heading6-text',
        text: 'Table',
      },
    ],
  },
  {
    _type: 'table',
    _key: 'sample-table',
    rows: [
      {
        cells: ['Header 1', 'Header 2', 'Header 3'],
      },
      {
        cells: ['Row 1, Cell 1', 'Row 1, Cell 2', 'Row 1, Cell 3'],
      },
      {
        cells: ['Row 2, Cell 1', 'Row 2, Cell 2', 'Row 2, Cell 3'],
      },
    ],
  },
  {
    _type: 'block',
    _key: 'heading7',
    style: 'h2',
    children: [
      {
        _type: 'span',
        _key: 'heading7-text',
        text: 'Links',
      },
    ],
  },
  {
    _type: 'block',
    _key: 'links',
    style: 'normal',
    children: [
      {
        _type: 'span',
        _key: 'link-text',
        text: 'Here is a ',
      },
      {
        _type: 'span',
        _key: 'external-link',
        text: 'link to Google',
        marks: ['link'],
        markDefs: [
          {
            _type: 'link',
            _key: 'external-link-def',
            linkType: 'href',
            href: 'https://google.com',
            openInNewTab: true,
          },
        ],
      },
      {
        _type: 'span',
        _key: 'link-text-2',
        text: ' and a ',
      },
      {
        _type: 'span',
        _key: 'internal-link',
        text: 'link to paintings',
        marks: ['link'],
        markDefs: [
          {
            _type: 'link',
            _key: 'internal-link-def',
            linkType: 'slug',
            slug: '/paintings',
          },
        ],
      },
      {
        _type: 'span',
        _key: 'link-text-3',
        text: '.',
      },
    ],
  },
  {
    _type: 'block',
    _key: 'quote',
    style: 'blockquote',
    children: [
      {
        _type: 'span',
        _key: 'quote-text',
        text: 'This is a blockquote to test the enhanced block content features.',
      },
    ],
  },
];

export default function TestBlocksPage() {
  return (
    <div className="min-h-screen bg-background pt-32">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Enhanced Block Content Test</h1>
        <div className="prose prose-lg max-w-none">
          <CustomPortableText value={sampleContent} />
        </div>
      </div>
    </div>
  );
}
