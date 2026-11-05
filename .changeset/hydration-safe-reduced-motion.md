---
"@wisihe/ui-react": patch
"tanstack-start-portfolio": patch
---

Fix a hydration mismatch (React error #418) for visitors who prefer reduced motion: add `useHydrationSafeReducedMotion` to `@wisihe/ui-react`, use it in the painting cards and the homepage hero, and add render-and-hydrate tests for the hero at 375px, 1280px and with reduced motion.
