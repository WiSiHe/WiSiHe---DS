/**
 * Seed the About page singleton with the current hardcoded content.
 * Run: node seed-about.mjs
 */
import { createClient } from '@sanity/client';
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.join(__dirname, '.env.local') });

const client = createClient({
  projectId: 'cbjsv7wi', dataset: 'production',
  apiVersion: '2024-01-01', token: process.env.SANITY_API_WRITE_TOKEN, useCdn: false,
});

await client.createOrReplace({
  _id: 'about',
  _type: 'about',
  heroTitle: 'Story of WiSiHe',
  heroSubtitle: 'Henrik Sissener',
  jobTitle: 'Frontend Developer & Digital Artist',
  bio: 'Frontend developer and digital artist based in Norway. I build performant web experiences and create digital paintings — two disciplines that feed each other in ways I never expected.',
  journeyItems: [
    {
      _key: 'spark',
      year: 'The Beginning',
      title: 'The Spark',
      content: 'My journey started with a simple curiosity about how things work. What began as tinkering with HTML/CSS soon turned into a deep passion for building logic that creates visual impact.',
    },
    {
      _key: 'logic',
      year: 'Evolution',
      title: 'Logic meets Art',
      content: "I realized that code isn't just about functionality — it's a medium for expression. I started bridging my love for traditional painting with digital possibilities, exploring how development can be as expressive as a brushstroke.",
    },
    {
      _key: 'worlds',
      year: 'Current Era',
      title: 'Bridging Worlds',
      content: "Today, I specialize in creating immersive web experiences where 3D, performance, and storytelling collide. I'm constantly pushing the boundaries of what's possible in the browser.",
    },
  ],
  ctaTitle: 'Lets create the Future together.',
  ctaButtonText: 'Start a Conversation',
  ctaButtonUrl: '/contact',
  socialLinks: [
    { _key: 'github', platform: 'GitHub', url: 'https://github.com/wisihe' },
    { _key: 'linkedin', platform: 'LinkedIn', url: 'https://linkedin.com/in/henrik-sissener' },
    { _key: 'instagram', platform: 'Instagram', url: 'https://instagram.com/wisihe' },
    { _key: 'twitter', platform: 'Twitter', url: 'https://twitter.com/wisihe' },
  ],
});

console.log('✅ About page seeded successfully');
