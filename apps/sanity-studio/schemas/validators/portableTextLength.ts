import type { ValidationBuilder } from 'sanity';

type PortableTextBlock = {
  _type?: string;
  children?: Array<{ text?: string | null }>;
};

export function portableTextCharCount(blocks: PortableTextBlock[] | undefined): number {
  if (!Array.isArray(blocks)) return 0;

  return blocks
    .filter(block => block?._type === 'block')
    .flatMap(block => block.children ?? [])
    .map(child => child.text ?? '')
    .join(' ')
    .trim().length;
}

export function requiredPortableTextMax(
  max: number,
): (rule: ValidationBuilder<PortableTextBlock[]>) => ValidationBuilder<PortableTextBlock[]> {
  return rule =>
    rule.required().custom((blocks: PortableTextBlock[] | undefined) => {
      const count = portableTextCharCount(blocks);
      if (count === 0) return 'Required';
      if (count > max) {
        return `Keep this under ${max} characters (currently ${count}).`;
      }
      return true;
    });
}
