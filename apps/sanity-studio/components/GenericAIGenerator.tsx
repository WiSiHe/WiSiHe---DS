import React from 'react'
import {Button, Card, Text, TextArea, Flex, Badge, Spinner} from '@sanity/ui'
import {useEffect, useState} from 'react'
import {set, StringInputProps, unset, useFormValue} from 'sanity'
import {urlFor} from '../utils/image'
import OpenAI from 'openai'
import {OPENAI_API_KEY} from '../environment'
import {WiStars} from 'react-icons/wi'
import {
  ApiIcon,
  DocumentIcon,
  WarningOutlineIcon,
  CheckmarkCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@sanity/icons'

const client = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
})

interface GenericAIGeneratorProps extends StringInputProps {
  // The prompt to send to the AI
  prompt?: string
  // Optional image field to analyze (for image-based generation)
  imageField?: string
  // Character limit for the output (optional)
  characterLimit?: number
  // Number of rows for the textarea
  rows?: number
  // Placeholder text for the textarea
  placeholder?: string
  // Optional function to transform the AI response before setting it
  transformResponse?: (response: string) => string
  // Optional field dependencies to include in the prompt
  fieldDependencies?: {
    [key: string]: string // field path -> variable name in prompt
  }
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
  } = props

  // Default prompt if none provided
  const defaultPrompt = imageField
    ? 'Describe this image: style, colors, subject, mood.'
    : 'Generate relevant content for this field.'

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState<string>('')
  const [showPromptEditor, setShowPromptEditor] = useState(false)
  const [customPrompt, setCustomPrompt] = useState(prompt || defaultPrompt)

  // Get the image value if imageField is specified
  const image = imageField ? (useFormValue([imageField]) as string) : null

  // Get field dependency values
  const dependencyValues: Record<string, string> = {}
  if (fieldDependencies) {
    Object.entries(fieldDependencies).forEach(([fieldPath, variableName]) => {
      const fieldValue = useFormValue(fieldPath.split('.')) as string
      dependencyValues[variableName] = fieldValue || ''
    })
  }

  const finalPrompt = customPrompt || defaultPrompt

  function handleChangeContent(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const response = e.target.value
    onChange(response ? set(response) : unset())
  }

  async function handleAIGeneration() {
    setIsLoading(true)
    setError(null)

    // If image is required but not available
    if (imageField && !imageUrl) {
      setError('Image URL is missing')
      setIsLoading(false)
      return
    }

    // If field dependencies are required but not available
    if (fieldDependencies) {
      const missingDependencies = Object.entries(dependencyValues).filter(([, value]) => {
        return !value || value.trim() === ''
      })

      if (missingDependencies.length > 0) {
        const missingFields = missingDependencies.map(([variableName]) => variableName).join(', ')
        setError(`Required fields are missing: ${missingFields}`)
        setIsLoading(false)
        return
      }
    }

    try {
      const content: OpenAI.Chat.ChatCompletionContentPart[] = []

      // Add text content
      let processedPrompt = finalPrompt

      // Replace field dependency variables in the prompt
      if (fieldDependencies && Object.keys(dependencyValues).length > 0) {
        Object.entries(dependencyValues).forEach(([variableName, value]) => {
          const placeholder = `{${variableName}}`
          processedPrompt = processedPrompt.replace(new RegExp(placeholder, 'g'), value)
        })
      }

      content.push({
        type: 'text',
        text: processedPrompt,
      })

      // Add image content if available
      if (imageUrl) {
        content.push({
          type: 'image_url',
          image_url: {url: imageUrl},
        })
      }

      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        {
          role: 'user',
          content,
        },
      ]

      const params: OpenAI.Chat.ChatCompletionCreateParams = {
        model: 'o4-mini-2025-04-16',
        messages,
      }

      const chatCompletion: OpenAI.Chat.ChatCompletion =
        await client.chat.completions.create(params)

      const response = chatCompletion.choices[0].message.content?.trim() || ''

      // Apply transformation if provided, otherwise just clean quotes
      const finalResponse = transformResponse
        ? transformResponse(response)
        : response.replace(/"/g, '')

      onChange(set(finalResponse))
    } catch (err: unknown) {
      console.error('Error generating content:', err)
      setError(err instanceof Error ? err.message : 'Error occurred while generating content')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle image URL generation if image field is specified
  useEffect(() => {
    if (!imageField || !image) {
      // Only show image error if we're not using field dependencies
      if (!fieldDependencies) {
        setError('Image URL is missing')
        setIsLoading(false)
      }
      return
    }

    const sanityUrl = urlFor(image).width(256).height(256).url()
    setImageUrl(sanityUrl)
  }, [image, imageField, fieldDependencies])

  return (
    <Card padding={4} tone="transparent" border radius={2} shadow={1}>
      {/* Header with AI badge */}
      <Flex align="center" gap={2} paddingBottom={3}>
        <ApiIcon />
        <Text size={1} weight="semibold">
          AI Content Generator
        </Text>
        {isLoading && (
          <Badge tone="primary" padding={2}>
            <Flex align="center" gap={1}>
              <Spinner />
              <Text size={0}>Generating...</Text>
            </Flex>
          </Badge>
        )}
      </Flex>

      {/* Collapsible prompt editor */}
      <Card paddingBottom={3} tone="transparent">
        <Button
          mode="bleed"
          onClick={() => setShowPromptEditor(!showPromptEditor)}
          icon={showPromptEditor ? ChevronUpIcon : ChevronDownIcon}
          text={showPromptEditor ? 'Hide prompt editor' : 'Customize prompt'}
          style={{width: '100%', justifyContent: 'flex-start'}}
        />
        {showPromptEditor && (
          <Card paddingTop={2} tone="transparent">
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
            <Card paddingTop={1} tone="transparent">
              <Text size={0} muted>
                Current prompt: {finalPrompt}
              </Text>
            </Card>
          </Card>
        )}
      </Card>

      {/* Character counter */}
      <Card paddingBottom={2} tone="transparent">
        <Flex align="center" gap={1}>
          <DocumentIcon />
          <Text size={1} muted>
            {value ? value.length : 0} {characterLimit ? `/ ${characterLimit}` : ''} characters
          </Text>
        </Flex>
      </Card>

      {/* Field dependency warning */}
      {fieldDependencies && Object.keys(dependencyValues).some((key) => !dependencyValues[key]) && (
        <Card paddingBottom={2} tone="transparent">
          <Flex align="center" gap={1}>
            <WarningOutlineIcon />
            <Text size={1} muted>
              Fill in the required fields first to generate content
            </Text>
          </Flex>
        </Card>
      )}

      {/* Text area */}
      <Card tone="transparent" paddingBottom={3}>
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
      <Card tone="transparent">
        <Button
          disabled={
            isLoading ||
            (imageField && !imageUrl) ||
            (fieldDependencies &&
              Object.keys(dependencyValues).some((key) => !dependencyValues[key]))
          }
          loading={isLoading}
          tone="primary"
          onClick={() => void handleAIGeneration()}
          icon={isLoading ? undefined : WiStars}
          text={isLoading ? 'Generating...' : 'Generate'}
        />

        {error && (
          <Flex align="center" gap={1} paddingTop={2}>
            <WarningOutlineIcon />
            <Text size={1} weight="medium" style={{color: 'var(--card-danger-fg-color)'}}>
              {error}
            </Text>
          </Flex>
        )}

        {value && !isLoading && !error && (
          <Flex align="center" gap={1} paddingTop={2}>
            <CheckmarkCircleIcon />
            <Text size={1} style={{color: 'var(--card-success-fg-color)'}}>
              Content generated successfully
            </Text>
          </Flex>
        )}
      </Card>
    </Card>
  )
}

export default GenericAIGenerator
