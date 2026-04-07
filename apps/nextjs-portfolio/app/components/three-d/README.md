# ThreeD Components

Components for the 3D presentation page.

## Class Name Merging

**Always use the `cn()` helper function from `@wisihe/utils` when merging Tailwind CSS classes**, especially when using conditional logic. This ensures proper class deduplication and merging, preventing conflicts and improving maintainability.

### Example

```tsx
import { cn } from '@wisihe/utils';

// ✅ Good - using cn()
className={cn(
  'base-class',
  condition ? 'conditional-class' : 'other-class',
  anotherCondition && 'additional-class'
)}

// ❌ Bad - template literal concatenation
className={`base-class ${condition ? 'conditional-class' : 'other-class'}`}
```

### Why use cn()?

The `cn()` function uses `tailwind-merge` under the hood to:
- Properly handle conflicting Tailwind classes (e.g., `p-4` and `p-8` won't conflict)
- Deduplicate classes automatically
- Provide better type safety and IntelliSense support
- Make conditional class logic more readable
