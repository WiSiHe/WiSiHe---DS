import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
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
import type { JSX } from 'react';

export type SerializedImageNode = Spread<
  {
    src: string;
    alt: string;
    caption?: string;
  },
  SerializedLexicalNode
>;

export class ImageNode extends DecoratorNode<JSX.Element> {
  __src: string;
  __alt: string;
  __caption?: string;

  static getType(): string {
    return 'image';
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(node.__src, node.__alt, node.__caption, node.__key);
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    const { src, alt, caption } = serializedNode;
    return $createImageNode(src, alt, caption);
  }

  exportJSON(): SerializedImageNode {
    return {
      src: this.__src,
      alt: this.__alt,
      caption: this.__caption,
      type: 'image',
      version: 1,
    };
  }

  constructor(src: string, alt: string, caption?: string, key?: NodeKey) {
    super(key);
    this.__src = src;
    this.__alt = alt;
    this.__caption = caption;
  }

  getSrc(): string {
    return this.__src;
  }

  getAlt(): string {
    return this.__alt;
  }

  getCaption(): string | undefined {
    return this.__caption;
  }

  createDOM(_config: EditorConfig): HTMLElement {
    const div = document.createElement('div');
    div.className = 'editor-image-decorator-wrapper';
    return div;
  }

  updateDOM(): false {
    return false;
  }

  getTextContent(): string {
    return this.__caption
      ? `![${this.__alt}](${this.__src} "${this.__caption}")`
      : `![${this.__alt}](${this.__src})`;
  }

  decorate(_editor: LexicalEditor, _config: EditorConfig): JSX.Element {
    return (
      <ImageComponent
        src={this.__src}
        alt={this.__alt}
        caption={this.__caption}
        nodeKey={this.getKey()}
      />
    );
  }
}

function ImageComponent({
  src,
  alt,
  caption,
  nodeKey,
}: {
  src: string;
  alt: string;
  caption?: string;
  nodeKey: NodeKey;
}) {
  const [editor] = useLexicalComposerContext();

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
    <div className='editor-visual-image-card' contentEditable={false}>
      <div className='editor-image-frame'>
        <img src={src} alt={alt} className='editor-image-preview' loading='lazy' />
        <button
          type='button'
          className='editor-image-delete-btn'
          onClick={handleDelete}
          title='Remove image from content'
        >
          <TrashIcon style={{ fontSize: '1rem' }} />
        </button>
      </div>
      <div className='editor-image-caption-row'>
        <span className='editor-image-alt-badge'>{alt || 'Image'}</span>
        {caption && <span className='editor-image-caption-text'>{caption}</span>}
      </div>
    </div>
  );
}

export function $createImageNode(src: string, alt: string, caption?: string): ImageNode {
  return new ImageNode(src, alt, caption);
}

export function $isImageNode(node: LexicalNode | null | undefined): node is ImageNode {
  return node instanceof ImageNode;
}
