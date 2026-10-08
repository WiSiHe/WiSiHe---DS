import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { registerCodeHighlighting } from '@lexical/code-prism';
import { LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { TRANSFORMERS } from '@lexical/markdown';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import {
  type TableOfContentsEntry,
  TableOfContentsPlugin,
} from '@lexical/react/LexicalTableOfContentsPlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { $insertNodeToNearestRoot } from '@lexical/utils';
import { UlistIcon } from '@sanity/icons/Ulist';
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  $getSelection,
  $isRangeSelection,
  type EditorState,
  type LexicalEditor as LexicalEditorInstance,
} from 'lexical';
import { useCallback, useEffect, useRef, useState } from 'react';
import { executeCopilotAction } from '../../lib/copilotClient';
import { exportLexicalToPortableText, type PortableTextBlock } from '../../lib/portableTextAdapter';
import { editorTheme } from './editorTheme';
import { $createAccordionNode, AccordionNode } from './nodes/AccordionNode';
import { $createImageNode, ImageNode } from './nodes/ImageNode';
import { FloatingToolbarPlugin } from './plugins/FloatingToolbarPlugin';
import { LoadPortableTextPlugin } from './plugins/LoadPortableTextPlugin';
import { SlashMenuPlugin } from './plugins/SlashMenuPlugin';
import { TableOfContentsPanel } from './TableOfContentsPanel';

interface LexicalEditorProps {
  documentId: string;
  documentTitle?: string;
  initialBlocks: PortableTextBlock[] | null | undefined;
  onChange: (blocks: PortableTextBlock[]) => void;
  onStatsChange?: (stats: { words: number; characters: number }) => void;
  onOpenReusableDrawer?: (tab?: 'blocks' | 'sanity' | 'media' | 'custom') => void;
  onOpenAiStudio?: () => void;
  onRegisterInsert?: (inserter: (text: string) => void) => void;
  onRegisterApply?: (applier: (text: string, mode: 'replace' | 'insert-below') => void) => void;
  onRegisterTextGetter?: (getter: () => string) => void;
  showOutline?: boolean;
  onToggleOutline?: () => void;
  onOutlineChange?: (count: number) => void;
}

function EditorBridgePlugin({
  onRegisterInsert,
  onRegisterApply,
  onRegisterTextGetter,
  onLocalInserterReady,
}: {
  onRegisterInsert?: (inserter: (text: string) => void) => void;
  onRegisterApply?: (applier: (text: string, mode: 'replace' | 'insert-below') => void) => void;
  onRegisterTextGetter?: (getter: () => string) => void;
  onLocalInserterReady: (inserter: (text: string) => void) => void;
}) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const inserter = (text: string) => {
      editor.update(() => {
        const trimmed = text.trim();
        const imageMatch = trimmed.match(/^!\[(.*?)\]\((.*?)(?:\s+"(.*?)")?\)$/);

        if (imageMatch) {
          const [, alt, src, caption] = imageMatch;
          const imageNode = $createImageNode(src, alt, caption);
          const selection = $getSelection();

          if ($isRangeSelection(selection)) {
            $insertNodeToNearestRoot(imageNode);
          } else {
            const root = $getRoot();
            root.append(imageNode);
          }

          const nextP = $createParagraphNode();
          imageNode.insertAfter(nextP);
          nextP.select();
          return;
        }

        const accordionMatch = trimmed.match(
          /^<details>\s*<summary>(.*?)<\/summary>\s*([\s\S]*?)<\/details>$/i,
        );
        if (accordionMatch) {
          const [, title, content] = accordionMatch;
          const accordionNode = $createAccordionNode({
            title: title.trim() || 'Untitled Section',
            content: content.trim(),
          });
          const selection = $getSelection();

          if ($isRangeSelection(selection)) {
            $insertNodeToNearestRoot(accordionNode);
          } else {
            const root = $getRoot();
            root.append(accordionNode);
          }

          const nextP = $createParagraphNode();
          accordionNode.insertAfter(nextP);
          nextP.select();
          return;
        }

        const selection = $getSelection();
        const lines = text.split('\n');

        if ($isRangeSelection(selection)) {
          for (let i = 0; i < lines.length; i++) {
            if (i > 0) {
              selection.insertParagraph();
            }
            selection.insertText(lines[i]);
          }
        } else {
          const root = $getRoot();
          for (const line of lines) {
            const p = $createParagraphNode();
            p.append($createTextNode(line));
            root.append(p);
          }
        }
      });

      // Ensure editor regains focus smoothly after drawer insertion
      setTimeout(() => {
        editor.focus();
      }, 50);
    };

    const applier = (text: string, mode: 'replace' | 'insert-below') => {
      editor.update(() => {
        const selection = $getSelection();
        const lines = text.split('\n');

        if (mode === 'replace') {
          if ($isRangeSelection(selection) && !selection.isCollapsed()) {
            selection.insertText(text);
          } else {
            const root = $getRoot();
            root.clear();
            for (const line of lines) {
              const p = $createParagraphNode();
              p.append($createTextNode(line));
              root.append(p);
            }
          }
        } else {
          // insert-below
          if ($isRangeSelection(selection)) {
            selection.insertParagraph();
            for (let i = 0; i < lines.length; i++) {
              if (i > 0) selection.insertParagraph();
              selection.insertText(lines[i]);
            }
          } else {
            const root = $getRoot();
            for (const line of lines) {
              const p = $createParagraphNode();
              p.append($createTextNode(line));
              root.append(p);
            }
          }
        }
      });
      setTimeout(() => {
        editor.focus();
      }, 50);
    };

    const textGetter = () => {
      let content = '';
      editor.getEditorState().read(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection) && !selection.isCollapsed()) {
          content = selection.getTextContent();
        } else {
          content = $getRoot().getTextContent();
        }
      });
      return content;
    };

    onLocalInserterReady(inserter);
    if (onRegisterInsert) onRegisterInsert(inserter);
    if (onRegisterApply) onRegisterApply(applier);
    if (onRegisterTextGetter) onRegisterTextGetter(textGetter);
  }, [editor, onRegisterInsert, onRegisterApply, onRegisterTextGetter, onLocalInserterReady]);

  return null;
}

function CodeHighlightPlugin() {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    return registerCodeHighlighting(editor);
  }, [editor]);
  return null;
}

function OutlineWatcher({
  tableOfContents,
  onOutlineChange,
}: {
  tableOfContents: TableOfContentsEntry[];
  onOutlineChange?: (count: number) => void;
}) {
  useEffect(() => {
    if (onOutlineChange) {
      onOutlineChange(tableOfContents.length);
    }
  }, [tableOfContents.length, onOutlineChange]);
  return null;
}

export function LexicalEditor({
  documentId,
  documentTitle,
  initialBlocks,
  onChange,
  onStatsChange,
  onOpenReusableDrawer,
  onOpenAiStudio,
  onRegisterInsert,
  onRegisterApply,
  onRegisterTextGetter,
  showOutline,
  onToggleOutline,
  onOutlineChange,
}: LexicalEditorProps) {
  const [showAiInput, setShowAiInput] = useState(false);
  const [isOutlineOpen, setIsOutlineOpen] = useState(showOutline ?? false);
  const [editorStats, setEditorStats] = useState({ words: 0, characters: 0 });
  const localInserterRef = useRef<((text: string) => void) | null>(null);
  const isLoadedRef = useRef(false);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (showOutline !== undefined) {
      setIsOutlineOpen(showOutline);
    }
  }, [showOutline]);

  const initialConfig = {
    namespace: 'WiSiHeEditorialEditor',
    theme: editorTheme,
    nodes: [
      HeadingNode,
      QuoteNode,
      ListNode,
      ListItemNode,
      CodeNode,
      CodeHighlightNode,
      LinkNode,
      ImageNode,
      AccordionNode,
    ],
    onError: (error: Error) => {
      console.error('Lexical Error:', error);
    },
  };

  const handleEditorChange = useCallback(
    (editorState: EditorState, editor: LexicalEditorInstance, tags?: Set<string>) => {
      // Calculate word & character counts
      editorState.read(() => {
        const text = $getRoot().getTextContent();
        const trimmed = text.trim();
        const words = trimmed ? trimmed.split(/\s+/).length : 0;
        const characters = text.length;
        const newStats = { words, characters };
        setEditorStats(newStats);
        if (onStatsChange) {
          onStatsChange(newStats);
        }
      });

      // Skip auto-save if triggered by programmatic document population
      if (tags?.has('sanity-load')) {
        isLoadedRef.current = true;
        return;
      }

      // If document was not yet marked as loaded, mark it and skip first blank save
      if (!isLoadedRef.current) {
        isLoadedRef.current = true;
        return;
      }

      // Debounce saving portable text
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        const blocks = exportLexicalToPortableText(editor);
        onChange(blocks);
      }, 600);
    },
    [onChange, onStatsChange],
  );

  function AiPromptBar({
    show,
    onClose,
    documentTitle,
  }: {
    show: boolean;
    onClose: () => void;
    documentTitle?: string;
  }) {
    const [editor] = useLexicalComposerContext();
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);

    if (!show) return null;

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!prompt.trim()) return;

      setLoading(true);
      try {
        let currentText = '';
        editor.getEditorState().read(() => {
          currentText = $getRoot().getTextContent();
        });

        const generated = await executeCopilotAction({
          action: 'custom',
          text: currentText,
          prompt,
          documentTitle,
        });

        if (generated) {
          editor.update(() => {
            const root = $getRoot();
            const newP = $createParagraphNode();
            newP.append($createTextNode(generated));
            root.append(newP);
          });
          setPrompt('');
          onClose();
        }
      } catch (err) {
        alert(err instanceof Error ? err.message : 'AI generation failed');
      } finally {
        setLoading(false);
      }
    };

    return (
      <form className='ai-prompt-bar' onSubmit={e => void handleSubmit(e)}>
        <span style={{ fontSize: '1.2rem' }}>✨</span>
        <span className='ai-prompt-model-badge' title='Active AI Model'>
          GPT-5.6 Sol
        </span>
        <input
          type='text'
          className='ai-prompt-input'
          placeholder='Ask GPT-5.6 Sol to write, outline, draft, or brainstorm… (Press Enter)'
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          disabled={loading}
          // biome-ignore lint/a11y/noAutofocus: prompt input appears only after the user opens it
          autoFocus
        />
        <button
          type='button'
          className='btn'
          style={{ padding: '0.25rem 0.6rem', fontSize: '0.8rem' }}
          onClick={onClose}
        >
          Esc
        </button>
      </form>
    );
  }

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className='editor-canvas-wrapper'>
        <AiPromptBar
          show={showAiInput}
          onClose={() => setShowAiInput(false)}
          documentTitle={documentTitle}
        />

        <RichTextPlugin
          contentEditable={
            <ContentEditable
              className='editor-input'
              aria-placeholder='Start typing or press "/" for commands and AI…'
              placeholder={
                <div className='editor-placeholder'>
                  Start typing or press <span style={{ color: '#818cf8' }}>/</span> for commands and
                  AI…
                </div>
              }
            />
          }
          ErrorBoundary={LexicalErrorBoundary}
        />

        <HistoryPlugin />
        <ListPlugin />
        <LinkPlugin />
        <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
        <CodeHighlightPlugin />
        <OnChangePlugin onChange={handleEditorChange} />
        <LoadPortableTextPlugin documentId={documentId} initialBlocks={initialBlocks} />
        <EditorBridgePlugin
          onRegisterInsert={onRegisterInsert}
          onRegisterApply={onRegisterApply}
          onRegisterTextGetter={onRegisterTextGetter}
          onLocalInserterReady={fn => {
            localInserterRef.current = fn;
          }}
        />
        <SlashMenuPlugin
          onTriggerAI={onOpenAiStudio || (() => setShowAiInput(true))}
          onOpenDrawer={onOpenReusableDrawer}
          onInsertSnippet={text => localInserterRef.current?.(text)}
          onToggleOutline={() => setIsOutlineOpen(prev => !prev)}
        />
        <FloatingToolbarPlugin documentTitle={documentTitle} onOpenAiStudio={onOpenAiStudio} />

        <TableOfContentsPlugin>
          {(tableOfContents, editorInstance) => (
            <>
              <OutlineWatcher tableOfContents={tableOfContents} onOutlineChange={onOutlineChange} />
              <button
                type='button'
                className={`editor-floating-outline-btn ${isOutlineOpen ? 'active' : ''}`}
                onClick={() => {
                  const next = !isOutlineOpen;
                  setIsOutlineOpen(next);
                  if (onToggleOutline) onToggleOutline();
                }}
                title={isOutlineOpen ? 'Close Document Outline' : 'Open Document Outline (TOC)'}
                aria-label='Document Table of Contents'
              >
                <UlistIcon style={{ fontSize: '1rem' }} />
                <span>Outline</span>
                {tableOfContents.length > 0 && (
                  <span className='toc-floating-badge'>{tableOfContents.length}</span>
                )}
              </button>

              <TableOfContentsPanel
                tableOfContents={tableOfContents}
                editor={editorInstance}
                isOpen={isOutlineOpen}
                onClose={() => {
                  setIsOutlineOpen(false);
                  if (onToggleOutline && isOutlineOpen) onToggleOutline();
                }}
                onOpenAiStudio={onOpenAiStudio}
                onInsertSnippet={localInserterRef.current}
                stats={editorStats}
              />
            </>
          )}
        </TableOfContentsPlugin>
      </div>
    </LexicalComposer>
  );
}
