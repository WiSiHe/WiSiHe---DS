import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function toUpperCase(str: string): string {
  return str.toUpperCase();
}

export function toLowerCase(str: string): string {
  return str.toLowerCase();
}

export const slugify = (str: string): string => {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
