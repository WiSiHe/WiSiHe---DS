# nextjs-portfolio

Main WiSiHe site — [www.wisihe.no](https://www.wisihe.no).

## Environment

See [`.env.example`](./.env.example) and [`docs/doppler-setup.md`](../../docs/doppler-setup.md).

```bash
cp .env.example .env.local
# from repo root:
pnpm --filter nextjs-portfolio dev
```

Dev server: [http://localhost:1992](http://localhost:1992)

## Deploy

Production deploys via Vercel. Secrets are synced from Doppler (`prd` config). After changing any `NEXT_PUBLIC_*` variable, redeploy so Next.js inlines the new values.
