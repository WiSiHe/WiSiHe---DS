# AI Rules

## Tailwind CSS & Styling Guidelines

1.  **Tailwind CSS v4**: Always prioritize Tailwind CSS v4 syntax and features.
2.  **CSS Variables**:
    - **ALWAYS** use the defined CSS variables from `globals.css` (e.g., `var(--color-surface)`, `var(--color-text-primary)`).
    - **AVOID** arbitrary values (e.g., `bg-[#111]`, `text-[#333]`) unless absolutely necessary and no suitable variable exists.
    - Use Tailwind's `[]` syntax for variables if a utility class isn't mapped, e.g., `bg-[var(--color-surface)]`.
3.  **Consistency**: Maintain visual consistency by adhering to the design tokens defined in the CSS variables.
