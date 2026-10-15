import { CheckmarkIcon } from '@sanity/icons/Checkmark';
import { CloseIcon } from '@sanity/icons/Close';
import { SparklesIcon } from '@sanity/icons/Sparkles';
import type { DocumentHandle } from '@sanity/sdk-react';
import type { BulkDescribeResult } from '../../lib/bulkDescribeClient';

export type DraftState =
  | 'pending'
  | 'generating'
  | 'done'
  | 'error'
  | 'approved'
  | 'skipped'
  | 'applied';

export interface ContentDraft {
  key: string;
  handle: DocumentHandle;
  documentKind: 'painting' | 'project' | 'photography' | 'post';
  title: string;
  existingDescription: string;
  imageUrl?: string;
  draft: string;
  result?: BulkDescribeResult;
  state: DraftState;
  error?: string;
}

interface BulkDescribeSheetProps {
  isOpen: boolean;
  isGenerating: boolean;
  drafts: ContentDraft[];
  onClose: () => void;
  onApprove: (key: string) => void;
  onSkip: (key: string) => void;
  onEditDraft: (key: string, text: string) => void;
  onApproveAll: () => void;
  onApplyApproved: () => void;
  isApplying: boolean;
}

export function BulkDescribeSheet({
  isOpen,
  isGenerating,
  drafts,
  onClose,
  onApprove,
  onSkip,
  onEditDraft,
  onApproveAll,
  onApplyApproved,
  isApplying,
}: BulkDescribeSheetProps) {
  if (!isOpen) return null;

  const approvedCount = drafts.filter(d => d.state === 'approved').length;
  const doneCount = drafts.filter(d => d.state === 'done').length;
  const appliedCount = drafts.filter(d => d.state === 'applied').length;
  const totalCount = drafts.length;

  return (
    <section className='bulk-sheet' aria-label='AI Draft Review Sheet'>
      {/* Sheet Header */}
      <div className='bulk-sheet-header'>
        <div className='bulk-sheet-header-left'>
          <div className='brand-logo-badge' style={{ background: '#312e81' }}>
            <SparklesIcon style={{ fontSize: '1rem', color: '#818cf8' }} />
          </div>
          <div>
            <h3 className='bulk-sheet-title'>AI Content Drafts Review</h3>
            <p className='bulk-sheet-sub'>
              Review and edit generated copy before saving to Sanity drafts.
            </p>
          </div>
          <div className='bulk-sheet-stats'>
            <span className='bulk-sheet-stat approved'>{approvedCount} approved</span>
            <span className='bulk-sheet-stat done'>{doneCount} ready</span>
            {appliedCount > 0 && (
              <span className='bulk-sheet-stat applied'>{appliedCount} applied</span>
            )}
            <span className='bulk-sheet-stat total'>{totalCount} total</span>
          </div>
        </div>

        <div className='bulk-sheet-header-actions'>
          {doneCount > 0 && (
            <button
              type='button'
              className='bulk-action-btn secondary'
              onClick={onApproveAll}
              disabled={isGenerating || isApplying}
            >
              <CheckmarkIcon style={{ fontSize: '0.9rem' }} />
              Approve All Ready
            </button>
          )}

          <button
            type='button'
            className='bulk-action-btn'
            onClick={onApplyApproved}
            disabled={approvedCount === 0 || isApplying}
          >
            <SparklesIcon style={{ fontSize: '0.9rem' }} />
            {isApplying ? 'Saving to Drafts…' : `Apply ${approvedCount} Approved to Drafts`}
          </button>

          <button
            type='button'
            className='bulk-sheet-close-btn'
            onClick={onClose}
            aria-label='Close draft review sheet'
          >
            <CloseIcon style={{ fontSize: '1.1rem' }} />
          </button>
        </div>
      </div>

      {/* Sheet Table Body */}
      <div className='bulk-sheet-body'>
        <table className='bulk-sheet-table'>
          <thead>
            <tr>
              <th style={{ width: '18%' }}>Document</th>
              <th style={{ width: '10%' }}>Type</th>
              <th style={{ width: '52%' }}>Generated Draft (Editable)</th>
              <th style={{ width: '10%' }}>Status</th>
              <th style={{ width: '10%' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {drafts.map(d => {
              const isApproved = d.state === 'approved';
              const isSkipped = d.state === 'skipped';
              const isApplied = d.state === 'applied';
              const isPending = d.state === 'pending' || d.state === 'generating';

              return (
                <tr key={d.key} className={`bulk-sheet-row state-${d.state}`}>
                  <td className='bulk-sheet-doc-cell'>
                    {d.imageUrl ? (
                      <img src={d.imageUrl} alt='' className='bulk-sheet-thumb' loading='lazy' />
                    ) : null}
                    <div className='bulk-sheet-doc-info'>
                      <span className='bulk-sheet-doc-title' title={d.title || d.handle.documentId}>
                        {d.title || d.handle.documentId}
                      </span>
                      <span className='mono muted small'>{d.handle.documentId}</span>
                    </div>
                  </td>

                  <td>
                    <span className={`doc-type-pill doc-type-${d.documentKind}`}>
                      {d.documentKind}
                    </span>
                  </td>

                  <td>
                    {isPending ? (
                      <div className='bulk-draft-skeleton'>
                        <div className='studio-spinner small' />
                        <span className='muted small'>
                          {d.state === 'generating' ? 'Writing draft with Sol…' : 'Queued…'}
                        </span>
                      </div>
                    ) : d.state === 'error' ? (
                      <div className='bulk-draft-error'>
                        <span>⚠️ {d.error || 'Generation failed'}</span>
                      </div>
                    ) : (
                      <div className='bulk-draft-editor-box'>
                        <textarea
                          className='bulk-draft-textarea'
                          value={d.draft}
                          disabled={isApplied || isApplying}
                          onChange={e => onEditDraft(d.key, e.target.value)}
                          rows={3}
                        />
                        <div className='bulk-draft-meta'>
                          <span className='muted small'>
                            {d.draft.length} chars • {d.draft.split(/\s+/).filter(Boolean).length}{' '}
                            words
                          </span>
                        </div>
                      </div>
                    )}
                  </td>

                  <td>
                    <span className={`bulk-state-pill ${d.state}`}>
                      {d.state === 'done'
                        ? 'Ready'
                        : d.state.charAt(0).toUpperCase() + d.state.slice(1)}
                    </span>
                  </td>

                  <td>
                    {!isPending && !isApplied && d.state !== 'error' && (
                      <div className='bulk-row-actions'>
                        <button
                          type='button'
                          className={`bulk-icon-btn approve ${isApproved ? 'active' : ''}`}
                          onClick={() => onApprove(d.key)}
                          title={isApproved ? 'Approved' : 'Approve draft'}
                          disabled={isApplying}
                        >
                          <CheckmarkIcon style={{ fontSize: '0.95rem' }} />
                        </button>
                        <button
                          type='button'
                          className={`bulk-icon-btn skip ${isSkipped ? 'active' : ''}`}
                          onClick={() => onSkip(d.key)}
                          title={isSkipped ? 'Skipped' : 'Skip this doc'}
                          disabled={isApplying}
                        >
                          <CloseIcon style={{ fontSize: '0.95rem' }} />
                        </button>
                      </div>
                    )}
                    {isApplied && (
                      <span className='applied-check-label'>
                        <CheckmarkIcon style={{ fontSize: '0.9rem', color: '#10b981' }} />
                        Saved
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
