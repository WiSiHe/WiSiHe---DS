'use client';

import RecipeIngredients from '../RecipeIngredients/RecipeIngredients';
import RecipeInstructions from '../RecipeInstructions/RecipeInstructions';
import Image from 'next/image';
import { urlForImage } from '@/sanity/lib/utils';
import { PortableTextBlock } from 'next-sanity';
import { FiClock, FiThermometer, FiUsers, FiBarChart, FiZap, FiTag } from 'react-icons/fi';

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

interface RecipeDetailProps {
  recipe: Recipe;
}

export default function RecipeDetail({ recipe }: RecipeDetailProps) {
  // Flatten all ingredients for instruction processing
  const allIngredients =
    recipe.ingredientCategories?.flatMap(category => category.ingredients) || [];

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-background)' }}>
      <div className="pt-24 pb-16">
        <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <header className="text-center mb-16">
            <div className="max-w-4xl mx-auto">
              <h1
                className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {recipe.title}
              </h1>
              {recipe.description && (
                <p
                  className="text-xl mb-8 leading-relaxed max-w-3xl mx-auto"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {recipe.description}
                </p>
              )}

              {/* Recipe Meta */}
              <div
                className="flex flex-wrap justify-center gap-6 text-sm mb-8"
                style={{ color: 'var(--color-text-tertiary)' }}
              >
                {recipe.prepTime && (
                  <div
                    className="flex items-center gap-2 px-4 py-2 rounded-full shadow-sm transition-all duration-200 hover:shadow-md"
                    style={{
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    <FiClock className="w-4 h-4" style={{ color: 'var(--color-accent)' }} />
                    <span>Prep: {recipe.prepTime} min</span>
                  </div>
                )}
                {recipe.cookingTime && (
                  <div
                    className="flex items-center gap-2 px-4 py-2 rounded-full shadow-sm transition-all duration-200 hover:shadow-md"
                    style={{
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    <FiThermometer
                      className="w-4 h-4"
                      style={{ color: 'var(--color-accent-warm)' }}
                    />
                    <span>Cook: {recipe.cookingTime} min</span>
                  </div>
                )}
                {recipe.totalTime && (
                  <div
                    className="flex items-center gap-2 px-4 py-2 rounded-full shadow-sm transition-all duration-200 hover:shadow-md"
                    style={{
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    <FiClock className="w-4 h-4" style={{ color: 'var(--color-accent)' }} />
                    <span>Total: {recipe.totalTime} min</span>
                  </div>
                )}
                {recipe.servings && (
                  <div
                    className="flex items-center gap-2 px-4 py-2 rounded-full shadow-sm transition-all duration-200 hover:shadow-md"
                    style={{
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    <FiUsers className="w-4 h-4" style={{ color: 'var(--color-accent-success)' }} />
                    <span>Serves: {recipe.servings}</span>
                  </div>
                )}
                {recipe.difficulty && (
                  <div
                    className="flex items-center gap-2 px-4 py-2 rounded-full shadow-sm transition-all duration-200 hover:shadow-md"
                    style={{
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    <FiBarChart className="w-4 h-4" style={{ color: 'var(--color-accent-cool)' }} />
                    <span className="capitalize">{recipe.difficulty}</span>
                  </div>
                )}
              </div>

              {/* Main Image */}
              {recipe.mainImage && (
                <div className="aspect-[16/9] overflow-hidden rounded-2xl shadow-2xl mb-12">
                  <Image
                    src={urlForImage(recipe.mainImage)?.url() || ''}
                    alt={recipe.mainImage.alt}
                    width={1200}
                    height={675}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
              )}
            </div>
          </header>

          {/* Main Content */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-12 max-w-7xl mx-auto">
            {/* Ingredients - Sticky on desktop */}
            <div className="xl:col-span-1">
              <div className="xl:sticky xl:top-8">
                <RecipeIngredients ingredientCategories={recipe.ingredientCategories} />
              </div>
            </div>

            {/* Instructions */}
            <div className="xl:col-span-3">
              <RecipeInstructions instructions={recipe.instructions} ingredients={allIngredients} />
            </div>
          </div>

          {/* Tips & Tricks */}
          {recipe.tips && recipe.tips.length > 0 && (
            <div className="mt-20 max-w-4xl mx-auto">
              <h2
                className="text-3xl font-bold mb-8 text-center"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Tips & Tricks
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recipe.tips.map((tip, index) => (
                  <div
                    key={index}
                    className="p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                    style={{
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="flex-shrink-0 p-2 rounded-lg"
                        style={{ background: 'var(--color-accent-light)' }}
                      >
                        <FiZap className="w-5 h-5" style={{ color: 'var(--color-accent)' }} />
                      </div>
                      <div>
                        {tip.title && (
                          <h3
                            className="font-semibold text-lg mb-3"
                            style={{ color: 'var(--color-text-primary)' }}
                          >
                            {tip.title}
                          </h3>
                        )}
                        <p
                          className="leading-relaxed"
                          style={{ color: 'var(--color-text-secondary)' }}
                        >
                          {tip.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {recipe.tags && recipe.tags.length > 0 && (
            <div
              className="mt-16 pt-12 max-w-4xl mx-auto"
              style={{ borderTop: '1px solid var(--color-border)' }}
            >
              <div className="flex flex-wrap justify-center gap-3">
                {recipe.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200"
                    style={{
                      background: 'var(--color-surface)',
                      color: 'var(--color-text-secondary)',
                      border: '1px solid var(--color-border)',
                    }}
                  >
                    <FiTag className="w-3 h-3" style={{ color: 'var(--color-accent)' }} />
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
