import { createFileRoute } from '@tanstack/react-router'
import { Flex, Grid } from '@wisihe/ui-react'

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  return (
    <Flex direction="column" gap={48} className="about-page">
      <section className="hero">
        <Flex direction="column" align="center" gap={16} style={{ textAlign: 'center' }}>
          <h1>About Me</h1>
          <p>Passionate developer building modern web experiences.</p>
        </Flex>
      </section>

      <section style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        <Flex direction="column" gap={32}>
          <div>
            <h2 style={{ marginBottom: '1.5rem' }}>The Journey</h2>
            <p style={{ marginBottom: '1rem', opacity: 0.9 }}>
              I'm a software engineer with a deep interest in frontend architectures, 
              design systems, and creating seamless user experiences. I love working 
              with modern tools like React, TypeScript, and of course, TanStack.
            </p>
            <p style={{ opacity: 0.9 }}>
              When I'm not coding, you can find me exploring new technologies, 
              reading about design principles, or working on small open-source projects.
            </p>
          </div>

          <Grid columns={2} gap={48}>
            <div>
              <h3 style={{ marginBottom: '1rem', color: 'var(--accent)' }}>Technologies</h3>
              <ul style={{ color: 'var(--muted)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <li>React / Next.js</li>
                <li>TypeScript</li>
                <li>Node.js</li>
                <li>GraphQL</li>
                <li>PostgreSQL</li>
              </ul>
            </div>
            <div>
              <h3 style={{ marginBottom: '1rem', color: 'var(--accent)' }}>Tools</h3>
              <ul style={{ color: 'var(--muted)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <li>VS Code</li>
                <li>Git / GitHub</li>
                <li>Figma</li>
                <li>Docker</li>
                <li>Vercel</li>
              </ul>
            </div>
          </Grid>
        </Flex>
      </section>
    </Flex>
  )
}

