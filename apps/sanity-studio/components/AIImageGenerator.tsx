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

function getValueAtPath(obj: any, path: any[]): any {
  let current = obj;
  for (const segment of path) {
    if (current == null) return undefined;
    if (typeof segment === 'string') {
      current = current[segment];
    } else if (typeof segment === 'object' && segment._key) {
      if (Array.isArray(current)) {
        current = current.find((item: any) => item._key === segment._key);
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }
  }
  return current;
}

export default function AIImageGenerator(props: ObjectInputProps) {
  const { renderDefault, onChange, path } = props;

  const client = useClient({ apiVersion: '2024-10-28' });

  // Get ingredient name from parent object path safely via root document
  const documentValue = useFormValue([]) as Record<string, unknown> | undefined;
  const parentValue = useMemo(() => {
    if (!documentValue) return undefined;
    return getValueAtPath(documentValue, path.slice(0, -1));
  }, [documentValue, path]) as { name?: string } | undefined;
  const ingredientName = parentValue?.name || '';

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
      setError('OpenAI API Key is missing. Please set OPENAI_API_KEY in your environment.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const openai = getClient();
      const response = await openai.images.generate({
        model: 'gpt-image-2',
        prompt: finalPrompt,
        n: 1,
        size: '1024x1024',
      });

      const imageUrl = response.data[0]?.url;
      const b64Data = response.data[0]?.b64_json;
      let blob: Blob;

      if (b64Data) {
        // Convert base64 to blob in the browser
        const byteCharacters = atob(b64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        blob = new Blob([byteArray], { type: 'image/png' });
      } else if (imageUrl) {
        const imgResponse = await fetch(imageUrl);
        if (!imgResponse.ok) {
          throw new Error(`Failed to fetch generated image: ${imgResponse.statusText}`);
        }
        blob = await imgResponse.blob();
      } else {
        throw new Error('No image data returned from OpenAI');
      }

      // Upload to Sanity
      const filename = `${ingredientName.toLowerCase().replace(/[^a-z0-9]/g, '_') || 'ingredient'}.png`;
      const asset = await client.assets.upload('image', blob, {
        filename,
      });

      // Generate Alt Text using gpt-4o-mini and the temporary image URL
      let altText = '';
      try {
        const chatCompletion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: `Write a short, descriptive alt text (under 100 characters) for this ingredient image of ${ingredientName || 'a food ingredient'}. It is isolated on a clean solid white background. Focus on its appearance, color, and texture. Keep it concise for screen readers.`,
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: imageUrl,
                  },
                },
              ],
            },
          ],
          max_tokens: 50,
        });
        altText = chatCompletion.choices[0]?.message?.content?.trim() || '';
        // Remove quotes if wrapped
        altText = altText.replace(/^["']|["']$/g, '');
      } catch (err) {
        console.error('Failed to generate alt text automatically:', err);
        altText = `Fresh ${ingredientName || 'food ingredient'} isolated on a white background`;
      }

      // Set both the asset reference and the automatically generated alt text inside Sanity
      onChange(
        set({
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: asset._id,
          },
          alt: altText,
        }),
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
            text={isLoading ? 'Generating with GPT Image 2...' : 'Generate with GPT Image 2'}
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
