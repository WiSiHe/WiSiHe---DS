import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { PortableTextBlock } from 'next-sanity';
import { JsonLd } from '@/app/components/JsonLd/JsonLd';
import { client } from '@/sanity/lib/client';
import { sanityFetch } from '@/sanity/lib/live';
import { getRecipe, getRecipeSlugs } from '@/sanity/lib/queries';
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

export async function generateStaticParams() {
  const slugs = (await client.fetch(getRecipeSlugs)) as { slug: string }[];

  return slugs.map(({ slug }) => ({
    slug,
  }));
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

  // Limit tags to 9 for SEO
  const limitedTags = recipe.tags?.slice(0, 9) || [];

  // Create title without word repetition
  const title = recipe.title.toLowerCase().includes('recipe')
    ? recipe.title
    : `${recipe.title} | Recipe`;

  const description =
    recipe.description ||
    `Learn how to make ${recipe.title} with step-by-step instructions, ingredients, and cooking tips. Perfect for home cooking.`;
  const imageUrl = recipe.mainImage
    ? urlForImage(recipe.mainImage)?.url() || 'https://www.wisihe.no/og-image.jpg'
    : 'https://www.wisihe.no/og-image.jpg';
  const url = `https://www.wisihe.no/recipes/${recipe.slug}`;

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
      tags: limitedTags.map(tag => tag.name),
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
      'home cooking',
      'delicious',
      recipe.title,
      ...limitedTags.map(tag => tag.name),
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

  // Limit tags to 9 for SEO
  const limitedTags = recipe.tags?.slice(0, 9) || [];

  // Create structured data
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    '@id': `https://www.wisihe.no/recipes/${recipe.slug}`,
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
    keywords: limitedTags.map(tag => tag.name).join(', '),
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
      <JsonLd data={structuredData} />
      <RecipeDetail recipe={{ ...recipe, tags: limitedTags }} />

      {/* Additional internal links section for SEO */}
      <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-background'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl font-bold mb-4 text-foreground'>Explore More</h2>
          <p className='text-lg text-foreground-subtle'>
            Discover other delicious recipes and cooking inspiration
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          <Link
            href='/recipes'
            className='group p-6 rounded-xl bg-surface border border-border shadow-lg hover:shadow-xl hover:border-accent-border transition-all duration-200 block no-underline'
          >
            <h3 className='text-xl font-semibold mb-3 text-foreground group-hover:text-accent transition-colors'>
              All Recipes
            </h3>
            <p className='text-foreground-subtle'>
              Browse our complete collection of delicious recipes
            </p>
          </Link>

          <Link
            href='/projects'
            className='group p-6 rounded-xl bg-surface border border-border shadow-lg hover:shadow-xl hover:border-accent-border transition-all duration-200 block no-underline'
          >
            <h3 className='text-xl font-semibold mb-3 text-foreground group-hover:text-accent transition-colors'>
              Other Projects
            </h3>
            <p className='text-foreground-subtle'>
              Check out our other creative projects and artwork
            </p>
          </Link>

          <Link
            href='/paintings'
            className='group p-6 rounded-xl bg-surface border border-border shadow-lg hover:shadow-xl hover:border-accent-border transition-all duration-200 block no-underline'
          >
            <h3 className='text-xl font-semibold mb-3 text-foreground group-hover:text-accent transition-colors'>
              Digital Art
            </h3>
            <p className='text-foreground-subtle'>
              Explore our collection of digital paintings and artwork
            </p>
          </Link>

          <Link
            href='/videos'
            className='group p-6 rounded-xl bg-surface border border-border shadow-lg hover:shadow-xl hover:border-accent-border transition-all duration-200 block no-underline'
          >
            <h3 className='text-xl font-semibold mb-3 text-foreground group-hover:text-accent transition-colors'>
              Video Content
            </h3>
            <p className='text-foreground-subtle'>Watch our latest videos and creative content</p>
          </Link>

          <Link
            href='/contact'
            className='group p-6 rounded-xl bg-surface border border-border shadow-lg hover:shadow-xl hover:border-accent-border transition-all duration-200 block no-underline'
          >
            <h3 className='text-xl font-semibold mb-3 text-foreground group-hover:text-accent transition-colors'>
              Get in Touch
            </h3>
            <p className='text-foreground-subtle'>Have questions about our recipes? Contact us!</p>
          </Link>

          <Link
            href='/'
            className='group p-6 rounded-xl bg-surface border border-border shadow-lg hover:shadow-xl hover:border-accent-border transition-all duration-200 block no-underline'
          >
            <h3 className='text-xl font-semibold mb-3 text-foreground group-hover:text-accent transition-colors'>
              Home
            </h3>
            <p className='text-foreground-subtle'>
              Return to our homepage and explore everything we offer
            </p>
          </Link>
        </div>
      </section>
    </>
  );
}
