import type { DocumentHandle } from '@sanity/sdk-react';
import { useDocumentProjection, useEditDocument } from '@sanity/sdk-react';
import { useEffect, useRef } from 'react';

export type TagRef = {
  _type: 'reference';
  _ref: string;
  _key: string;
};

function newKey(): string {
  return `k${Math.random().toString(36).slice(2, 12)}`;
}

type MergeTagsOnDocProps = {
  handle: DocumentHandle;
  tagIds: string[];
  /** Increment to re-run merge for this document */
  runId: number;
  onDone: (error?: Error) => void;
};

/**
 * Applies merged tag references when `runId` changes; skips until projection is ready.
 */
export function MergeTagsOnDoc({ handle, tagIds, runId, onDone }: MergeTagsOnDocProps) {
  const tagPath = handle.documentType === 'painting' ? 'tagsV2' : 'tags';
  const { data, isPending } = useDocumentProjection<{ tagsV2?: TagRef[]; tags?: TagRef[] }>({
    ...handle,
    projection: `{ tagsV2, tags }`,
  });

  const editTags = useEditDocument<TagRef[]>({
    ...handle,
    path: tagPath as 'tags',
  });

  const appliedRunRef = useRef<number | null>(null);
  const inFlightRef = useRef(false);

  useEffect(() => {
    if (!runId || appliedRunRef.current === runId || inFlightRef.current) return;
    if (isPending) return;

    const raw = handle.documentType === 'painting' ? data?.tagsV2 : data?.tags;
    const current: TagRef[] = Array.isArray(raw) ? [...raw] : [];
    const existing = new Set(current.map(r => r._ref));

    for (const id of tagIds) {
      if (!existing.has(id)) {
        current.push({ _type: 'reference', _ref: id, _key: newKey() });
        existing.add(id);
      }
    }

    inFlightRef.current = true;

    void editTags(current)
      .then(() => {
        appliedRunRef.current = runId;
        inFlightRef.current = false;
        onDone();
      })
      .catch((e: unknown) => {
        inFlightRef.current = false;
        onDone(e instanceof Error ? e : new Error(String(e)));
      });
  }, [runId, isPending, data, editTags, handle.documentType, onDone, tagIds]);

  return null;
}
