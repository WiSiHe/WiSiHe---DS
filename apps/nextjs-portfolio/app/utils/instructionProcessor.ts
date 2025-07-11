interface Ingredient {
  ingredient: string;
  amount: string;
  unit: string;
  isDiscrete?: boolean;
  notes?: string;
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

    // Only add ingredient name for measurement units (grams, liters, dl, etc.)
    const measurementUnits = [
      'g',
      'gram',
      'grams',
      'kg',
      'l',
      'liter',
      'liters',
      'dl',
      'cl',
      'ml',
      'tbsp',
      'tbs',
      'tsp',
      'cup',
      'cups',
      'oz',
      'pound',
      'pounds',
      'lb',
    ];
    const isMeasurementUnit = measurementUnits.some(unit =>
      displayUnit.toLowerCase().includes(unit.toLowerCase()),
    );

    const displayIngredientName = isMeasurementUnit ? ingredient.ingredient : '';

    return `**${displayAmount} ${displayUnit}${displayIngredientName ? ` ${displayIngredientName}` : ''}**`;
  });
}
