type PortableTextBlock = {
  _type: string;
  style?: string;
  [key: string]: unknown;
};

const HEADING_STYLES = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);

function isHeadingBlock(block: PortableTextBlock): boolean {
  return block._type === 'block' && HEADING_STYLES.has(String(block.style ?? ''));
}

export function splitContentAtFirstHeading(content: PortableTextBlock[]): {
  intro: PortableTextBlock[];
  body: PortableTextBlock[];
  hasSplit: boolean;
} {
  if (!content.length) {
    return { intro: [], body: [], hasSplit: false };
  }

  const firstHeadingIndex = content.findIndex(isHeadingBlock);
  if (firstHeadingIndex <= 0) {
    return { intro: [], body: content, hasSplit: false };
  }

  return {
    intro: content.slice(0, firstHeadingIndex),
    body: content.slice(firstHeadingIndex),
    hasSplit: true,
  };
}

export function resolveProjectContent(
  summary: PortableTextBlock[] | null | undefined,
  content: PortableTextBlock[] | null | undefined,
): {
  sidebarSummary: PortableTextBlock[] | null;
  caseStudyBody: PortableTextBlock[] | null;
} {
  const blocks = (content ?? []) as PortableTextBlock[];

  if (!blocks.length) {
    return {
      sidebarSummary: summary?.length ? (summary as PortableTextBlock[]) : null,
      caseStudyBody: null,
    };
  }

  if (summary?.length) {
    return {
      sidebarSummary: summary as PortableTextBlock[],
      caseStudyBody: blocks,
    };
  }

  const { intro, body, hasSplit } = splitContentAtFirstHeading(blocks);

  if (hasSplit && intro.length > 0) {
    return {
      sidebarSummary: intro,
      caseStudyBody: body,
    };
  }

  return {
    sidebarSummary: null,
    caseStudyBody: blocks,
  };
}
