import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'cbjsv7wi',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  apiVersion: '2024-10-28',
  useCdn: false,
  token: process.env.SANITY_STUDIO_WRITE_TOKEN || process.env.SANITY_AUTH_TOKEN,
});

const openai = new OpenAI({
  apiKey: process.env.SANITY_STUDIO_OPENAI_API_KEY,
});

// Delay helper
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function runBulkGeneration() {
  console.log('Starting bulk ingredient photo generation...');

  if (!client.config().token) {
    console.error('Error: No Sanity write token found. Run with sanity exec --with-user-token.');
    process.exit(1);
  }

  if (!process.env.SANITY_STUDIO_OPENAI_API_KEY) {
    console.error('Error: SANITY_STUDIO_OPENAI_API_KEY is not defined in environment.');
    process.exit(1);
  }

  // 1. Fetch ingredients missing photos
  const ingredients = await client.fetch(`*[_type == "ingredient" && !defined(photo.asset)]`);
  console.log(`Found ${ingredients.length} ingredients missing photos.`);

  if (ingredients.length === 0) {
    console.log('Nothing to do. Exiting.');
    return;
  }

  // 2. Loop and generate
  for (let i = 0; i < ingredients.length; i++) {
    const ing = ingredients[i];
    console.log(
      `\n[${i + 1}/${ingredients.length}] Generating photo for: "${ing.name}" (${ing._id})`,
    );

    try {
      const finalPrompt = `a fresh ${ing.name.toLowerCase()} isolated on a clean solid white background, professional studio food photography, clean lighting, sharp focus, product shot`;
      console.log(`- Prompt: "${finalPrompt}"`);

      // Generate Image using gpt-image-2
      const imgRes = await openai.images.generate({
        model: 'gpt-image-2',
        prompt: finalPrompt,
        n: 1,
        size: '1024x1024',
      });

      const imageUrl = imgRes.data[0]?.url;
      const b64Data = imgRes.data[0]?.b64_json;
      let uploadInput: Buffer;

      if (b64Data) {
        uploadInput = Buffer.from(b64Data, 'base64');
      } else if (imageUrl) {
        const imgResponse = await fetch(imageUrl);
        if (!imgResponse.ok) {
          throw new Error(`Failed to fetch generated image: ${imgResponse.statusText}`);
        }
        uploadInput = Buffer.from(await imgResponse.arrayBuffer());
      } else {
        throw new Error('No image data returned from OpenAI');
      }

      // Upload to Sanity
      console.log('- Uploading image to Sanity asset store...');
      const filename = `${ing.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}.png`;
      const asset = await client.assets.upload('image', uploadInput, {
        filename,
      });
      console.log(`- Asset uploaded: ${asset._id}. Generating alt text...`);

      // Generate Alt Text using gpt-4o-mini
      let altText = '';
      try {
        const chatCompletion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: `Write a short, descriptive alt text (under 100 characters) for this ingredient image of ${ing.name}. It is isolated on a clean solid white background. Focus on its appearance, color, and texture. Keep it concise for screen readers.`,
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: b64Data ? `data:image/png;base64,${b64Data}` : imageUrl || '',
                  },
                },
              ],
            },
          ],
          max_tokens: 50,
        });
        altText = chatCompletion.choices[0]?.message?.content?.trim() || '';
        altText = altText.replace(/^["']|["']$/g, '');
        console.log(`- Alt Text generated: "${altText}"`);
      } catch (altErr) {
        console.error('  Failed to generate alt text, using fallback.', altErr);
        altText = `Fresh ${ing.name.toLowerCase()} isolated on a white background`;
      }

      // Update ingredient document
      console.log('- Updating ingredient document with photo and alt text...');
      await client
        .patch(ing._id)
        .set({
          photo: {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: asset._id,
            },
            alt: altText,
          },
        })
        .commit();
      console.log('- Document updated successfully.');

      // Wait 3 seconds to avoid rate limiting
      console.log('Waiting 3 seconds before next generation...');
      await delay(3000);
    } catch (err) {
      console.error(`Error generating photo for "${ing.name}":`, err);
      console.log('Continuing with next ingredient...');
    }
  }

  console.log('\nBulk photo generation completed!');
}

runBulkGeneration().catch(err => {
  console.error('Bulk generation failed:', err);
  process.exit(1);
});
