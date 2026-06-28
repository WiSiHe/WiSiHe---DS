import type { GetAllRecipesResult } from '@wisihe/sanity-queries';
import { Chip } from '@wisihe/ui-react';
import { cn } from '@wisihe/utils';
import Image from 'next/image';
import { Link } from '@/app/components/layout/ProgressLink';
import { urlForImage } from '@/sanity/lib/utils';
import { RecipeMetaBadges } from '../RecipeMetaBadges/RecipeMetaBadges';

type RecipeListItem = GetAllRecipesResult[number];

type RecipeCardProps = {
  recipe: RecipeListItem;
  featured?: boolean;
  className?: string;
};

export function RecipeCard({ recipe, featured = false, className }: RecipeCardProps) {
  const imageUrl = recipe.mainImage
    ? urlForImage(recipe.mainImage)?.width(800).height(600).quality(80).url()
    : null;

  return (
    <article
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-2xl border border-border/40 bg-surface transition-all duration-300 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/5',
        featured && 'md:grid md:grid-cols-2 md:gap-0',
        className,
      )}
    >
      <Link
        href={`/recipes/${recipe.slug || ''}`}
        className={cn(
          'relative block overflow-hidden',
          featured ? 'aspect-[16/10] md:aspect-auto md:min-h-full' : 'aspect-[4/3]',
        )}
        aria-label={recipe.title || undefined}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={recipe.mainImage?.alt ?? recipe.title ?? ''}
            fill
            className='object-cover transition-transform duration-500 group-hover:scale-105'
            sizes={featured ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 100vw, 33vw'}
            placeholder={recipe.mainImage?.lqip ? 'blur' : 'empty'}
            blurDataURL={recipe.mainImage?.lqip ?? undefined}
          />
        ) : (
          <div className='absolute inset-0 bg-gradient-to-br from-accent/20 via-surface-subtle to-brand-1-600/20' />
        )}
        <div
          className='absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-80'
          aria-hidden
        />
        {featured ? (
          <span className='absolute left-4 top-4 rounded-full border border-accent/40 bg-background/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-accent backdrop-blur-md'>
            Latest recipe
          </span>
        ) : null}
      </Link>

      <div
        className={cn('flex flex-col gap-3 p-5', featured && 'md:justify-center md:p-8 lg:p-10')}
      >
        <div className='space-y-2'>
          <Link href={`/recipes/${recipe.slug || ''}`}>
            <h2
              className={cn(
                'font-serif font-bold text-foreground transition-colors group-hover:text-accent',
                featured ? 'text-2xl sm:text-3xl lg:text-4xl' : 'text-xl',
              )}
            >
              {recipe.title}
            </h2>
          </Link>
          {recipe.description ? (
            <p
              className={cn(
                'text-foreground-subtle text-pretty leading-relaxed',
                featured ? 'text-base sm:text-lg' : 'text-sm line-clamp-2',
              )}
            >
              {recipe.description}
            </p>
          ) : null}
        </div>

        <RecipeMetaBadges
          prepTime={recipe.prepTime}
          cookingTime={recipe.cookingTime}
          totalTime={recipe.totalTime}
          servings={recipe.servings}
          difficulty={recipe.difficulty}
        />

        {recipe.tags?.length ? (
          <div className='flex flex-wrap gap-2 pt-1'>
            {recipe.tags.slice(0, 3).map(tag => (
              <Chip key={tag.name || ''} label={tag.name || ''} size='small' interactive={false} />
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}
