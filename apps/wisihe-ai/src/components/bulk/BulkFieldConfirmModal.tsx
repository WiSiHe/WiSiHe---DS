import { SparklesIcon } from '@sanity/icons/Sparkles';
import { useEffect } from 'react';
import type { FieldDef } from '../../lib/bulkFieldDefs';

interface BulkFieldConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  documentType: string;
  count: number;
  fieldDef: FieldDef;
  fieldValue: unknown;
  isApplying: boolean;
}

export function BulkFieldConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  documentType,
  count,
  fieldDef,
  fieldValue,
  isApplying,
}: BulkFieldConfirmModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isApplying) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isApplying, onClose]);

  if (!isOpen) return null;

  let displayValue = String(fieldValue ?? '');
  if (fieldDef.type === 'boolean') {
    displayValue = fieldValue ? 'True (Enabled)' : 'False (Disabled)';
  } else if (fieldDef.type === 'select') {
    const opt = fieldDef.options?.find(o => o.value === fieldValue);
    displayValue = opt ? `${opt.label} (${opt.value})` : String(fieldValue);
  }

  return (
    <div className='bulk-modal-overlay' role='dialog' aria-modal='true'>
      <button
        type='button'
        tabIndex={-1}
        aria-label='Close dialog'
        className='bulk-modal-backdrop'
        onClick={() => !isApplying && onClose()}
      />
      <div className='bulk-modal-card'>
        <div className='bulk-modal-header'>
          <div className='bulk-modal-icon-badge'>
            <SparklesIcon style={{ fontSize: '1.1rem', color: '#818cf8' }} />
          </div>
          <div>
            <h3 className='bulk-modal-title'>Confirm Bulk Field Update</h3>
            <p className='bulk-modal-sub'>
              Drafts will be updated for {count} selected {documentType}(s).
            </p>
          </div>
        </div>

        <div className='bulk-modal-body'>
          <div className='bulk-confirm-summary-box'>
            <div className='bulk-confirm-row'>
              <span className='bulk-confirm-label'>Collection</span>
              <span className='bulk-confirm-value capitalize'>{documentType}</span>
            </div>
            <div className='bulk-confirm-row'>
              <span className='bulk-confirm-label'>Affected Docs</span>
              <span className='bulk-confirm-value highlight'>
                {count} document{count === 1 ? '' : 's'}
              </span>
            </div>
            <div className='bulk-confirm-row'>
              <span className='bulk-confirm-label'>Target Field</span>
              <span className='bulk-confirm-value'>
                {fieldDef.label} <span className='mono muted'>({fieldDef.name})</span>
              </span>
            </div>
            <div className='bulk-confirm-row'>
              <span className='bulk-confirm-label'>New Value</span>
              <span className='bulk-confirm-value new-val'>{displayValue || '(empty)'}</span>
            </div>
          </div>

          <p className='bulk-modal-note'>
            ℹ️ This operation patches each document's <strong>draft</strong>. Nothing is published to
            the public site until you explicitly click "Publish Selected".
          </p>
        </div>

        <div className='bulk-modal-footer'>
          <button
            type='button'
            className='bulk-action-btn secondary'
            onClick={onClose}
            disabled={isApplying}
          >
            Cancel
          </button>
          <button
            type='button'
            className='bulk-action-btn'
            onClick={onConfirm}
            disabled={isApplying}
          >
            {isApplying
              ? 'Applying to Drafts…'
              : `Apply to ${count} Document${count === 1 ? '' : 's'}`}
          </button>
        </div>
      </div>
    </div>
  );
}
