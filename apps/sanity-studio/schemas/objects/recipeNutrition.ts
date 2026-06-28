import { defineField, defineType } from 'sanity';
import NutritionEstimator from '../../components/NutritionEstimator';

export default defineType({
  name: 'recipeNutrition',
  title: 'Nutrition (per serving)',
  type: 'object',
  components: {
    input: NutritionEstimator,
  },
  fields: [
    defineField({
      name: 'calories',
      title: 'Calories',
      type: 'number',
      description: 'Energy per serving (kcal)',
      validation: Rule => Rule.min(0).max(5000),
    }),
    defineField({
      name: 'protein',
      title: 'Protein (g)',
      type: 'number',
      validation: Rule => Rule.min(0).max(500),
    }),
    defineField({
      name: 'carbohydrates',
      title: 'Carbohydrates (g)',
      type: 'number',
      validation: Rule => Rule.min(0).max(500),
    }),
    defineField({
      name: 'fat',
      title: 'Fat (g)',
      type: 'number',
      validation: Rule => Rule.min(0).max(500),
    }),
    defineField({
      name: 'fiber',
      title: 'Fiber (g)',
      type: 'number',
      validation: Rule => Rule.min(0).max(100),
    }),
    defineField({
      name: 'sugar',
      title: 'Sugar (g)',
      type: 'number',
      validation: Rule => Rule.min(0).max(200),
    }),
    defineField({
      name: 'sodium',
      title: 'Sodium (mg)',
      type: 'number',
      validation: Rule => Rule.min(0).max(10000),
    }),
    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'string',
      description: 'e.g. "Approximate — varies with brands and substitutions"',
    }),
  ],
});
