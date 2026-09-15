/**
 * JSON-LD for structured data. Renders directly into HTML so search engine
 * crawlers (Googlebot, Bingbot, etc.) parse valid JSON-LD inside the document
 * without duplicated or post-body injections.
 */
export function JsonLd(props: { data: unknown }) {
  if (!props.data) return null;

  const json = JSON.stringify(props.data).replace(/</g, '\\u003c');

  return (
    <script
      type='application/ld+json'
      // biome-ignore lint/security/noDangerouslySetInnerHtml: Sanitized JSON-LD output
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
