import { $createCodeNode, $isCodeNode } from '@lexical/code';
import { $createLinkNode, $isLinkNode } from '@lexical/link';
import { $createListItemNode, $createListNode, $isListItemNode, $isListNode } from '@lexical/list';
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
  $isQuoteNode,
  type HeadingTagType,
} from '@lexical/rich-text';
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  $isParagraphNode,
  $isTextNode,
  type LexicalEditor,
  type LexicalNode,
} from 'lexical';
import {
  $createAccordionNode,
  $isAccordionNode,
  type AccordionVariant,
} from '../components/editor/nodes/AccordionNode';
import { $createImageNode, $isImageNode } from '../components/editor/nodes/ImageNode';

import { DATASET, PROJECT_ID } from '../sanityEnv';

export interface PortableTextSpan {
  _key: string;
  _type: 'span';
  text: string;
  marks?: string[];
}

export interface PortableTextMarkDef {
  _key: string;
  _type: string;
  href?: string;
  [key: string]: unknown;
}

export interface PortableTextBlock {
  _key: string;
  _type: string;
  style?: string;
  children?: PortableTextSpan[];
  markDefs?: PortableTextMarkDef[];
  listItem?: 'bullet' | 'number';
  level?: number;
  language?: string;
  code?: string;
  [key: string]: unknown;
}

export const generateKey = (): string => Math.random().toString(36).substring(2, 10);

/**
 * Reconstructs a Sanity CDN URL from a standard asset reference id.
 * Format: image-<id>-<width>x<height>-<ext>
 */
export function buildSanityImageUrl(
  ref: string,
  projectId = PROJECT_ID,
  dataset = DATASET,
): string {
  if (!ref.startsWith('image-')) return ref;
  const parts = ref.replace(/^image-/, '').split('-');
  if (parts.length >= 2) {
    const ext = parts[parts.length - 1];
    const dimensions = parts[parts.length - 2];
    const id = parts.slice(0, -2).join('-');
    return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${ext}`;
  }
  return ref;
}

/**
 * Extracts a canonical Sanity image asset reference from a Sanity CDN URL or raw asset id.
 */
export function parseSanityAssetRef(urlOrRef: string): string | null {
  if (urlOrRef.startsWith('image-')) {
    return urlOrRef;
  }
  const cleanUrl = urlOrRef.split('?')[0].split('#')[0];
  const match = cleanUrl.match(
    /cdn\.sanity\.io\/images\/[^/]+\/[^/]+\/([a-f0-9]+)-(\d+x\d+)\.([a-z0-9]+)/i,
  );
  if (match) {
    const [, id, dimensions, ext] = match;
    return `image-${id}-${dimensions}-${ext}`;
  }
  return null;
}

/**
 * Deserializes an array of Sanity PortableText blocks into Lexical Editor state.
 */
export function populateLexicalFromPortableText(
  editor: LexicalEditor,
  blocks: PortableTextBlock[] | null | undefined,
): void {
  editor.update(
    () => {
      const root = $getRoot();
      root.clear();

      if (!blocks || !Array.isArray(blocks) || blocks.length === 0) {
        const p = $createParagraphNode();
        root.append(p);
        return;
      }

      let currentList: ReturnType<typeof $createListNode> | null = null;
      let currentListType: 'bullet' | 'number' | null = null;

      for (const block of blocks) {
        // 1. Handle List items
        if (block.listItem) {
          const itemType = block.listItem === 'number' ? 'number' : 'bullet';
          if (!currentList || currentListType !== itemType) {
            currentList = $createListNode(itemType);
            currentListType = itemType;
            root.append(currentList);
          }

          const listItemNode = $createListItemNode();
          appendSpansToLexicalNode(listItemNode, block);
          currentList.append(listItemNode);
          continue;
        }

        // Reset active list when hitting a non-list item
        currentList = null;
        currentListType = null;

        // 2. Handle Image blocks
        if (block._type === 'image') {
          const assetRef = (block.asset as { _ref?: string; url?: string } | undefined)?._ref;
          const assetUrl =
            (block.asset as { _ref?: string; url?: string } | undefined)?.url ||
            (assetRef ? buildSanityImageUrl(assetRef) : '');
          const alt = typeof block.alt === 'string' ? block.alt : '';
          const caption = typeof block.caption === 'string' ? block.caption : '';

          if (assetUrl) {
            const imageNode = $createImageNode(assetUrl, alt, caption);
            root.append(imageNode);
            const p = $createParagraphNode();
            root.append(p);
          }
          continue;
        }

        // 3. Handle Accordion blocks
        if (block._type === 'accordion') {
          let contentText = '';
          if (Array.isArray(block.content)) {
            contentText = block.content
              .map(
                (c: {
                  _type?: string;
                  language?: string;
                  code?: string;
                  children?: { text?: string }[];
                }) => {
                  if (c._type === 'code') {
                    return `\`\`\`${c.language || ''}\n${c.code || ''}\n\`\`\``;
                  }
                  if (c.children && Array.isArray(c.children)) {
                    return c.children.map(ch => ch.text || '').join('');
                  }
                  return '';
                },
              )
              .filter(Boolean)
              .join('\n\n');
          } else if (typeof block.content === 'string') {
            contentText = block.content;
          }

          const accordionNode = $createAccordionNode({
            title: typeof block.title === 'string' ? block.title : 'Untitled Collapsible Section',
            badge: typeof block.badge === 'string' ? block.badge : undefined,
            variant: (block.variant as AccordionVariant) || 'card',
            defaultOpen: Boolean(block.defaultOpen),
            content: contentText,
          });

          root.append(accordionNode);
          const p = $createParagraphNode();
          root.append(p);
          continue;
        }

        // 3. Handle Code blocks
        if (block._type === 'code') {
          const codeNode = $createCodeNode(block.language || undefined);
          codeNode.append($createTextNode(block.code || ''));
          root.append(codeNode);
          continue;
        }

        // 4. Handle Heading blocks
        if (block.style && /^h[1-6]$/.test(block.style)) {
          const tag = block.style as HeadingTagType;
          const headingNode = $createHeadingNode(tag);
          appendSpansToLexicalNode(headingNode, block);
          root.append(headingNode);
          continue;
        }

        // 5. Handle Blockquotes
        if (block.style === 'blockquote') {
          const quoteNode = $createQuoteNode();
          appendSpansToLexicalNode(quoteNode, block);
          root.append(quoteNode);
          continue;
        }

        // 6. Default Paragraph block
        const paragraphNode = $createParagraphNode();
        appendSpansToLexicalNode(paragraphNode, block);
        root.append(paragraphNode);
      }
    },
    { tag: 'sanity-load' },
  );
}

function appendSpansToLexicalNode(
  target: LexicalNode & { append: (...nodes: LexicalNode[]) => void },
  block: PortableTextBlock,
): void {
  const spans = block.children || [];
  const markDefs = block.markDefs || [];

  if (spans.length === 0) {
    target.append($createTextNode(''));
    return;
  }

  for (const span of spans) {
    if (span._type !== 'span' || typeof span.text !== 'string') continue;

    const textNode = $createTextNode(span.text);
    const marks = span.marks || [];

    // Apply basic marks
    if (marks.includes('strong')) textNode.toggleFormat('bold');
    if (marks.includes('em')) textNode.toggleFormat('italic');
    if (marks.includes('code')) textNode.toggleFormat('code');
    if (marks.includes('underline')) textNode.toggleFormat('underline');
    if (marks.includes('strike-through')) textNode.toggleFormat('strikethrough');

    // Check for link mark
    const linkDefKey = marks.find(m => markDefs.some(d => d._key === m && d._type === 'link'));
    if (linkDefKey) {
      const linkDef = markDefs.find(d => d._key === linkDefKey);
      const linkNode = $createLinkNode(linkDef?.href || '#');
      linkNode.append(textNode);
      target.append(linkNode);
    } else {
      target.append(textNode);
    }
  }
}

/**
 * Serializes the current Lexical editor state into an array of Sanity PortableText blocks.
 */
export function exportLexicalToPortableText(editor: LexicalEditor): PortableTextBlock[] {
  const blocks: PortableTextBlock[] = [];

  editor.getEditorState().read(() => {
    const root = $getRoot();
    const children = root.getChildren();

    for (const node of children) {
      if ($isImageNode(node)) {
        const assetRef = parseSanityAssetRef(node.getSrc());
        if (assetRef) {
          blocks.push({
            _key: generateKey(),
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: assetRef,
            },
            alt: node.getAlt() || 'Image',
            ...(node.getCaption() ? { caption: node.getCaption() } : {}),
          });
        }
      } else if ($isHeadingNode(node)) {
        blocks.push(convertTextContainerToBlock(node, node.getTag()));
      } else if ($isQuoteNode(node)) {
        blocks.push(convertTextContainerToBlock(node, 'blockquote'));
      } else if ($isListNode(node)) {
        const listType = node.getListType() === 'number' ? 'number' : 'bullet';
        const listItems = node.getChildren();
        for (const item of listItems) {
          if ($isListItemNode(item)) {
            const block = convertTextContainerToBlock(item, 'normal');
            block.listItem = listType;
            block.level = 1;
            blocks.push(block);
          }
        }
      } else if ($isCodeNode(node)) {
        blocks.push({
          _key: generateKey(),
          _type: 'code',
          language: node.getLanguage() || 'text',
          code: node.getTextContent(),
        });
      } else if ($isAccordionNode(node)) {
        const contentParagraphs = node
          .getContent()
          .split(/\n\n+/)
          .filter(Boolean)
          .map(pText => ({
            _key: generateKey(),
            _type: 'block',
            style: 'normal',
            children: [
              {
                _key: generateKey(),
                _type: 'span',
                text: pText,
              },
            ],
          }));

        blocks.push({
          _key: generateKey(),
          _type: 'accordion',
          title: node.getTitle(),
          ...(node.getBadge() ? { badge: node.getBadge() } : {}),
          variant: node.getVariant(),
          defaultOpen: node.getDefaultOpen(),
          content:
            contentParagraphs.length > 0
              ? contentParagraphs
              : [
                  {
                    _key: generateKey(),
                    _type: 'block',
                    style: 'normal',
                    children: [{ _key: generateKey(), _type: 'span', text: node.getContent() }],
                  },
                ],
        });
      } else if ($isParagraphNode(node)) {
        const text = node.getTextContent().trim();
        const accordionMatch = text.match(
          /^<details>\s*<summary>(.*?)<\/summary>\s*([\s\S]*?)<\/details>$/i,
        );
        if (accordionMatch) {
          const [, title, innerContent] = accordionMatch;
          blocks.push({
            _key: generateKey(),
            _type: 'accordion',
            title: title.trim() || 'Untitled Collapsible Section',
            variant: 'card',
            defaultOpen: false,
            content: [
              {
                _key: generateKey(),
                _type: 'block',
                style: 'normal',
                children: [
                  {
                    _key: generateKey(),
                    _type: 'span',
                    text: innerContent.trim(),
                  },
                ],
              },
            ],
          });
          continue;
        }

        const imageMatch = text.match(/^!\[(.*?)\]\((.*?)(?:\s+"(.*?)")?\)$/);
        if (imageMatch) {
          const [, alt, url, caption] = imageMatch;
          const assetRef = parseSanityAssetRef(url);
          if (assetRef) {
            blocks.push({
              _key: generateKey(),
              _type: 'image',
              asset: {
                _type: 'reference',
                _ref: assetRef,
              },
              alt: alt || 'Image',
              ...(caption ? { caption } : {}),
            });
            continue;
          }
        }
        blocks.push(convertTextContainerToBlock(node, 'normal'));
      }
    }
  });

  return blocks;
}

function convertTextContainerToBlock(
  container: LexicalNode & { getChildren: () => LexicalNode[] },
  style: string,
): PortableTextBlock {
  const spans: PortableTextSpan[] = [];
  const markDefs: PortableTextMarkDef[] = [];

  const children = container.getChildren();

  for (const child of children) {
    if ($isLinkNode(child)) {
      const linkDefKey = generateKey();
      markDefs.push({
        _key: linkDefKey,
        _type: 'link',
        href: child.getURL(),
      });

      for (const linkChild of child.getChildren()) {
        if ($isTextNode(linkChild)) {
          const marks = extractMarks(linkChild);
          marks.push(linkDefKey);
          spans.push({
            _key: generateKey(),
            _type: 'span',
            text: linkChild.getTextContent(),
            marks,
          });
        }
      }
    } else if ($isTextNode(child)) {
      const marks = extractMarks(child);
      spans.push({
        _key: generateKey(),
        _type: 'span',
        text: child.getTextContent(),
        marks: marks.length > 0 ? marks : undefined,
      });
    }
  }

  // Sanity requires at least one span per text block
  if (spans.length === 0) {
    spans.push({
      _key: generateKey(),
      _type: 'span',
      text: '',
    });
  }

  const block: PortableTextBlock = {
    _key: generateKey(),
    _type: 'block',
    style,
    children: spans,
  };

  if (markDefs.length > 0) {
    block.markDefs = markDefs;
  }

  return block;
}

function extractMarks(textNode: ReturnType<typeof $createTextNode>): string[] {
  const marks: string[] = [];
  if (textNode.hasFormat('bold')) marks.push('strong');
  if (textNode.hasFormat('italic')) marks.push('em');
  if (textNode.hasFormat('code')) marks.push('code');
  if (textNode.hasFormat('underline')) marks.push('underline');
  if (textNode.hasFormat('strikethrough')) marks.push('strike-through');
  return marks;
}
