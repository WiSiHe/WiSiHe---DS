/**
 * Checks if a value is a plain object (not null, array, or primitive).
 * @param obj - The value to check
 * @returns True if the value is a plain object
 */
export function isObject(obj: unknown): obj is Record<string, unknown> {
  return obj !== null && typeof obj === 'object';
}

interface EmptyObject {
  [key: string]: never;
}

/**
 * Checks if an object is empty (has no enumerable properties).
 * @param obj - The object to check
 * @returns True if the object has no properties
 */
export function isEmptyObject(obj: Record<string, unknown>): obj is EmptyObject {
  return Object.keys(obj).length === 0;
}

/**
 * Checks if an object is not empty (has enumerable properties).
 * @param obj - The object to check
 * @returns True if the object has properties
 */
export function isNotEmptyObject(obj: Record<string, unknown>): obj is Record<string, unknown> {
  return Object.keys(obj).length > 0;
}
