function readEnv(...keys: string[]): string | undefined {
  for (const key of keys) {
    if (typeof process !== 'undefined' && process.env?.[key]?.trim()) {
      return process.env[key]?.trim();
    }
    const metaVal = (import.meta.env as unknown as Record<string, string | undefined>)?.[key];
    if (typeof metaVal === 'string' && metaVal.trim()) {
      return metaVal.trim();
    }
  }
  return undefined;
}

export function sanityProjectId(): string {
  return (
    readEnv('VITE_SANITY_PROJECT_ID', 'NEXT_PUBLIC_SANITY_PROJECT_ID', 'SANITY_PROJECT_ID') ??
    'cbjsv7wi'
  );
}

export function sanityDataset(): string {
  return (
    readEnv('VITE_SANITY_DATASET', 'NEXT_PUBLIC_SANITY_DATASET', 'SANITY_DATASET') ?? 'production'
  );
}

export function sanityApiVersion(): string {
  return (
    readEnv('VITE_SANITY_API_VERSION', 'NEXT_PUBLIC_SANITY_API_VERSION', 'SANITY_API_VERSION') ??
    '2025-02-19'
  );
}

export function sanityWriteToken(): string | undefined {
  return readEnv(
    'VITE_SANITY_WRITE_TOKEN',
    'VITE_SANITY_API_WRITE_TOKEN',
    'SANITY_API_WRITE_TOKEN',
    'NEXT_PUBLIC_SANITY_API_WRITE_TOKEN',
    'SANITY_AUTH_TOKEN',
  );
}

export function sanityAiProxySecret(): string | undefined {
  return readEnv('SANITY_AI_PROXY_SECRET', 'VITE_SANITY_AI_PROXY_SECRET', 'SANITY_AI_BULK_SECRET');
}

export function sanityAiProxyAllowedOrigins(): string | undefined {
  return readEnv(
    'SANITY_AI_PROXY_ALLOWED_ORIGINS',
    'VITE_SANITY_AI_PROXY_ALLOWED_ORIGINS',
    'SANITY_AI_BULK_ALLOWED_ORIGINS',
  );
}

export function openaiApiKey(): string | undefined {
  return readEnv('OPENAI_API_KEY', 'VITE_OPENAI_API_KEY');
}

export function openaiTagSuggestModel(): string {
  return readEnv('OPENAI_TAG_SUGGEST_MODEL', 'VITE_OPENAI_TAG_SUGGEST_MODEL') ?? 'gpt-5.4-nano';
}
