export function serializeSchema(data: unknown): string {
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`
}
