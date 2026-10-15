import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ChevronDownIcon } from '@sanity/icons/ChevronDown';
import { ChevronUpIcon } from '@sanity/icons/ChevronUp';
import { TrashIcon } from '@sanity/icons/Trash';
import {
  $getNodeByKey,
  DecoratorNode,
  type EditorConfig,
  type LexicalEditor,
  type LexicalNode,
  type NodeKey,
  type SerializedLexicalNode,
  type Spread,
} from 'lexical';
import { type JSX, useState } from 'react';

export type AccordionVariant = 'card' | 'subtle' | 'glass';

export type SerializedAccordionNode = Spread<
  {
    title: string;
    badge?: string;
    variant: AccordionVariant;
    defaultOpen: boolean;
    content: string;
  },
  SerializedLexicalNode
>;

export class AccordionNode extends DecoratorNode<JSX.Element> {
  __title: string;
  __badge?: string;
  __variant: AccordionVariant;
  __defaultOpen: boolean;
  __content: string;

  static getType(): string {
    return 'accordion';
  }

  static clone(node: AccordionNode): AccordionNode {
    return new AccordionNode(
      node.__title,
      node.__content,
      node.__badge,
      node.__variant,
      node.__defaultOpen,
      node.__key,
    );
  }

  static importJSON(serializedNode: SerializedAccordionNode): AccordionNode {
    const { title, content, badge, variant, defaultOpen } = serializedNode;
    return $createAccordionNode({
      title,
      content,
      badge,
      variant,
      defaultOpen,
    });
  }

  exportJSON(): SerializedAccordionNode {
    return {
      title: this.__title,
      badge: this.__badge,
      variant: this.__variant,
      defaultOpen: this.__defaultOpen,
      content: this.__content,
      type: 'accordion',
      version: 1,
    };
  }

  constructor(
    title: string,
    content: string = '',
    badge?: string,
    variant: AccordionVariant = 'card',
    defaultOpen: boolean = false,
    key?: NodeKey,
  ) {
    super(key);
    this.__title = title;
    this.__content = content;
    this.__badge = badge;
    this.__variant = variant;
    this.__defaultOpen = defaultOpen;
  }

  getTitle(): string {
    return this.__title;
  }

  getContent(): string {
    return this.__content;
  }

  getBadge(): string | undefined {
    return this.__badge;
  }

  getVariant(): AccordionVariant {
    return this.__variant;
  }

  getDefaultOpen(): boolean {
    return this.__defaultOpen;
  }

  setTitle(title: string): void {
    const writable = this.getWritable();
    writable.__title = title;
  }

  setContent(content: string): void {
    const writable = this.getWritable();
    writable.__content = content;
  }

  setBadge(badge?: string): void {
    const writable = this.getWritable();
    writable.__badge = badge;
  }

  setVariant(variant: AccordionVariant): void {
    const writable = this.getWritable();
    writable.__variant = variant;
  }

  setDefaultOpen(defaultOpen: boolean): void {
    const writable = this.getWritable();
    writable.__defaultOpen = defaultOpen;
  }

  createDOM(_config: EditorConfig): HTMLElement {
    const div = document.createElement('div');
    div.className = 'editor-accordion-decorator-wrapper';
    return div;
  }

  updateDOM(): false {
    return false;
  }

  getTextContent(): string {
    return `<details><summary>${this.__title}</summary>\n\n${this.__content}\n</details>`;
  }

  decorate(_editor: LexicalEditor, _config: EditorConfig): JSX.Element {
    return (
      <AccordionComponent
        nodeKey={this.getKey()}
        initialTitle={this.__title}
        initialContent={this.__content}
        initialBadge={this.__badge}
        initialVariant={this.__variant}
        initialDefaultOpen={this.__defaultOpen}
      />
    );
  }
}

interface AccordionComponentProps {
  nodeKey: NodeKey;
  initialTitle: string;
  initialContent: string;
  initialBadge?: string;
  initialVariant: AccordionVariant;
  initialDefaultOpen: boolean;
}

function AccordionComponent({
  nodeKey,
  initialTitle,
  initialContent,
  initialBadge,
  initialVariant,
  initialDefaultOpen,
}: AccordionComponentProps) {
  const [editor] = useLexicalComposerContext();
  const [isOpen, setIsOpen] = useState(true); // default open in editor so author can edit easily
  const [title, setTitle] = useState(initialTitle);
  const [badge, setBadge] = useState(initialBadge || '');
  const [content, setContent] = useState(initialContent);
  const [defaultOpen, setDefaultOpen] = useState(initialDefaultOpen);
  const [variant, _setVariant] = useState<AccordionVariant>(initialVariant);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if ($isAccordionNode(node)) {
        node.setTitle(val);
      }
    });
  };

  const handleBadgeChange = (val: string) => {
    setBadge(val);
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if ($isAccordionNode(node)) {
        node.setBadge(val.trim() ? val.trim() : undefined);
      }
    });
  };

  const handleContentChange = (val: string) => {
    setContent(val);
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if ($isAccordionNode(node)) {
        node.setContent(val);
      }
    });
  };

  const handleToggleDefaultOpen = () => {
    const nextVal = !defaultOpen;
    setDefaultOpen(nextVal);
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if ($isAccordionNode(node)) {
        node.setDefaultOpen(nextVal);
      }
    });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if (node) {
        node.remove();
      }
    });
  };

  return (
    <div className={`editor-accordion-card variant-${variant}`} contentEditable={false}>
      {/* Header Bar */}
      <div className='editor-accordion-header'>
        <button
          type='button'
          className='editor-accordion-toggle-btn'
          onClick={() => setIsOpen(!isOpen)}
          title={isOpen ? 'Collapse Section' : 'Expand Section'}
        >
          {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </button>

        <input
          type='text'
          className='editor-accordion-title-input'
          value={title}
          onChange={e => handleTitleChange(e.target.value)}
          placeholder='Accordion Title (e.g. Technical Deep Dive)…'
        />

        <input
          type='text'
          className='editor-accordion-badge-input'
          value={badge}
          onChange={e => handleBadgeChange(e.target.value)}
          placeholder='Optional Badge (e.g. Details)'
        />

        <div className='editor-accordion-actions'>
          <button
            type='button'
            className={`editor-accordion-pill-btn ${defaultOpen ? 'active' : ''}`}
            onClick={handleToggleDefaultOpen}
            title='Toggle whether this section starts expanded on the live site'
          >
            {defaultOpen ? 'Initially Open' : 'Initially Closed'}
          </button>

          <button
            type='button'
            className='editor-accordion-delete-btn'
            onClick={handleDelete}
            title='Remove Accordion'
          >
            <TrashIcon />
          </button>
        </div>
      </div>

      {/* Collapsible Content Drawer */}
      {isOpen && (
        <div className='editor-accordion-body'>
          <textarea
            className='editor-accordion-textarea'
            value={content}
            onChange={e => handleContentChange(e.target.value)}
            placeholder='Enter collapsible content here (supports Markdown text, lists, and code blocks)…'
            rows={4}
          />
        </div>
      )}
    </div>
  );
}

export function $createAccordionNode(options: {
  title: string;
  content?: string;
  badge?: string;
  variant?: AccordionVariant;
  defaultOpen?: boolean;
}): AccordionNode {
  return new AccordionNode(
    options.title,
    options.content || '',
    options.badge,
    options.variant || 'card',
    options.defaultOpen || false,
  );
}

export function $isAccordionNode(node: LexicalNode | null | undefined): node is AccordionNode {
  return node instanceof AccordionNode;
}
