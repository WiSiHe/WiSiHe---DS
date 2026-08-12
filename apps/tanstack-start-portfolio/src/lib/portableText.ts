type PortableTextBlock = {
  children?: Array<{ text?: string }>;
  _type?: string;
};

export function portableTextToPlainText(blocks: unknown, maxLength?: number): string {
  if (!Array.isArray(blocks) || blocks.length === 0) return '';

  const text = (blocks as PortableTextBlock[])
    .map(block => {
      if (block._type && block._type !== 'block') return '';
      return block.children?.map(child => child.text ?? '').join('') ?? '';
    })
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!text) return '';
  if (maxLength != null && text.length > maxLength) {
    return `${text.slice(0, maxLength - 1).trimEnd()}…`;
  }
  return text;
}
