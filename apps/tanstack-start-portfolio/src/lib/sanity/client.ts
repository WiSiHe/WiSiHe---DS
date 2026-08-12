import { createClient, type SanityClient } from '@sanity/client';
import { getPreviewPerspective } from './draftMode';

function readEnv(...keys: string[]): string | undefined {
  for (const key of keys) {
    const viteValue = import.meta.env[key as keyof ImportMetaEnv];
    if (typeof viteValue === 'string' && viteValue.trim()) return viteValue.trim();
  }
  return undefined;
}

export function sanityProjectId(): string {
  return readEnv('VITE_SANITY_PROJECT_ID') ?? '';
}

export function sanityDataset(): string {
  return readEnv('VITE_SANITY_DATASET') ?? '';
}

export function sanityApiVersion(): string {
  return readEnv('VITE_SANITY_API_VERSION') ?? '2024-10-28';
}

/** Server-only read token for draft / preview content. */
export function sanityPreviewToken(): string | undefined {
  return readEnv(
    'VITE_SANITY_API_READ_TOKEN',
    'VITE_SANITY_PREVIEW_TOKEN',
    'SANITY_API_READ_TOKEN',
  );
}

export function createSanityClient(options?: {
  preview?: boolean;
  perspective?: 'published' | 'previewDrafts';
}): SanityClient {
  const preview = options?.preview ?? false;
  const perspective = options?.perspective ?? (preview ? 'previewDrafts' : 'published');
  const token = preview ? sanityPreviewToken() : undefined;

  return createClient({
    projectId: sanityProjectId(),
    dataset: sanityDataset(),
    apiVersion: sanityApiVersion(),
    useCdn: !preview,
    perspective,
    token,
  });
}

export function getSanityClientForRequest(request?: Request | null): SanityClient {
  const preview = getPreviewPerspective(request) === 'previewDrafts';
  const token = preview ? sanityPreviewToken() : undefined;

  if (preview && !token) {
    return createSanityClient({ preview: false, perspective: 'published' });
  }

  return createSanityClient({
    preview,
    perspective: preview ? 'previewDrafts' : 'published',
  });
}
