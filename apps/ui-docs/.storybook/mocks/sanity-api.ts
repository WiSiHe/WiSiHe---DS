/** Storybook stand-in for `@/sanity/lib/api` — avoids required Sanity env vars. */
export const projectId = 'storybook';
export const dataset = 'production';
export const apiVersion = '2024-10-28';
export const studioUrl = 'http://localhost:3333';
export const readToken = undefined;
export const writeToken = undefined;

export function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage);
  }
  return v;
}
