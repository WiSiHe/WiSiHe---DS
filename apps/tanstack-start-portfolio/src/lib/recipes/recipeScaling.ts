export type RecipeIngredientLike = {
  ingredient?: string | null;
  amount?: string | null;
  unit?: string | null;
};

const UNICODE_FRACTIONS: Record<string, number> = {
  '¼': 0.25,
  '½': 0.5,
  '¾': 0.75,
  '⅓': 1 / 3,
  '⅔': 2 / 3,
};

const NUMBER_PATTERN = '\\d+\\s+\\d+/\\d+|\\d+/\\d+|\\d+(?:[.,]\\d+)?[¼½¾⅓⅔]?|[¼½¾⅓⅔]';
const NUMBER_REGEX = new RegExp(NUMBER_PATTERN, 'g');

function parseNumber(token: string): number {
  const mixed = token.match(/^(\d+)\s+(\d+)\/(\d+)$/);
  if (mixed) return Number(mixed[1]) + Number(mixed[2]) / Number(mixed[3]);
  const fraction = token.match(/^(\d+)\/(\d+)$/);
  if (fraction) return Number(fraction[1]) / Number(fraction[2]);
  const last = token.at(-1) ?? '';
  const unicode = UNICODE_FRACTIONS[last];
  if (unicode !== undefined) return Number(token.slice(0, -1) || 0) + unicode;
  return Number(token.replace(',', '.'));
}

function formatNumber(value: number): string {
  return String(Math.round(value * 100) / 100);
}

/**
 * Scales every number in a CMS amount string, so ranges ("250–300") keep both endpoints and any
 * surrounding wording is preserved. A factor of 1 returns the original text untouched.
 */
export function scaleAmount(amount: string | null | undefined, factor: number): string {
  const text = amount ?? '';
  if (!text || factor === 1 || !Number.isFinite(factor)) return text;
  return text.replace(NUMBER_REGEX, token => formatNumber(parseNumber(token) * factor));
}

export function getServingsFactor(base: number | null | undefined, servings: number): number {
  return base && base > 0 ? servings / base : 1;
}

function ingredientVariations(name: string): string[] {
  const n = name.toLowerCase().trim();
  const variations = [n, n.endsWith('s') ? n.slice(0, -1) : `${n}s`];
  if (n.endsWith('y')) variations.push(`${n.slice(0, -1)}ies`);
  if (n.endsWith('ies')) variations.push(`${n.slice(0, -3)}y`);
  return variations;
}

/**
 * Replaces `{{name}}` / `{{ingredient:name}}` tokens with the scaled "amount unit name" text.
 * Unmatched tokens fall back to the bare name so template syntax never reaches the page.
 */
export function resolveIngredientTokens(
  text: string,
  ingredients: RecipeIngredientLike[],
  factor = 1,
): string {
  return text.replace(/\{\{([^}]+)\}\}/g, (_match, reference: string) => {
    const name = reference.replace(/^\s*ingredient:/, '').trim();
    const found = ingredients.find(i => i.ingredient?.toLowerCase().trim() === name.toLowerCase());
    if (!found) return name;

    const unit = found.unit ?? '';
    const unitHasName = ingredientVariations(found.ingredient ?? '').some(v =>
      unit.toLowerCase().includes(v),
    );
    return [scaleAmount(found.amount, factor), unit, unitHasName ? '' : found.ingredient]
      .filter(Boolean)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
  });
}

type PortableTextBlockLike = {
  _type?: string;
  children?: Array<{ _type?: string; text?: string; marks?: string[] }>;
};

/**
 * Resolves ingredient tokens inside Portable Text spans. Adjacent unmarked spans are merged first
 * because the editor can split a token across spans.
 */
export function resolveInstructionBlocks<T>(
  blocks: T,
  ingredients: RecipeIngredientLike[],
  factor = 1,
): T {
  if (!Array.isArray(blocks)) return blocks;
  return (blocks as PortableTextBlockLike[]).map(block => {
    if (block._type !== 'block' || !block.children) return block;
    const merged: NonNullable<PortableTextBlockLike['children']> = [];
    for (const child of block.children) {
      const prev = merged.at(-1);
      const plain = (c?: { _type?: string; marks?: string[] }) =>
        c?._type === 'span' && !c.marks?.length;
      if (prev && plain(prev) && plain(child)) {
        merged[merged.length - 1] = { ...prev, text: (prev.text ?? '') + (child.text ?? '') };
      } else {
        merged.push({ ...child });
      }
    }
    return {
      ...block,
      children: merged.map(child =>
        child._type === 'span' && typeof child.text === 'string'
          ? { ...child, text: resolveIngredientTokens(child.text, ingredients, factor) }
          : child,
      ),
    };
  }) as T;
}
