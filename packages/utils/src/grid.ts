/**
 * Available breakpoint values for responsive design.
 */
export type Breakpoints = 'base' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | `${number}px`;

/**
 * Available column counts for grid layouts.
 */
export type Cols = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

/**
 * Available gap values for grid spacing.
 */
export type Gap = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24 | 32 | 40 | 48 | 56 | 64;

/**
 * Breakpoint values mapping for responsive design.
 */
export const breakpointValues: Record<Exclude<Breakpoints, `${number}px`>, string> = {
  base: '0px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

/**
 * Spacing scale mapping for consistent spacing values.
 */
export const spacingScale: Record<Gap, string> = {
  0: '0px',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  32: '8rem',
  40: '10rem',
  48: '12rem',
  56: '14rem',
  64: '16rem',
};

/**
 * CSS class prefixes for different query types.
 */
export const TYPE_CLASSES = {
  media: '',
  container: 'tw-@container',
};

/**
 * Generates CSS styles for responsive values.
 * @param values - The values to generate styles for
 * @param type - The query type (container or media)
 * @param styleProperty - The CSS property name
 * @param scale - The scale mapping for values
 * @returns Generated CSS string
 */
const generateStyles = (
  values: Cols | Gap | Partial<Record<Breakpoints, Cols | Gap>>,
  type: 'container' | 'media',
  styleProperty: string,
  scale: Record<number, string>,
): string => {
  if (typeof values === 'number') {
    return `${styleProperty}: ${scale[values]};`;
  } else if (typeof values === 'object') {
    return Object.entries(values)
      .map(([breakpoint, value]) => {
        const isContainerQuery = type === 'container';
        const mediaType = isContainerQuery ? '@container' : '@media';
        const breakpointValue = isContainerQuery
          ? breakpoint
          : breakpointValues[breakpoint as keyof typeof breakpointValues];
        const query = isContainerQuery
          ? `(min-width: ${breakpoint})`
          : `(min-width: ${breakpointValue})`;

        return `${mediaType} ${query} { ${styleProperty}: ${scale[value as number]}; }`;
      })
      .join(' ');
  }
  return '';
};

/**
 * Generates CSS grid column styles with responsive breakpoints.
 * @param cols - Column count or responsive column mapping
 * @param type - Query type (container or media)
 * @returns Generated CSS grid-template-columns string
 */
export const generateGridColStyles = (
  cols: Cols | Partial<Record<Breakpoints, Cols>>,
  type: 'container' | 'media',
): string =>
  generateStyles(cols, type, 'grid-template-columns', {
    1: 'repeat(1, minmax(0, 1fr))',
    2: 'repeat(2, minmax(0, 1fr))',
    3: 'repeat(3, minmax(0, 1fr))',
    4: 'repeat(4, minmax(0, 1fr))',
    5: 'repeat(5, minmax(0, 1fr))',
    6: 'repeat(6, minmax(0, 1fr))',
    7: 'repeat(7, minmax(0, 1fr))',
    8: 'repeat(8, minmax(0, 1fr))',
    9: 'repeat(9, minmax(0, 1fr))',
    10: 'repeat(10, minmax(0, 1fr))',
    11: 'repeat(11, minmax(0, 1fr))',
    12: 'repeat(12, minmax(0, 1fr))',
  });

/**
 * Generates CSS grid gap styles with responsive breakpoints.
 * @param gap - Gap value or responsive gap mapping
 * @param type - Query type (container or media)
 * @returns Generated CSS grid-gap string
 */
export const generateGridGapStyles = (
  gap: Gap | Partial<Record<Breakpoints, Gap>>,
  type: 'container' | 'media',
): string => generateStyles(gap, type, 'grid-gap', spacingScale);
