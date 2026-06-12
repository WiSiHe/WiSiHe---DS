import { WarningOutlineIcon } from '@sanity/icons';
import { Button, Flex, Select, Stack, Text } from '@sanity/ui';
import OpenAI from 'openai';
import type { ChangeEvent } from 'react';
import { useCallback, useState } from 'react';
import { WiStars } from 'react-icons/wi';
import {
  PatchEvent,
  type StringInputProps,
  set,
  unset,
  useClient,
  useFormCallbacks,
  useFormValue,
} from 'sanity';
import {
  COUNTRY_SELECT_OPTIONS,
  getCountryByCode,
  getCountryByName,
  matchCountryFromText,
} from '../constants/countries';
import { OPENAI_API_KEY } from '../environment';
import { PHOTOGRAPHY_COUNTRY_AI_PROMPT } from '../schemas/photographyGuidance';
import { buildAiMetadataContext } from '../utils/buildAiMetadataContext';
import { urlFor } from '../utils/image';

let _openai: OpenAI | null = null;
function getOpenAiClient(): OpenAI {
  if (!_openai) {
    _openai = new OpenAI({ apiKey: OPENAI_API_KEY, dangerouslyAllowBrowser: true });
  }
  return _openai;
}

type ImageValue = { asset?: { _ref?: string } };

export function PhotographyCountryInput(props: StringInputProps) {
  const { value, onChange } = props;
  const client = useClient({ apiVersion: '2024-10-28' });
  const { onChange: patchDocument } = useFormCallbacks();
  const document = useFormValue([]) as Record<string, unknown> | undefined;
  const countryCode = useFormValue(['countryCode']) as string | undefined;
  const image = useFormValue(['image']) as ImageValue | undefined;

  const [isSuggesting, setIsSuggesting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resolvedCode =
    countryCode?.trim().toUpperCase() || getCountryByName(value)?.code || undefined;

  const applyCountry = useCallback(
    (name: string) => {
      const country = getCountryByName(name);
      if (!country) return;
      onChange(set(country.name));
      patchDocument(PatchEvent.from([set(country.code, ['countryCode'])]));
    },
    [onChange, patchDocument],
  );

  const handleSelect = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      setError(null);
      const name = event.currentTarget.value;
      if (!name) {
        onChange(unset());
        patchDocument(PatchEvent.from([unset(['countryCode'])]));
        return;
      }
      applyCountry(name);
    },
    [applyCountry, onChange, patchDocument],
  );

  const suggestCountry = useCallback(async () => {
    const assetRef = image?.asset?._ref;
    if (!assetRef) {
      setError('Upload a photo first.');
      return;
    }

    setIsSuggesting(true);
    setError(null);

    try {
      const metadataContext = await buildAiMetadataContext(client, document, assetRef);
      const imageUrl = urlFor(image).width(768).height(768).url();
      const prompt = `${PHOTOGRAPHY_COUNTRY_AI_PROMPT}

Pick the closest match from this list only:
${COUNTRY_SELECT_OPTIONS.map(o => o.title).join(', ')}

Known metadata (prefer GPS and capture context over guessing from scenery alone):
${metadataContext}`;

      const completion = await getOpenAiClient().chat.completions.create({
        model: 'o4-mini-2025-04-16',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              { type: 'image_url', image_url: { url: imageUrl } },
            ],
          },
        ],
      });

      const raw = completion.choices[0].message.content?.trim() ?? '';
      const matched = matchCountryFromText(raw);
      if (!matched) {
        setError(`Could not match "${raw}" to the country list. Pick manually.`);
        return;
      }

      applyCountry(matched.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Country suggestion failed');
    } finally {
      setIsSuggesting(false);
    }
  }, [applyCountry, client, document, image]);

  const codeLabel = resolvedCode ? (getCountryByCode(resolvedCode)?.name ?? resolvedCode) : null;

  return (
    <Stack space={3}>
      <Select value={value ?? ''} onChange={handleSelect}>
        <option value=''>Select country…</option>
        {COUNTRY_SELECT_OPTIONS.map(option => (
          <option key={option.value} value={option.value}>
            {option.title}
          </option>
        ))}
      </Select>

      {resolvedCode ? (
        <Text size={1} muted>
          ISO code: {resolvedCode}
          {codeLabel ? ` · ${codeLabel}` : ''}
        </Text>
      ) : (
        <Text size={1} muted>
          Choose from the list — the ISO code is stored automatically for map grouping.
        </Text>
      )}

      <Flex gap={2} wrap='wrap'>
        <Button
          text={isSuggesting ? 'Suggesting…' : 'Suggest country (AI)'}
          icon={isSuggesting ? undefined : WiStars}
          loading={isSuggesting}
          mode='ghost'
          onClick={() => void suggestCountry()}
        />
      </Flex>

      {error ? (
        <Flex align='center' gap={1}>
          <WarningOutlineIcon />
          <Text size={1} style={{ color: 'var(--card-danger-fg-color)' }}>
            {error}
          </Text>
        </Flex>
      ) : null}
    </Stack>
  );
}
