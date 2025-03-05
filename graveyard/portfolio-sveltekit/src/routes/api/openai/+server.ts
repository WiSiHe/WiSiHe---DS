import { json } from '@sveltejs/kit'
import OpenAI from 'openai'
import type { RequestEvent } from '@sveltejs/kit'
import { PUBLIC_OPENAI_API_KEY } from '$env/static/public'

// Initialize OpenAI with your API key
const openai = new OpenAI({
  apiKey: PUBLIC_OPENAI_API_KEY
})

export async function POST({ request }: RequestEvent) {
  try {
    // Parse the incoming request body
    const { messages, maxToken = 1000 } = await request.json()

    if (!messages) {
      return json({ error: 'Message is required.' }, { status: 400 })
    }

    // Create the prompt for OpenAI

    // Generate the completion using OpenAI SDK
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: maxToken
    })

    // Extract the assistant's message
    const assistantMessage =
      completion?.choices[0]?.message?.content?.trim() || ''
    // Return the generated SEO description
    return json(
      { response: assistantMessage },
      {
        headers: {
          'Access-Control-Allow-Origin': 'http://localhost:3333',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      }
    )
  } catch (error) {
    console.error('Error interacting with OpenAI API:', error)
    return json(
      { error: (error as Error).message || 'An unexpected error occurred.' },
      { status: 500 }
    )
  }
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': 'http://localhost:3333', // Replace accordingly
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  })
}
