import path from 'node:path';
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'cbjsv7wi',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  apiVersion: '2024-10-28',
  useCdn: false,
  // sanity exec --with-user-token injects the user token into the environment
  token: process.env.SANITY_STUDIO_WRITE_TOKEN || process.env.SANITY_AUTH_TOKEN,
});

async function runMigration() {
  console.log('Starting ingredient schema migration...');

  if (!client.config().token) {
    console.error('Error: No write token found. Please run this script using:');
    console.error(
      'pnpm --filter sanity-studio exec sanity exec migrations/migrate-ingredients.ts --with-user-token',
    );
    process.exit(1);
  }

  // 1. Fetch all recipes
  const recipes = await client.fetch(`*[_type == "recipe"]`);
  console.log(`Fetched ${recipes.length} recipes to process.`);

  // Map to cache created/existing standalone ingredient IDs: name -> ID
  const ingredientCache: Record<string, string> = {};

  // Fetch all existing standalone ingredients first to populate cache
  const existingIngredients = await client.fetch(`*[_type == "ingredient"]`);
  console.log(`Found ${existingIngredients.length} existing standalone ingredients in Sanity.`);
  for (const ing of existingIngredients) {
    ingredientCache[ing.name.toLowerCase().trim()] = ing._id;
  }

  // 2. Process recipes
  for (const recipe of recipes) {
    console.log(`\nProcessing recipe: "${recipe.title}" (${recipe._id})`);
    let needsUpdate = false;

    if (!recipe.ingredientCategories || !Array.isArray(recipe.ingredientCategories)) {
      console.log('No ingredient categories found. Skipping.');
      continue;
    }

    // Deep clone the categories to modify them
    const updatedCategories = JSON.parse(JSON.stringify(recipe.ingredientCategories));

    for (const category of updatedCategories) {
      if (!category.ingredients || !Array.isArray(category.ingredients)) continue;

      for (const item of category.ingredients) {
        // If it's already a reference, skip
        if (item.ingredient && typeof item.ingredient === 'object' && item.ingredient._ref) {
          console.log(`- Ingredient "${item.ingredient._ref}" is already a reference. Skipping.`);
          continue;
        }

        // If it's a string, we need to migrate it
        if (item.ingredient && typeof item.ingredient === 'string') {
          const rawName = item.ingredient;
          const cleanName = rawName.trim();
          const cacheKey = cleanName.toLowerCase();

          let ingredientId = ingredientCache[cacheKey];

          if (!ingredientId) {
            console.log(`Creating new standalone ingredient document for: "${cleanName}"`);

            // Create standalone ingredient document
            const newIngredientDoc = {
              _type: 'ingredient',
              name: cleanName,
              // Copy over the inline photo/alt if it exists
              photo: item.photo
                ? {
                    _type: 'image',
                    asset: item.photo.asset,
                    alt: item.photo.alt || `Fresh ${cleanName.toLowerCase()}`,
                  }
                : undefined,
            };

            const created = await client.create(newIngredientDoc);
            ingredientId = created._id;
            ingredientCache[cacheKey] = ingredientId;
          } else {
            console.log(
              `Using existing standalone ingredient document for: "${cleanName}" (${ingredientId})`,
            );
          }

          // Replace string name with reference object
          item.ingredient = {
            _type: 'reference',
            _ref: ingredientId,
          };

          // Remove the photo field from the inline recipe-ingredient list item
          delete item.photo;

          needsUpdate = true;
        }
      }
    }

    if (needsUpdate) {
      console.log(`Committing updates for recipe: "${recipe.title}"...`);
      await client.patch(recipe._id).set({ ingredientCategories: updatedCategories }).commit();
      console.log('Update successful.');
    } else {
      console.log('No updates needed.');
    }
  }

  console.log('\nMigration completed successfully!');
}

runMigration().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
