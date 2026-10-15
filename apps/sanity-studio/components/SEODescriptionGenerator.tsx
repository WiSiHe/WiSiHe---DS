import { Button, Card, Text, TextArea } from '@sanity/ui';
import OpenAI from 'openai';
import type React from 'react';
import { useState } from 'react';
import { type StringInputProps, set, unset, useFormValue } from 'sanity';
import { OPENAI_API_KEY } from '../environment';

let _client: OpenAI | null = null;
function getClient(): OpenAI {
  if (!_client) {
    if (!OPENAI_API_KEY) {
      throw new Error('Missing OpenAI API key. Please set OPENAI_API_KEY in your environment.');
    }
    _client = new OpenAI({
      apiKey: OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });
  }
  return _client;
}

const SEODescriptionGenerator = (props: StringInputProps) => {
  const { value, onChange } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Access the 'description' field value
  const description = useFormValue(['description']);

  const handleChangeDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const response = e.target.value;
    onChange(response ? set(response) : unset());
  };

  const handleGenerateDescription = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const client = getClient();
      const params: OpenAI.Chat.ChatCompletionCreateParams = {
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content:
              'You are an AI SEO expert writer. Re-write the following text into a good SEO description in 122 characters or less, it should never exceede 122: "' +
              ((description as string) || ''),
          },
        ],
      };
      const chatCompletion: OpenAI.Chat.ChatCompletion =
        await client.chat.completions.create(params);

      const feedback = chatCompletion.choices[0].message.content?.trim() || '';

      const seoDescription = feedback.replace(/"/g, '');

      // Update the value with the generated SEO description
      onChange(set(seoDescription));
    } catch (err: unknown) {
      console.error('Error generating SEO description:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card padding={4} tone='transparent' border>
      <Card paddingBottom={2}>
        <TextArea
          value={value || ''}
          onChange={handleChangeDescription}
          rows={3}
          placeholder='Enter your description here...'
        />
      </Card>
      <Card paddingBottom={2}>
        <Text size={1} muted>
          {value ? value.length : 0} / 122 characters
        </Text>
      </Card>
      <Button
        text={isLoading ? 'Generating...' : 'Generate SEO Description'}
        disabled={isLoading || !description}
        tone='primary'
        onClick={() => void handleGenerateDescription()}
      />
      {error && (
        <Text size={1} weight='medium' color='danger' style={{ marginTop: '0.5rem' }}>
          {error}
        </Text>
      )}
    </Card>
  );
};

export default SEODescriptionGenerator;
