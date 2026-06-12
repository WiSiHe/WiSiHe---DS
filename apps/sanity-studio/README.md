# Sanity Studio — WiSiHe CMS

- **Live:** https://wisihe.sanity.studio/
- **Env:** [`.env.example`](./.env.example)
- **Doppler:** [`docs/doppler-setup.md`](../../docs/doppler-setup.md)

```bash
cp .env.example .env.local
pnpm --filter sanity-studio dev
```

### Algolia

```bash
pnpm --filter sanity-studio sync-algolia
pnpm --filter sanity-studio set-algolia-settings
```

Requires `SANITY_API_READ_TOKEN`, `ALGOLIA_APP_ID`, and `ALGOLIA_WRITE_KEY` in env.
