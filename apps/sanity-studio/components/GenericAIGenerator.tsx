import {
  ApiIcon,
  CheckmarkCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  DocumentIcon,
  WarningOutlineIcon,
} from '@sanity/icons';
import { Badge, Button, Card, Flex, Spinner, Text, TextArea } from '@sanity/ui';
import OpenAI from 'openai';
import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { WiStars } from 'react-icons/wi';
import { type StringInputProps, set, unset, useClient, useFormValue } from 'sanity';
import { OPENAI_API_KEY } from '../environment';
import { buildAiMetadataContext } from '../utils/buildAiMetadataContext';
import { urlFor } from '../utils/image';

// Lazy client — created on first use so module import doesn't fail in CLI/SSR contexts
let _client: OpenAI | null = null;
function getClient(): OpenAI {
  if (!_client) {
    _client = new OpenAI({ apiKey: OPENAI_API_KEY, dangerouslyAllowBrowser: true });
  }
  return _client;
}

function getValueAtPath(obj: unknown, path: string[]): unknown {
  let current: unknown = obj;
  for (const segment of path) {
    if (current == null) return undefined;
    if (typeof current !== 'object') return undefined;
    current = (current as Record<string, unknown>)[segment];
  }
  return current;
}

function extractTextFromBlockContent(blockContent: unknown): string {
  if (!blockContent || !Array.isArray(blockContent)) return '';

  return blockContent
    .map((block: any) => {
      if (block._type === 'block' && block.children) {
        return block.children.map((child: any) => child.text || '').join('');
      }
      return '';
    })
    .join(' ')
    .trim();
}

function extractTagNames(tags: unknown): string {
  if (!tags || !Array.isArray(tags)) return '';

  return tags
    .map((tag: any) => {
      if (typeof tag === 'string') return tag;
      if (tag && typeof tag === 'object' && tag.name) return tag.name;
      return '';
    })
    .filter(Boolean)
    .join(', ');
}

interface GenericAIGeneratorProps extends StringInputProps {
  // The prompt to send to the AI
  prompt?: string;
  // Optional image field to analyze (for image-based generation)
  imageField?: string;
  // Character limit for the output (optional)
  characterLimit?: number;
  // Number of rows for the textarea
  rows?: number;
  // Placeholder text for the textarea
  placeholder?: string;
  // Optional function to transform the AI response before setting it
  transformResponse?: (response: string) => string;
  // Optional field dependencies to include in the prompt
  fieldDependencies?: {
    [key: string]: string; // field path -> variable name in prompt
  };
  /** When true, generation is blocked until the image field has a value. */
  imageRequired?: boolean;
  /** Inject EXIF/GPS and location fields into {fileMetadata} in the prompt. */
  includeFileMetadata?: boolean;
}

const GenericAIGenerator = (props: GenericAIGeneratorProps) => {
  const {
    value,
    onChange,
    prompt,
    imageField,
    characterLimit,
    rows = 3,
    placeholder = 'Generated content will appear here...',
    transformResponse,
    fieldDependencies,
    imageRequired = Boolean(imageField && !fieldDependencies),
    includeFileMetadata = false,
  } = props;

  const client = useClient({ apiVersion: '2024-10-28' });

  // Default prompt if none provided
  const defaultPrompt = imageField
    ? 'Describe this image: style, colors, subject, mood.'
    : 'Generate relevant content for this field.';

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [showPromptEditor, setShowPromptEditor] = useState(false);
  const [customPrompt, setCustomPrompt] = useState(prompt || defaultPrompt);

  const documentValue = useFormValue([]) as Record<string, unknown> | undefined;

  const image = imageField
    ? (getValueAtPath(documentValue, imageField.split('.')) as string | undefined | null)
    : null;

  const dependencyValues = useMemo(() => {
    if (!fieldDependencies) return {};
    const out: Record<string, string> = {};
    for (const [fieldPath, variableName] of Object.entries(fieldDependencies)) {
      const fieldValue = getValueAtPath(documentValue, fieldPath.split('.'));
      let extracted = '';
      if (fieldPath === 'content' && fieldValue) {
        extracted = extractTextFromBlockContent(fieldValue);
      } else if (fieldPath === 'tags' && fieldValue) {
        extracted = extractTagNames(fieldValue);
      } else {
        extracted = fieldValue ? String(fieldValue) : '';
      }
      const trimmed = extracted.trim();
      const existing = out[variableName]?.trim() ?? '';
      if (trimmed && !existing) {
        out[variableName] = trimmed;
      } else if (!out[variableName]) {
        out[variableName] = extracted;
      }
    }
    return out;
  }, [documentValue, fieldDependencies]);

  const finalPrompt = customPrompt || defaultPrompt;

  function handleChangeContent(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const response = e.target.value;
    onChange(response ? set(response) : unset());
  }

  async function handleAIGeneration() {
    setIsLoading(true);
    setError(null);

    if (imageRequired && !imageUrl) {
      setError('Image URL is missing');
      setIsLoading(false);
      return;
    }

    // If field dependencies are required but not available
    if (fieldDependencies) {
      const missingDependencies = Object.entries(dependencyValues).filter(([, value]) => {
        return !value || (typeof value === 'string' && value.trim() === '');
      });

      if (missingDependencies.length > 0) {
        const missingFields = missingDependencies.map(([variableName]) => variableName).join(', ');
        setError(`Required fields are missing: ${missingFields}`);
        setIsLoading(false);
        return;
      }
    }

    try {
      const content: OpenAI.Chat.ChatCompletionContentPart[] = [];

      // Add text content
      let processedPrompt = finalPrompt;

      if (fieldDependencies && Object.keys(dependencyValues).length > 0) {
        Object.entries(dependencyValues).forEach(([variableName, value]) => {
          const placeholder = `{${variableName}}`;
          const stringValue = typeof value === 'string' ? value : String(value || '');
          processedPrompt = processedPrompt.replace(new RegExp(placeholder, 'g'), stringValue);
        });
      }

      if (includeFileMetadata) {
        const imageValue = imageField
          ? (getValueAtPath(documentValue, imageField.split('.')) as
              | { asset?: { _ref?: string } }
              | undefined)
          : undefined;
        const metadataContext = await buildAiMetadataContext(
          client,
          documentValue,
          imageValue?.asset?._ref,
        );
        processedPrompt = processedPrompt.replace(/\{fileMetadata\}/g, metadataContext);
      }

      content.push({
        type: 'text',
        text: processedPrompt,
      });

      // Add image content if available
      if (imageUrl) {
        content.push({
          type: 'image_url',
          image_url: { url: imageUrl },
        });
      }

      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        {
          role: 'user',
          content,
        },
      ];

      const params: OpenAI.Chat.ChatCompletionCreateParams = {
        model: 'o4-mini-2025-04-16',
        messages,
      };

      const chatCompletion: OpenAI.Chat.ChatCompletion =
        await getClient().chat.completions.create(params);

      const response = chatCompletion.choices[0].message.content?.trim() || '';

      // Apply transformation if provided, otherwise just clean quotes
      const finalResponse = transformResponse
        ? transformResponse(response)
        : response.replace(/"/g, '');

      onChange(set(finalResponse));
    } catch (err: unknown) {
      console.error('Error generating content:', err);
      setError(err instanceof Error ? err.message : 'Error occurred while generating content');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!imageField || !image) {
      setImageUrl('');
      if (imageRequired) {
        setError('Image URL is missing');
      }
      return;
    }

    setError(null);
    const sanityUrl = urlFor(image).width(256).height(256).url();
    setImageUrl(sanityUrl);
  }, [image, imageField, imageRequired]);

  return (
    <Card padding={4} tone='transparent' border radius={2} shadow={1}>
      {/* Header with AI badge */}
      <Flex align='center' gap={2} paddingBottom={3}>
        <ApiIcon />
        <Text size={1} weight='semibold'>
          AI Content Generator
        </Text>
        {isLoading && (
          <Badge tone='primary' padding={2}>
            <Flex align='center' gap={1}>
              <Spinner />
              <Text size={0}>Generating...</Text>
            </Flex>
          </Badge>
        )}
      </Flex>

      {/* Collapsible prompt editor */}
      <Card paddingBottom={3} tone='transparent'>
        <Button
          mode='bleed'
          onClick={() => setShowPromptEditor(!showPromptEditor)}
          icon={showPromptEditor ? ChevronUpIcon : ChevronDownIcon}
          text={showPromptEditor ? 'Hide prompt editor' : 'Customize prompt'}
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
            <Card paddingTop={1} tone='transparent'>
              <Text size={0} muted>
                Current prompt: {finalPrompt}
              </Text>
            </Card>
          </Card>
        )}
      </Card>

      {/* Character counter */}
      <Card paddingBottom={2} tone='transparent'>
        <Flex align='center' gap={1}>
          <DocumentIcon />
          <Text size={1} muted>
            {value ? value.length : 0} {characterLimit ? `/ ${characterLimit}` : ''} characters
          </Text>
        </Flex>
      </Card>

      {/* Field dependency warning */}
      {fieldDependencies &&
        Object.keys(dependencyValues).some(key => {
          const value = dependencyValues[key];
          return !value || (typeof value === 'string' && value.trim() === '');
        }) && (
          <Card paddingBottom={2} tone='transparent'>
            <Flex align='center' gap={1}>
              <WarningOutlineIcon />
              <Text size={1} muted>
                Fill in the required fields first to generate content
              </Text>
            </Flex>
          </Card>
        )}

      {/* Text area */}
      <Card tone='transparent' paddingBottom={3}>
        <TextArea
          value={value || ''}
          onChange={handleChangeContent}
          placeholder={placeholder}
          rows={rows}
          style={{
            border: '1px solid var(--card-border-color)',
            borderRadius: '4px',
            padding: '8px 12px',
          }}
        />
      </Card>

      {/* Generate button and status */}
      <Card tone='transparent'>
        <Button
          disabled={
            isLoading ||
            (imageRequired && !imageUrl) ||
            (fieldDependencies &&
              Object.keys(dependencyValues).some(key => {
                const value = dependencyValues[key];
                return !value || (typeof value === 'string' && value.trim() === '');
              }))
          }
          loading={isLoading}
          tone='primary'
          onClick={() => void handleAIGeneration()}
          icon={isLoading ? undefined : WiStars}
          text={isLoading ? 'Generating...' : 'Generate'}
        />

        {error && (
          <Flex align='center' gap={1} paddingTop={2}>
            <WarningOutlineIcon />
            <Text size={1} weight='medium' style={{ color: 'var(--card-danger-fg-color)' }}>
              {error}
            </Text>
          </Flex>
        )}

        {value && !isLoading && !error && (
          <Flex align='center' gap={1} paddingTop={2}>
            <CheckmarkCircleIcon />
            <Text size={1} style={{ color: 'var(--card-success-fg-color)' }}>
              Content generated successfully
            </Text>
          </Flex>
        )}
      </Card>
    </Card>
  );
};

export default GenericAIGenerator;
