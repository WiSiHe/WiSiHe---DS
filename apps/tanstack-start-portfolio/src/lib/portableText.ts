type PortableTextBlock = {
  children?: Array<{ text?: string }>;
};

export function portableTextToPlainText(
  blocks: PortableTextBlock[] | null | undefined,
  maxLength?: number,
): string {
  if (!blocks?.length) return '';

  const text = blocks
    .map(block => block.children?.map(child => child.text ?? '').join('') ?? '')
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!text) return '';
  if (maxLength != null && text.length > maxLength) {
    return `${text.slice(0, maxLength - 1).trimEnd()}…`;
  }
  return text;
}
