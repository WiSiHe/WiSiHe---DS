import { createImageUrlBuilder } from '@sanity/image-url';

type EnvLike = Record<string, string | undefined>;

export type NextSanityConfig = {
  projectId: string;
  dataset: string;
  apiVersion: string;
  studioUrl: string;
  readToken?: string;
  writeToken?: string;
};

export type AstroSanityConfig = {
  projectId?: string;
  dataset?: string;
  apiVersion: string;
  studioUrl?: string;
};

export function assertValue<T>(value: T | undefined, errorMessage: string): T {
  if (value === undefined) {
    throw new Error(errorMessage);
  }

  return value;
}

export function getNextSanityConfig(env: EnvLike): NextSanityConfig {
  return {
    dataset: assertValue(
      env.NEXT_PUBLIC_SANITY_DATASET,
      'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET',
    ),
    projectId: assertValue(
      env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID',
    ),
    apiVersion: env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-10-28',
    studioUrl: env.NEXT_PUBLIC_SANITY_STUDIO_URL || 'http://localhost:3333',
    readToken: env.NEXT_PUBLIC_SANITY_API_READ_TOKEN,
    writeToken: env.NEXT_PUBLIC_SANITY_API_WRITE_TOKEN,
  };
}

export function getAstroSanityConfig(env: EnvLike): AstroSanityConfig {
  return {
    projectId: env.PUBLIC_SANITY_PROJECT_ID || env.SANITY_PROJECT_ID,
    dataset: env.PUBLIC_SANITY_DATASET || env.SANITY_DATASET,
    apiVersion: env.PUBLIC_SANITY_API_VERSION || env.SANITY_API_VERSION || '2024-01-01',
    studioUrl: env.PUBLIC_SANITY_STUDIO_URL,
  };
}

export function createSanityImageBuilder(config: { projectId: string; dataset: string }) {
  return createImageUrlBuilder({
    projectId: config.projectId,
    dataset: config.dataset,
  });
}
