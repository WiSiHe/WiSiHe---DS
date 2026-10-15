import type { DocumentHandle } from '@sanity/sdk-react';
import { useDocumentProjection } from '@sanity/sdk-react';

interface DocMetadataCellProps {
  handle: DocumentHandle;
}

export function DocMetadataCell({ handle }: DocMetadataCellProps) {
  const docType = handle.documentType;

  let projection = `{}`;
  if (docType === 'painting') {
    projection = `{
      "medium": medium,
      "format": format,
      "isFeatured": isFeatured,
      "isForSale": isForSale,
      "isNSFW": isNSFW,
      "hasDesc": defined(description)
    }`;
  } else if (docType === 'project') {
    projection = `{
      "status": status,
      "projectType": projectType,
      "client": client,
      "hasSummary": defined(summary)
    }`;
  } else if (docType === 'photography') {
    projection = `{
      "camera": camera,
      "isFeatured": isFeatured,
      "hasCaption": defined(caption)
    }`;
  } else if (docType === 'post') {
    projection = `{
      "hasExcerpt": defined(excerpt)
    }`;
  }

  const { data } = useDocumentProjection<Record<string, unknown>>({
    ...handle,
    projection,
  });

  if (!data) return <span className='muted small'>—</span>;

  if (docType === 'painting') {
    const medium = typeof data.medium === 'string' ? data.medium : '';
    const isFeatured = Boolean(data.isFeatured);
    const isForSale = Boolean(data.isForSale);
    const isNSFW = Boolean(data.isNSFW);
    const hasDesc = Boolean(data.hasDesc);

    return (
      <div className='doc-meta-cell'>
        {medium && <span className='doc-meta-badge muted'>{medium}</span>}
        {isFeatured && <span className='doc-meta-badge highlight'>Featured</span>}
        {isForSale && <span className='doc-meta-badge green'>For Sale</span>}
        {isNSFW && <span className='doc-meta-badge warning'>NSFW</span>}
        {hasDesc ? (
          <span className='doc-meta-text' title='Has gallery label description'>
            📝 Described
          </span>
        ) : (
          <span className='doc-meta-text empty' title='Missing gallery description'>
            ⚠️ No description
          </span>
        )}
      </div>
    );
  }

  if (docType === 'project') {
    const status = typeof data.status === 'string' ? data.status : '';
    const projectType = typeof data.projectType === 'string' ? data.projectType : '';
    const hasSummary = Boolean(data.hasSummary);

    return (
      <div className='doc-meta-cell'>
        {status && <span className={`doc-meta-badge status-${status}`}>{status}</span>}
        {projectType && <span className='doc-meta-badge muted'>{projectType}</span>}
        {hasSummary ? (
          <span className='doc-meta-text'>📝 Has summary</span>
        ) : (
          <span className='doc-meta-text empty'>⚠️ No summary</span>
        )}
      </div>
    );
  }

  if (docType === 'photography') {
    const camera = typeof data.camera === 'string' ? data.camera : '';
    const isFeatured = Boolean(data.isFeatured);
    const hasCaption = Boolean(data.hasCaption);

    return (
      <div className='doc-meta-cell'>
        {camera && <span className='doc-meta-badge muted'>{camera}</span>}
        {isFeatured && <span className='doc-meta-badge highlight'>Featured</span>}
        {hasCaption ? (
          <span className='doc-meta-text'>📸 Captioned</span>
        ) : (
          <span className='doc-meta-text empty'>⚠️ No caption</span>
        )}
      </div>
    );
  }

  if (docType === 'post') {
    const hasExcerpt = Boolean(data.hasExcerpt);
    return (
      <div className='doc-meta-cell'>
        {hasExcerpt ? (
          <span className='doc-meta-text'>📄 Has excerpt</span>
        ) : (
          <span className='doc-meta-text empty'>⚠️ No excerpt</span>
        )}
      </div>
    );
  }

  return <span className='muted small'>—</span>;
}
