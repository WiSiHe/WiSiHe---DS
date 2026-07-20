import type { PortableTextBlock } from 'next-sanity';
import { processInstructionText } from '@/app/utils/instructionProcessor';
import PortableText from '../../cms/PortableText/PortableText';

type PrintIngredient = {
  ingredient: string;
  amount: string;
  unit: string;
  notes?: string;
};

type PrintIngredientCategory = {
  categoryName: string;
  ingredients: PrintIngredient[];
};

type PrintInstruction = {
  title?: string | null;
  content: PortableTextBlock[] | readonly PortableTextBlock[];
};

type PrintTip = {
  title?: string | null;
  content: string;
};

type RecipePrintViewProps = {
  title: string;
  description?: string | null;
  servings: number;
  prepTime?: number | null;
  cookingTime?: number | null;
  totalTime?: number | null;
  difficulty?: 'easy' | 'medium' | 'hard' | null;
  caloriesPerServing?: number | null;
  ingredientCategories: PrintIngredientCategory[];
  instructions?: PrintInstruction[] | null;
  tips?: PrintTip[] | null;
  url: string;
};

function formatMinutes(minutes: number | null | undefined): string | null {
  if (minutes == null || minutes <= 0) return null;
  return `${minutes} min`;
}

function difficultyLabel(value: RecipePrintViewProps['difficulty']): string | null {
  if (!value) return null;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function processInstructionContent(
  content: PortableTextBlock[] | readonly PortableTextBlock[],
  ingredients: PrintIngredient[],
): PortableTextBlock[] {
  return [...content].map(block => {
    if (block._type !== 'block' || !block.children) return block;

    const processedChildren = block.children.flatMap(child => {
      if (child._type !== 'span' || typeof child.text !== 'string') return [child];

      const processedText = processInstructionText(child.text, ingredients);
      const parts = processedText.split(/(\*\*[^*]+\*\*)/g);

      return parts
        .map((part, partIndex) => {
          if (!part) return null;
          if (part.startsWith('**') && part.endsWith('**')) {
            return {
              _key: `${child._key}-print-${partIndex}`,
              _type: 'span' as const,
              text: part.slice(2, -2),
              marks: ['strong'],
            };
          }
          return {
            _key: `${child._key}-print-${partIndex}`,
            _type: 'span' as const,
            text: part,
            marks: child.marks ?? [],
          };
        })
        .filter((part): part is NonNullable<typeof part> => part !== null);
    });

    return { ...block, children: processedChildren };
  });
}

/** Screen-hidden, print-only recipe sheet with current scaled servings. */
export default function RecipePrintView({
  title,
  description,
  servings,
  prepTime,
  cookingTime,
  totalTime,
  difficulty,
  caloriesPerServing,
  ingredientCategories,
  instructions,
  tips,
  url,
}: RecipePrintViewProps) {
  const metaItems = [
    servings > 0 ? `${servings} serving${servings === 1 ? '' : 's'}` : null,
    formatMinutes(prepTime) ? `Prep ${formatMinutes(prepTime)}` : null,
    formatMinutes(cookingTime) ? `Cook ${formatMinutes(cookingTime)}` : null,
    formatMinutes(totalTime) ? `Total ${formatMinutes(totalTime)}` : null,
    difficultyLabel(difficulty),
    caloriesPerServing != null ? `${caloriesPerServing} kcal / serving` : null,
  ].filter((item): item is string => Boolean(item));

  const flatIngredients = ingredientCategories.flatMap(category => category.ingredients);

  return (
    <article className='recipe-print-view hidden print:block'>
      <header className='mb-6 border-b border-black/20 pb-4'>
        <p className='mb-1 text-xs uppercase tracking-[0.2em] text-black/55'>WiSiHe · Recipe</p>
        <h1 className='text-3xl font-bold tracking-tight text-black'>{title}</h1>
        {description ? (
          <p className='mt-3 text-base leading-relaxed text-black/80'>{description}</p>
        ) : null}
        {metaItems.length > 0 ? (
          <p className='mt-3 text-sm text-black/70'>{metaItems.join(' · ')}</p>
        ) : null}
      </header>

      <div className='grid grid-cols-1 gap-8 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)]'>
        <section className='break-inside-avoid'>
          <h2 className='mb-3 border-b border-black/15 pb-1 text-sm font-bold uppercase tracking-wider text-black'>
            Ingredients
          </h2>
          <div className='space-y-4'>
            {ingredientCategories.map(category => (
              <div key={category.categoryName}>
                {category.categoryName ? (
                  <h3 className='mb-1.5 text-xs font-semibold uppercase tracking-wide text-black/60'>
                    {category.categoryName}
                  </h3>
                ) : null}
                <ul className='space-y-1.5 text-sm text-black'>
                  {category.ingredients.map((ingredient, index) => (
                    <li
                      key={`${category.categoryName}-${ingredient.ingredient}-${index}`}
                      className='flex justify-between gap-3'
                    >
                      <span>
                        {ingredient.ingredient}
                        {ingredient.notes ? (
                          <span className='block text-xs text-black/55'>{ingredient.notes}</span>
                        ) : null}
                      </span>
                      <span className='shrink-0 tabular-nums text-black/75'>
                        {ingredient.amount} {ingredient.unit}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className='mb-3 border-b border-black/15 pb-1 text-sm font-bold uppercase tracking-wider text-black'>
            Instructions
          </h2>
          {instructions && instructions.length > 0 ? (
            <ol className='space-y-4'>
              {instructions.map((instruction, index) => (
                <li key={instruction.title ?? `step-${index}`} className='break-inside-avoid'>
                  <p className='mb-1 text-sm font-semibold text-black'>
                    <span className='mr-2 tabular-nums text-black/50'>{index + 1}.</span>
                    {instruction.title ?? `Step ${index + 1}`}
                  </p>
                  <div className='pl-5 text-sm leading-relaxed text-black/85 [&_a]:text-black [&_a]:underline'>
                    <PortableText
                      value={processInstructionContent(instruction.content, flatIngredients)}
                    />
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <p className='text-sm text-black/60'>No instructions available.</p>
          )}
        </section>
      </div>

      {tips && tips.length > 0 ? (
        <section className='mt-8 break-inside-avoid border-t border-black/15 pt-4'>
          <h2 className='mb-3 text-sm font-bold uppercase tracking-wider text-black'>Tips</h2>
          <ul className='space-y-2 text-sm text-black/80'>
            {tips.map((tip, index) => (
              <li key={tip.title ?? `tip-${index}`}>
                {tip.title ? <span className='font-semibold text-black'>{tip.title}: </span> : null}
                {tip.content}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <footer className='mt-10 border-t border-black/15 pt-3 text-xs text-black/55'>
        <p>Henrik Wilhelm Sissener · wisihe.no</p>
        <p className='mt-0.5 break-all'>{url}</p>
      </footer>
    </article>
  );
}
