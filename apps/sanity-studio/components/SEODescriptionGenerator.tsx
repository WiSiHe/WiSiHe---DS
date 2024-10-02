// SEODescriptionGenerator.jsx
import {set, StringInputProps, unset, useFormValue} from 'sanity'
import {Button, Card, TextArea, Text} from '@sanity/ui'
import {useState} from 'react'

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

    // Define the API endpoint
    const apiEndpoint = 'http://localhost:5173/api/open-ai' // Use your actual SvelteKit domain

    try {
      const res = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer your-secret-token`, // Replace with your actual secret token
        },
        body: JSON.stringify({
          description: `You are an AI SEO expert writer. Re-write the following text into a good SEO description in 122 characters or less, it should never exceede 122: "${description}"`,
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to generate SEO description.')
      }

      const data = await res.json()
      let {seoDescription} = data

      seoDescription = seoDescription.replace(/"/g, '')

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
