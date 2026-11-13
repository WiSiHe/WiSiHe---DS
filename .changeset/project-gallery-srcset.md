---
"tanstack-start-portfolio": patch
---

Give project gallery slides a responsive `srcSet` (700/1050/1400w) (#112). Mobile Lighthouse on a production build of `/projects/scentwise` (3 runs, medians), before to after: LCP 6067 ms to 5413 ms, CLS 0.001 to 0.001 (no regression), transfer 945 KB to 823 KB, performance score 0.77 to 0.79.
