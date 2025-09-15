/**
 * Formats a date string to a human-readable format.
 * @param date - The date string to format
 * @returns Formatted date string (e.g., "January 1, 2024") or "Invalid Date" if input is invalid
 */
export function formatDate(date: string): string {
  if (!date || typeof date !== 'string') {
    return 'Invalid Date';
  }

  const dateObj = new Date(date);

  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }

  return dateObj.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}
