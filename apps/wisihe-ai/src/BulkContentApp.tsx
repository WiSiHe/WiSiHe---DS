import { CogIcon } from '@sanity/icons/Cog';
import { EditIcon } from '@sanity/icons/Edit';
import { SparklesIcon } from '@sanity/icons/Sparkles';
import { TagIcon } from '@sanity/icons/Tag';
import type { DocumentHandle } from '@sanity/sdk-react';
import {
  createDatasetHandle,
  publishDocument,
  useApplyDocumentActions,
  useClient,
  useDocumentProjection,
  useDocuments,
  useQuery,
} from '@sanity/sdk-react';
import type { ReactNode } from 'react';
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BulkDescribeSheet, type ContentDraft } from './components/bulk/BulkDescribeSheet';
import { BulkFieldConfirmModal } from './components/bulk/BulkFieldConfirmModal';
import { DocMetadataCell } from './components/DocMetadataCell';
import { DocTitleCell } from './components/DocTitleCell';
import { MergeTagsOnDoc } from './components/MergeTagsOnDoc';
import { generateDescription } from './lib/bulkDescribeClient';
import { BULK_FIELD_DEFS, type FieldDef } from './lib/bulkFieldDefs';
import { suggestTagsFromProxy, type TagCatalogEntry } from './lib/suggestTagsClient';
import { DATASET, PROJECT_ID } from './sanityEnv';

export type Tab = 'paintings' | 'projects' | 'photography' | 'posts' | 'tags';
export type DocType = 'painting' | 'project' | 'photography' | 'post' | 'tag';

interface BulkContentAppProps {
  activeTab?: 'editorial' | 'bulk';
  onTabChange?: (tab: 'editorial' | 'bulk') => void;
}

function selectionKey(h: DocumentHandle): string {
  return `${h.documentType}:${h.documentId}`;
}

function tabToDocType(t: Tab): DocType {
  switch (t) {
    case 'paintings':
      return 'painting';
    case 'projects':
      return 'project';
    case 'photography':
      return 'photography';
    case 'posts':
      return 'post';
    case 'tags':
      return 'tag';
  }
}

function TagsCatalogInner({ children }: { children: (tags: TagCatalogEntry[]) => ReactNode }) {
  const { data } = useQuery<Array<{ _id: string; name: string | null }>>({
    query: `*[_type == "tag"] | order(name asc) { _id, name }`,
  });
  const catalog: TagCatalogEntry[] = useMemo(() => {
    const rows = data ?? [];
    return rows
      .filter(r => r._id && typeof r.name === 'string' && r.name.trim())
      .map(r => ({ id: r._id, name: r.name as string }));
  }, [data]);
  return <>{children(catalog)}</>;
}

function DocumentTable({
  documentType,
  dataset,
  selected,
  toggle,
  selectAll,
  deselectAll,
}: {
  documentType: DocType;
  dataset: ReturnType<typeof createDatasetHandle>;
  selected: ReadonlySet<string>;
  toggle: (h: DocumentHandle) => void;
  selectAll: (handles: DocumentHandle[]) => void;
  deselectAll: (handles: DocumentHandle[]) => void;
}) {
  const { data, hasMore, isPending, loadMore, count } = useDocuments({
    ...dataset,
    documentType,
    batchSize: 30,
    orderings: [{ field: '_updatedAt', direction: 'desc' }],
  });

  const allVisibleSelected = data.length > 0 && data.every(h => selected.has(selectionKey(h)));
  const someVisibleSelected = !allVisibleSelected && data.some(h => selected.has(selectionKey(h)));

  const selectAllRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = someVisibleSelected;
    }
  }, [someVisibleSelected]);

  return (
    <div className='panel'>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.75rem',
        }}
      >
        <p className='muted' style={{ margin: 0 }}>
          Showing {data.length}
          {typeof count === 'number' ? ` of ${count}` : ''} {documentType}
          {hasMore ? ' — more available.' : '.'}
        </p>
        <span className='muted small'>
          Tip: Check boxes to select documents, then pick an action in the left panel.
        </span>
      </div>
      <div className='table-scroll'>
        <table className='doc-table'>
          <thead>
            <tr>
              <th className='th-check'>
                <input
                  ref={selectAllRef}
                  type='checkbox'
                  checked={allVisibleSelected}
                  onChange={() => {
                    if (allVisibleSelected) {
                      deselectAll(data);
                    } else {
                      selectAll(data);
                    }
                  }}
                  aria-label='Select all visible documents'
                  title={allVisibleSelected ? 'Deselect all visible' : 'Select all visible'}
                />
              </th>
              <th style={{ width: '32%' }}>Title</th>
              <th style={{ width: '40%' }}>Attributes & Status</th>
              <th style={{ width: '24%' }}>Document ID</th>
            </tr>
          </thead>
          <tbody>
            {data.map(handle => (
              <tr key={selectionKey(handle)}>
                <td>
                  <input
                    type='checkbox'
                    checked={selected.has(selectionKey(handle))}
                    onChange={() => {
                      toggle(handle);
                    }}
                    aria-label={`Select ${handle.documentId}`}
                  />
                </td>
                <td>
                  <Suspense fallback={<span className='muted'>…</span>}>
                    <DocTitleCell handle={handle} />
                  </Suspense>
                </td>
                <td>
                  <Suspense fallback={<span className='muted'>…</span>}>
                    <DocMetadataCell handle={handle} />
                  </Suspense>
                </td>
                <td className='mono muted small'>{handle.documentId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {hasMore ? (
        <button
          type='button'
          className='btn btn-secondary'
          disabled={isPending}
          onClick={() => loadMore()}
        >
          {isPending ? 'Loading…' : 'Load more'}
        </button>
      ) : null}
    </div>
  );
}

export function BulkContentApp({ activeTab = 'bulk', onTabChange }: BulkContentAppProps = {}) {
  const dataset = useMemo(
    () => createDatasetHandle({ projectId: PROJECT_ID, dataset: DATASET }),
    [],
  );

  const [tab, setTab] = useState<Tab>('paintings');
  const [selected, setSelected] = useState<ReadonlySet<string>>(() => new Set());
  const [handlesByKey, setHandlesByKey] = useState(() => new Map<string, DocumentHandle>());

  // Tag batch state
  const [tagChoice, setTagChoice] = useState<string>('');
  const [mergeBatch, setMergeBatch] = useState<{
    runId: number;
    items: DocumentHandle[];
    tagIds: string[];
  } | null>(null);
  const [mergeDone, setMergeDone] = useState(0);

  // Field update state
  const currentDocType = tabToDocType(tab);
  const availableFields: FieldDef[] = useMemo(
    () => BULK_FIELD_DEFS[currentDocType] || [],
    [currentDocType],
  );
  const [selectedFieldName, setSelectedFieldName] = useState<string>('');
  const [fieldValue, setFieldValue] = useState<unknown>('');
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [isApplyingField, setIsApplyingField] = useState(false);

  // Status banners
  const [lastMessage, setLastMessage] = useState<string | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);

  // Tag suggester state
  const [aiBusy, setAiBusy] = useState(false);
  const [aiPreview, setAiPreview] = useState<string[] | null>(null);

  // Bulk describe / content generation state
  const [drafts, setDrafts] = useState<ContentDraft[]>([]);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isApplyingDrafts, setIsApplyingDrafts] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const client = useClient({ apiVersion: '2025-02-19' });
  const apply = useApplyDocumentActions();

  // Tab switching with selection scoping
  const handleTabChange = useCallback((newTab: Tab) => {
    setTab(newTab);
    setSelected(new Set());
    setHandlesByKey(new Map());
    setSelectedFieldName('');
    setFieldValue('');
    setLastError(null);
  }, []);

  // Update selected field definition when field choice changes
  const selectedFieldDef = useMemo(
    () => availableFields.find(f => f.name === selectedFieldName),
    [availableFields, selectedFieldName],
  );

  useEffect(() => {
    if (selectedFieldDef) {
      if (selectedFieldDef.type === 'boolean') {
        setFieldValue(selectedFieldDef.defaultValue ?? true);
      } else if (selectedFieldDef.type === 'select') {
        setFieldValue(selectedFieldDef.defaultValue ?? selectedFieldDef.options?.[0]?.value ?? '');
      } else {
        setFieldValue('');
      }
    } else {
      setFieldValue('');
    }
  }, [selectedFieldDef]);

  const toggle = useCallback((h: DocumentHandle) => {
    const k = selectionKey(h);
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });
    setHandlesByKey(prev => {
      const next = new Map(prev);
      if (next.has(k)) next.delete(k);
      else next.set(k, h);
      return next;
    });
  }, []);

  const selectAll = useCallback((handles: DocumentHandle[]) => {
    setSelected(prev => {
      const next = new Set(prev);
      for (const h of handles) next.add(selectionKey(h));
      return next;
    });
    setHandlesByKey(prev => {
      const next = new Map(prev);
      for (const h of handles) next.set(selectionKey(h), h);
      return next;
    });
  }, []);

  const deselectAll = useCallback((handles: DocumentHandle[]) => {
    setSelected(prev => {
      const next = new Set(prev);
      for (const h of handles) next.delete(selectionKey(h));
      return next;
    });
    setHandlesByKey(prev => {
      const next = new Map(prev);
      for (const h of handles) next.delete(selectionKey(h));
      return next;
    });
  }, []);

  const selectedHandles = useMemo(() => {
    return [...selected].map(k => handlesByKey.get(k)).filter(Boolean) as DocumentHandle[];
  }, [handlesByKey, selected]);

  const clearSelection = useCallback(() => {
    setSelected(new Set());
    setHandlesByKey(new Map());
  }, []);

  // ── Direct Field Update: Patch Drafts
  const applyFieldToSelection = useCallback(async () => {
    if (!selectedFieldDef || selectedHandles.length === 0) return;
    setIsApplyingField(true);
    setLastError(null);
    let patchedCount = 0;

    try {
      for (const h of selectedHandles) {
        const publishedId = h.documentId.replace(/^drafts\./, '');
        const draftId = `drafts.${publishedId}`;

        // Ensure draft exists
        const existing = await client.getDocument(draftId);
        if (!existing) {
          const published = await client.getDocument(publishedId);
          if (published) {
            const { _id, _createdAt, _updatedAt, _rev, ...rest } = published;
            await client.createIfNotExists({ ...rest, _id: draftId, _type: h.documentType });
          }
        }

        await client
          .patch(draftId)
          .set({ [selectedFieldDef.name]: fieldValue })
          .commit({ autoGenerateArrayKeys: true });

        patchedCount++;
      }

      setLastMessage(
        `✓ Updated "${selectedFieldDef.label}" on ${patchedCount} document(s). Drafts saved — publish when ready.`,
      );
      setConfirmModalOpen(false);
    } catch (e: unknown) {
      setLastError(e instanceof Error ? e.message : String(e));
    } finally {
      setIsApplyingField(false);
    }
  }, [selectedFieldDef, selectedHandles, fieldValue, client]);

  // ── Tag merge flow
  const onMergeChildDone = useCallback((error?: Error) => {
    if (error) {
      setLastError(error.message);
    }
    setMergeDone(c => c + 1);
  }, []);

  const startMerge = useCallback(
    (tagIds: string[]) => {
      const items = selectedHandles;
      if (items.length === 0 || tagIds.length === 0) {
        setLastError('Select at least one document and at least one tag.');
        return;
      }
      setLastError(null);
      setLastMessage(null);
      setMergeDone(0);
      setMergeBatch({ runId: Date.now(), items, tagIds });
    },
    [selectedHandles],
  );

  useEffect(() => {
    if (!mergeBatch) return;
    const n = mergeBatch.items.length;
    if (n === 0) {
      setMergeBatch(null);
      setMergeDone(0);
      return;
    }
    if (mergeDone >= n) {
      setLastMessage(`✓ Merged tags on ${n} document(s). Drafts updated — publish when ready.`);
      setMergeBatch(null);
      setMergeDone(0);
    }
  }, [mergeBatch, mergeDone]);

  // ── Publishing selected documents
  const publishSelected = useCallback(async () => {
    if (selectedHandles.length === 0) {
      setLastError('Select documents to publish.');
      return;
    }
    setLastError(null);
    setLastMessage(null);
    const chunk = 12;
    try {
      for (let i = 0; i < selectedHandles.length; i += chunk) {
        const part = selectedHandles.slice(i, i + chunk);
        await apply(part.map(h => publishDocument(h)));
      }
      setLastMessage(`✓ Published ${selectedHandles.length} document(s) successfully.`);
    } catch (e: unknown) {
      setLastError(e instanceof Error ? e.message : String(e));
    }
  }, [apply, selectedHandles]);

  const isMerging = mergeBatch !== null;
  const mergeProgress = isMerging
    ? Math.round((mergeDone / (mergeBatch?.items.length || 1)) * 100)
    : 0;

  // ── AI Content Generation
  const generateDescriptions = useCallback(async () => {
    const eligibleHandles = selectedHandles.filter(
      h =>
        h.documentType === 'painting' ||
        h.documentType === 'project' ||
        h.documentType === 'photography' ||
        h.documentType === 'post',
    );
    if (eligibleHandles.length === 0) {
      setLastError('Select at least one document to generate content.');
      return;
    }

    abortRef.current?.abort();
    const abort = new AbortController();
    abortRef.current = abort;

    const initial: ContentDraft[] = eligibleHandles.map(h => ({
      key: selectionKey(h),
      handle: h,
      documentKind: h.documentType as 'painting' | 'project' | 'photography' | 'post',
      title: h.documentId,
      existingDescription: '',
      imageUrl: undefined,
      draft: '',
      state: 'pending',
    }));
    setDrafts(initial);
    setSheetOpen(true);
    setIsGenerating(true);
    setLastError(null);

    // Fetch existing title, description, and image URL for each before generating
    await Promise.allSettled(
      eligibleHandles.map(async h => {
        if (abort.signal.aborted) return;
        const key = selectionKey(h);

        setDrafts(prev => prev.map(d => (d.key === key ? { ...d, state: 'generating' } : d)));

        try {
          // Fetch document preview projection including image asset url
          const doc = await client
            .fetch<{
              title?: string;
              name?: string;
              description?: string;
              caption?: string;
              excerpt?: string;
              medium?: string;
              imageUrl?: string;
            }>(
              `*[_id in [$id, "drafts." + $id]][0] {
                title,
                name,
                description,
                caption,
                excerpt,
                medium,
                "imageUrl": coalesce(image.asset->url, mainImage.asset->url, coverImage.asset->url)
              }`,
              { id: h.documentId },
            )
            .catch(() => null);

          const title = (doc?.title as string) || (doc?.name as string) || h.documentId;
          const existingDescription =
            (doc?.description as string) ||
            (doc?.caption as string) ||
            (doc?.excerpt as string) ||
            '';
          const medium = (doc?.medium as string) || '';
          const imageUrl = (doc?.imageUrl as string) || '';

          const result = await generateDescription({
            documentKind: h.documentType as 'painting' | 'project' | 'photography' | 'post',
            title,
            existingDescription,
            medium,
            imageUrl,
          });

          if (abort.signal.aborted) return;
          setDrafts(prev =>
            prev.map(d =>
              d.key === key
                ? { ...d, title, imageUrl, draft: result.description, result, state: 'done' }
                : d,
            ),
          );
        } catch (e: unknown) {
          if (abort.signal.aborted) return;
          setDrafts(prev =>
            prev.map(d =>
              d.key === key
                ? { ...d, error: e instanceof Error ? e.message : String(e), state: 'error' }
                : d,
            ),
          );
        }
      }),
    );

    setIsGenerating(false);
  }, [selectedHandles, client]);

  // Draft review handlers
  const handleApproveDraft = useCallback((key: string) => {
    setDrafts(prev =>
      prev.map(d =>
        d.key === key ? { ...d, state: d.state === 'approved' ? 'done' : 'approved' } : d,
      ),
    );
  }, []);

  const handleSkipDraft = useCallback((key: string) => {
    setDrafts(prev =>
      prev.map(d =>
        d.key === key ? { ...d, state: d.state === 'skipped' ? 'done' : 'skipped' } : d,
      ),
    );
  }, []);

  const handleEditDraft = useCallback((key: string, text: string) => {
    setDrafts(prev => prev.map(d => (d.key === key ? { ...d, draft: text } : d)));
  }, []);

  const handleApproveAll = useCallback(() => {
    setDrafts(prev => prev.map(d => (d.state === 'done' ? { ...d, state: 'approved' } : d)));
  }, []);

  // Commit approved drafts to Sanity
  const applyAllApprovedDrafts = useCallback(async () => {
    const toApply = drafts.filter(d => d.state === 'approved');
    if (toApply.length === 0) return;

    setIsApplyingDrafts(true);
    setLastError(null);
    let appliedCount = 0;

    for (const d of toApply) {
      const publishedId = d.handle.documentId.replace(/^drafts\./, '');
      const draftId = `drafts.${publishedId}`;

      try {
        const field =
          d.documentKind === 'painting'
            ? 'description'
            : d.documentKind === 'project'
              ? 'summary'
              : d.documentKind === 'photography'
                ? 'caption'
                : 'excerpt';

        const value =
          d.result?.fieldType === 'portableText' && d.result.portableText
            ? d.result.portableText
            : d.draft;

        // Ensure draft exists
        const existing = await client.getDocument(draftId);
        if (!existing) {
          const published = await client.getDocument(publishedId);
          if (published) {
            const { _id, _createdAt, _updatedAt, _rev, ...rest } = published;
            await client.createIfNotExists({ ...rest, _id: draftId, _type: d.documentKind });
          }
        }

        await client
          .patch(draftId)
          .set({ [field]: value })
          .commit({ autoGenerateArrayKeys: true });

        setDrafts(prev => prev.map(dr => (dr.key === d.key ? { ...dr, state: 'applied' } : dr)));
        appliedCount++;
      } catch (e: unknown) {
        setDrafts(prev =>
          prev.map(dr =>
            dr.key === d.key
              ? { ...dr, error: e instanceof Error ? e.message : String(e), state: 'error' }
              : dr,
          ),
        );
      }
    }

    setIsApplyingDrafts(false);
    if (appliedCount > 0) {
      setLastMessage(`✓ Applied AI copy to ${appliedCount} document draft(s). Publish when ready.`);
    }
  }, [drafts, client]);

  // AI Generation labels
  const aiButtonConfig = useMemo(() => {
    switch (currentDocType) {
      case 'painting':
        return {
          label: 'Generate Descriptions',
          subtitle: 'Curator labels (~240 chars) analyzed directly from artwork image',
        };
      case 'project':
        return {
          label: 'Generate Summaries',
          subtitle: 'Portfolio sidebar summaries (~400 chars)',
        };
      case 'photography':
        return {
          label: 'Generate Captions',
          subtitle: 'Gallery captions (~280 chars) analyzed directly from photograph',
        };
      case 'post':
        return { label: 'Generate Excerpts', subtitle: 'Article excerpts (~200 chars)' };
      default:
        return null;
    }
  }, [currentDocType]);

  return (
    <div className='bulk-studio'>
      {/* Unified Studio Topbar */}
      <div className='editorial-header'>
        <div className='editorial-header-left'>
          {/* Brand */}
          <div className='brand-logo-group'>
            <div className='brand-logo-badge'>
              <SparklesIcon style={{ fontSize: '1rem', color: '#818cf8' }} />
            </div>
            <span className='brand-title'>WiSiHe Studio</span>
            <span className='version-pill'>v1.4</span>
          </div>

          {/* Mode Switcher */}
          {onTabChange && (
            <div className='tabs-pill-wrapper'>
              <button
                type='button'
                className={`tab-pill ${activeTab === 'editorial' ? 'active' : ''}`}
                onClick={() => onTabChange('editorial')}
                title='Editorial Studio Canvas'
              >
                <EditIcon style={{ fontSize: '0.95rem' }} />
                <span>Editorial</span>
              </button>
              <button
                type='button'
                className={`tab-pill ${activeTab === 'bulk' ? 'active' : ''}`}
                onClick={() => onTabChange('bulk')}
                title='Bulk Content Studio'
              >
                <TagIcon style={{ fontSize: '0.95rem' }} />
                <span>Bulk Studio</span>
              </button>
            </div>
          )}

          <div className='header-v-divider' />

          {/* 5 Core Editorial Collections */}
          <div className='bulk-content-tabs'>
            {(['paintings', 'projects', 'photography', 'posts', 'tags'] as Tab[]).map(t => (
              <button
                key={t}
                type='button'
                className={`bulk-tab ${tab === t ? 'active' : ''}`}
                onClick={() => handleTabChange(t)}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className='editorial-header-right'>
          {/* Selection status */}
          {selectedHandles.length > 0 && (
            <div className='bulk-selection-pill'>
              <span className='bulk-sel-count'>{selectedHandles.length}</span>
              <span>selected</span>
              <button
                type='button'
                className='bulk-clear-btn'
                onClick={clearSelection}
                title='Clear selection'
              >
                ✕
              </button>
            </div>
          )}

          {/* Env */}
          <div className='env-status-pill'>
            <span className='env-dot' />
            <span>{DATASET}</span>
          </div>
        </div>
      </div>

      {/* Status Banner */}
      {(lastMessage || lastError) && (
        <div className={`bulk-banner ${lastError ? 'error' : 'success'}`} role='status'>
          <span>{lastError ?? lastMessage}</span>
          <button
            type='button'
            className='bulk-banner-dismiss'
            onClick={() => {
              setLastMessage(null);
              setLastError(null);
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Merge progress bar */}
      {isMerging && (
        <div className='bulk-progress-bar'>
          <div className='bulk-progress-fill' style={{ width: `${mergeProgress}%` }} />
        </div>
      )}

      {/* Body: Action Panel + Document Table */}
      <div className='bulk-body'>
        {/* Left: Action Panel */}
        <div className='bulk-action-panel'>
          {/* Guide Card */}
          <div className='bulk-guide-card'>
            <div className='bulk-guide-header'>
              <SparklesIcon style={{ color: '#818cf8', fontSize: '0.85rem' }} />
              <span className='bulk-guide-title'>Draft-First Safety</span>
            </div>
            <p className='bulk-guide-text'>
              Edits (fields, AI copy, tags) save to <strong>drafts</strong> automatically. Your live
              website remains unchanged until you click <strong>Publish Selected</strong>.
            </p>
          </div>

          {/* Zone 1: Direct Field Updates */}
          {availableFields.length > 0 && (
            <div className='bulk-action-section'>
              <div className='bulk-section-header'>
                <CogIcon style={{ fontSize: '0.9rem', color: '#a5b4fc' }} />
                <p className='bulk-section-label'>Field Updates</p>
              </div>
              <p className='bulk-section-desc'>
                Batch-set schema attributes across all selected {currentDocType} records.
              </p>

              <label className='bulk-field-group'>
                <span className='bulk-field-label'>Target field</span>
                <select
                  className='bulk-select'
                  value={selectedFieldName}
                  onChange={e => setSelectedFieldName(e.target.value)}
                  disabled={selectedHandles.length === 0}
                >
                  <option value=''>Choose a field to update…</option>
                  {availableFields.map(f => (
                    <option key={f.name} value={f.name}>
                      {f.label} ({f.type})
                    </option>
                  ))}
                </select>
              </label>

              {selectedFieldDef && (
                <div className='bulk-field-group'>
                  <span className='bulk-field-label'>New value</span>
                  {selectedFieldDef.type === 'boolean' ? (
                    <div className='bulk-segmented-control'>
                      <button
                        type='button'
                        className={`bulk-segmented-btn ${fieldValue === true ? 'active' : ''}`}
                        onClick={() => setFieldValue(true)}
                      >
                        True (Enable)
                      </button>
                      <button
                        type='button'
                        className={`bulk-segmented-btn ${fieldValue === false ? 'active' : ''}`}
                        onClick={() => setFieldValue(false)}
                      >
                        False (Disable)
                      </button>
                    </div>
                  ) : selectedFieldDef.type === 'select' ? (
                    <select
                      className='bulk-select'
                      value={String(fieldValue ?? '')}
                      onChange={e => setFieldValue(e.target.value)}
                    >
                      {selectedFieldDef.options?.map(opt => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : selectedFieldDef.type === 'date' ? (
                    <input
                      type='date'
                      className='bulk-input'
                      value={String(fieldValue ?? '')}
                      onChange={e => setFieldValue(e.target.value)}
                    />
                  ) : selectedFieldDef.type === 'datetime' ? (
                    <input
                      type='datetime-local'
                      className='bulk-input'
                      value={String(fieldValue ?? '')}
                      onChange={e => setFieldValue(e.target.value)}
                    />
                  ) : (
                    <input
                      type='text'
                      className='bulk-input'
                      placeholder={selectedFieldDef.placeholder || 'Enter value…'}
                      value={String(fieldValue ?? '')}
                      onChange={e => setFieldValue(e.target.value)}
                    />
                  )}
                </div>
              )}

              <button
                type='button'
                className='bulk-action-btn'
                disabled={!selectedFieldDef || selectedHandles.length === 0}
                onClick={() => setConfirmModalOpen(true)}
              >
                <CogIcon style={{ fontSize: '0.9rem' }} />
                Apply to{' '}
                {selectedHandles.length > 0 ? `${selectedHandles.length} doc(s)` : 'Selection'}
              </button>
              {selectedHandles.length === 0 && (
                <span className='muted small' style={{ display: 'block', textAlign: 'center' }}>
                  Select documents from table first
                </span>
              )}
            </div>
          )}

          {/* Zone 2: Contextual AI Content Generation */}
          {aiButtonConfig && (
            <div className='bulk-action-section'>
              <div className='bulk-section-header'>
                <SparklesIcon style={{ fontSize: '0.9rem', color: '#818cf8' }} />
                <p className='bulk-section-label'>AI Copywriting</p>
              </div>
              <p className='bulk-section-desc'>
                Generates {aiButtonConfig.subtitle} using GPT-5.6 Sol visual analysis and metadata.
              </p>

              <div className='bulk-workflow-steps'>
                <span className='bulk-step-chip'>1. Generate</span>
                <span className='bulk-step-arrow'>→</span>
                <span className='bulk-step-chip'>2. Review Sheet</span>
                <span className='bulk-step-arrow'>→</span>
                <span className='bulk-step-chip'>3. Save Drafts</span>
              </div>

              <button
                type='button'
                className='bulk-action-btn ai'
                disabled={selectedHandles.length === 0 || isGenerating}
                onClick={() => void generateDescriptions()}
              >
                <SparklesIcon style={{ fontSize: '0.9rem' }} />
                {isGenerating
                  ? 'Generating drafts…'
                  : `✨ ${aiButtonConfig.label} (${selectedHandles.length})`}
              </button>

              {drafts.length > 0 && (
                <button
                  type='button'
                  className='bulk-action-btn secondary'
                  onClick={() => setSheetOpen(true)}
                  style={{ marginTop: '0.35rem' }}
                >
                  View Review Sheet ({drafts.length} drafts)
                </button>
              )}
            </div>
          )}

          {/* Zone 3: Tag Operations */}
          <div className='bulk-action-section'>
            <div className='bulk-section-header'>
              <TagIcon style={{ fontSize: '0.9rem', color: '#a5b4fc' }} />
              <p className='bulk-section-label'>Tag Operations</p>
            </div>
            <p className='bulk-section-desc'>
              Attach a tag to all selected documents. Existing tags are kept intact.
            </p>

            <Suspense fallback={<p className='muted small'>Loading tag catalog…</p>}>
              <TagsCatalogInner>
                {catalog => (
                  <>
                    <label className='bulk-field-group'>
                      <span className='bulk-field-label'>Choose tag</span>
                      <select
                        className='bulk-select'
                        value={tagChoice}
                        onChange={e => setTagChoice(e.target.value)}
                        disabled={selectedHandles.length === 0}
                      >
                        <option value=''>Choose a tag…</option>
                        {catalog.map(t => (
                          <option key={t.id} value={t.id}>
                            {t.name}
                          </option>
                        ))}
                      </select>
                    </label>

                    <button
                      type='button'
                      className='bulk-action-btn'
                      disabled={!tagChoice || selectedHandles.length === 0 || isMerging}
                      onClick={() => {
                        if (tagChoice) startMerge([tagChoice]);
                      }}
                    >
                      <TagIcon style={{ fontSize: '0.9rem' }} />
                      Merge Tag into Selection
                    </button>

                    {aiPreview && aiPreview.length > 0 && (
                      <div className='bulk-ai-result'>
                        <p className='bulk-field-label'>
                          ✨ AI suggested {aiPreview.length} tag(s)
                        </p>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <button
                            type='button'
                            className='bulk-action-btn'
                            onClick={() => startMerge(aiPreview)}
                          >
                            Apply AI Tags
                          </button>
                          <button
                            type='button'
                            className='bulk-action-btn secondary'
                            onClick={() => setAiPreview(null)}
                          >
                            Dismiss
                          </button>
                        </div>
                      </div>
                    )}

                    <div className='bulk-divider' />

                    <div className='bulk-section-header'>
                      <SparklesIcon style={{ fontSize: '0.9rem', color: '#818cf8' }} />
                      <p className='bulk-section-label'>AI Tag Suggestion</p>
                    </div>
                    <p className='bulk-section-desc'>
                      Select <strong>exactly 1 document</strong> to recommend matching tags from
                      your Sanity catalog.
                    </p>
                    <AiSuggestRow
                      catalog={catalog}
                      selectedHandles={selectedHandles}
                      disabled={aiBusy}
                      onBusy={setAiBusy}
                      onError={setLastError}
                      onSuggestions={setAiPreview}
                    />
                  </>
                )}
              </TagsCatalogInner>
            </Suspense>
          </div>

          {/* Zone 4: Publishing */}
          <div className='bulk-action-section'>
            <div className='bulk-section-header'>
              <SparklesIcon style={{ fontSize: '0.9rem', color: '#34d399' }} />
              <p className='bulk-section-label'>Publishing</p>
            </div>
            <p className='bulk-section-desc'>
              Promote selected documents from draft to live on the public website.
            </p>
            <button
              type='button'
              className='bulk-action-btn publish'
              disabled={selectedHandles.length === 0}
              onClick={() => void publishSelected()}
            >
              <SparklesIcon style={{ fontSize: '0.9rem' }} />
              Publish {selectedHandles.length > 0 ? `${selectedHandles.length} doc(s)` : 'Selected'}
            </button>
          </div>
        </div>

        {/* Right: Document Table */}
        <div className='bulk-table-pane'>
          {mergeBatch
            ? mergeBatch.items.map(h => (
                <MergeTagsOnDoc
                  key={`${h.documentId}-${mergeBatch.runId}`}
                  handle={h}
                  tagIds={mergeBatch.tagIds}
                  runId={mergeBatch.runId}
                  onDone={onMergeChildDone}
                />
              ))
            : null}

          <Suspense
            fallback={
              <div className='bulk-table-loading'>
                <div className='studio-spinner' />
                <span className='muted'>Loading {tab}…</span>
              </div>
            }
          >
            <DocumentTable
              key={currentDocType}
              documentType={currentDocType}
              dataset={dataset}
              selected={selected}
              toggle={toggle}
              selectAll={selectAll}
              deselectAll={deselectAll}
            />
          </Suspense>
        </div>
      </div>

      {/* Confirmation Modal */}
      {selectedFieldDef && (
        <BulkFieldConfirmModal
          isOpen={confirmModalOpen}
          onClose={() => setConfirmModalOpen(false)}
          onConfirm={() => void applyFieldToSelection()}
          documentType={currentDocType}
          count={selectedHandles.length}
          fieldDef={selectedFieldDef}
          fieldValue={fieldValue}
          isApplying={isApplyingField}
        />
      )}

      {/* Slide-Up Bottom Review Sheet */}
      <BulkDescribeSheet
        isOpen={sheetOpen}
        isGenerating={isGenerating}
        drafts={drafts}
        onClose={() => setSheetOpen(false)}
        onApprove={handleApproveDraft}
        onSkip={handleSkipDraft}
        onEditDraft={handleEditDraft}
        onApproveAll={handleApproveAll}
        onApplyApproved={() => void applyAllApprovedDrafts()}
        isApplying={isApplyingDrafts}
      />
    </div>
  );
}

function AiSuggestRow({
  catalog,
  selectedHandles,
  disabled,
  onBusy,
  onError,
  onSuggestions,
}: {
  catalog: TagCatalogEntry[];
  selectedHandles: DocumentHandle[];
  disabled: boolean;
  onBusy: (v: boolean) => void;
  onError: (msg: string | null) => void;
  onSuggestions: (ids: string[] | null) => void;
}) {
  const sole = selectedHandles.length === 1 ? selectedHandles[0] : undefined;

  if (
    !sole ||
    (sole.documentType !== 'painting' &&
      sole.documentType !== 'project' &&
      sole.documentType !== 'photography' &&
      sole.documentType !== 'post')
  ) {
    return (
      <button type='button' className='bulk-action-btn secondary' disabled>
        <SparklesIcon style={{ fontSize: '0.9rem' }} />
        AI Suggest Tags
      </button>
    );
  }

  return (
    <Suspense fallback={<span className='muted small'>Loading document…</span>}>
      <AiSuggestTrigger
        handle={sole}
        catalog={catalog}
        disabled={disabled}
        onBusy={onBusy}
        onError={onError}
        onSuggestions={onSuggestions}
      />
    </Suspense>
  );
}

function AiSuggestTrigger({
  handle,
  catalog,
  disabled,
  onBusy,
  onError,
  onSuggestions,
}: {
  handle: DocumentHandle;
  catalog: TagCatalogEntry[];
  disabled: boolean;
  onBusy: (v: boolean) => void;
  onError: (msg: string | null) => void;
  onSuggestions: (ids: string[] | null) => void;
}) {
  const projection =
    handle.documentType === 'project'
      ? `{ "title": name, "textBody": "" }`
      : `{ "title": title, "textBody": coalesce(description, caption, excerpt, "") }`;

  const { data } = useDocumentProjection<{ title?: string | null; textBody?: string | null }>({
    ...handle,
    projection,
  });

  const title = (data?.title ?? '').trim() || 'Untitled';
  const textBody = (data?.textBody ?? '').trim();
  const kind =
    handle.documentType === 'project'
      ? 'project'
      : handle.documentType === 'photography'
        ? 'photography'
        : handle.documentType === 'post'
          ? 'post'
          : 'painting';

  return (
    <button
      type='button'
      className={`bulk-action-btn ${disabled ? '' : 'ai'}`}
      disabled={disabled || catalog.length === 0}
      onClick={async () => {
        onError(null);
        onBusy(true);
        try {
          const res = await suggestTagsFromProxy({
            documentKind: kind,
            title,
            textBody,
            tagsCatalog: catalog,
          });
          onSuggestions(res.suggestedTagIds);
        } catch (e: unknown) {
          onError(e instanceof Error ? e.message : String(e));
          onSuggestions(null);
        } finally {
          onBusy(false);
        }
      }}
    >
      <SparklesIcon style={{ fontSize: '0.9rem' }} />
      {disabled ? 'Thinking…' : 'AI Suggest Tags'}
    </button>
  );
}
