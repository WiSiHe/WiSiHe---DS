'use client';

import { cn } from '@wisihe/utils';
import { useMemo } from 'react';
import {
  computeMacroSplit,
  DAILY_REFERENCE,
  dailyPercent,
  hasNutritionData,
  type RecipeNutritionValues,
  resolveCalories,
  scaleNutrition,
} from './recipeNutritionUtils';

type RecipeNutritionProps = {
  nutrition: RecipeNutritionValues | null | undefined;
  servings: number;
  baseServings: number;
  className?: string;
};

type StatRow = {
  key: string;
  label: string;
  value: string;
  sublabel?: string;
  emphasis?: boolean;
};

function formatGrams(value: number | null | undefined): string | null {
  if (value == null || value <= 0) return null;
  return `${value % 1 === 0 ? value : value.toFixed(1)} g`;
}

function formatMilligrams(value: number | null | undefined): string | null {
  if (value == null || value <= 0) return null;
  return `${Math.round(value)} mg`;
}

export default function RecipeNutrition({
  nutrition,
  servings,
  baseServings,
  className,
}: RecipeNutritionProps) {
  const batchFactor = baseServings > 0 ? servings / baseServings : 1;
  const showBatch = servings !== baseServings && baseServings > 0;

  const perServing = nutrition;
  const batch = useMemo(
    () => (nutrition && showBatch ? scaleNutrition(nutrition, batchFactor) : null),
    [batchFactor, nutrition, showBatch],
  );

  const macroSplit = useMemo(
    () => (perServing ? computeMacroSplit(perServing) : null),
    [perServing],
  );

  if (!hasNutritionData(nutrition) || !perServing) return null;

  const caloriesPerServing = resolveCalories(perServing);

  const buildStats = (values: RecipeNutritionValues): StatRow[] => {
    const calories = resolveCalories(values);
    const rows: StatRow[] = [];

    if (calories != null) {
      rows.push({
        key: 'calories',
        label: 'Calories',
        value: `${calories}`,
        sublabel: 'kcal',
        emphasis: true,
      });
    }
    const protein = formatGrams(values.protein);
    if (protein) {
      const pct = dailyPercent(values.protein, DAILY_REFERENCE.protein);
      rows.push({
        key: 'protein',
        label: 'Protein',
        value: protein,
        sublabel: pct != null ? `${pct}% DV` : undefined,
      });
    }
    const carbs = formatGrams(values.carbohydrates);
    if (carbs) {
      const pct = dailyPercent(values.carbohydrates, DAILY_REFERENCE.carbohydrates);
      rows.push({
        key: 'carbs',
        label: 'Carbs',
        value: carbs,
        sublabel: pct != null ? `${pct}% DV` : undefined,
      });
    }
    const fat = formatGrams(values.fat);
    if (fat) {
      const pct = dailyPercent(values.fat, DAILY_REFERENCE.fat);
      rows.push({
        key: 'fat',
        label: 'Fat',
        value: fat,
        sublabel: pct != null ? `${pct}% DV` : undefined,
      });
    }
    const fiber = formatGrams(values.fiber);
    if (fiber) {
      rows.push({
        key: 'fiber',
        label: 'Fiber',
        value: fiber,
        sublabel: dailyPercent(values.fiber, DAILY_REFERENCE.fiber)
          ? `${dailyPercent(values.fiber, DAILY_REFERENCE.fiber)}% DV`
          : undefined,
      });
    }
    const sugar = formatGrams(values.sugar);
    if (sugar) {
      rows.push({ key: 'sugar', label: 'Sugar', value: sugar });
    }
    const sodium = formatMilligrams(values.sodium);
    if (sodium) {
      const pct = dailyPercent(values.sodium, DAILY_REFERENCE.sodium);
      rows.push({
        key: 'sodium',
        label: 'Sodium',
        value: sodium,
        sublabel: pct != null ? `${pct}% DV` : undefined,
      });
    }

    return rows;
  };

  const perServingStats = buildStats(perServing);
  const batchStats = batch ? buildStats(batch) : null;

  return (
    <section
      className={cn('rounded-2xl border border-border/20 bg-surface/80 p-5', className)}
      aria-labelledby='recipe-nutrition-heading'
    >
      <div className='mb-4'>
        <h3
          id='recipe-nutrition-heading'
          className='text-lg font-bold tracking-tight text-foreground font-sans'
        >
          Nutrition
        </h3>
        <p className='mt-1 text-xs text-foreground-muted'>
          Per serving
          {showBatch ? ` · batch totals for ${servings} servings below` : ''}
        </p>
      </div>

      {caloriesPerServing != null ? (
        <div className='mb-4 flex items-end gap-2 border-b border-border/10 pb-4'>
          <span className='text-4xl font-extrabold tabular-nums text-accent'>
            {caloriesPerServing}
          </span>
          <span className='pb-1 text-sm font-medium text-foreground-muted'>kcal / serving</span>
        </div>
      ) : null}

      {macroSplit ? (
        <div className='mb-4'>
          <p className='mb-2 text-xs font-semibold uppercase tracking-wider text-foreground-muted'>
            Macro split
          </p>
          <div className='flex h-2 overflow-hidden rounded-full bg-surface-subtle'>
            <div
              className='bg-sky-500/80'
              style={{ width: `${macroSplit.proteinPct}%` }}
              title={`Protein ${macroSplit.proteinPct}%`}
            />
            <div
              className='bg-amber-500/80'
              style={{ width: `${macroSplit.carbsPct}%` }}
              title={`Carbs ${macroSplit.carbsPct}%`}
            />
            <div
              className='bg-rose-500/80'
              style={{ width: `${macroSplit.fatPct}%` }}
              title={`Fat ${macroSplit.fatPct}%`}
            />
          </div>
          <div className='mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-foreground-muted'>
            <span>
              <span className='inline-block size-2 rounded-full bg-sky-500/80 mr-1' aria-hidden />
              Protein {macroSplit.proteinPct}%
            </span>
            <span>
              <span className='inline-block size-2 rounded-full bg-amber-500/80 mr-1' aria-hidden />
              Carbs {macroSplit.carbsPct}%
            </span>
            <span>
              <span className='inline-block size-2 rounded-full bg-rose-500/80 mr-1' aria-hidden />
              Fat {macroSplit.fatPct}%
            </span>
          </div>
        </div>
      ) : null}

      <dl className='grid grid-cols-2 gap-3 sm:grid-cols-3'>
        {perServingStats
          .filter(row => row.key !== 'calories')
          .map(row => (
            <div
              key={row.key}
              className='rounded-xl border border-border/10 bg-background/40 px-3 py-2'
            >
              <dt className='text-xs text-foreground-muted'>{row.label}</dt>
              <dd className='mt-0.5 text-sm font-semibold tabular-nums text-foreground'>
                {row.value}
                {row.sublabel ? (
                  <span className='ml-1 text-xs font-normal text-foreground-muted'>
                    {row.sublabel}
                  </span>
                ) : null}
              </dd>
            </div>
          ))}
      </dl>

      {showBatch && batchStats && batch ? (
        <div className='mt-4 border-t border-border/10 pt-4'>
          <p className='mb-2 text-xs font-semibold uppercase tracking-wider text-foreground-muted'>
            Whole batch ({servings} servings)
          </p>
          <p className='text-sm text-foreground'>
            {resolveCalories(batch) != null ? (
              <span className='font-semibold tabular-nums'>
                {resolveCalories(batch)} kcal total
              </span>
            ) : null}
            {batch.protein ? (
              <span className='text-foreground-muted'> · {formatGrams(batch.protein)} protein</span>
            ) : null}
          </p>
        </div>
      ) : null}

      {perServing.notes ? (
        <p className='mt-4 text-xs leading-relaxed text-foreground-muted'>{perServing.notes}</p>
      ) : (
        <p className='mt-4 text-xs text-foreground-muted'>
          % DV = approximate share of a 2,000 kcal daily diet.
        </p>
      )}
    </section>
  );
}
