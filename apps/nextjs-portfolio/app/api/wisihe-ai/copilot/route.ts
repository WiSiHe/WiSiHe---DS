import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { openaiApiKey, sanityAiProxyAllowedOrigins, sanityAiProxySecret } from '@/lib/env';

export const runtime = 'nodejs';

const SECRET =
  sanityAiProxySecret() || (process.env.NODE_ENV !== 'production' ? 'wisihe-dev-local-secret' : '');
const OPENAI_KEY = openaiApiKey();

function originAllowed(origin: string): boolean {
  const explicit = sanityAiProxyAllowedOrigins();
  if (explicit?.trim()) {
    return explicit
      .split(',')
      .map(s => s.trim())
      .some(entry => entry === '*' || entry === origin);
  }
  try {
    const host = new URL(origin).hostname;
    return host === 'localhost' || host.endsWith('.sanity.studio') || host.endsWith('.sanity.io');
  } catch {
    return false;
  }
}

function corsHeaders(origin: string | null): Headers {
  const headers = new Headers();
  if (origin && originAllowed(origin)) {
    headers.set('Access-Control-Allow-Origin', origin);
    headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    headers.set('Vary', 'Origin');
  }
  return headers;
}

export async function OPTIONS(req: Request) {
  const origin = req.headers.get('origin');
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}

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

export async function POST(req: Request) {
  const origin = req.headers.get('origin');
  const headers = corsHeaders(origin);

  if (origin && !originAllowed(origin)) {
    return NextResponse.json({ error: 'Forbidden origin' }, { status: 403, headers });
  }

  if (!SECRET || req.headers.get('authorization') !== `Bearer ${SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers });
  }

  if (!OPENAI_KEY) {
    return NextResponse.json({ error: 'Server missing OPENAI_API_KEY' }, { status: 503, headers });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400, headers });
  }

  const o = body as Record<string, unknown>;
  const action = (typeof o['action'] === 'string' ? o['action'] : 'custom') as CopilotAction;
  const text = typeof o['text'] === 'string' ? o['text'] : '';
  const prompt = typeof o['prompt'] === 'string' ? o['prompt'] : '';
  const documentTitle = typeof o['documentTitle'] === 'string' ? o['documentTitle'] : '';
  const tone = (typeof o['tone'] === 'string' ? o['tone'] : undefined) as CopilotTone | undefined;
  const perspective = (typeof o['perspective'] === 'string' ? o['perspective'] : undefined) as
    | CopilotPerspective
    | undefined;
  const rawTemperature = typeof o['temperature'] === 'number' ? o['temperature'] : 0.7;
  const temperature = Math.min(Math.max(rawTemperature, 0.1), 1.0);

  const allowedModels = [
    'gpt-6-astra',
    'gpt-6',
    'gpt-5.6-sol',
    'gpt-5.6',
    'gpt-5.6-terra',
    'gpt-5.6-luna',
    'gpt-5.4',
    'gpt-5.4-nano',
    'gpt-5',
    'gpt-4.5',
    'gpt-4.5-preview',
    'o3',
    'o3-mini',
    'o1',
    'gpt-4o',
    'gpt-4o-mini',
  ];
  const requestedModel = typeof o['model'] === 'string' ? o['model'] : '';
  const selectedModel = allowedModels.includes(requestedModel)
    ? requestedModel
    : process.env['OPENAI_COPILOT_MODEL'] || 'gpt-5.6-sol';

  if (!text.trim() && !prompt.trim()) {
    return NextResponse.json({ error: 'Missing text or prompt' }, { status: 400, headers });
  }

  const toneInstructions: Record<CopilotTone, string> = {
    technical:
      'Tone: Rigorous, analytical, precise, and engineering-focused with clear architectural thinking.',
    narrative:
      'Tone: Evocative, literary, sensory, and immersive storytelling with rich atmosphere.',
    punchy:
      'Tone: Crisp, high-impact, minimalist, fast-paced, using strong verbs and short sentences.',
    casual:
      'Tone: Approachable, conversational, authentic, and warmly engaging without being unpolished.',
    executive:
      'Tone: Strategic, high-level, outcome-oriented, emphasizing value, architecture, and scope.',
  };

  const perspectiveInstructions: Record<CopilotPerspective, string> = {
    'first-person':
      'Perspective: Write in the first person ("I" or "we"), representing Henrik Wilhelm Sissener (artist, developer, technical director).',
    'third-person':
      'Perspective: Write in the third person documentary or studio voice ("Henrik", "The project", "The team").',
  };

  const systemInstructions = [
    'You are a thoughtful, world-class editor and writer assisting Henrik Wilhelm Sissener (artist, developer, storyteller).',
    tone ? toneInstructions[tone] : 'Tone: Elegant, clear, vivid, articulate, and grounded.',
    perspective
      ? perspectiveInstructions[perspective]
      : 'Perspective: Natural and authentic to Henrik Wilhelm Sissener.',
    'Output rule: Output only the requested text or markdown. Never add conversational prefixes or suffixes like "Here is the rewritten text:".',
  ].join(' ');

  let userPrompt = '';

  switch (action) {
    case 'continue':
      userPrompt = `Context document title: "${documentTitle}".\nContinue writing smoothly and compellingly from the following passage:\n\n"""\n${text}\n"""`;
      break;
    case 'improve':
      userPrompt = `Refine and elevate the clarity, rhythm, and precision of the following passage while preserving its core essence:\n\n"""\n${text}\n"""`;
      break;
    case 'shorten':
      userPrompt = `Make the following text more concise, sharp, and impactful without losing essential nuance:\n\n"""\n${text}\n"""`;
      break;
    case 'expand':
      userPrompt = `Elaborate on the following text with evocative depth, concrete details, and clear explanations:\n\n"""\n${text}\n"""`;
      break;
    case 'fix-grammar':
      userPrompt = `Fix any grammatical errors, awkward phrasing, and typos in the following text while keeping the author's voice intact:\n\n"""\n${text}\n"""`;
      break;
    case 'translate-no':
      userPrompt = `Translate the following text into natural, elegant Norwegian (Bokmål):\n\n"""\n${text}\n"""`;
      break;
    case 'generate-alt':
      userPrompt = `Based on the following document context ("${documentTitle}") and surrounding text or image note:\n"""\n${text || prompt}\n"""\n\nGenerate two items:\n1. A descriptive, accessible alt text (under 125 characters, no "image of" prefix)\n2. An elegant caption for the image.\n\nFormat your output exactly as:\nAlt: <alt text here>\nCaption: <caption here>`;
      break;
    case 'generate-subheadings':
      userPrompt = `Document: "${documentTitle}"\nAnalyze the following draft content and generate a structured hierarchy of compelling Markdown H2 and H3 subheadings to organize it logically:\n\n"""\n${text}\n"""`;
      break;
    case 'outline-to-draft':
      userPrompt = `Document: "${documentTitle}"\nTransform the following rough outline, notes, or bullet points into a fluid, beautifully written long-form editorial draft:\n\n"""\n${text}\n"""`;
      break;
    case 'tldr':
      userPrompt = `Generate a high-impact TL;DR executive summary callout block for the following text:\n\n"""\n${text}\n"""\n\nFormat as markdown callout:\n> 📌 **TL;DR**\n> - **Concept:** ...\n> - **Key Highlights:** ...\n> - **Outcome / Takeaway:** ...`;
      break;
    case 'critique':
      userPrompt = `Act as an elite editorial director and critique this draft. Evaluate structure, pacing, tone consistency, engagement, and clarity. Provide 3-5 concise, high-value recommendations in markdown bullet points:\n\n"""\n${text}\n"""`;
      break;
    case 'tone-shift':
      userPrompt = `Rewrite the following passage strictly embodying the requested tone (${tone || 'elevated'}):\n\n"""\n${text}\n"""`;
      break;
    case 'accordion-condense':
      userPrompt = `Document: "${documentTitle}"\nAnalyze the following passage and package/structure it into an interactive Collapsible Deep Dive format. Extract a compelling section title and organize the body with articulate paragraphs or bullet points.\nFormat your output strictly as:\n<details><summary>[Specific, engaging section title]</summary>\n\n[Well-structured deep dive paragraphs, specifications, or bullet points]\n</details>\n\nOriginal passage:\n"""\n${text}\n"""`;
      break;
    default:
      userPrompt = `${prompt}\n\nReference text:\n"""\n${text}\n"""`;
      break;
  }

  try {
    const openai = new OpenAI({ apiKey: OPENAI_KEY });
    let usedModel = selectedModel;
    let output = '';

    try {
      const isNewModel =
        selectedModel.startsWith('gpt-5') ||
        selectedModel.startsWith('gpt-6') ||
        selectedModel.startsWith('o');
      const response = await openai.chat.completions.create({
        model: selectedModel,
        messages: [
          { role: 'system', content: systemInstructions },
          { role: 'user', content: userPrompt },
        ],
        ...(isNewModel ? {} : { temperature }),
        max_completion_tokens: 1800,
      });
      output = response.choices[0]?.message?.content?.trim() || '';
    } catch (modelErr: unknown) {
      if (selectedModel !== 'gpt-4o' && (modelErr as { status?: number } | null)?.status === 404) {
        const fallbackResponse = await openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: systemInstructions },
            { role: 'user', content: userPrompt },
          ],
          temperature,
          max_tokens: 1800,
        });
        output = fallbackResponse.choices[0]?.message?.content?.trim() || '';
        usedModel = 'gpt-4o';
      } else {
        throw modelErr;
      }
    }

    return NextResponse.json({ result: output, model: usedModel }, { headers });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'AI completion failed';
    return NextResponse.json({ error: message }, { status: 500, headers });
  }
}
