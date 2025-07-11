import { sanityFetch } from '@/sanity/lib/live';
import { getRecipe } from '@/sanity/lib/queries';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { PortableTextBlock } from 'next-sanity';
import { urlForImage } from '@/sanity/lib/utils';
import RecipeDetail from '../../components/RecipeDetail/RecipeDetail';

interface RecipeIngredient {
  ingredient: string;
  photo?: {
    asset?: {
      _ref: string;
      _type: 'reference';
    };
    alt: string;
    lqip?: string;
    aspectRatio?: number;
  };
  amount: string;
  unit: string;
  isDiscrete?: boolean;
  notes?: string;
}

interface IngredientCategory {
  categoryName: string;
  ingredients: RecipeIngredient[];
}

interface Instruction {
  title?: string;
  content: PortableTextBlock[];
}

interface RecipeTip {
  title?: string;
  content: string;
  icon?: string;
}

interface Recipe {
  _id: string;
  slug: string;
  title: string;
  description?: string;
  mainImage?: {
    asset?: {
      _ref: string;
      _type: 'reference';
    };
    alt: string;
    lqip?: string;
    aspectRatio?: number;
  };
  ingredientCategories?: IngredientCategory[];
  instructions?: Instruction[];
  tips?: RecipeTip[];
  cookingTime?: number;
  prepTime?: number;
  totalTime?: number;
  servings?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  publishedAt?: string;
  tags?: Array<{ name: string }>;
}

interface RecipeQueryResult {
  data: Recipe;
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const result = (await sanityFetch({ query: getRecipe, params: { slug } })) as RecipeQueryResult;
  const recipe = result.data;

  if (!recipe) {
    return {
      title: 'Recipe Not Found',
    };
  }

  const title = `${recipe.title} | Recipes | WiSiHe`;
  const description =
    recipe.description ||
    `Learn how to make ${recipe.title} with step-by-step instructions, ingredients, and cooking tips.`;
  const imageUrl = recipe.mainImage
    ? urlForImage(recipe.mainImage)?.url() || 'https://wisihe.no/og-image.jpg'
    : 'https://wisihe.no/og-image.jpg';
  const url = `https://wisihe.no/recipes/${recipe.slug}`;

  return {
    title,
    description,
    openGraph: {
      title: recipe.title,
      description,
      type: 'article',
      url,
      siteName: 'WiSiHe',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: recipe.mainImage?.alt || recipe.title,
        },
      ],
      publishedTime: recipe.publishedAt,
      authors: ['WiSiHe'],
      tags: recipe.tags?.map(tag => tag.name) || [],
    },
    twitter: {
      card: 'summary_large_image',
      title: recipe.title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: url,
    },
    keywords: [
      'recipe',
      'cooking',
      'food',
      recipe.title,
      ...(recipe.tags?.map(tag => tag.name) || []),
    ].join(', '),
  };
}

export default async function RecipePage({ params }: Props) {
  const { slug } = await params;
  const result = (await sanityFetch({ query: getRecipe, params: { slug } })) as RecipeQueryResult;
  const recipe = result.data;

  if (!recipe) {
    notFound();
  }

  // Create structured data
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    '@id': `https://wisihe.no/recipes/${recipe.slug}`,
    name: recipe.title,
    description: recipe.description,
    image: recipe.mainImage ? urlForImage(recipe.mainImage)?.url() : undefined,
    author: {
      '@type': 'Person',
      name: 'WiSiHe',
    },
    datePublished: recipe.publishedAt,
    prepTime: recipe.prepTime ? `PT${recipe.prepTime}M` : undefined,
    cookTime: recipe.cookingTime ? `PT${recipe.cookingTime}M` : undefined,
    totalTime: recipe.totalTime ? `PT${recipe.totalTime}M` : undefined,
    recipeYield: recipe.servings ? `${recipe.servings} servings` : undefined,
    recipeCategory: 'Main Course',
    recipeCuisine: 'International',
    keywords: recipe.tags?.map(tag => tag.name).join(', '),
    recipeIngredient:
      recipe.ingredientCategories?.flatMap(category =>
        category.ingredients.map(ingredient => ({
          '@type': 'Ingredient',
          name: ingredient.ingredient,
          amount: ingredient.amount,
          unit: ingredient.unit,
        })),
      ) || [],
    recipeInstructions:
      recipe.instructions?.map((instruction, index) => ({
        '@type': 'HowToStep',
        position: index + 1,
        name: instruction.title || `Step ${index + 1}`,
        text: (instruction.content?.[0]?.children?.[0]?.text as string) || '',
      })) || [],
    ...(recipe.difficulty && {
      recipeDifficulty: recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1),
    }),
    ...(recipe.tips &&
      recipe.tips.length > 0 && {
        recipeTip: recipe.tips.map(tip => tip.content),
      }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <RecipeDetail recipe={recipe} />
    </>
  );
}
