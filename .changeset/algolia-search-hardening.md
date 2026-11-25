---
"tanstack-start-portfolio": patch
"sanity-studio": patch
---

Harden the Algolia setup: share one record builder between the full reindex and the auto-sync function (which now re-fetches and replaces the record, removing non-indexable documents), wait for index tasks and sort replicas strictly by their attribute, show correct multi-select facet counts, and keep server-side renders out of search analytics.
