import { describe, expect, it } from 'vite-plus/test';
import { SITE_URL } from '../site';
import { buildRecipeStructuredData, buildVideoStructuredData } from './structuredData';

describe('video structured data', () => {
  it('uses the player URL for YouTube and includes the actual publication date', () => {
    const video = buildVideoStructuredData({
      slug: 'demo',
      title: 'Demo',
      videoUrl: 'https://www.youtube.com/watch?v=abc123',
      youtubeVideoId: 'abc123',
      thumbnailUrl: 'https://example.com/thumbnail.jpg',
      uploadDate: '2024-01-01T12:00:00Z',
    });
    expect(video).toMatchObject({
      embedUrl: 'https://www.youtube.com/embed/abc123',
      thumbnailUrl: 'https://example.com/thumbnail.jpg',
      uploadDate: '2024-01-01T12:00:00Z',
    });
    expect(video).not.toHaveProperty('contentUrl');
  });

  it('uses a temporary publication date when none is available', () => {
    const video = buildVideoStructuredData({
      slug: 'demo',
      title: 'Demo',
      videoUrl: 'https://example.com/demo.mp4?quality=high',
    });
    expect(video).toHaveProperty('contentUrl', 'https://example.com/demo.mp4?quality=high');
    expect(video).toHaveProperty('uploadDate', '2000-01-01T00:00:00Z');
  });
});

describe('recipe structured data', () => {
  it('includes available classification and links each instruction to its page anchor', () => {
    const graph = buildRecipeStructuredData({
      slug: 'soup',
      title: 'Soup',
      recipeCategory: ' Dinner ',
      recipeCuisine: ' Nordic ',
      instructions: [{ title: 'Simmer', text: 'Simmer gently.' }, { text: 'Serve.' }],
    });

    expect(graph['@graph'][1]).toMatchObject({
      recipeCategory: 'Dinner',
      recipeCuisine: 'Nordic',
      recipeInstructions: [
        { name: 'Simmer', text: 'Simmer gently.', url: `${SITE_URL}/recipes/soup#step-1` },
        { text: 'Serve.', url: `${SITE_URL}/recipes/soup#step-2` },
      ],
    });
    expect(graph['@graph'][1]).not.toMatchObject({
      recipeInstructions: [expect.anything(), { name: expect.anything() }],
    });
  });

  it('omits classification when it is missing or blank', () => {
    const recipe = buildRecipeStructuredData({
      slug: 'soup',
      title: 'Soup',
      recipeCategory: ' ',
      recipeCuisine: null,
    })['@graph'][1];

    expect(recipe).not.toHaveProperty('recipeCategory');
    expect(recipe).not.toHaveProperty('recipeCuisine');
  });
});
