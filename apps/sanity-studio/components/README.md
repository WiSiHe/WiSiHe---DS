# Generic AI Generator Component

A reusable Sanity Studio component that provides AI-powered content generation with OpenAI integration.

## Features

- **Text-based generation**: Generate content from text prompts
- **Image-based generation**: Analyze images and generate descriptions/alt text
- **Character limits**: Optional character counting and limits
- **Customizable UI**: Configurable button text, placeholders, and textarea rows
- **Error handling**: Built-in error states and loading indicators
- **Response transformation**: Optional function to transform AI responses

## Usage

### Basic Text Generation

```tsx
import GenericAIGenerator from './GenericAIGenerator'

const MyComponent = (props: StringInputProps) => {
  return (
    <GenericAIGenerator
      {...props}
      prompt="Write a creative description for this project."
      buttonText="Generate Description"
      placeholder="Description will appear here..."
    />
  )
}
```

### Image-based Generation

```tsx
const ImageAltGenerator = (props: StringInputProps) => {
  return (
    <GenericAIGenerator
      {...props}
      prompt="You are an AI SEO expert writer, write a good alt text for this image in 96 characters or less."
      imageField="image"
      characterLimit={92}
      buttonText="Generate Alt Text"
      placeholder="Alt text here..."
    />
  )
}
```

### With Character Limits

```tsx
const SEODescriptionGenerator = (props: StringInputProps) => {
  return (
    <GenericAIGenerator
      {...props}
      prompt="Write an SEO description in 122 characters or less."
      characterLimit={122}
      rows={3}
      buttonText="Generate SEO Description"
    />
  )
}
```

### With Response Transformation

```tsx
const CustomGenerator = (props: StringInputProps) => {
  const transformResponse = (response: string) => {
    // Custom transformation logic
    return response.toUpperCase().replace(/"/g, '')
  }

  return (
    <GenericAIGenerator
      {...props}
      prompt="Generate a title for this content."
      transformResponse={transformResponse}
      buttonText="Generate Title"
    />
  )
}
```

### With Field Dependencies

```tsx
const SEODescriptionGenerator = (props: StringInputProps) => {
  return (
    <GenericAIGenerator
      {...props}
      prompt="You are an AI SEO expert writer. Re-write the following text into a good SEO description in 122 characters or less: {description}"
      fieldDependencies={{
        description: 'description',
      }}
      characterLimit={122}
      buttonText="Generate SEO Description"
    />
  )
}
```

## Props

| Prop                | Type                           | Required | Description                                                   |
| ------------------- | ------------------------------ | -------- | ------------------------------------------------------------- |
| `prompt`            | `string`                       | Yes      | The prompt to send to the AI                                  |
| `imageField`        | `string`                       | No       | Field name containing the image to analyze                    |
| `characterLimit`    | `number`                       | No       | Character limit for the output (shows counter)                |
| `rows`              | `number`                       | No       | Number of rows for the textarea (default: 3)                  |
| `buttonText`        | `string`                       | No       | Text for the generate button (default: "Generate with AI")    |
| `placeholder`       | `string`                       | No       | Placeholder text for the textarea                             |
| `transformResponse` | `(response: string) => string` | No       | Function to transform the AI response                         |
| `fieldDependencies` | `{[key: string]: string}`      | No       | Field paths mapped to variable names for prompt interpolation |

## Requirements

- OpenAI API key configured in `environment.ts`
- `@sanity/ui` components
- `openai` package installed

## Examples

See `ExampleUsage.tsx` for complete examples of how to refactor existing components to use the generic AI generator.
