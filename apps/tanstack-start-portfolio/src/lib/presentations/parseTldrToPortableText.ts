import type { PortableTextBlockLike } from './types';

export function parseTldrToPortableText(text: string): PortableTextBlockLike[] {
  const lines = text
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);

  return lines.map((line, idx) => {
    const cleanLine = line.replace(/^[•\-*]\s*/, '');
    const isBullet =
      line.startsWith('•') || line.startsWith('-') || line.startsWith('*') || lines.length > 1;

    return {
      _type: 'block',
      _key: `tldr-block-${idx}`,
      style: 'normal',
      ...(isBullet && { listItem: 'bullet', level: 1 }),
      markDefs: [],
      children: [
        {
          _type: 'span',
          _key: `tldr-span-${idx}`,
          marks: [],
          text: cleanLine,
        },
      ],
    };
  });
}
