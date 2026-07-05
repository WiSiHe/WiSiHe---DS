import { IconClock, IconFlame, IconGauge, IconUsers } from '@tabler/icons-react';
import { cn } from '@wisihe/utils';

export type RecipeMetaBadgesProps = {
  prepTime?: number | null;
  cookingTime?: number | null;
  totalTime?: number | null;
  servings?: number | null;
  difficulty?: 'easy' | 'medium' | 'hard' | null;
  /** Pre-resolved calories per serving (app resolves from nutrition macros). */
  caloriesPerServing?: number | null;
  variant?: 'hero' | 'card';
  className?: string;
};

const DIFFICULTY_LABEL: Record<string, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
};

export function RecipeMetaBadges({
  prepTime,
  cookingTime,
  totalTime,
  servings,
  difficulty,
  caloriesPerServing,
  variant = 'card',
  className,
}: RecipeMetaBadgesProps) {
  const isHero = variant === 'hero';
  const badgeClass = isHero
    ? 'border-white/35 bg-black/70 text-white backdrop-blur-lg'
    : 'border-border/25 bg-surface/50 text-foreground-subtle backdrop-blur-xs';

  const items = [
    caloriesPerServing != null
      ? { icon: IconFlame, label: `${caloriesPerServing} kcal / serving` }
      : null,
    prepTime ? { icon: IconClock, label: `Prep ${prepTime} min` } : null,
    cookingTime ? { icon: IconFlame, label: `Cook ${cookingTime} min` } : null,
    totalTime ? { icon: IconClock, label: `Total ${totalTime} min` } : null,
    servings ? { icon: IconUsers, label: `${servings} servings` } : null,
    difficulty
      ? {
          icon: IconGauge,
          label: DIFFICULTY_LABEL[difficulty] ?? difficulty,
        }
      : null,
  ].filter(Boolean) as Array<{ icon: typeof IconClock; label: string }>;

  if (!items.length) return null;

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {items.map(item => (
        <span
          key={item.label}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium shadow-sm',
            badgeClass,
          )}
        >
          <item.icon className='size-3.5 shrink-0 opacity-80' aria-hidden />
          {item.label}
        </span>
      ))}
    </div>
  );
}
