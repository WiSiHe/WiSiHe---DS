import { $createCodeNode } from '@lexical/code';
import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from '@lexical/list';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  LexicalTypeaheadMenuPlugin,
  MenuOption,
  useBasicTypeaheadTriggerMatch,
} from '@lexical/react/LexicalTypeaheadMenuPlugin';
import { $createHeadingNode, $createQuoteNode, type HeadingTagType } from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import { $insertNodeToNearestRoot } from '@lexical/utils';
import { BinaryDocumentIcon } from '@sanity/icons/BinaryDocument';
import { BlockquoteIcon } from '@sanity/icons/Blockquote';
import { BookIcon } from '@sanity/icons/Book';
import { CaseIcon } from '@sanity/icons/Case';
import { ChevronDownIcon } from '@sanity/icons/ChevronDown';
import { CodeBlockIcon } from '@sanity/icons/CodeBlock';
import { ComponentIcon } from '@sanity/icons/Component';
import { DocumentIcon } from '@sanity/icons/Document';
import { ImagesIcon } from '@sanity/icons/Images';
import { InfoOutlineIcon } from '@sanity/icons/InfoOutline';
import { OlistIcon } from '@sanity/icons/Olist';
import { SparklesIcon } from '@sanity/icons/Sparkles';
import { SplitVerticalIcon } from '@sanity/icons/SplitVertical';
import { UlistIcon } from '@sanity/icons/Ulist';
import {
  $createParagraphNode,
  $getRoot,
  $getSelection,
  $isRangeSelection,
  type TextNode,
} from 'lexical';
import { type ReactNode, useCallback, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { $createAccordionNode } from '../nodes/AccordionNode';
import { BUILTIN_TEMPLATES } from '../ReusableContentDrawer';

class SlashMenuItem extends MenuOption {
  title: string;
  subtitle?: string;
  itemIcon: ReactNode;
  category: 'ai' | 'reusable' | 'text';
  onSelect: () => void;

  constructor(
    title: string,
    itemIcon: ReactNode,
    category: 'ai' | 'reusable' | 'text',
    onSelect: () => void,
    subtitle?: string,
  ) {
    super(title);
    this.title = title;
    this.subtitle = subtitle;
    this.itemIcon = itemIcon;
    this.category = category;
    this.onSelect = onSelect;
  }
}

interface SlashMenuPluginProps {
  onTriggerAI?: () => void;
  onOpenDrawer?: (tab?: 'blocks' | 'sanity' | 'media' | 'custom') => void;
  onInsertSnippet?: (text: string) => void;
  onToggleOutline?: () => void;
}

export function SlashMenuPlugin({
  onTriggerAI,
  onOpenDrawer,
  onInsertSnippet,
  onToggleOutline,
}: SlashMenuPluginProps) {
  const [editor] = useLexicalComposerContext();
  const [queryString, setQueryString] = useState<string | null>(null);

  const checkForTriggerMatch = useBasicTypeaheadTriggerMatch('/', {
    minLength: 0,
  });

  const formatHeading = useCallback(
    (tag: HeadingTagType) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode(tag));
        }
      });
    },
    [editor],
  );

  const formatQuote = useCallback(() => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createQuoteNode());
      }
    });
  }, [editor]);

  const formatCode = useCallback(() => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createCodeNode());
      }
    });
  }, [editor]);

  const formatParagraph = useCallback(() => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
  }, [editor]);

  const insertTemplateById = useCallback(
    (id: string) => {
      const template = BUILTIN_TEMPLATES.find(t => t.id === id);
      if (template && onInsertSnippet) {
        onInsertSnippet(template.content);
      }
    },
    [onInsertSnippet],
  );

  const options: SlashMenuItem[] = useMemo(() => {
    const list: SlashMenuItem[] = [
      // 1. AI Assistant
      new SlashMenuItem(
        'Ask AI Copilot…',
        <SparklesIcon style={{ color: '#818cf8' }} />,
        'ai',
        () => {
          if (onTriggerAI) onTriggerAI();
        },
        'Draft, brainstorm, or refine with GPT-5.6 Sol',
      ),

      // 2. Reusable Content Blocks
      new SlashMenuItem(
        'Browse Reusable Library',
        <ComponentIcon style={{ color: '#a5b4fc' }} />,
        'reusable',
        () => {
          if (onOpenDrawer) onOpenDrawer('blocks');
        },
        'Open side drawer for snippets & references',
      ),
      new SlashMenuItem(
        'Document Outline / TOC',
        <UlistIcon style={{ color: '#818cf8' }} />,
        'reusable',
        () => {
          if (onToggleOutline) onToggleOutline();
        },
        'View heading hierarchy, reading stats & quick jump',
      ),
      new SlashMenuItem(
        'Insert Image from Sanity',
        <ImagesIcon style={{ color: '#38bdf8' }} />,
        'reusable',
        () => {
          if (onOpenDrawer) onOpenDrawer('media');
        },
        'Browse Sanity media library or upload new image',
      ),
      new SlashMenuItem(
        'Collapsible Accordion',
        <ChevronDownIcon style={{ color: '#c084fc' }} />,
        'reusable',
        () => {
          editor.update(() => {
            const accordionNode = $createAccordionNode({
              title: 'Collapsible Section Title',
              content: 'Add technical specs, background details, or deep-dive content here.',
              badge: 'Deep Dive',
            });
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              $insertNodeToNearestRoot(accordionNode);
            } else {
              $getRoot().append(accordionNode);
            }
            const nextP = $createParagraphNode();
            accordionNode.insertAfter(nextP);
            nextP.select();
          });
        },
        'Insert an expandable / collapsible deep-dive card (/accordion)',
      ),
      new SlashMenuItem(
        'Info Callout Box',
        <InfoOutlineIcon style={{ color: '#38bdf8' }} />,
        'reusable',
        () => insertTemplateById('callout-info'),
        'Highlighted note for important context',
      ),
      new SlashMenuItem(
        'TL;DR Executive Summary',
        <BookIcon style={{ color: '#fbbf24' }} />,
        'reusable',
        () => insertTemplateById('tldr-summary'),
        'Standard structured summary bullet list',
      ),
      new SlashMenuItem(
        'Project Specs Grid',
        <CaseIcon style={{ color: '#34d399' }} />,
        'reusable',
        () => insertTemplateById('specs-grid'),
        'Metadata table for tech stack & role',
      ),
      new SlashMenuItem(
        'Mermaid Diagram',
        <BinaryDocumentIcon style={{ color: '#c084fc' }} />,
        'reusable',
        () => insertTemplateById('mermaid-diagram'),
        'Embed flowchart or architecture diagram',
      ),
      new SlashMenuItem(
        'Section Divider',
        <SplitVerticalIcon style={{ color: '#94a3b8' }} />,
        'reusable',
        () => insertTemplateById('divider'),
        'Thematic horizontal break line',
      ),
      new SlashMenuItem(
        'Collaboration CTA',
        <SparklesIcon style={{ color: '#f43f5e' }} />,
        'reusable',
        () => insertTemplateById('cta-collaboration'),
        'Invite readers to contact or explore more',
      ),

      // 3. Basic Formatting Blocks
      new SlashMenuItem(
        'Text Paragraph',
        <DocumentIcon style={{ color: '#cbd5e1' }} />,
        'text',
        formatParagraph,
        'Normal body typography',
      ),
      new SlashMenuItem(
        'Heading 1',
        <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>H1</span>,
        'text',
        () => formatHeading('h1'),
        'Major section title',
      ),
      new SlashMenuItem(
        'Heading 2',
        <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>H2</span>,
        'text',
        () => formatHeading('h2'),
        'Sub-section heading',
      ),
      new SlashMenuItem(
        'Heading 3',
        <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>H3</span>,
        'text',
        () => formatHeading('h3'),
        'Small section title',
      ),
      new SlashMenuItem(
        'Bullet List',
        <UlistIcon style={{ color: '#94a3b8' }} />,
        'text',
        () => {
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
        },
        'Unordered bullet points',
      ),
      new SlashMenuItem(
        'Numbered List',
        <OlistIcon style={{ color: '#94a3b8' }} />,
        'text',
        () => {
          editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
        },
        'Sequential numbered steps',
      ),
      new SlashMenuItem(
        'Quote Block',
        <BlockquoteIcon style={{ color: '#94a3b8' }} />,
        'text',
        formatQuote,
        'Editorial quotation or pullquote',
      ),
      new SlashMenuItem(
        'Code Block',
        <CodeBlockIcon style={{ color: '#94a3b8' }} />,
        'text',
        formatCode,
        'Syntax-highlighted code container',
      ),
    ];

    if (!queryString) return list;
    const q = queryString.toLowerCase();
    return list.filter(
      item => item.title.toLowerCase().includes(q) || item.subtitle?.toLowerCase().includes(q),
    );
  }, [
    queryString,
    formatParagraph,
    formatHeading,
    formatQuote,
    formatCode,
    insertTemplateById,
    onTriggerAI,
    onOpenDrawer,
    onToggleOutline,
    editor,
  ]);

  const onSelectOption = useCallback(
    (selectedOption: SlashMenuItem, nodeToRemove: TextNode | null, closeMenu: () => void) => {
      editor.update(() => {
        if (nodeToRemove) {
          nodeToRemove.remove();
        }
      });
      selectedOption.onSelect();
      closeMenu();
    },
    [editor],
  );

  return (
    <LexicalTypeaheadMenuPlugin<SlashMenuItem>
      onQueryChange={setQueryString}
      onSelectOption={onSelectOption}
      triggerFn={checkForTriggerMatch}
      options={options}
      menuRenderFn={(
        anchorElementRef,
        { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex },
      ) => {
        if (!anchorElementRef.current || options.length === 0) return null;

        const aiOptions = options.filter(o => o.category === 'ai');
        const reusableOptions = options.filter(o => o.category === 'reusable');
        const textOptions = options.filter(o => o.category === 'text');

        return createPortal(
          <div className='slash-menu-dropdown' role='listbox'>
            {aiOptions.length > 0 && (
              <>
                <div className='slash-menu-category'>AI Assistant</div>
                {aiOptions.map(option => {
                  const index = options.indexOf(option);
                  const isSelected = selectedIndex === index;
                  return (
                    <div
                      key={option.key}
                      tabIndex={-1}
                      role='option'
                      aria-selected={isSelected}
                      className={`slash-menu-item ai-item ${isSelected ? 'selected' : ''}`}
                      onClick={() => {
                        setHighlightedIndex(index);
                        selectOptionAndCleanUp(option);
                      }}
                      onKeyDown={e => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          selectOptionAndCleanUp(option);
                        }
                      }}
                      onMouseEnter={() => setHighlightedIndex(index)}
                    >
                      <span className='slash-menu-item-icon'>{option.itemIcon}</span>
                      <div className='slash-menu-item-text'>
                        <span className='slash-menu-item-title'>{option.title}</span>
                        {option.subtitle && (
                          <span className='slash-menu-item-desc'>{option.subtitle}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </>
            )}

            {reusableOptions.length > 0 && (
              <>
                <div className='slash-menu-category'>Reusable Content & Snippets</div>
                {reusableOptions.map(option => {
                  const index = options.indexOf(option);
                  const isSelected = selectedIndex === index;
                  return (
                    <div
                      key={option.key}
                      tabIndex={-1}
                      role='option'
                      aria-selected={isSelected}
                      className={`slash-menu-item ${isSelected ? 'selected' : ''}`}
                      onClick={() => {
                        setHighlightedIndex(index);
                        selectOptionAndCleanUp(option);
                      }}
                      onKeyDown={e => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          selectOptionAndCleanUp(option);
                        }
                      }}
                      onMouseEnter={() => setHighlightedIndex(index)}
                    >
                      <span className='slash-menu-item-icon'>{option.itemIcon}</span>
                      <div className='slash-menu-item-text'>
                        <span className='slash-menu-item-title'>{option.title}</span>
                        {option.subtitle && (
                          <span className='slash-menu-item-desc'>{option.subtitle}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </>
            )}

            {textOptions.length > 0 && (
              <>
                <div className='slash-menu-category'>Basic Blocks</div>
                {textOptions.map(option => {
                  const index = options.indexOf(option);
                  const isSelected = selectedIndex === index;
                  return (
                    <div
                      key={option.key}
                      tabIndex={-1}
                      role='option'
                      aria-selected={isSelected}
                      className={`slash-menu-item ${isSelected ? 'selected' : ''}`}
                      onClick={() => {
                        setHighlightedIndex(index);
                        selectOptionAndCleanUp(option);
                      }}
                      onKeyDown={e => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          selectOptionAndCleanUp(option);
                        }
                      }}
                      onMouseEnter={() => setHighlightedIndex(index)}
                    >
                      <span className='slash-menu-item-icon'>{option.itemIcon}</span>
                      <div className='slash-menu-item-text'>
                        <span className='slash-menu-item-title'>{option.title}</span>
                        {option.subtitle && (
                          <span className='slash-menu-item-desc'>{option.subtitle}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>,
          anchorElementRef.current,
        );
      }}
    />
  );
}
