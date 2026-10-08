import { TOGGLE_LINK_COMMAND } from '@lexical/link';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $insertNodeToNearestRoot } from '@lexical/utils';
import { BoldIcon } from '@sanity/icons/Bold';
import { ChevronDownIcon } from '@sanity/icons/ChevronDown';
import { CodeBlockIcon } from '@sanity/icons/CodeBlock';
import { EarthGlobeIcon } from '@sanity/icons/EarthGlobe';
import { EditIcon } from '@sanity/icons/Edit';
import { ItalicIcon } from '@sanity/icons/Italic';
import { LinkIcon } from '@sanity/icons/Link';
import { SearchIcon } from '@sanity/icons/Search';
import { SparklesIcon } from '@sanity/icons/Sparkles';
import { SyncIcon } from '@sanity/icons/Sync';
import { UnderlineIcon } from '@sanity/icons/Underline';
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
} from 'lexical';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { type CopilotAction, executeCopilotAction } from '../../../lib/copilotClient';
import { $createAccordionNode } from '../nodes/AccordionNode';

interface FloatingToolbarPluginProps {
  documentTitle?: string;
  onOpenAiStudio?: () => void;
}

export function FloatingToolbarPlugin({
  documentTitle,
  onOpenAiStudio,
}: FloatingToolbarPluginProps) {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef<HTMLDivElement | null>(null);

  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showAiMenu, setShowAiMenu] = useState(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection) || selection.isCollapsed()) {
      setPosition(null);
      setShowAiMenu(false);
      return;
    }

    setIsBold(selection.hasFormat('bold'));
    setIsItalic(selection.hasFormat('italic'));
    setIsCode(selection.hasFormat('code'));
    setIsUnderline(selection.hasFormat('underline'));

    const domSelection = window.getSelection();
    if (!domSelection || domSelection.rangeCount === 0) {
      setPosition(null);
      return;
    }

    const range = domSelection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    if (rect.width === 0 && rect.height === 0) {
      setPosition(null);
      return;
    }

    setPosition({
      x: rect.left + rect.width / 2,
      y: rect.top + window.scrollY,
    });
  }, []);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        updateToolbar();
        return false;
      },
      COMMAND_PRIORITY_LOW,
    );
  }, [editor, updateToolbar]);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar();
      });
    });
  }, [editor, updateToolbar]);

  const handleAiAction = async (action: CopilotAction) => {
    let selectedText = '';
    editor.getEditorState().read(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        selectedText = selection.getTextContent();
      }
    });

    if (!selectedText.trim()) return;

    setIsAiLoading(true);
    setShowAiMenu(false);

    try {
      const result = await executeCopilotAction({
        action,
        text: selectedText,
        documentTitle,
      });

      if (result) {
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            selection.insertText(result);
          }
        });
      }
    } catch (err) {
      console.error('AI transform failed:', err);
      alert(err instanceof Error ? err.message : 'AI action failed');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleInsertLink = () => {
    const url = prompt('Enter URL:');
    if (url !== null) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, url || null);
    }
  };

  const handleWrapInAccordion = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection) && !selection.isCollapsed()) {
        const text = selection.getTextContent().trim();
        const lines = text.split('\n').filter(Boolean);
        let title = 'Deep Dive Section';
        let body = text;

        if (lines.length > 1) {
          title = lines[0].replace(/^[#*\-•\s]+/, '').trim();
          body = lines.slice(1).join('\n\n').trim();
        } else if (text.length > 35) {
          const firstSentence = text.split(/[.!?]/)[0];
          title =
            firstSentence && firstSentence.length < 50 ? firstSentence : `${text.slice(0, 35)}…`;
        }

        const accordionNode = $createAccordionNode({
          title: title || 'Collapsible Section',
          content: body || text,
          badge: 'Deep Dive',
        });

        $insertNodeToNearestRoot(accordionNode);
        const nextP = $createParagraphNode();
        accordionNode.insertAfter(nextP);
        nextP.select();
      }
    });
  };

  if (!position) return null;

  return createPortal(
    <div
      ref={toolbarRef}
      className='floating-toolbar'
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <button
        type='button'
        className={`floating-btn ${isBold ? 'active' : ''}`}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
        title='Bold (Cmd+B)'
      >
        <BoldIcon style={{ fontSize: '1rem' }} />
      </button>
      <button
        type='button'
        className={`floating-btn ${isItalic ? 'active' : ''}`}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
        title='Italic (Cmd+I)'
      >
        <ItalicIcon style={{ fontSize: '1rem' }} />
      </button>
      <button
        type='button'
        className={`floating-btn ${isUnderline ? 'active' : ''}`}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
        title='Underline'
      >
        <UnderlineIcon style={{ fontSize: '1rem' }} />
      </button>
      <button
        type='button'
        className={`floating-btn ${isCode ? 'active' : ''}`}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')}
        title='Inline Code'
      >
        <CodeBlockIcon style={{ fontSize: '1rem' }} />
      </button>
      <button type='button' className='floating-btn' onClick={handleInsertLink} title='Add Link'>
        <LinkIcon style={{ fontSize: '1rem' }} />
      </button>
      <button
        type='button'
        className='floating-btn'
        onClick={handleWrapInAccordion}
        title='Wrap Selection in Collapsible Accordion'
      >
        <ChevronDownIcon style={{ fontSize: '1rem', color: '#c084fc' }} />
      </button>

      <div className='floating-divider' />

      <button
        type='button'
        className={`floating-btn ${showAiMenu ? 'active' : ''}`}
        onClick={() => setShowAiMenu(!showAiMenu)}
        disabled={isAiLoading}
        title='AI Writing Assistant'
        style={{
          color: '#a5b4fc',
          width: 'auto',
          padding: '0 0.5rem',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.35rem',
        }}
      >
        {isAiLoading ? (
          <>
            <SyncIcon className='rotating' style={{ fontSize: '0.95rem' }} />
            <span>Thinking…</span>
          </>
        ) : (
          <>
            <SparklesIcon style={{ fontSize: '0.95rem', color: '#818cf8' }} />
            <span>AI</span>
          </>
        )}
      </button>

      {showAiMenu && (
        <div className='floating-ai-dropdown'>
          <div className='floating-ai-header'>
            <span className='floating-ai-header-title'>AI Assist</span>
            <span className='floating-ai-header-badge'>GPT-5.6 Sol</span>
          </div>
          {onOpenAiStudio && (
            <button
              type='button'
              className='floating-ai-item primary'
              onClick={() => {
                setShowAiMenu(false);
                onOpenAiStudio();
              }}
            >
              <span className='floating-ai-item-icon'>
                <SparklesIcon style={{ color: '#818cf8' }} />
              </span>
              <span>Full AI Studio…</span>
            </button>
          )}
          <button
            type='button'
            className='floating-ai-item'
            onClick={() => void handleAiAction('improve')}
          >
            <span className='floating-ai-item-icon'>
              <SparklesIcon style={{ color: '#818cf8' }} />
            </span>
            <span>Improve clarity & flow</span>
          </button>
          <button
            type='button'
            className='floating-ai-item'
            onClick={() => void handleAiAction('shorten')}
          >
            <span className='floating-ai-item-icon'>
              <EditIcon style={{ color: '#38bdf8' }} />
            </span>
            <span>Make concise (TL;DR)</span>
          </button>
          <button
            type='button'
            className='floating-ai-item'
            onClick={() => void handleAiAction('expand')}
          >
            <span className='floating-ai-item-icon'>
              <SearchIcon style={{ color: '#fbbf24' }} />
            </span>
            <span>Elaborate / Expand</span>
          </button>
          <button
            type='button'
            className='floating-ai-item'
            onClick={() => void handleAiAction('fix-grammar')}
          >
            <span className='floating-ai-item-icon'>
              <EditIcon style={{ color: '#34d399' }} />
            </span>
            <span>Fix grammar & typos</span>
          </button>
          <button
            type='button'
            className='floating-ai-item'
            onClick={() => void handleAiAction('translate-no')}
          >
            <span className='floating-ai-item-icon'>
              <EarthGlobeIcon style={{ color: '#f43f5e' }} />
            </span>
            <span>Translate to Norwegian</span>
          </button>
        </div>
      )}
    </div>,
    document.body,
  );
}
