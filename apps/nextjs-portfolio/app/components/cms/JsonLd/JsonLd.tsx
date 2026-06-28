'use client';

import { useServerInsertedHTML } from 'next/navigation';

/**
 * JSON-LD for structured data. Injected via useServerInsertedHTML so React 19
 * does not warn about <script> tags inside the component tree.
 */
export function JsonLd(props: { data: unknown }) {
  const json = JSON.stringify(props.data);

  useServerInsertedHTML(() => (
    <script
      type='application/ld+json'
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD is JSON.stringify output only.
      dangerouslySetInnerHTML={{ __html: json }}
    />
  ));

  return null;
}
