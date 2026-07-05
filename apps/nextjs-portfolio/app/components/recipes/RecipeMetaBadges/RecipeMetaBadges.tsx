import { RecipeMetaBadges as RecipeMetaBadgesView } from '@wisihe/ui-react';
import {
  type RecipeNutritionValues,
  resolveCalories,
} from '../RecipeNutrition/recipeNutritionUtils';

type RecipeMetaBadgesProps = {
  prepTime?: number | null;
  cookingTime?: number | null;
  totalTime?: number | null;
  servings?: number | null;
  difficulty?: 'easy' | 'medium' | 'hard' | null;
  nutrition?: RecipeNutritionValues | null;
  variant?: 'hero' | 'card';
  className?: string;
};

/** App adapter — resolves calories from Sanity nutrition, then defers to the package view. */
export function RecipeMetaBadges({ nutrition, ...rest }: RecipeMetaBadgesProps) {
  const caloriesPerServing = nutrition ? resolveCalories(nutrition) : null;
  return <RecipeMetaBadgesView {...rest} caloriesPerServing={caloriesPerServing} />;
}
