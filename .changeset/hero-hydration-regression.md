---
"tanstack-start-portfolio": patch
---

Hero: export the SSR-safe initial viewport values and add a regression test so the first render can't start reading `window` again (hydration error #418).
