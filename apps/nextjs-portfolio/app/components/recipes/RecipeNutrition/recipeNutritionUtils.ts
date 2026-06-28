export type RecipeNutritionValues = {
  calories?: number | null;
  protein?: number | null;
  carbohydrates?: number | null;
  fat?: number | null;
  fiber?: number | null;
  sugar?: number | null;
  sodium?: number | null;
  notes?: string | null;
};

export function hasNutritionData(nutrition: RecipeNutritionValues | null | undefined): boolean {
  if (!nutrition) return false;
  return [
    nutrition.calories,
    nutrition.protein,
    nutrition.carbohydrates,
    nutrition.fat,
    nutrition.fiber,
    nutrition.sugar,
    nutrition.sodium,
  ].some(value => typeof value === 'number' && value > 0);
}

function roundValue(value: number, decimals = 0): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

export function scaleNutritionValue(
  value: number | null | undefined,
  factor: number,
  decimals = 0,
): number | null {
  if (value == null || value <= 0 || factor <= 0) return null;
  return roundValue(value * factor, decimals);
}

export function scaleNutrition(
  nutrition: RecipeNutritionValues,
  factor: number,
): RecipeNutritionValues {
  return {
    calories: scaleNutritionValue(nutrition.calories, factor),
    protein: scaleNutritionValue(nutrition.protein, factor, 1),
    carbohydrates: scaleNutritionValue(nutrition.carbohydrates, factor, 1),
    fat: scaleNutritionValue(nutrition.fat, factor, 1),
    fiber: scaleNutritionValue(nutrition.fiber, factor, 1),
    sugar: scaleNutritionValue(nutrition.sugar, factor, 1),
    sodium: scaleNutritionValue(nutrition.sodium, factor),
    notes: nutrition.notes,
  };
}

export function resolveCalories(nutrition: RecipeNutritionValues): number | null {
  if (nutrition.calories != null && nutrition.calories > 0) {
    return Math.round(nutrition.calories);
  }
  const protein = nutrition.protein ?? 0;
  const carbs = nutrition.carbohydrates ?? 0;
  const fat = nutrition.fat ?? 0;
  const fromMacros = protein * 4 + carbs * 4 + fat * 9;
  return fromMacros > 0 ? Math.round(fromMacros) : null;
}

export type MacroSplit = {
  proteinPct: number;
  carbsPct: number;
  fatPct: number;
  proteinKcal: number;
  carbsKcal: number;
  fatKcal: number;
  totalKcal: number;
};

export function computeMacroSplit(nutrition: RecipeNutritionValues): MacroSplit | null {
  const protein = nutrition.protein ?? 0;
  const carbs = nutrition.carbohydrates ?? 0;
  const fat = nutrition.fat ?? 0;
  if (protein <= 0 && carbs <= 0 && fat <= 0) return null;

  const proteinKcal = protein * 4;
  const carbsKcal = carbs * 4;
  const fatKcal = fat * 9;
  const macroTotal = proteinKcal + carbsKcal + fatKcal;
  const totalKcal = resolveCalories(nutrition) ?? macroTotal;
  if (totalKcal <= 0) return null;

  const basis = macroTotal > 0 ? macroTotal : totalKcal;
  return {
    proteinKcal,
    carbsKcal,
    fatKcal,
    totalKcal,
    proteinPct: Math.round((proteinKcal / basis) * 100),
    carbsPct: Math.round((carbsKcal / basis) * 100),
    fatPct: Math.round((fatKcal / basis) * 100),
  };
}

/** Reference daily intakes (approx.) for optional context labels */
export const DAILY_REFERENCE = {
  calories: 2000,
  protein: 50,
  carbohydrates: 275,
  fat: 78,
  fiber: 28,
  sugar: 50,
  sodium: 2300,
} as const;

export function dailyPercent(value: number | null | undefined, reference: number): number | null {
  if (value == null || value <= 0 || reference <= 0) return null;
  return Math.round((value / reference) * 100);
}
