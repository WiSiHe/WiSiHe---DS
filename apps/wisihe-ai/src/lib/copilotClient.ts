import { readSanityAppProcessEnv } from '../sanityEnv';

export type CopilotAction =
  | 'continue'
  | 'improve'
  | 'shorten'
  | 'expand'
  | 'fix-grammar'
  | 'translate-no'
  | 'generate-alt'
  | 'generate-subheadings'
  | 'outline-to-draft'
  | 'tldr'
  | 'critique'
  | 'tone-shift'
  | 'accordion-condense'
  | 'custom';

export type CopilotTone = 'technical' | 'narrative' | 'punchy' | 'casual' | 'executive';
export type CopilotPerspective = 'first-person' | 'third-person';
export type CopilotModel =
  | 'gpt-6-astra'
  | 'gpt-5.6-sol'
  | 'gpt-5.6-terra'
  | 'gpt-5.6-luna'
  | 'gpt-5.4'
  | 'gpt-4o';

export const DEFAULT_AI_MODEL: CopilotModel = 'gpt-5.6-sol';

export interface ModelAvatarMeta {
  variant: 'astra' | 'sol' | 'terra' | 'luna' | 'classic';
  text: string;
  subtext?: string;
}

export const AVAILABLE_AI_MODELS: Array<{
  id: CopilotModel;
  name: string;
  codename: string;
  provider: string;
  tag: string;
  badge: string;
  description: string;
  avatar: ModelAvatarMeta;
}> = [
  {
    id: 'gpt-6-astra',
    name: 'GPT-6 Astra',
    codename: 'Astra',
    provider: 'OpenAI',
    tag: 'Frontier Flagship',
    badge: 'OpenAI GPT-6 Astra',
    description: 'Our most capable model, built for the hardest end-to-end work',
    avatar: {
      variant: 'astra',
      text: '6',
      subtext: 'astra',
    },
  },
  {
    id: 'gpt-5.6-sol',
    name: 'GPT-5.6 Sol',
    codename: 'Sol',
    provider: 'OpenAI',
    tag: 'Flagship Professional',
    badge: 'OpenAI GPT-5.6 Sol',
    description: 'Flagship model for complex professional work',
    avatar: {
      variant: 'sol',
      text: 'Sol',
    },
  },
  {
    id: 'gpt-5.6-terra',
    name: 'GPT-5.6 Terra',
    codename: 'Terra',
    provider: 'OpenAI',
    tag: 'Balanced Cost & Power',
    badge: 'OpenAI GPT-5.6 Terra',
    description: 'GPT-5.6 model that balances intelligence and cost',
    avatar: {
      variant: 'terra',
      text: 'Terra',
    },
  },
  {
    id: 'gpt-5.6-luna',
    name: 'GPT-5.6 Luna',
    codename: 'Luna',
    provider: 'OpenAI',
    tag: 'Optimized Workloads',
    badge: 'OpenAI GPT-5.6 Luna',
    description: 'GPT-5.6 model optimized for cost-sensitive workloads',
    avatar: {
      variant: 'luna',
      text: 'Luna',
    },
  },
];

export interface CopilotOptions {
  action: CopilotAction;
  text: string;
  prompt?: string;
  documentTitle?: string;
  tone?: CopilotTone;
  perspective?: CopilotPerspective;
  temperature?: number;
  model?: CopilotModel | string;
}

export interface CopilotExecutionResult {
  result: string;
  model: string;
}

const defaultProxy = 'http://localhost:1992';

export async function executeCopilotActionDetailed(
  input: CopilotOptions,
): Promise<CopilotExecutionResult> {
  const base =
    readSanityAppProcessEnv('SANITY_APP_AI_PROXY_URL') ??
    import.meta.env.VITE_AI_PROXY_URL?.trim() ??
    defaultProxy;
  const secret =
    readSanityAppProcessEnv('SANITY_APP_AI_PROXY_SECRET') ??
    import.meta.env.VITE_AI_PROXY_SECRET?.trim() ??
    (import.meta.env.DEV ? 'wisihe-dev-local-secret' : '');

  if (!secret) {
    throw new Error(
      'Missing SANITY_APP_AI_PROXY_SECRET. Ensure the secret matches SANITY_AI_PROXY_SECRET on the Next.js server.',
    );
  }

  const model = input.model || DEFAULT_AI_MODEL;

  const res = await fetch(`${base.replace(/\/$/, '')}/api/wisihe-ai/copilot`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${secret}`,
    },
    body: JSON.stringify({
      action: input.action,
      text: input.text,
      prompt: input.prompt,
      documentTitle: input.documentTitle,
      tone: input.tone,
      perspective: input.perspective,
      temperature: input.temperature,
      model,
    }),
  });

  const json = (await res.json().catch(() => ({}))) as {
    result?: string;
    model?: string;
    error?: string;
  };
  if (!res.ok) {
    throw new Error(json.error || `Copilot request failed with status ${res.status}`);
  }

  return {
    result: json.result || '',
    model: json.model || model,
  };
}

export async function executeCopilotAction(input: CopilotOptions): Promise<string> {
  const detailed = await executeCopilotActionDetailed(input);
  return detailed.result;
}

export async function uploadImageToSanity(file: File): Promise<unknown> {
  const base =
    readSanityAppProcessEnv('SANITY_APP_AI_PROXY_URL') ??
    import.meta.env.VITE_AI_PROXY_URL?.trim() ??
    defaultProxy;
  const secret =
    readSanityAppProcessEnv('SANITY_APP_AI_PROXY_SECRET') ??
    import.meta.env.VITE_AI_PROXY_SECRET?.trim();

  const formData = new FormData();
  formData.append('file', file);

  const headers: Record<string, string> = {};
  if (secret) {
    headers.Authorization = `Bearer ${secret}`;
  }

  const res = await fetch(`${base.replace(/\/$/, '')}/api/wisihe-ai/upload-image`, {
    method: 'POST',
    headers,
    body: formData,
  });

  const json = (await res.json().catch(() => ({}))) as { asset?: unknown; error?: string };
  if (!res.ok || !json.asset) {
    throw new Error(json.error || `Upload failed with status ${res.status}`);
  }

  return json.asset;
}
