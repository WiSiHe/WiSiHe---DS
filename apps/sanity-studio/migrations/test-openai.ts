import dotenv from 'dotenv';
import OpenAI from 'openai';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const openai = new OpenAI({
  apiKey: process.env.SANITY_STUDIO_OPENAI_API_KEY,
});

async function test() {
  console.log('Testing OpenAI Image Generation with gpt-image-2...');
  try {
    const res = await openai.images.generate({
      model: 'gpt-image-2',
      prompt:
        'a fresh apple isolated on a clean solid white background, professional studio food photography, clean lighting, sharp focus, product shot',
      n: 1,
      size: '1024x1024',
    });
    console.log('SUCCESS! Full Response Object:', JSON.stringify(res, null, 2));
  } catch (err) {
    console.error('FAILED with error:', err);
  }
}

test();
