import { SparklesIcon } from '@sanity/icons';
import { Box, Button, Card, Flex, Stack, Text } from '@sanity/ui';
import OpenAI from 'openai';
import { useState } from 'react';
import { type ObjectInputProps, set, useClient, useFormValue } from 'sanity';
import { OPENAI_API_KEY } from '../environment';

let _client: OpenAI | null = null;
function getOpenAI(): OpenAI {
  if (!_client) {
    _client = new OpenAI({ apiKey: OPENAI_API_KEY, dangerouslyAllowBrowser: true });
  }
  return _client;
}

type FetchedRecipe = {
  title?: string;
  servings?: number;
  ingredientCategories?: Array<{
    categoryName?: string;
    ingredients?: Array<{
      amount?: string;
      unit?: string;
      ingredient?: string;
    }>;
  }>;
};

function buildIngredientSummary(recipe: FetchedRecipe): string {
  const list: string[] = [];
  if (recipe.title?.trim()) list.push(`Recipe: ${recipe.title.trim()}`);
  if (recipe.servings && recipe.servings > 0) list.push(`Servings: ${recipe.servings}`);

  for (const category of recipe.ingredientCategories ?? []) {
    if (category.categoryName?.trim()) list.push(`\n${category.categoryName}:`);
    for (const row of category.ingredients ?? []) {
      const ing = row.ingredient?.trim();
      if (!ing) continue;
      const amount = [row.amount, row.unit].filter(Boolean).join(' ');
      list.push(amount ? `- ${amount} ${ing}` : `- ${ing}`);
    }
  }

  return list.join('\n');
}

type NutritionPayload = {
  calories?: number;
  protein?: number;
  carbohydrates?: number;
  fat?: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  notes?: string;
};

function parseNutritionJson(raw: string): NutritionPayload | null {
  const trimmed = raw.trim();
  const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return null;
  try {
    const parsed = JSON.parse(jsonMatch[0]) as NutritionPayload;
    return parsed;
  } catch {
    return null;
  }
}

export default function NutritionEstimator(props: ObjectInputProps) {
  const { renderDefault, onChange } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sanityClient = useClient({ apiVersion: '2024-01-01' });
  const documentId = useFormValue(['_id']) as string | undefined;

  const handleEstimate = async () => {
    if (!documentId) {
      setError('Save the recipe first, then estimate nutrition.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const recipe = await sanityClient.fetch<FetchedRecipe>(
        `*[_id == $id][0]{
          title,
          servings,
          ingredientCategories[]{
            categoryName,
            ingredients[]{
              amount,
              unit,
              "ingredient": ingredient->name
            }
          }
        }`,
        { id: documentId },
      );

      const ingredientSummary = buildIngredientSummary(recipe ?? {});
      if (!ingredientSummary.trim()) {
        setError('Add ingredients and servings before estimating.');
        return;
      }

      const completion = await getOpenAI().chat.completions.create({
        model: 'gpt-4o-mini',
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content:
              'You estimate recipe nutrition per serving for home cooking. Return JSON only with numeric fields: calories, protein, carbohydrates, fat, fiber, sugar, sodium (all per serving; sodium in mg). Include notes as a short disclaimer string. Be reasonable — round to whole numbers.',
          },
          {
            role: 'user',
            content: `Estimate nutrition per serving for:\n\n${ingredientSummary}`,
          },
        ],
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) throw new Error('Empty response from AI');

      const parsed = parseNutritionJson(content);
      if (!parsed) throw new Error('Could not parse nutrition response');

      onChange(
        set({
          _type: 'recipeNutrition',
          calories: parsed.calories ?? undefined,
          protein: parsed.protein ?? undefined,
          carbohydrates: parsed.carbohydrates ?? undefined,
          fat: parsed.fat ?? undefined,
          fiber: parsed.fiber ?? undefined,
          sugar: parsed.sugar ?? undefined,
          sodium: parsed.sodium ?? undefined,
          notes: parsed.notes ?? 'Approximate values — adjust for your ingredients.',
        }),
      );
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Estimation failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Stack space={3}>
      <Card padding={3} tone='transparent' border radius={2}>
        <Flex align='center' justify='space-between' gap={3} wrap='wrap'>
          <Box flex={1}>
            <Text size={1} weight='semibold'>
              Nutrition estimator
            </Text>
            <Text size={1} muted>
              AI rough estimate from your ingredient list — always verify before publishing.
            </Text>
          </Box>
          <Button
            icon={SparklesIcon}
            text={isLoading ? 'Estimating…' : 'Estimate with AI'}
            tone='primary'
            mode='ghost'
            disabled={isLoading || !documentId}
            onClick={() => void handleEstimate()}
          />
        </Flex>
        {error ? (
          <Box marginTop={3}>
            <Text size={1} style={{ color: 'var(--card-badge-caution-fg-color)' }}>
              {error}
            </Text>
          </Box>
        ) : null}
      </Card>
      {renderDefault(props)}
    </Stack>
  );
}
