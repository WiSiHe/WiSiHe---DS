/**
 * Converts a string to uppercase.
 * @param str - The string to convert
 * @returns The uppercase version of the string
 */
export function toUpperCase(str: string): string {
  return str.toUpperCase();
}

/**
 * Converts a string to lowercase.
 * @param str - The string to convert
 * @returns The lowercase version of the string
 */
export function toLowerCase(str: string): string {
  return str.toLowerCase();
}

/**
 * Converts a string to a URL-friendly slug.
 * Removes special characters and replaces spaces with hyphens.
 * @param str - The string to slugify
 * @returns A URL-friendly slug string
 */
export const slugify = (str: string): string => {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

/**
 * Strips invisible characters and Unicode diacritics from a tag name so it
 * can be safely compared/displayed.
 * Handles Sanity-encoded special characters and zero-width spaces.
 */
export function cleanTagName(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove combining diacritical marks
    .replace(/[\u200B-\u200D\uFEFF]/g, '') // Remove zero-width spaces
    .replace(/[^\w\s-]/g, '') // Remove everything except letters, numbers, spaces, hyphens
    .trim();
}
