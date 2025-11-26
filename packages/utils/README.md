# @wisihe/utils

A collection of utility functions for common JavaScript/TypeScript operations.

## Install

```bash
npm install @wisihe/utils
```

## Usage

```javascript
import { isObject, formatDate, cn, first, isEmptyArray } from '@wisihe/utils';

console.log(isObject({})); // true
console.log(isObject([])); // false

console.log(formatDate('2024-01-01')); // "January 1, 2024"

const className = cn('px-4', 'py-2', { 'bg-blue-500': true }); // "px-4 py-2 bg-blue-500"

const firstItem = first([1, 2, 3]); // 1
const isEmpty = isEmptyArray([]); // true
```

const isEmpty = isEmptyArray([]); // true

```

## API Reference

### String Utilities

- `toUpperCase(str: string): string` - Converts a string to uppercase
- `toLowerCase(str: string): string` - Converts a string to lowercase
- `slugify(str: string): string` - Converts a string to a URL-friendly slug

### Array Utilities

- `isEmptyArray<T>(arr: T[] | undefined | null): boolean` - Checks if an array is empty
- `isNotEmptyArray<T>(arr: T[] | undefined | null): arr is T[]` - Checks if an array is not empty
- `first<T>(arr: T[] | undefined | null): T | undefined` - Gets the first element of an array
- `last<T>(arr: T[] | undefined | null): T | undefined` - Gets the last element of an array

### Object Utilities

- `isObject(obj: unknown): obj is Record<string, unknown>` - Checks if a value is a plain object
- `isEmptyObject(obj: Record<string, unknown>): obj is EmptyObject` - Checks if an object is empty
- `isNotEmptyObject(obj: Record<string, unknown>): obj is Record<string, unknown>` - Checks if an object is not empty

### Date Utilities

- `formatDate(date: string): string` - Formats a date string to a human-readable format

### CSS Utilities

- `cn(...inputs: ClassValue[]): string` - Utility for conditionally joining class names with Tailwind CSS merge

### Flexbox Types

- `FlexDirection` - CSS flex-direction values
- `FlexWrap` - CSS flex-wrap values
- `JustifyContent` - CSS justify-content values

### Grid Utilities

- `Breakpoints` - Available breakpoint values for responsive design
- `Cols` - Available column counts for grid layouts
- `Gap` - Available gap values for grid spacing
- `breakpointValues` - Breakpoint values mapping
- `spacingScale` - Spacing scale mapping
- `generateGridColStyles(cols, type)` - Generates CSS grid column styles
- `generateGridGapStyles(gap, type)` - Generates CSS grid gap styles

## License

MIT
```
