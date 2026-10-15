import type { PortableTextBlock } from 'next-sanity';
import { processInstructionText } from '@/app/utils/instructionProcessor';

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

type PrintParagraph = {
  text: string;
  kind: 'text' | 'list' | 'tip';
  tipTitle?: string;
};

function formatMinutes(minutes: number | null | undefined): string | null {
  if (minutes == null || minutes <= 0) return null;
  return `${minutes} min`;
}

function difficultyLabel(value: RecipePrintViewProps['difficulty']): string | null {
  if (!value) return null;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/** Flatten Portable Text into plain print paragraphs — no tip cards / grid quirks. */
function contentToPrintParagraphs(
  content: PortableTextBlock[] | readonly PortableTextBlock[],
  ingredients: PrintIngredient[],
): PrintParagraph[] {
  const paragraphs: PrintParagraph[] = [];

  for (const block of content) {
    const typed = block as PortableTextBlock & {
      _type: string;
      listItem?: string;
      title?: string;
      content?: string;
      children?: { _type?: string; text?: string }[];
    };

    if (typed._type === 'recipeTip') {
      const tipText = typed.content?.trim();
      if (tipText) {
        paragraphs.push({
          kind: 'tip',
          tipTitle: typed.title?.trim() || undefined,
          text: tipText,
        });
      }
      continue;
    }

    if (typed._type !== 'block' || !typed.children?.length) continue;

    const raw = typed.children.map(child => child.text ?? '').join('');
    const withAmounts = processInstructionText(raw, ingredients).replace(/\*\*/g, '');
    const text = withAmounts.replace(/\s+/g, ' ').trim();
    if (!text) continue;

    paragraphs.push({
      kind: typed.listItem ? 'list' : 'text',
      text,
    });
  }

  return paragraphs;
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
    <article className='recipe-print-view'>
      <header className='recipe-print-header'>
        <p className='recipe-print-kicker'>WiSiHe · Recipe</p>
        <h1 className='recipe-print-title'>{title}</h1>
        {description ? <p className='recipe-print-description'>{description}</p> : null}
        {metaItems.length > 0 ? <p className='recipe-print-meta'>{metaItems.join(' · ')}</p> : null}
      </header>

      <section className='recipe-print-section'>
        <h2 className='recipe-print-heading'>Ingredients</h2>
        {ingredientCategories.map(category => (
          <div key={category.categoryName} className='recipe-print-category'>
            {category.categoryName ? (
              <h3 className='recipe-print-subheading'>{category.categoryName}</h3>
            ) : null}
            <ul className='recipe-print-ingredients'>
              {category.ingredients.map((ingredient, index) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: ingredients can repeat within a category and have no id
                <li key={`${category.categoryName}-${ingredient.ingredient}-${index}`}>
                  <span className='recipe-print-ingredient-name'>
                    {ingredient.ingredient}
                    {ingredient.notes ? (
                      <span className='recipe-print-note'> — {ingredient.notes}</span>
                    ) : null}
                  </span>
                  <span className='recipe-print-amount'>
                    {ingredient.amount} {ingredient.unit}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className='recipe-print-section'>
        <h2 className='recipe-print-heading'>Instructions</h2>
        {instructions && instructions.length > 0 ? (
          <ol className='recipe-print-steps'>
            {instructions.map((instruction, index) => {
              const paragraphs = contentToPrintParagraphs(instruction.content, flatIngredients);
              return (
                <li key={instruction.title ?? `step-${index}`} className='recipe-print-step'>
                  <p className='recipe-print-step-title'>
                    {index + 1}. {instruction.title?.replace(/:\s*$/, '') || `Step ${index + 1}`}
                  </p>
                  {paragraphs.map((paragraph, paragraphIndex) => {
                    if (paragraph.kind === 'tip') {
                      return (
                        <p
                          // biome-ignore lint/suspicious/noArrayIndexKey: paragraphs derived from portable text have no id
                          key={`${index}-tip-${paragraphIndex}`}
                          className='recipe-print-inline-tip'
                        >
                          {paragraph.tipTitle ? (
                            <strong>{paragraph.tipTitle}: </strong>
                          ) : (
                            <strong>Tip: </strong>
                          )}
                          {paragraph.text}
                        </p>
                      );
                    }
                    if (paragraph.kind === 'list') {
                      return (
                        // biome-ignore lint/suspicious/noArrayIndexKey: paragraphs derived from portable text have no id
                        <p key={`${index}-list-${paragraphIndex}`} className='recipe-print-bullet'>
                          • {paragraph.text}
                        </p>
                      );
                    }
                    return (
                      // biome-ignore lint/suspicious/noArrayIndexKey: paragraphs derived from portable text have no id
                      <p key={`${index}-text-${paragraphIndex}`} className='recipe-print-body'>
                        {paragraph.text}
                      </p>
                    );
                  })}
                </li>
              );
            })}
          </ol>
        ) : (
          <p className='recipe-print-body'>No instructions available.</p>
        )}
      </section>

      {tips && tips.length > 0 ? (
        <section className='recipe-print-section'>
          <h2 className='recipe-print-heading'>Tips</h2>
          <ul className='recipe-print-tips'>
            {tips.map((tip, index) => (
              <li key={tip.title ?? `tip-${index}`}>
                {tip.title ? <strong>{tip.title}: </strong> : null}
                {tip.content}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <footer className='recipe-print-footer'>
        <p>Henrik Wilhelm Sissener · wisihe.no</p>
        <p>{url}</p>
      </footer>
    </article>
  );
}
