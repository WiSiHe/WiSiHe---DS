export type PaginationItem = { type: 'page'; page: number } | { type: 'ellipsis'; key: string };

/** 0-based page indices with ellipsis gaps for long page counts. */
export function buildPaginationItems(page: number, totalPages: number): PaginationItem[] {
  if (totalPages <= 1) return [];

  const delta = 2;
  const pages: number[] = [];
  const items: PaginationItem[] = [];
  let previousPage: number | undefined;

  for (let index = 0; index < totalPages; index += 1) {
    if (
      index === 0 ||
      index === totalPages - 1 ||
      (index >= page - delta && index <= page + delta)
    ) {
      pages.push(index);
    }
  }

  for (const pageIndex of pages) {
    if (previousPage !== undefined) {
      if (pageIndex - previousPage === 2) {
        items.push({ type: 'page', page: previousPage + 1 });
      } else if (pageIndex - previousPage > 2) {
        items.push({ type: 'ellipsis', key: `gap-${previousPage}-${pageIndex}` });
      }
    }

    items.push({ type: 'page', page: pageIndex });
    previousPage = pageIndex;
  }

  return items;
}
