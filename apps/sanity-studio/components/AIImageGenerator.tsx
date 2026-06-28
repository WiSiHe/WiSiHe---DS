import {
  ApiIcon,
  CheckmarkCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  WarningOutlineIcon,
} from '@sanity/icons';
import { Badge, Button, Card, Flex, Spinner, Stack, Text, TextArea } from '@sanity/ui';
import OpenAI from 'openai';
import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { WiStars } from 'react-icons/wi';
import { type ObjectInputProps, set, useClient, useFormValue } from 'sanity';
import { OPENAI_API_KEY } from '../environment';

let _client: OpenAI | null = null;
function getClient(): OpenAI {
  if (!_client) {
    _client = new OpenAI({ apiKey: OPENAI_API_KEY, dangerouslyAllowBrowser: true });
  }
  return _client;
}

export default function AIImageGenerator(props: ObjectInputProps) {
  const { renderDefault, onChange, path } = props;

  const client = useClient({ apiVersion: '2024-10-28' });

  // Get ingredient name from parent object path
  const parentPath = path.slice(0, -1);
  const parentValue = useFormValue(parentPath) as { ingredient?: string } | undefined;
  const ingredientName = parentValue?.ingredient || '';

  const defaultPrompt = useMemo(() => {
    return ingredientName
      ? `a fresh ${ingredientName} isolated on a clean solid white background, professional studio food photography, clean lighting, sharp focus, product shot`
      : 'a fresh food ingredient isolated on a clean solid white background, professional studio food photography, clean lighting, sharp focus, product shot';
  }, [ingredientName]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPromptEditor, setShowPromptEditor] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [success, setSuccess] = useState(false);

  // Sync custom prompt when default prompt changes
  useEffect(() => {
    setCustomPrompt(defaultPrompt);
  }, [defaultPrompt]);

  const finalPrompt = customPrompt || defaultPrompt;

  async function handleImageGeneration() {
    if (!OPENAI_API_KEY) {
      setError(
        'OpenAI API Key is missing. Please set SANITY_STUDIO_OPENAI_API_KEY in your environment.',
      );
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const openai = getClient();
      const response = await openai.images.generate({
        model: 'dall-e-3',
        prompt: finalPrompt,
        n: 1,
        size: '1024x1024',
      });

      const imageUrl = response.data[0]?.url;
      if (!imageUrl) {
        throw new Error('No image URL returned from OpenAI');
      }

      // Fetch DALL-E image as blob
      const imgResponse = await fetch(imageUrl);
      if (!imgResponse.ok) {
        throw new Error(`Failed to fetch generated image: ${imgResponse.statusText}`);
      }
      const blob = await imgResponse.blob();

      // Upload to Sanity
      const filename = `${ingredientName.toLowerCase().replace(/[^a-z0-9]/g, '_') || 'ingredient'}.png`;
      const asset = await client.assets.upload('image', blob, {
        filename,
      });

      // Set the value inside Sanity
      onChange(
        set(
          {
            _type: 'reference',
            _ref: asset._id,
          },
          ['asset'],
        ),
      );
      setSuccess(true);
    } catch (err: unknown) {
      console.error('Error generating image:', err);
      setError(
        err instanceof Error ? err.message : 'An error occurred while generating the image.',
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Stack space={3}>
      {renderDefault(props)}

      <Card padding={3} tone='transparent' border radius={2} shadow={1}>
        <Flex align='center' gap={2} paddingBottom={2}>
          <ApiIcon />
          <Text size={1} weight='semibold'>
            AI Ingredient Photo Generator
          </Text>
          {isLoading && (
            <Badge tone='primary' padding={2}>
              <Flex align='center' gap={1}>
                <Spinner />
                <Text size={0}>Generating & Uploading...</Text>
              </Flex>
            </Badge>
          )}
        </Flex>

        <Card paddingBottom={3} tone='transparent'>
          <Button
            mode='bleed'
            onClick={() => setShowPromptEditor(!showPromptEditor)}
            icon={showPromptEditor ? ChevronUpIcon : ChevronDownIcon}
            text={showPromptEditor ? 'Hide prompt' : 'Show prompt'}
            style={{ width: '100%', justifyContent: 'flex-start' }}
          />
          {showPromptEditor && (
            <Card paddingTop={2} tone='transparent'>
              <TextArea
                value={customPrompt}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setCustomPrompt(e.target.value)
                }
                placeholder={defaultPrompt}
                rows={3}
                style={{
                  border: '1px solid var(--card-border-color)',
                  borderRadius: '4px',
                  padding: '8px 12px',
                  fontSize: '12px',
                }}
              />
            </Card>
          )}
        </Card>

        <Flex gap={2} align='center'>
          <Button
            disabled={isLoading || !finalPrompt}
            loading={isLoading}
            tone='primary'
            onClick={() => void handleImageGeneration()}
            icon={isLoading ? undefined : WiStars}
            text={isLoading ? 'Generating with DALL-E 3...' : 'Generate with DALL-E 3'}
          />
        </Flex>

        {error && (
          <Flex align='center' gap={1} paddingTop={2}>
            <WarningOutlineIcon />
            <Text size={1} weight='medium' style={{ color: 'var(--card-danger-fg-color)' }}>
              {error}
            </Text>
          </Flex>
        )}

        {success && !isLoading && !error && (
          <Flex align='center' gap={1} paddingTop={2}>
            <CheckmarkCircleIcon />
            <Text size={1} style={{ color: 'var(--card-success-fg-color)' }}>
              Image generated and set successfully!
            </Text>
          </Flex>
        )}
      </Card>
    </Stack>
  );
}
