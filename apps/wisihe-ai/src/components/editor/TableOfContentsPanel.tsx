import type { TableOfContentsEntry } from '@lexical/react/LexicalTableOfContentsPlugin';
import { AddIcon } from '@sanity/icons/Add';
import { CloseIcon } from '@sanity/icons/Close';
import { DocumentIcon } from '@sanity/icons/Document';
import { SparklesIcon } from '@sanity/icons/Sparkles';
import { UlistIcon } from '@sanity/icons/Ulist';
import type { LexicalEditor } from 'lexical';

interface TableOfContentsPanelProps {
  tableOfContents: TableOfContentsEntry[];
  editor: LexicalEditor;
  isOpen: boolean;
  onClose: () => void;
  onOpenAiStudio?: () => void;
  onInsertSnippet?: ((text: string) => void) | null;
  stats?: { words: number; characters: number };
}

export function TableOfContentsPanel({
  tableOfContents,
  editor,
  isOpen,
  onClose,
  onOpenAiStudio,
  onInsertSnippet,
  stats,
}: TableOfContentsPanelProps) {
  if (!isOpen) return null;

  const readingTimeMinutes = Math.max(1, Math.ceil((stats?.words || 0) / 200));

  const scrollToHeading = (key: string) => {
    editor.getEditorState().read(() => {
      const element = editor.getElementByKey(key);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.classList.add('heading-target-highlight');
        setTimeout(() => {
          element.classList.remove('heading-target-highlight');
        }, 1600);
      }
    });
  };

  const handleInsertTocAsMarkdown = () => {
    if (tableOfContents.length === 0 || !onInsertSnippet) return;

    const lines: string[] = ['### Table of Contents\n'];
    for (const [, text, tag] of tableOfContents) {
      const cleanTitle = text.trim();
      if (!cleanTitle) continue;
      const slug = cleanTitle
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');

      const indent = tag === 'h1' ? '' : tag === 'h2' ? '  ' : tag === 'h3' ? '    ' : '      ';

      lines.push(`${indent}- [${cleanTitle}](#${slug})`);
    }

    onInsertSnippet(`${lines.join('\n')}\n`);
    onClose();
  };

  return (
    <aside className='toc-sidebar-panel' aria-label='Document Table of Contents'>
      {/* Header */}
      <div className='toc-header'>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div className='toc-icon-wrap'>
            <UlistIcon style={{ fontSize: '1.05rem', color: 'var(--ed-accent)' }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <h3 className='toc-title'>Outline</h3>
              <span className='toc-count-badge'>
                {tableOfContents.length} {tableOfContents.length === 1 ? 'section' : 'sections'}
              </span>
            </div>
            <div className='toc-meta-sub'>
              {stats?.words || 0} words • ~{readingTimeMinutes} min read
            </div>
          </div>
        </div>

        <button
          type='button'
          className='toc-close-btn'
          onClick={onClose}
          title='Close Outline panel'
          aria-label='Close Outline'
        >
          <CloseIcon style={{ fontSize: '1rem' }} />
        </button>
      </div>

      {/* Body: Headings list */}
      <div className='toc-body'>
        {tableOfContents.length === 0 ? (
          <div className='toc-empty'>
            <DocumentIcon
              style={{ fontSize: '1.8rem', opacity: 0.4, color: 'var(--ed-text-muted)' }}
            />
            <p className='toc-empty-title'>No headings found</p>
            <p className='toc-empty-desc'>
              Add headings with <span className='mono'>/h1</span>, <span className='mono'>/h2</span>
              , or markdown <span className='mono'>## Section</span> to structure your content.
            </p>
            {onOpenAiStudio && (
              <button
                type='button'
                className='snippet-btn primary sm'
                style={{ marginTop: '0.5rem' }}
                onClick={() => {
                  onClose();
                  onOpenAiStudio();
                }}
              >
                <SparklesIcon />
                <span>AI Generate Headings</span>
              </button>
            )}
          </div>
        ) : (
          <nav className='toc-nav-list'>
            {tableOfContents.map(([key, text, tag]) => {
              const displayTitle = text.trim() || `(Untitled ${tag.toUpperCase()})`;
              const level = parseInt(tag.replace('h', ''), 10) || 1;

              return (
                <button
                  key={key}
                  type='button'
                  className={`toc-item-btn level-${level}`}
                  onClick={() => scrollToHeading(key)}
                  title={`Jump to: ${displayTitle}`}
                >
                  <span className={`toc-level-tag tag-${tag}`}>{tag.toUpperCase()}</span>
                  <span className='toc-item-text'>{displayTitle}</span>
                </button>
              );
            })}
          </nav>
        )}
      </div>

      {/* Footer Actions */}
      {tableOfContents.length > 0 && (
        <div className='toc-footer'>
          <button
            type='button'
            className='snippet-btn secondary sm'
            style={{ width: '100%' }}
            onClick={handleInsertTocAsMarkdown}
            title='Insert this Table of Contents as Markdown links directly into the document'
          >
            <AddIcon />
            <span>Insert TOC into Document</span>
          </button>
        </div>
      )}
    </aside>
  );
}
