interface Ingredient {
  ingredient: string;
  amount: string;
  unit: string;
  isDiscrete?: boolean;
  notes?: string;
}

function getIngredientVariations(ingredient: string): string[] {
  const ing = ingredient.toLowerCase().trim();
  const variations = [ing];
  if (ing.endsWith('s')) {
    variations.push(ing.slice(0, -1)); // e.g. eggs -> egg
  } else {
    variations.push(ing + 's'); // e.g. egg -> eggs
  }
  if (ing.endsWith('y')) {
    variations.push(ing.slice(0, -1) + 'ies'); // e.g. cherry -> cherries
  }
  if (ing.endsWith('ies')) {
    variations.push(ing.slice(0, -3) + 'y'); // e.g. cherries -> cherry
  }
  return variations;
}

export function processInstructionText(text: string, ingredients: Ingredient[]): string {
  return text.replace(/\{\{([^}]+)\}\}/g, (match, referenceName: string) => {
    const cleanName = referenceName.replace(/^ingredient:/, '').trim();
    const ingredient = ingredients.find(
      ing => ing.ingredient.toLowerCase() === cleanName.toLowerCase(),
    );

    if (!ingredient) return match; // Return original if ingredient not found

    const displayAmount = ingredient.amount;
    const displayUnit = ingredient.unit;

    // Check if the unit already contains the ingredient name or its singular/plural forms
    const variations = getIngredientVariations(ingredient.ingredient);
    const unitLower = displayUnit.toLowerCase();
    const unitAlreadyContainsIngredient = variations.some(v => unitLower.includes(v));

    const displayIngredientName = unitAlreadyContainsIngredient ? '' : ingredient.ingredient;

    // Format output cleanly, ensuring no double spaces if unit is empty
    return `**${displayAmount} ${displayUnit}${displayIngredientName ? ` ${displayIngredientName}` : ''}**`
      .replace(/\s+/g, ' ')
      .trim();
  });
}
