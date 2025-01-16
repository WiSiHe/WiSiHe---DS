import type { RGB, RGBA } from '@figma/rest-api-spec';

/**
 * Converts an RGB or RGBA color object to a hexadecimal color string.
 *
 * This function takes an object with red, green, and blue color values (and optionally an alpha value)
 * and converts it to a hexadecimal color string. If the alpha value is present and not equal to 1, it
 * is included in the resulting hex string.
 *
 * @param color - The RGB or RGBA color object.
 * @param r - The red color value (0-1).
 * @param g - The green color value (0-1).
 * @param b - The blue color value (0-1).
 * @param a - The alpha color value (0-1), optional.
 * @returns The hexadecimal color string.
 */
export function rgbToHex({ r, g, b, ...rest }: RGB | RGBA): string {
  const a = 'a' in rest ? rest.a : 1;

  const toHex = (value: number): string => {
    const hex = Math.round(value * 255).toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  };

  const hex = [toHex(r), toHex(g), toHex(b)].join('');
  return `#${hex}${a !== 1 ? toHex(a) : ''}`;
}

/**
 * Recursively sorts the keys of an object or array of objects.
 *
 * This function takes an object or array of objects and sorts the keys of each object. Semantic tokens
 * (like 'background', 'surface', etc.) are sorted to the end, while the rest are sorted alphabetically.
 * The sorting is performed recursively for nested objects and arrays.
 *
 * @param tokens - The object or array of objects to be sorted.
 * @returns The sorted object or array of objects.
 */
export function sortTokens(tokens: any): any {
  if (typeof tokens !== 'object' || tokens === null) {
    return tokens;
  }

  if (Array.isArray(tokens)) {
    return tokens.map(sortTokens);
  }

  const sortedKeys = Object.keys(tokens).sort((a, b) => {
    // Sort semantic tokens (like 'background', 'surface', etc.) to the end
    const semanticTokens = ['background', 'surface', 'ink', 'button', 'link', 'chip'];
    const aIsSemantic = semanticTokens.includes(a);
    const bIsSemantic = semanticTokens.includes(b);
    if (aIsSemantic && !bIsSemantic) return 1;
    if (!aIsSemantic && bIsSemantic) return -1;

    // Alphabetical sort for the rest
    return a.localeCompare(b);
  });

  const sortedObject: any = {};
  for (const key of sortedKeys) {
    sortedObject[key] = sortTokens(tokens[key]);
  }

  return sortedObject;
}
