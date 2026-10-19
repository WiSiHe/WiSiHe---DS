/**
 * Builds an HTML `srcset` from a width -> URL function. The browser picks the smallest candidate that
 * covers the displayed size (via the element's `sizes`), so a 322 px card no longer downloads a 900 px image.
 * Returns undefined when no URL could be built.
 */
export function buildSrcSet(
  widths: readonly number[],
  urlForWidth: (width: number) => string | null | undefined,
): string | undefined {
  const candidates = [...new Set(widths)]
    .sort((a, b) => a - b)
    .flatMap(width => {
      const url = urlForWidth(width);
      return url ? [`${url} ${width}w`] : [];
    });
  return candidates.length > 0 ? candidates.join(', ') : undefined;
}
