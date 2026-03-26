import { createFileRoute } from '@tanstack/react-router'
import { Button, Flex, Input, Textarea } from '@wisihe/ui-react'

export const Route = createFileRoute('/contact')({
  component: Contact,
})

function Contact() {
  return (
    <Flex direction="column" gap={48} className="contact-page">
      <section className="hero">
        <Flex direction="column" align="center" gap={16} style={{ textAlign: 'center' }}>
          <h1>Get in Touch</h1>
          <p>Have a project in mind or just want to say hi? I'd love to hear from you.</p>
        </Flex>
      </section>

      <section style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Flex direction="column" gap={4}>
            <Input id="name" label="Name" placeholder="Your Name" />
          </Flex>
          <Flex direction="column" gap={4}>
            <Input type="email" id="email" label="Email" placeholder="your@email.com" />
          </Flex>
          <Flex direction="column" gap={4}>
            <Textarea 
              id="message" 
              label="Message"
              rows={5} 
              placeholder="How can I help?" 
              style={{ resize: 'none' }}
            />
          </Flex>
          <Button type="button" variant="primary" style={{ marginTop: '1rem' }}>
            Send Message
          </Button>
        </form>

        <div style={{ marginTop: '4rem', textAlign: 'center' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Other ways to connect</h3>
          <Flex justify="center" gap={32}>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
          </Flex>
        </div>
      </section>
    </Flex>
  )
}

