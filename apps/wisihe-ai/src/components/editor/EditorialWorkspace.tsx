import { BookIcon } from '@sanity/icons/Book';
import { CaseIcon } from '@sanity/icons/Case';
import { ComponentIcon } from '@sanity/icons/Component';
import { DocumentIcon } from '@sanity/icons/Document';
import { EditIcon } from '@sanity/icons/Edit';
import { EyeClosedIcon } from '@sanity/icons/EyeClosed';
import { EyeOpenIcon } from '@sanity/icons/EyeOpen';
import { PublishIcon } from '@sanity/icons/Publish';
import { SparklesIcon } from '@sanity/icons/Sparkles';
import { SyncIcon } from '@sanity/icons/Sync';
import { TagIcon } from '@sanity/icons/Tag';
import { UlistIcon } from '@sanity/icons/Ulist';
import { WarningOutlineIcon } from '@sanity/icons/WarningOutline';
import { useClient, useQuery } from '@sanity/sdk-react';
import { useCallback, useMemo, useRef, useState } from 'react';
import type { PortableTextBlock } from '../../lib/portableTextAdapter';
import { AIControlCenter } from './AIControlCenter';
import { LexicalEditor } from './LexicalEditor';
import { PresentationPane } from './PresentationPane';
import { ReusableContentDrawer } from './ReusableContentDrawer';
import './editor.css';

interface EditableDocument {
  _id: string;
  _type: 'post' | 'project' | 'recipe';
  title?: string;
  name?: string;
  slug?: { current?: string };
  body?: PortableTextBlock[];
  content?: PortableTextBlock[];
  summary?: PortableTextBlock[];
  description?: PortableTextBlock[];
  instructions?: { content?: PortableTextBlock[]; [key: string]: unknown }[];
  [key: string]: unknown;
}

interface EditorialWorkspaceProps {
  activeTab?: 'editorial' | 'bulk';
  onTabChange?: (tab: 'editorial' | 'bulk') => void;
}

export function EditorialWorkspace({
  activeTab = 'editorial',
  onTabChange,
}: EditorialWorkspaceProps = {}) {
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(true);
  const [showOutline, setShowOutline] = useState(false);
  const [headingCount, setHeadingCount] = useState(0);
  const [showReusableDrawer, setShowReusableDrawer] = useState(false);
  const [drawerTab, setDrawerTab] = useState<'blocks' | 'sanity' | 'media' | 'custom'>('blocks');
  const [showAiStudio, setShowAiStudio] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [stats, setStats] = useState({ words: 0, characters: 0 });

  const insertSnippetRef = useRef<((text: string) => void) | null>(null);
  const applyResultRef = useRef<((text: string, mode: 'replace' | 'insert-below') => void) | null>(
    null,
  );
  const textGetterRef = useRef<(() => string) | null>(null);
  const client = useClient({ apiVersion: '2025-02-19' });

  // Fetch candidate documents
  const { data: documents, isPending } = useQuery<EditableDocument[]>({
    query: `*[_type in ["post", "project", "recipe"] && !(_id in path("drafts.**"))] | order(_updatedAt desc)[0...50] {
      _id,
      _type,
      title,
      name,
      slug,
      body,
      content,
      summary,
      description,
      instructions
    }`,
  });

  // Select initial document once loaded
  const docList = useMemo(() => documents ?? [], [documents]);
  const activeDocId = selectedDocId || (docList.length > 0 ? docList[0]._id : null);
  const activeDoc = useMemo(
    () => docList.find(d => d._id === activeDocId) || null,
    [docList, activeDocId],
  );

  // Identify which field stores Portable Text
  const richTextField = useMemo(() => {
    if (!activeDoc) return 'body';
    if (activeDoc._type === 'project') return 'content';
    if (activeDoc._type === 'recipe') return 'instructions';
    return 'body';
  }, [activeDoc]);

  const initialBlocks = useMemo(() => {
    if (!activeDoc) return [];
    if (activeDoc._type === 'project') {
      return activeDoc.content ?? activeDoc.summary ?? [];
    }
    if (activeDoc._type === 'recipe') {
      if (Array.isArray(activeDoc.instructions) && activeDoc.instructions.length > 0) {
        const first = activeDoc.instructions[0];
        if (first && Array.isArray(first.content)) return first.content;
      }
      return [];
    }
    return activeDoc.body ?? [];
  }, [activeDoc]);

  const docTitle = activeDoc?.title || activeDoc?.name || 'Untitled';
  const docSlug = activeDoc?.slug?.current || '';

  // Determine frontend preview URL path
  const previewPath = useMemo(() => {
    if (!activeDoc) return '/';
    if (activeDoc._type === 'project') return docSlug ? `/projects/${docSlug}` : '/projects';
    if (activeDoc._type === 'recipe') return docSlug ? `/recipes/${docSlug}` : '/recipes';
    if (activeDoc._type === 'post') return docSlug ? `/posts/${docSlug}` : '/';
    return '/';
  }, [activeDoc, docSlug]);

  // Handle content changes from Lexical
  const handleContentChange = useCallback(
    async (blocks: PortableTextBlock[]) => {
      if (!activeDoc) return;
      setSaveStatus('saving');

      const publishedId = activeDoc._id.replace(/^drafts\./, '');
      const draftId = `drafts.${publishedId}`;

      const patchData =
        activeDoc._type === 'recipe'
          ? {
              instructions: [
                {
                  _key: 'step1',
                  title: 'Instructions',
                  content: blocks,
                },
              ],
            }
          : {
              [richTextField]: blocks,
            };

      try {
        // Ensure draft exists before applying patch
        const existingDraft = await client.getDocument(draftId);
        if (!existingDraft) {
          const { _id, _createdAt, _updatedAt, _rev, ...copyFields } = activeDoc;
          await client.createIfNotExists({
            ...copyFields,
            _id: draftId,
            _type: activeDoc._type,
          });
        }

        await client.patch(draftId).set(patchData).commit({ autoGenerateArrayKeys: true });

        setSaveStatus('saved');
      } catch (err) {
        console.error('Failed to save document:', err);
        setSaveStatus('error');
      }
    },
    [activeDoc, client, richTextField],
  );

  // Handle publishing document
  const handlePublish = useCallback(async () => {
    if (!activeDoc) return;
    setSaveStatus('saving');

    const publishedId = activeDoc._id.replace(/^drafts\./, '');
    const draftId = `drafts.${publishedId}`;

    try {
      const draftDoc = await client.getDocument(draftId);
      if (draftDoc) {
        const { _id, _rev, _createdAt, _updatedAt, ...dataToPublish } = draftDoc;
        const tx = client.transaction();
        tx.createOrReplace({
          ...dataToPublish,
          _id: publishedId,
        });
        tx.delete(draftId);
        await tx.commit();
      }

      setSaveStatus('saved');
      alert(`Published "${docTitle}" successfully!`);
    } catch (err) {
      console.error('Failed to publish document:', err);
      setSaveStatus('error');
      alert(err instanceof Error ? err.message : 'Publish failed');
    }
  }, [activeDoc, client, docTitle]);

  const _ActiveDocIcon =
    activeDoc?._type === 'project'
      ? CaseIcon
      : activeDoc?._type === 'recipe'
        ? BookIcon
        : DocumentIcon;

  if (isPending) {
    return (
      <div
        className='editorial-container'
        style={{ alignItems: 'center', justifyContent: 'center' }}
      >
        <div className='editorial-loader'>
          <SyncIcon
            className='rotating'
            style={{ fontSize: '1.4rem', color: 'var(--ed-accent)' }}
          />
          <p className='muted'>Connecting to Sanity Editorial Lake…</p>
        </div>
      </div>
    );
  }

  return (
    <div className='editorial-container'>
      {/* ── Unified Studio Topbar ── */}
      <div className='editorial-header'>
        {/* LEFT: Brand + View switcher + Doc picker */}
        <div className='editorial-header-left'>
          {/* Brand */}
          <div className='brand-logo-group'>
            <div className='brand-logo-badge'>
              <SparklesIcon style={{ fontSize: '1rem', color: '#818cf8' }} />
            </div>
            <span className='brand-title'>WiSiHe</span>
          </div>

          <div className='header-v-divider' />

          {/* View Tabs — icon + short label */}
          {onTabChange && (
            <div className='tabs-pill-wrapper'>
              <button
                type='button'
                className={`tab-pill ${activeTab === 'editorial' ? 'active' : ''}`}
                onClick={() => onTabChange('editorial')}
                title='Editorial Studio'
              >
                <EditIcon />
                <span>Editorial</span>
              </button>
              <button
                type='button'
                className={`tab-pill ${activeTab === 'bulk' ? 'active' : ''}`}
                onClick={() => onTabChange('bulk')}
                title='Bulk Tag Catalog'
              >
                <TagIcon />
                <span>Bulk Tags</span>
              </button>
            </div>
          )}

          <div className='header-v-divider' />

          {/* Document Picker — compact, icon + title only */}
          <div className='document-picker-wrapper'>
            {activeDoc && <span className={`doc-type-dot doc-type-${activeDoc._type}`} />}
            <select
              className='document-select'
              value={activeDoc?._id || ''}
              onChange={e => setSelectedDocId(e.target.value)}
              title='Switch document'
            >
              {docList.map(doc => (
                <option
                  key={doc._id}
                  value={doc._id}
                  style={{ background: '#161a20', color: '#fff' }}
                >
                  {doc.title || doc.name || 'Untitled'}
                </option>
              ))}
            </select>
          </div>

          {/* Save status — minimal */}
          <div
            className={`save-status-dot-pill ${saveStatus}`}
            title={
              saveStatus === 'saving'
                ? 'Saving draft…'
                : saveStatus === 'error'
                  ? 'Save error'
                  : 'Draft saved'
            }
          >
            {saveStatus === 'saving' ? (
              <SyncIcon className='rotating' style={{ fontSize: '0.75rem' }} />
            ) : saveStatus === 'error' ? (
              <WarningOutlineIcon style={{ fontSize: '0.75rem', color: '#fb7185' }} />
            ) : (
              <span className='sync-pulse-dot' />
            )}
            <span className='save-status-label'>
              {saveStatus === 'saving' ? 'Saving' : saveStatus === 'error' ? 'Error' : 'Saved'}
            </span>
          </div>
        </div>

        {/* RIGHT: Tool buttons (icon-only) + Publish */}
        <div className='editorial-header-right'>
          <button
            type='button'
            className={`btn-icon ${showOutline ? 'active' : ''}`}
            onClick={() => setShowOutline(!showOutline)}
            title='Document Outline'
          >
            <UlistIcon />
            {headingCount > 0 && <span className='btn-icon-badge'>{headingCount}</span>}
          </button>

          <button
            type='button'
            className={`btn-icon btn-icon-ai ${showAiStudio ? 'active' : ''}`}
            onClick={() => setShowAiStudio(true)}
            title='AI Studio — GPT-5.6 Sol'
          >
            <SparklesIcon />
          </button>

          <button
            type='button'
            className={`btn-icon ${showReusableDrawer ? 'active' : ''}`}
            onClick={() => {
              setDrawerTab('blocks');
              setShowReusableDrawer(!showReusableDrawer);
            }}
            title='Blocks & Media Library'
          >
            <ComponentIcon />
          </button>

          <div className='header-v-divider' />

          <button
            type='button'
            className={`btn-icon ${showPreview ? 'active' : ''}`}
            onClick={() => setShowPreview(!showPreview)}
            title={showPreview ? 'Hide live preview' : 'Show live preview'}
          >
            {showPreview ? <EyeClosedIcon /> : <EyeOpenIcon />}
          </button>

          <button
            type='button'
            className='btn-publish'
            onClick={() => void handlePublish()}
            title='Publish draft to live'
          >
            <PublishIcon />
            <span>Publish</span>
          </button>
        </div>
      </div>

      {/* Split Body */}
      <div className='editorial-split-body'>
        <div className='editor-pane'>
          {activeDoc ? (
            <LexicalEditor
              key={activeDoc._id}
              documentId={activeDoc._id}
              documentTitle={docTitle}
              initialBlocks={initialBlocks}
              onChange={blocks => void handleContentChange(blocks)}
              onStatsChange={setStats}
              showOutline={showOutline}
              onToggleOutline={() => setShowOutline(prev => !prev)}
              onOutlineChange={setHeadingCount}
              onOpenReusableDrawer={tab => {
                if (tab) setDrawerTab(tab);
                setShowReusableDrawer(true);
              }}
              onOpenAiStudio={() => setShowAiStudio(true)}
              onRegisterInsert={fn => {
                insertSnippetRef.current = fn;
              }}
              onRegisterApply={fn => {
                applyResultRef.current = fn;
              }}
              onRegisterTextGetter={fn => {
                textGetterRef.current = fn;
              }}
            />
          ) : (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--ed-text-muted)' }}>
              No document selected. Choose a post, project, or recipe from the dropdown above.
            </div>
          )}
        </div>

        {showPreview && (
          <PresentationPane
            previewPath={previewPath}
            onToggleCollapse={() => setShowPreview(false)}
          />
        )}
      </div>

      {/* Footer Status Bar */}
      <div className='editorial-footer'>
        <div className='footer-stats'>
          <span>{stats.words} words</span>
          <span>{stats.characters} characters</span>
          <span>~{Math.max(1, Math.ceil(stats.words / 200))} min read</span>
        </div>

        <div className='footer-hints'>
          <span>Press </span>
          <code className='shortcut-badge'>/</code>
          <span> for blocks, snippets & AI • Highlight text for quick actions</span>
        </div>
      </div>

      {/* AI Editorial Studio Modal */}
      <AIControlCenter
        isOpen={showAiStudio}
        onClose={() => setShowAiStudio(false)}
        documentTitle={docTitle}
        currentText={textGetterRef.current?.() || ''}
        onApplyResult={(resultText, mode) => {
          if (applyResultRef.current) {
            applyResultRef.current(resultText, mode);
          }
        }}
      />

      {/* Reusable Content & Snippets Drawer */}
      <ReusableContentDrawer
        isOpen={showReusableDrawer}
        onClose={() => setShowReusableDrawer(false)}
        initialTab={drawerTab}
        documentTitle={docTitle}
        onInsertContent={text => {
          if (insertSnippetRef.current) {
            insertSnippetRef.current(text);
          }
        }}
      />
    </div>
  );
}
