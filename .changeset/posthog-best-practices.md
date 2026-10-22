---
"tanstack-start-portfolio": patch
---

PostHog: follow the library's recommended setup — pin `defaults: '2026-08-30'`, use the SDK's `history_change` pageviews instead of a hand-rolled capture (page_type/page_path added via `before_send`), shorten the idle wait before loading, and turn off dead-click capture.
