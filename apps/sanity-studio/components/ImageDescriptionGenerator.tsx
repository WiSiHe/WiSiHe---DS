import {Button, Card, Text, TextArea} from '@sanity/ui'
import {useEffect, useState} from 'react'
import {set, StringInputProps, unset, useFormValue} from 'sanity'
import {urlFor} from '../utils/image'

const BASE_PROMPT =
  'You are an AI expert at describing images, vividly describe this image, be as creative as you would like. Describe the style, colors, characters, what the motive might be and so on.'

const IMAGE_HEIGHT = 256
const IMAGE_WIDTH = 256

const ImageDescriptionGenerator = (props: StringInputProps) => {
  const {value, onChange} = props

  const image = useFormValue(['image']) as string

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState<string>('')

  function handleChangeDescription(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const response = e.target.value
    onChange(response ? set(response) : unset())
  }

  async function handleAltTextGeneration() {
    setIsLoading(true)
    setError(null)

    if (!imageUrl) {
      setError('Image URL is missing')
      setIsLoading(false)
      return
    }

    const apiEndpoint = process.env.NEXT_PUBLIC_OPENAI_API_URL || 'http://localhost:5173/api/openai'

    const newChatLogs = [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: BASE_PROMPT,
          },
          {
            type: 'image_url',
            image_url: {url: imageUrl},
          },
        ],
      },
    ]

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: newChatLogs,
        }),
      }).then((res) => res.json())

      if (response?.response) {
        onChange(set(response.response))
      } else {
        setError('Failed to generate description text')
      }
    } catch (err) {
      console.error('Error generating description text:', err)
      setError('Error occurred while generating description text')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!image) {
      setError('Image URL is missing')
      setIsLoading(false)
      return
    }
    const sanityUrl = urlFor(image).width(IMAGE_WIDTH).height(IMAGE_HEIGHT).url()

    setImageUrl(sanityUrl)
  }, [image])

  return (
    <Card padding={4} tone="transparent" border>
      <Card tone="transparent">
        <TextArea
          value={value || ''}
          onChange={handleChangeDescription}
          placeholder="Alt text here..."
          rows={6}
        />
      </Card>

      <Card tone="transparent" paddingTop={2}>
        <Button
          disabled={isLoading || !imageUrl}
          loading={isLoading}
          tone="primary"
          onClick={handleAltTextGeneration}
        >
          Generate Alt Text
        </Button>
        {error && (
          <Text size={1} weight="medium" color="danger" style={{marginTop: '0.5rem'}}>
            {error}
          </Text>
        )}
      </Card>
    </Card>
  )
}

export default ImageDescriptionGenerator
