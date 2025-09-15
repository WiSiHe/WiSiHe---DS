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
