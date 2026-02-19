# AI Rules

## React Compiler & Performance

1.  **No Manual Memoization**: This project uses the React Compiler, which automatically handles memoization and optimization.
2.  **DO NOT use**:
    - `React.memo()` or `memo()` - The compiler handles component memoization automatically
    - `useMemo()` - The compiler optimizes value computations automatically
    - `useCallback()` - The compiler optimizes function references automatically
3.  **Write clean, straightforward code**: Let the React Compiler handle all performance optimizations. Only use manual memoization if explicitly requested by the user or if there's a specific performance issue that the compiler cannot handle.

## Tailwind CSS & Styling Guidelines

1.  **Tailwind CSS v4**: Always prioritize Tailwind CSS v4 syntax and features.
2.  **CSS Variables**:
    - **ALWAYS** use the defined CSS variables from `globals.css` (e.g., `var(--color-surface)`, `var(--color-foreground)`).
    - **AVOID** arbitrary values (e.g., `bg-[#111]`, `text-[#333]`) unless absolutely necessary and no suitable variable exists.
    - Use Tailwind's `[]` syntax for variables if a utility class isn't mapped, e.g., `bg-[var(--color-surface)]`.
3.  **Consistency**: Maintain visual consistency by adhering to the design tokens defined in the CSS variables.
4.  **No Glassmorphism**: Do **NOT** use glassmorphism (e.g., `backdrop-blur`, semi-transparent backgrounds with blur). Use solid backgrounds, borders/outlines, and shadows to achieve depth and separation. The design should be clean, solid, and premium.
