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
  content?: string;
};

type RecipePrintViewProps = {
  title: string;
  description?: string | null;
  servings: number;
  prepTime?: number | null;
  cookingTime?: number | null;
  totalTime?: number | null;
  difficulty?: string | null;
  ingredientCategories: PrintIngredientCategory[];
  instructions?: PrintInstruction[] | null;
  tips?: Array<{ title?: string | null; content: string }> | null;
  url: string;
};

function formatMinutes(minutes: number | null | undefined): string | null {
  if (minutes == null || minutes <= 0) return null;
  return `${minutes} min`;
}

export function RecipePrintView({
  title,
  description,
  servings,
  prepTime,
  cookingTime,
  totalTime,
  difficulty,
  ingredientCategories,
  instructions,
  tips,
  url,
}: RecipePrintViewProps) {
  const meta = [
    servings ? `${servings} servings` : null,
    formatMinutes(prepTime) ? `Prep ${formatMinutes(prepTime)}` : null,
    formatMinutes(cookingTime) ? `Cook ${formatMinutes(cookingTime)}` : null,
    formatMinutes(totalTime) ? `Total ${formatMinutes(totalTime)}` : null,
    difficulty ? difficulty.charAt(0).toUpperCase() + difficulty.slice(1) : null,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <article className='recipe-print-view' aria-hidden>
      <header className='recipe-print-header'>
        <p className='recipe-print-kicker'>Recipe</p>
        <h1 className='recipe-print-title'>{title}</h1>
        {description ? <p className='recipe-print-description'>{description}</p> : null}
        {meta ? <p className='recipe-print-meta'>{meta}</p> : null}
      </header>

      {ingredientCategories.length > 0 ? (
        <section className='recipe-print-section'>
          <h2 className='recipe-print-heading'>Ingredients</h2>
          {ingredientCategories.map(category => (
            <div key={category.categoryName || 'ingredients'} className='recipe-print-category'>
              {category.categoryName ? (
                <h3 className='recipe-print-subheading'>{category.categoryName}</h3>
              ) : null}
              <ul className='recipe-print-ingredients'>
                {category.ingredients.map(item => (
                  <li key={`${item.ingredient}-${item.amount}`}>
                    <span className='recipe-print-ingredient-name'>
                      {item.ingredient}
                      {item.notes ? (
                        <span className='recipe-print-note'> ({item.notes})</span>
                      ) : null}
                    </span>
                    <span className='recipe-print-amount'>
                      {[item.amount, item.unit].filter(Boolean).join(' ')}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      ) : null}

      {instructions && instructions.length > 0 ? (
        <section className='recipe-print-section'>
          <h2 className='recipe-print-heading'>Instructions</h2>
          <ol className='recipe-print-steps'>
            {instructions.map((step, index) => (
              <li key={step.title || index} className='recipe-print-step'>
                {step.title ? <p className='recipe-print-step-title'>{step.title}</p> : null}
                {step.content ? <p className='recipe-print-body'>{step.content}</p> : null}
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {tips && tips.length > 0 ? (
        <section className='recipe-print-section'>
          <h2 className='recipe-print-heading'>Tips</h2>
          <ul className='recipe-print-tips'>
            {tips.map((tip, index) => (
              <li key={tip.title || index}>
                {tip.title ? <strong>{tip.title}: </strong> : null}
                {tip.content}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <footer className='recipe-print-footer'>
        <p>{url}</p>
        <p>Recipe by Henrik Wilhelm Sissener</p>
      </footer>
    </article>
  );
}
