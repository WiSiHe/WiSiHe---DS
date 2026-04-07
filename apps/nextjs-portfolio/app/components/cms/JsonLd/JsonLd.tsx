/**
 * JSON-LD for structured data. Uses serialized JSON only (not HTML markup).
 */
export function JsonLd(props: { data: unknown }) {
  const json = JSON.stringify(props.data);
  return (
    <script
      type='application/ld+json'
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD is JSON.stringify output only.
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
