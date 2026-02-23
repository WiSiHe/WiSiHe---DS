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

const BASE_PROMPT =
  'You are an AI SEO expert writer, write a good alt text for this image in 96 characters or less.';

const IMAGE_HEIGHT = 256;
const IMAGE_WIDTH = 256;

const ImageAltTextGenerator = (props: StringInputProps) => {
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
      const feedback = chatCompletion.choices[0].message.content?.trim() || '';
      const altText = feedback.replace(/"/g, '');
      onChange(set(altText));
    } catch (err) {
      console.error('Error generating alt text:', err);
      setError('Error occurred while generating alt text');
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
      <Card paddingBottom={2} tone='transparent'>
        <Text size={1} muted>
          {value ? value.length : 0} / 92 characters
        </Text>
      </Card>
      <Card tone='transparent'>
        <TextArea
          value={value || ''}
          onChange={handleChangeDescription}
          placeholder='Alt text here...'
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

export default ImageAltTextGenerator;
