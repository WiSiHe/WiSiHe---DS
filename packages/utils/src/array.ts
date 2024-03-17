export function isEmptyArray<T>(arr: T[]): boolean {
  return arr.length === 0;
}

export function isNotEmptyArray<T>(arr: T[]): boolean {
  return arr.length > 0;
}

export function first<T>(arr: T[]): T {
  return arr[0];
}

export function last<T>(arr: T[]): T {
  return arr[arr.length - 1];
}
