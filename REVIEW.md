# Review guide

Context for reviewers (human and Qodo). `AGENTS.md` has the full house rules; this file lists what review should check and what it should leave alone.

## Product decisions to respect

- **Blur placeholders only on `object-cover` images.** Images shown with `object-contain` (letterboxed, like the project gallery) must not get a blurred low-quality placeholder, because the blur stays visible around the photo. Leaving the placeholder off there is intentional, not a missing feature.
- **Sanity image URLs set a width and a height or `fit=max`.** A width-only URL can upscale past the source. `srcSet` descriptors (`w`) must match the width the CDN delivers.
- **Solid surfaces only.** No `backdrop-blur` or blurred translucent backgrounds.
- **Tokens only.** Colors, type and spacing come from `@wisihe/tokens` utilities, not hex or arbitrary values.
- **No manual memoization** (`useMemo`, `useCallback`, `memo`). The React Compiler handles it.

## Worth catching

- A test that renders a hand-built copy or constants instead of the real component or function, or one that cannot fail.
- Performance claims (Lighthouse, LCP, CLS) in a changeset or PR that were measured on one route but written as if they hold for the whole app.
- A new image call site without `srcSet` and `sizes`.
- Hydration mismatches: values that differ between server and client render.

## Leave alone

- Generated token outputs and `dist/`.
- Style nits that Biome already checks.
- Measurement noise: a Lighthouse score change inside run-to-run variation is not a regression finding unless the PR claims it as an effect.
