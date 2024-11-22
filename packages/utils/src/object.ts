export function isObject(obj: unknown): obj is Record<string, unknown> {
  return obj !== null && typeof obj === 'object';
}

interface EmptyObject {
  [key: string]: never;
}

export function isEmptyObject(obj: Record<string, unknown>): obj is EmptyObject {
  return Object.keys(obj).length === 0;
}

export function isNotEmptyObject(obj: Record<string, unknown>): obj is Record<string, unknown> {
  return Object.keys(obj).length > 0;
}
