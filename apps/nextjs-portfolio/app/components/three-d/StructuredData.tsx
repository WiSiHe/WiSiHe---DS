'use client';

import { JsonLd } from '@/app/components/cms/JsonLd/JsonLd';

export function StructuredData() {
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: "Houston, we're coding 3D!",
    description:
      'Interactive 3D web development tutorial covering Three.js, React Three Fiber, WebGL, and modern 3D web development techniques.',
    url: 'https://www.wisihe.no/three-d',
    author: {
      '@type': 'Person',
      name: 'Henrik Wilhelm Sissener',
      jobTitle: 'Frontend Developer',
      worksFor: {
        '@type': 'Organization',
        name: 'NoA Ignite',
      },
      sameAs: [
        'https://github.com/wisihe',
        'https://www.linkedin.com/in/henrik-sissener/',
        'https://twitter.com/wisihe',
      ],
    },
    publisher: {
      '@type': 'Organization',
      name: 'WiSiHe',
      url: 'https://www.wisihe.no',
    },
    inLanguage: 'en-US',
    isAccessibleForFree: true,
    datePublished: '2024-01-01',
    dateModified: new Date().toISOString().split('T')[0],
  };

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Learn 3D Web Development with Three.js and React Three Fiber',
    description:
      'Step-by-step tutorial on building interactive 3D experiences on the web using Three.js and React Three Fiber.',
    // TODO: Use OG image once created (see layout.tsx for requirements)
    image: 'https://www.wisihe.no/images/og-3d-presentation.png',
    totalTime: 'PT1H',
    supply: [
      {
        '@type': 'HowToSupply',
        name: 'Basic React knowledge',
      },
      {
        '@type': 'HowToSupply',
        name: 'JavaScript/TypeScript experience',
      },
    ],
    tool: [
      {
        '@type': 'HowToTool',
        name: 'Three.js',
      },
      {
        '@type': 'HowToTool',
        name: 'React Three Fiber',
      },
      {
        '@type': 'HowToTool',
        name: '@react-three/drei',
      },
    ],
    step: [
      {
        '@type': 'HowToStep',
        name: 'Understanding 3D Fundamentals',
        text: 'Learn about vertices, edges, and faces - the building blocks of 3D graphics.',
      },
      {
        '@type': 'HowToStep',
        name: 'Setting Up Your First Scene',
        text: 'Create your first React Three Fiber scene with Canvas component.',
      },
      {
        '@type': 'HowToStep',
        name: 'Working with Materials and Textures',
        text: 'Apply materials and textures to 3D objects to create realistic surfaces.',
      },
      {
        '@type': 'HowToStep',
        name: 'Building Interactive Experiences',
        text: 'Combine vertices, edges, and faces to create interactive 3D experiences.',
      },
    ],
  };

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: "Houston, we're coding 3D!",
    description:
      'A comprehensive guide to 3D web development using Three.js and React Three Fiber, making 3D accessible to frontend developers.',
    // TODO: Use OG image once created (see layout.tsx for requirements)
    image: 'https://www.wisihe.no/images/og-3d-presentation.png',
    author: {
      '@type': 'Person',
      name: 'Henrik Wilhelm Sissener',
      jobTitle: 'Frontend Developer',
      worksFor: {
        '@type': 'Organization',
        name: 'NoA Ignite',
      },
    },
    publisher: {
      '@type': 'Organization',
      name: 'WiSiHe',
      url: 'https://www.wisihe.no',
    },
    datePublished: '2024-01-01',
    dateModified: new Date().toISOString().split('T')[0],
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://www.wisihe.no/three-d',
    },
    keywords: ['Three.js', 'React Three Fiber', 'WebGL', '3D web development', 'interactive 3D'],
  };

  return (
    <>
      <JsonLd data={webPageSchema} />
      <JsonLd data={howToSchema} />
      <JsonLd data={articleSchema} />
    </>
  );
}
