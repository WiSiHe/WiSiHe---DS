import type { DocumentHandle } from '@sanity/sdk-react';
import { useDocumentProjection } from '@sanity/sdk-react';

type DocTitleCellProps = {
  handle: DocumentHandle;
};

export function DocTitleCell({ handle }: DocTitleCellProps) {
  const { data } = useDocumentProjection<{ label?: string | null }>({
    ...handle,
    projection: `{ "label": coalesce(title, name) }`,
  });

  return <span className='doc-title'>{data?.label?.trim() || 'Untitled'}</span>;
}
