import { Button, Card, Text, TextArea } from '@sanity/ui';
import OpenAI from 'openai';
import type React from 'react';
import { useEffect, useState } from 'react';
import { type StringInputProps, set, unset, useFormValue } from 'sanity';
import { OPENAI_API_KEY } from '../environment';
import { urlFor } from '../utils/image';

const client = new OpenAI({
  apiKey: OPENAI_API_KEY, // This is the default and can be omitted
  dangerouslyAllowBrowser: true, // This is the default and can be omitted
});

const BASE_PROMPT = `You write museum wall labels for a digital art portfolio.

Requirements:
- 1–2 sentences, 40–240 characters total
- Third person only (never "I", "my", "we", "me")
- Do not repeat or quote the artwork title
- Describe: subject, composition, colour or light, mood or theme
- Tone: precise and calm, like a curator—not a blog post or social caption
- Present tense; no exclamation marks`;

const IMAGE_HEIGHT = 256;
const IMAGE_WIDTH = 256;

const ImageDescriptionGenerator = (props: StringInputProps) => {
  const { value, onChange } = props;

  const image = useFormValue(['image']) as string;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');

  function handleChangeDescription(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const response = e.target.value;
    onChange(response ? set(response) : unset());
  }

  async function handleAltTextGeneration() {
    setIsLoading(true);
    setError(null);

    if (!imageUrl) {
      setError('Image URL is missing');
      setIsLoading(false);
      return;
    }

    try {
      const params: OpenAI.Chat.ChatCompletionCreateParams = {
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: BASE_PROMPT,
              },
              {
                type: 'image_url',
                image_url: { url: imageUrl },
              },
            ],
          },
        ],
      };

      const chatCompletion: OpenAI.Chat.ChatCompletion =
        await client.chat.completions.create(params);

      const response = chatCompletion.choices[0].message.content?.trim() || '';

      const description = response.replace(/"/g, '');

      onChange(set(description));
    } catch (err) {
      console.error('Error generating description text:', err);
      setError('Error occurred while generating description text');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!image) {
      setError('Image URL is missing');
      setIsLoading(false);
      return;
    }
    const sanityUrl = urlFor(image).width(IMAGE_WIDTH).height(IMAGE_HEIGHT).url();

    setImageUrl(sanityUrl);
  }, [image]);

  return (
    <Card padding={4} tone='transparent' border>
      <Card tone='transparent'>
        <TextArea
          value={value || ''}
          onChange={handleChangeDescription}
          placeholder='Alt text here...'
          rows={6}
        />
      </Card>

      <Card tone='transparent' paddingTop={2}>
        <Button
          disabled={isLoading || !imageUrl}
          loading={isLoading}
          tone='primary'
          onClick={() => void handleAltTextGeneration()}
        >
          Generate Alt Text
        </Button>
        {error && (
          <Text size={1} weight='medium' color='danger' style={{ marginTop: '0.5rem' }}>
            {error}
          </Text>
        )}
      </Card>
    </Card>
  );
};

export default ImageDescriptionGenerator;
