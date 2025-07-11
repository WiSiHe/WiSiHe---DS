import { sanityFetch } from '@/sanity/lib/live';
import { getRecipe } from '@/sanity/lib/queries';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { PortableTextBlock } from 'next-sanity';
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

  return {
    title: `${recipe.title} | Recipes | WiSiHe`,
    description: recipe.description || `Learn how to make ${recipe.title}`,
    openGraph: {
      title: recipe.title,
      description: recipe.description || `Learn how to make ${recipe.title}`,
      type: 'article',
    },
  };
}

export default async function RecipePage({ params }: Props) {
  const { slug } = await params;
  const result = (await sanityFetch({ query: getRecipe, params: { slug } })) as RecipeQueryResult;
  const recipe = result.data;

  if (!recipe) {
    notFound();
  }

  return <RecipeDetail recipe={recipe} />;
}
