// SEODescriptionGenerator.jsx
import {set, StringInputProps, unset, useFormValue} from 'sanity'
import {Button, Card, TextArea, Text} from '@sanity/ui'
import {useState} from 'react'
import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: process.env['SANITY_STUDIO_OPENAI_API_KEY'], // This is the default and can be omitted
  dangerouslyAllowBrowser: true, // This is the default and can be omitted
})

const SEODescriptionGenerator = (props: StringInputProps) => {
  const {value, onChange} = props

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Access the 'description' field value
  const description = useFormValue(['description'])

  const handleChangeDescription = (e: any) => {
    const response = e.target.value
    onChange(response ? set(response) : unset())
  }

  const handleGenerateDescription = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const params: OpenAI.Chat.ChatCompletionCreateParams = {
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content:
              'You are an AI SEO expert writer. Re-write the following text into a good SEO description in 122 characters or less, it should never exceede 122: "' +
              description,
          },
        ],
      }
      const chatCompletion: OpenAI.Chat.ChatCompletion =
        await client.chat.completions.create(params)

      const feedback = chatCompletion.choices[0].message.content?.trim() || ''

      const seoDescription = feedback.replace(/"/g, '')

      // Update the value with the generated SEO description
      onChange(set(seoDescription))
    } catch (err: any) {
      console.error('Error generating SEO description:', err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card padding={4} tone="transparent" border>
      <Card paddingBottom={2}>
        <TextArea
          value={value || ''}
          onChange={handleChangeDescription}
          rows={3}
          placeholder="Enter your description here..."
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
        tone="primary"
        onClick={handleGenerateDescription}
      />
      {error && (
        <Text size={1} weight="medium" color="danger" style={{marginTop: '0.5rem'}}>
          {error}
        </Text>
      )}
    </Card>
  )
}

export default SEODescriptionGenerator
