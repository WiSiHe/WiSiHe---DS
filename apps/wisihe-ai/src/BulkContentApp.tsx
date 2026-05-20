import type { DocumentHandle } from '@sanity/sdk-react';
import {
  createDatasetHandle,
  publishDocument,
  useApplyDocumentActions,
  useDocumentProjection,
  useDocuments,
  useQuery,
} from '@sanity/sdk-react';
import type { ReactNode } from 'react';
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { DocTitleCell } from './components/DocTitleCell';
import { MergeTagsOnDoc } from './components/MergeTagsOnDoc';
import { suggestTagsFromProxy, type TagCatalogEntry } from './lib/suggestTagsClient';
import { DATASET, PROJECT_ID } from './sanityEnv';

type Tab = 'paintings' | 'projects' | 'tags';

function selectionKey(h: DocumentHandle): string {
  return `${h.documentType}:${h.documentId}`;
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
}: {
  documentType: 'painting' | 'project' | 'tag';
  dataset: ReturnType<typeof createDatasetHandle>;
  selected: ReadonlySet<string>;
  toggle: (h: DocumentHandle) => void;
}) {
  const { data, hasMore, isPending, loadMore, count } = useDocuments({
    ...dataset,
    documentType,
    batchSize: 30,
    orderings: [{ field: '_updatedAt', direction: 'desc' }],
  });

  return (
    <div className='panel'>
      <p className='muted'>
        Showing {data.length}
        {typeof count === 'number' ? ` of ${count}` : ''} {documentType}
        {hasMore ? ' — more available.' : '.'}
      </p>
      <div className='table-scroll'>
        <table className='doc-table'>
          <thead>
            <tr>
              <th className='th-check' />
              <th>Title</th>
              <th>Id</th>
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
                <td className='mono muted'>{handle.documentId}</td>
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

export function BulkContentApp() {
  const dataset = useMemo(
    () => createDatasetHandle({ projectId: PROJECT_ID, dataset: DATASET }),
    [],
  );

  const [tab, setTab] = useState<Tab>('paintings');
  const [selected, setSelected] = useState<ReadonlySet<string>>(() => new Set());
  const [handlesByKey, setHandlesByKey] = useState(() => new Map<string, DocumentHandle>());

  const [tagChoice, setTagChoice] = useState<string>('');
  const [mergeBatch, setMergeBatch] = useState<{
    runId: number;
    items: DocumentHandle[];
    tagIds: string[];
  } | null>(null);
  const [mergeDone, setMergeDone] = useState(0);
  const [lastMessage, setLastMessage] = useState<string | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);

  const [aiBusy, setAiBusy] = useState(false);
  const [aiPreview, setAiPreview] = useState<string[] | null>(null);

  const apply = useApplyDocumentActions();

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

  const selectedHandles = useMemo(() => {
    return [...selected].map(k => handlesByKey.get(k)).filter(Boolean) as DocumentHandle[];
  }, [handlesByKey, selected]);

  const clearSelection = useCallback(() => {
    setSelected(new Set());
    setHandlesByKey(new Map());
  }, []);

  const onMergeChildDone = useCallback((error?: Error) => {
    if (error) {
      setLastError(error.message);
    }
    setMergeDone(c => c + 1);
  }, []);

  const startMerge = useCallback(
    (tagIds: string[]) => {
      const items = selectedHandles.filter(
        h => h.documentType === 'painting' || h.documentType === 'project',
      );
      if (items.length === 0 || tagIds.length === 0) {
        setLastError('Select at least one painting or project and at least one tag.');
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
      setLastMessage(`Merged tags on ${n} document(s). Drafts updated — use Publish if needed.`);
      setMergeBatch(null);
      setMergeDone(0);
    }
  }, [mergeBatch, mergeDone]);

  const publishSelected = useCallback(async () => {
    const items = selectedHandles.filter(
      h => h.documentType === 'painting' || h.documentType === 'project',
    );
    if (items.length === 0) {
      setLastError('Select paintings or projects to publish.');
      return;
    }
    setLastError(null);
    setLastMessage(null);
    const chunk = 12;
    try {
      for (let i = 0; i < items.length; i += chunk) {
        const part = items.slice(i, i + chunk);
        await apply(part.map(h => publishDocument(h)));
      }
      setLastMessage(`Published ${items.length} document(s).`);
    } catch (e: unknown) {
      setLastError(e instanceof Error ? e.message : String(e));
    }
  }, [apply, selectedHandles]);

  return (
    <div className='bulk-app'>
      <header className='bulk-header'>
        <h1 className='bulk-title'>WiSiHe bulk tools</h1>
        <p className='muted'>
          Dataset <span className='mono'>{PROJECT_ID}</span> /{' '}
          <span className='mono'>{DATASET}</span>
        </p>
      </header>

      <nav className='tabs' aria-label='Primary'>
        <button
          type='button'
          className={tab === 'paintings' ? 'tab active' : 'tab'}
          onClick={() => setTab('paintings')}
        >
          Paintings
        </button>
        <button
          type='button'
          className={tab === 'projects' ? 'tab active' : 'tab'}
          onClick={() => setTab('projects')}
        >
          Projects
        </button>
        <button
          type='button'
          className={tab === 'tags' ? 'tab active' : 'tab'}
          onClick={() => setTab('tags')}
        >
          Tags
        </button>
      </nav>

      {(lastMessage || lastError) && (
        <output className={lastError ? 'banner error' : 'banner success'} aria-live='polite'>
          {lastError ?? lastMessage}
        </output>
      )}

      <section className='toolbar'>
        <div className='toolbar-row'>
          <span className='muted'>Selected: {selectedHandles.length}</span>
          <button type='button' className='btn btn-secondary' onClick={clearSelection}>
            Clear selection
          </button>
        </div>

        <Suspense
          fallback={
            <p className='muted' style={{ marginTop: 8 }}>
              Loading tag catalog…
            </p>
          }
        >
          <TagsCatalogInner>
            {catalog => (
              <>
                <div className='toolbar-row wrap'>
                  <label className='field'>
                    <span className='field-label'>Add tag to selection</span>
                    <select
                      className='select'
                      value={tagChoice}
                      onChange={e => {
                        setTagChoice(e.target.value);
                      }}
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
                    className='btn'
                    disabled={!tagChoice}
                    onClick={() => {
                      if (tagChoice) startMerge([tagChoice]);
                    }}
                  >
                    Merge tag into selected
                  </button>
                  {aiPreview && aiPreview.length > 0 ? (
                    <>
                      <span className='muted'>AI suggested {aiPreview.length} tag(s).</span>
                      <button type='button' className='btn' onClick={() => startMerge(aiPreview)}>
                        Apply AI suggestions
                      </button>
                      <button
                        type='button'
                        className='btn btn-secondary'
                        onClick={() => setAiPreview(null)}
                      >
                        Dismiss AI
                      </button>
                    </>
                  ) : null}
                </div>
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

        <div className='toolbar-row'>
          <button
            type='button'
            className='btn btn-secondary'
            onClick={() => void publishSelected()}
          >
            Publish selected (paintings/projects)
          </button>
        </div>
      </section>

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

      {tab === 'paintings' ? (
        <Suspense fallback={<p className='muted'>Loading paintings…</p>}>
          <DocumentTable
            documentType='painting'
            dataset={dataset}
            selected={selected}
            toggle={toggle}
          />
        </Suspense>
      ) : null}
      {tab === 'projects' ? (
        <Suspense fallback={<p className='muted'>Loading projects…</p>}>
          <DocumentTable
            documentType='project'
            dataset={dataset}
            selected={selected}
            toggle={toggle}
          />
        </Suspense>
      ) : null}
      {tab === 'tags' ? (
        <Suspense fallback={<p className='muted'>Loading tags…</p>}>
          <DocumentTable documentType='tag' dataset={dataset} selected={selected} toggle={toggle} />
        </Suspense>
      ) : null}
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

  if (!sole || (sole.documentType !== 'painting' && sole.documentType !== 'project')) {
    return (
      <p className='muted small' style={{ marginTop: 8 }}>
        Select exactly one painting or project for AI tag suggestions (OpenAI via Next.js proxy at{' '}
        <code className='mono'>/api/wisihe-ai/suggest-tags</code>).
      </p>
    );
  }

  return (
    <div className='ai-row'>
      <Suspense fallback={<span className='muted'>Loading document…</span>}>
        <AiSuggestTrigger
          handle={sole}
          catalog={catalog}
          disabled={disabled}
          onBusy={onBusy}
          onError={onError}
          onSuggestions={onSuggestions}
        />
      </Suspense>
    </div>
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
    handle.documentType === 'painting'
      ? `{ "title": title, "textBody": coalesce(description, "") }`
      : `{ "title": name, "textBody": "" }`;

  const { data } = useDocumentProjection<{ title?: string | null; textBody?: string | null }>({
    ...handle,
    projection,
  });

  const title = (data?.title ?? '').trim() || 'Untitled';
  const textBody = (data?.textBody ?? '').trim();
  const kind = handle.documentType === 'painting' ? 'painting' : 'project';

  return (
    <button
      type='button'
      className='btn btn-secondary'
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
      Run AI tag suggest (nano)
    </button>
  );
}
