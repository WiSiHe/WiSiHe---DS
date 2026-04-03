/**
 * Checks if an array is empty or null/undefined.
 * @param arr - The array to check
 * @returns True if the array is empty, null, or undefined
 */
export function isEmptyArray<T>(arr: T[] | undefined | null): boolean {
  return !arr || arr.length === 0;
}

/**
 * Checks if an array is not empty and is a valid array.
 * @param arr - The array to check
 * @returns True if the array has elements and is not null/undefined
 */
export function isNotEmptyArray<T>(arr: T[] | undefined | null): arr is T[] {
  return Array.isArray(arr) && arr.length > 0;
}

/**
 * Gets the first element of an array.
 * @param arr - The array to get the first element from
 * @returns The first element or undefined if array is empty
 */
export function first<T>(arr: T[] | undefined | null): T | undefined {
  return isNotEmptyArray(arr) ? arr[0] : undefined;
}

/**
 * Gets the last element of an array.
 * @param arr - The array to get the last element from
 * @returns The last element or undefined if array is empty
 */
export function last<T>(arr: T[] | undefined | null): T | undefined {
  return isNotEmptyArray(arr) ? arr[arr.length - 1] : undefined;
}

/**
 * Fisher–Yates shuffle — returns a new array (does not mutate the input).
 */
export function shuffleArray<T>(array: readonly T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const a = shuffled[i];
    const b = shuffled[j];
    if (a !== undefined && b !== undefined) {
      shuffled[i] = b;
      shuffled[j] = a;
    }
  }
  return shuffled;
}
