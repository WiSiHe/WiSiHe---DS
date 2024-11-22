// Check if an array is empty
export function isEmptyArray<T>(arr: T[] | undefined | null): boolean {
  return !arr || arr.length === 0;
}

// Check if an array is not empty
export function isNotEmptyArray<T>(arr: T[] | undefined | null): arr is T[] {
  return Array.isArray(arr) && arr.length > 0;
}

// Get the first element of an array
export function first<T>(arr: T[] | undefined | null): T | undefined {
  return isNotEmptyArray(arr) ? arr[0] : undefined;
}

// Get the last element of an array
export function last<T>(arr: T[] | undefined | null): T | undefined {
  return isNotEmptyArray(arr) ? arr[arr.length - 1] : undefined;
}
