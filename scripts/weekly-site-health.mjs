/**
 * Weekly site-health review — composes multiple check sources and funnels
 * actionable findings into one deduplicated GitHub-issue pipeline.
 *
 * Sources:
 *   - PostHog analytics (product/engagement heuristics)
 *   - Lighthouse (accessibility, SEO, and opt-in performance on key routes)
 *   - Structured-data (JSON-LD validation on key routes)
 *
 * Local dry run (reads apps/tanstack-start-portfolio/.env.local when present):
 *   node scripts/weekly-site-health.mjs --dry-run
 *
 * Scope flags (default: run everything):
 *   --only=analytics,lighthouse,structured-data
 *   --perf         include the opt-in Lighthouse performance finding
 *
 * Required env (analytics):
 *   POSTHOG_PERSONAL_API_KEY  — personal API key with query:read scope
 *   POSTHOG_PROJECT_ID        — PostHog project ID
 *
 * Optional env:
 *   POSTHOG_API_HOST            — default https://eu.posthog.com
 *   SITE_HEALTH_BASE_URL        — default https://www.wisihe.no
 *   SITE_HEALTH_A11Y_MIN        — default 0.9
 *   SITE_HEALTH_SEO_MIN         — default 0.9
 *   SITE_HEALTH_PERF_MIN        — default 0.75
 *   SITE_HEALTH_MAX_ISSUES      — cap per run, default 5
 *   GITHUB_REPOSITORY           — owner/repo (set automatically in GitHub Actions)
 *   GITHUB_TOKEN                — token with issues:write
 */

import { createAnalyticsChecks } from './checks/analytics.mjs';
import { createLighthouseChecks } from './checks/lighthouse.mjs';
import { createStructuredDataChecks } from './checks/structured-data.mjs';
import { loadLocalEnvFile, runReport } from './lib/site-health-report.mjs';

loadLocalEnvFile();

const DEFAULT_MAX_ISSUES = 5;
const DEFAULT_BASE_URL = 'https://www.wisihe.no';

const rawArgs = process.argv.slice(2);
const args = new Set(rawArgs);
const dryRun = args.has('--dry-run');
const includePerf = args.has('--perf');

const onlyArg = rawArgs.find(arg => arg.startsWith('--only='));
const onlySources = onlyArg
  ? new Set(
      onlyArg
        .slice('--only='.length)
        .split(',')
        .map(value => value.trim())
        .filter(Boolean),
    )
  : null;

/** @param {string} source */
const isEnabled = source => !onlySources || onlySources.has(source);

/** @param {string} value */
function toRatio(value, fallback) {
  const parsed = Number.parseFloat(value ?? '');
  return Number.isFinite(parsed) ? parsed : fallback;
}

const githubRepository = process.env.GITHUB_REPOSITORY?.trim();
const githubToken = process.env.GITHUB_TOKEN?.trim();
const maxIssues =
  Number.parseInt(process.env.SITE_HEALTH_MAX_ISSUES ?? '', 10) || DEFAULT_MAX_ISSUES;

if (!dryRun && (!githubRepository || !githubToken)) {
  throw new Error('Missing GITHUB_REPOSITORY or GITHUB_TOKEN (use --dry-run for local preview)');
}

const reviewDate = new Date().toISOString().slice(0, 10);
const baseUrl = (process.env.SITE_HEALTH_BASE_URL?.trim() || DEFAULT_BASE_URL).replace(/\/$/, '');

/** @type {Array<() => Promise<import('./lib/site-health-report.mjs').Finding | import('./lib/site-health-report.mjs').Finding[] | null>>} */
const checks = [];

if (isEnabled('analytics')) {
  const apiKey = process.env.POSTHOG_PERSONAL_API_KEY?.trim();
  const projectId = process.env.POSTHOG_PROJECT_ID?.trim();
  const apiHost = (process.env.POSTHOG_API_HOST?.trim() || 'https://eu.posthog.com').replace(
    /\/$/,
    '',
  );

  if (!apiKey || !projectId) {
    console.warn(
      '· Skipping analytics checks: missing POSTHOG_PERSONAL_API_KEY or POSTHOG_PROJECT_ID.',
    );
  } else {
    checks.push(...createAnalyticsChecks({ apiKey, projectId, apiHost, reviewDate }));
  }
}

if (isEnabled('lighthouse')) {
  checks.push(
    ...createLighthouseChecks({
      baseUrl,
      a11yMin: toRatio(process.env.SITE_HEALTH_A11Y_MIN, 0.9),
      seoMin: toRatio(process.env.SITE_HEALTH_SEO_MIN, 0.9),
      perfMin: toRatio(process.env.SITE_HEALTH_PERF_MIN, 0.75),
      includePerf,
      reviewDate,
    }),
  );
}

if (isEnabled('structured-data')) {
  checks.push(...createStructuredDataChecks({ baseUrl, reviewDate }));
}

if (checks.length === 0) {
  throw new Error('No checks enabled — verify --only flags and required env vars.');
}

runReport({ checks, dryRun, maxIssues, githubRepository, githubToken }).catch(error => {
  console.error(error);
  process.exit(1);
});
