/**
 * Weekly PostHog analytics review — creates GitHub issues for actionable findings.
 *
 * Local dry run (reads apps/nextjs-portfolio/.env.local when present):
 *   node scripts/weekly-analytics-review.mjs --dry-run
 *
 * Required env:
 *   POSTHOG_PERSONAL_API_KEY  — personal API key with query:read scope
 *   POSTHOG_PROJECT_ID        — PostHog project ID
 *
 * Optional env:
 *   POSTHOG_API_HOST          — default https://us.posthog.com
 *   GITHUB_REPOSITORY         — owner/repo (set automatically in GitHub Actions)
 *   GITHUB_TOKEN              — token with issues:write (GITHUB_TOKEN in Actions)
 *   ANALYTICS_REVIEW_MAX_ISSUES — cap per run, default 5
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, '..');

/** Load apps/nextjs-portfolio/.env.local when present (local dev only). */
function loadLocalEnvFile() {
  const envPath = path.join(repoRoot, 'apps/nextjs-portfolio/.env.local');

  try {
    const content = fs.readFileSync(envPath, 'utf8');

    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;

      const separatorIndex = trimmed.indexOf('=');
      if (separatorIndex === -1) continue;

      const key = trimmed.slice(0, separatorIndex).trim();
      let value = trimmed.slice(separatorIndex + 1).trim();

      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    // CI and doppler run inject env directly — no local file needed.
  }
}

loadLocalEnvFile();

const LOOKBACK_DAYS = 7;
const DEFAULT_MAX_ISSUES = 5;

const args = new Set(process.argv.slice(2));
const dryRun = args.has('--dry-run');

const posthogApiKey = process.env.POSTHOG_PERSONAL_API_KEY?.trim();
const posthogProjectId = process.env.POSTHOG_PROJECT_ID?.trim();
const posthogApiHost = (process.env.POSTHOG_API_HOST?.trim() || 'https://us.posthog.com').replace(
  /\/$/,
  '',
);
const githubRepository = process.env.GITHUB_REPOSITORY?.trim();
const githubToken = process.env.GITHUB_TOKEN?.trim();
const maxIssues = Number.parseInt(process.env.ANALYTICS_REVIEW_MAX_ISSUES ?? '', 10) || DEFAULT_MAX_ISSUES;

if (!posthogApiKey) throw new Error('Missing POSTHOG_PERSONAL_API_KEY');
if (!posthogProjectId) throw new Error('Missing POSTHOG_PROJECT_ID');
if (!dryRun && (!githubRepository || !githubToken)) {
  throw new Error('Missing GITHUB_REPOSITORY or GITHUB_TOKEN (use --dry-run for local preview)');
}

const reviewDate = new Date().toISOString().slice(0, 10);
const intervalClause = `INTERVAL ${LOOKBACK_DAYS} DAY`;

/** @typedef {{ id: string, title: string, body: string }} AnalyticsFinding */

/**
 * @param {string} hogql
 * @returns {Promise<{ columns: string[], results: unknown[][] }>}
 */
async function runHogQL(hogql) {
  const response = await fetch(`${posthogApiHost}/api/projects/${posthogProjectId}/query/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${posthogApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: {
        kind: 'HogQLQuery',
        query: hogql,
      },
      name: 'weekly-analytics-review',
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`PostHog query failed (${response.status}): ${detail}`);
  }

  const payload = await response.json();
  return {
    columns: payload.columns ?? [],
    results: payload.results ?? [],
  };
}

/**
 * @param {{ columns: string[], results: unknown[][] }} queryResult
 * @returns {Record<string, unknown>[]}
 */
function rowsToObjects({ columns, results }) {
  return results.map((row) =>
    Object.fromEntries(columns.map((column, index) => [column, row[index]])),
  );
}

/**
 * @param {number | string | null | undefined} value
 * @returns {number}
 */
function toNumber(value) {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

/**
 * @param {Record<string, unknown>[]} rows
 * @returns {string}
 */
function markdownTable(rows) {
  if (rows.length === 0) return '_No rows returned._';

  const columns = Object.keys(rows[0]);
  const header = `| ${columns.join(' | ')} |`;
  const divider = `| ${columns.map(() => '---').join(' | ')} |`;
  const body = rows
    .map((row) => `| ${columns.map((column) => String(row[column] ?? '')).join(' | ')} |`)
    .join('\n');

  return `${header}\n${divider}\n${body}`;
}

/**
 * @param {string} checkId
 * @param {string} summary
 * @param {string} details
 * @param {string[]} actions
 * @returns {AnalyticsFinding}
 */
function buildFinding(checkId, summary, details, actions) {
  const actionList = actions.map((action) => `- ${action}`).join('\n');

  return {
    id: checkId,
    title: `[Analytics] ${summary}`,
    body: `<!-- analytics-check-id:${checkId} -->
_Auto-generated weekly review from PostHog (${reviewDate}, last ${LOOKBACK_DAYS} days)._

## Summary
${summary}

## Data
${details}

## Suggested actions
${actionList}

---
_Re-run manually: **Actions → Weekly analytics review → Run workflow**_`,
  };
}

/**
 * @returns {Promise<AnalyticsFinding | null>}
 */
async function checkSearchNoResultRate() {
  const hogql = `
    SELECT
      countIf(event = 'search_performed') AS searches,
      countIf(event = 'search_no_results') AS no_results
    FROM events
    WHERE timestamp >= now() - ${intervalClause}
      AND event IN ('search_performed', 'search_no_results')
  `;

  const [row] = rowsToObjects(await runHogQL(hogql));
  const searches = toNumber(row?.searches);
  const noResults = toNumber(row?.no_results);

  if (searches < 5) return null;

  const rate = noResults / searches;
  if (rate < 0.25) return null;

  const ratePct = Math.round(rate * 100);

  return buildFinding(
    'search-no-results-rate',
    `High search no-result rate (${ratePct}%)`,
    markdownTable([
      { metric: 'Searches', value: searches },
      { metric: 'No-result searches', value: noResults },
      { metric: 'No-result rate', value: `${ratePct}%` },
    ]),
    [
      'Review top no-result queries and add matching content or synonyms/tags.',
      'Improve Algolia relevance for frequent zero-result terms.',
      'Consider surfacing popular categories when search returns nothing.',
    ],
  );
}

/**
 * @returns {Promise<AnalyticsFinding | null>}
 */
async function checkTopNoResultQueries() {
  const hogql = `
    SELECT
      properties.query AS query,
      properties.section AS section,
      count() AS count
    FROM events
    WHERE timestamp >= now() - ${intervalClause}
      AND event = 'search_no_results'
      AND properties.query IS NOT NULL
      AND properties.query != ''
    GROUP BY query, section
    HAVING count >= 2
    ORDER BY count DESC
    LIMIT 10
  `;

  const rows = rowsToObjects(await runHogQL(hogql));
  if (rows.length === 0) return null;

  const top = rows[0];
  const topCount = toNumber(top.count);

  return buildFinding(
    'top-no-result-queries',
    `Repeated no-result searches (top: "${top.query}", ${topCount}x)`,
    markdownTable(rows),
    [
      `Add or tag content that matches "${top.query}" in the ${top.section} section.`,
      'Check whether the query is a typo — add aliases if users commonly misspell it.',
      'If demand is real but content is out of scope, add a curated empty-state suggestion.',
    ],
  );
}

/**
 * @param {string} checkId
 * @param {string} listingPageType
 * @param {string} detailEvent
 * @param {string} label
 * @returns {Promise<AnalyticsFinding | null>}
 */
async function checkListingDropoff(checkId, listingPageType, detailEvent, label) {
  const hogql = `
    SELECT
      countIf(event = '$pageview' AND properties.page_type = '${listingPageType}') AS listing_views,
      countIf(event = '${detailEvent}') AS detail_views
    FROM events
    WHERE timestamp >= now() - ${intervalClause}
      AND (
        (event = '$pageview' AND properties.page_type = '${listingPageType}')
        OR event = '${detailEvent}'
      )
  `;

  const [row] = rowsToObjects(await runHogQL(hogql));
  const listingViews = toNumber(row?.listing_views);
  const detailViews = toNumber(row?.detail_views);

  if (listingViews < 10) return null;

  const conversion = detailViews / listingViews;
  if (conversion >= 0.2) return null;

  const conversionPct = Math.round(conversion * 100);

  return buildFinding(
    checkId,
    `Low ${label} listing → detail conversion (${conversionPct}%)`,
    markdownTable([
      { metric: 'Listing views', value: listingViews },
      { metric: 'Detail views', value: detailViews },
      { metric: 'Conversion', value: `${conversionPct}%` },
    ]),
    [
      `Make ${label} cards more scannable (title, preview image, short hook).`,
      'Test stronger primary CTAs on listing cards.',
      'Review sort order — surface highest-interest items first.',
    ],
  );
}

/**
 * @returns {Promise<AnalyticsFinding | null>}
 */
async function checkContactFormGap() {
  const hogql = `
    SELECT
      countIf(event = '$pageview') AS pageviews,
      countIf(event = 'contact_form_submitted') AS contact_submissions
    FROM events
    WHERE timestamp >= now() - ${intervalClause}
      AND event IN ('$pageview', 'contact_form_submitted')
  `;

  const [row] = rowsToObjects(await runHogQL(hogql));
  const pageviews = toNumber(row?.pageviews);
  const submissions = toNumber(row?.contact_submissions);

  if (pageviews < 50 || submissions > 0) return null;

  return buildFinding(
    'contact-form-gap',
    `No contact form submissions despite ${pageviews} pageviews`,
    markdownTable([
      { metric: 'Pageviews', value: pageviews },
      { metric: 'Contact submissions', value: submissions },
    ]),
    [
      'Review contact page copy and reduce friction (fewer required fields).',
      'Add a secondary contact CTA on high-traffic pages (about, project detail).',
      'Check form errors in production — a silent failure would show up here over time.',
    ],
  );
}

/**
 * @returns {Promise<AnalyticsFinding | null>}
 */
async function checkProjectFilterUnderuse() {
  const hogql = `
    SELECT
      countIf(event = 'projects_listing_viewed') AS listing_views,
      countIf(event = 'projects_filtered') AS filter_uses
    FROM events
    WHERE timestamp >= now() - ${intervalClause}
      AND event IN ('projects_listing_viewed', 'projects_filtered')
  `;

  const [row] = rowsToObjects(await runHogQL(hogql));
  const listingViews = toNumber(row?.listing_views);
  const filterUses = toNumber(row?.filter_uses);

  if (listingViews < 10 || filterUses > 0) return null;

  return buildFinding(
    'project-filter-underuse',
    'Project filters never used despite listing traffic',
    markdownTable([
      { metric: 'Projects listing views', value: listingViews },
      { metric: 'Filter interactions', value: filterUses },
    ]),
    [
      'Surface default filters or featured tags above the fold.',
      'Add a “popular tags” chip row for one-click filtering.',
      'Consider whether filters are visually buried on mobile.',
    ],
  );
}

/**
 * @returns {Promise<AnalyticsFinding | null>}
 */
async function checkTrafficWeekDrop() {
  const hogql = `
    SELECT
      countIf(timestamp >= now() - ${intervalClause}) AS this_week,
      countIf(
        timestamp >= now() - INTERVAL ${LOOKBACK_DAYS * 2} DAY
        AND timestamp < now() - ${intervalClause}
      ) AS last_week
    FROM events
    WHERE event = '$pageview'
      AND timestamp >= now() - INTERVAL ${LOOKBACK_DAYS * 2} DAY
  `;

  const [row] = rowsToObjects(await runHogQL(hogql));
  const thisWeek = toNumber(row?.this_week);
  const lastWeek = toNumber(row?.last_week);

  if (lastWeek < 30) return null;

  const drop = (lastWeek - thisWeek) / lastWeek;
  if (drop < 0.4) return null;

  const dropPct = Math.round(drop * 100);

  return buildFinding(
    'traffic-week-drop',
    `Pageview drop week-over-week (−${dropPct}%)`,
    markdownTable([
      { metric: 'This week', value: thisWeek },
      { metric: 'Last week', value: lastWeek },
      { metric: 'Change', value: `−${dropPct}%` },
    ]),
    [
      'Check for deploy/regression issues affecting traffic entry pages.',
      'Compare top landing pages — did a specific page lose visibility?',
      'If seasonal, note it and adjust thresholds later.',
    ],
  );
}

/**
 * @returns {Promise<AnalyticsFinding | null>}
 */
async function checkFooterCtaEngagement() {
  const hogql = `
    SELECT
      countIf(event = '$pageview' AND properties.page_type = 'home') AS home_views,
      countIf(event = 'footer_cta_clicked') AS footer_cta_clicks
    FROM events
    WHERE timestamp >= now() - ${intervalClause}
      AND (
        (event = '$pageview' AND properties.page_type = 'home')
        OR event = 'footer_cta_clicked'
      )
  `;

  const [row] = rowsToObjects(await runHogQL(hogql));
  const homeViews = toNumber(row?.home_views);
  const ctaClicks = toNumber(row?.footer_cta_clicks);

  if (homeViews < 20 || ctaClicks > 1) return null;

  return buildFinding(
    'footer-cta-low-engagement',
    `Footer CTA rarely clicked (${ctaClicks} clicks / ${homeViews} home views)`,
    markdownTable([
      { metric: 'Home pageviews', value: homeViews },
      { metric: 'Footer CTA clicks', value: ctaClicks },
    ]),
    [
      'Test footer CTA copy — is the value proposition clear?',
      'Try a mid-page CTA on home for visitors who never scroll to the footer.',
      'Ensure the CTA destination matches visitor intent (contact vs projects).',
    ],
  );
}

/** @type {Array<() => Promise<AnalyticsFinding | null>>} */
const checks = [
  checkSearchNoResultRate,
  checkTopNoResultQueries,
  () => checkListingDropoff('paintings-listing-dropoff', 'paintings_listing', 'painting_viewed', 'paintings'),
  () => checkListingDropoff('projects-listing-dropoff', 'projects_listing', 'project_viewed', 'projects'),
  checkContactFormGap,
  checkProjectFilterUnderuse,
  checkTrafficWeekDrop,
  checkFooterCtaEngagement,
];

/**
 * @param {string} checkId
 * @returns {Promise<boolean>}
 */
async function hasOpenIssueForCheck(checkId) {
  const [owner, repo] = githubRepository.split('/');
  const marker = `analytics-check-id:${checkId}`;
  const query = encodeURIComponent(`repo:${owner}/${repo} is:issue is:open "${marker}" in:body`);

  const response = await fetch(`https://api.github.com/search/issues?q=${query}`, {
    headers: {
      Authorization: `Bearer ${githubToken}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`GitHub search failed (${response.status}): ${detail}`);
  }

  const payload = await response.json();
  return (payload.total_count ?? 0) > 0;
}

/**
 * @param {AnalyticsFinding} finding
 */
async function createIssue(finding) {
  const [owner, repo] = githubRepository.split('/');

  const postIssue = async (labels) => {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: finding.title,
        body: finding.body,
        ...(labels ? { labels } : {}),
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`GitHub issue creation failed (${response.status}): ${detail}`);
    }

    return response.json();
  };

  try {
    return await postIssue(['analytics', 'improvement']);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (!message.includes('(422)')) throw error;
    console.log(`· Retrying without labels for ${finding.id}`);
    return postIssue();
  }
}

async function main() {
  console.log(`Running weekly analytics review (${dryRun ? 'dry run' : 'live'})…`);

  /** @type {AnalyticsFinding[]} */
  const findings = [];

  for (const runCheck of checks) {
    const checkName = runCheck.name || 'anonymous-check';

    try {
      const finding = await runCheck();
      if (finding) {
        findings.push(finding);
        console.log(`✓ Triggered: ${finding.id}`);
      } else {
        console.log(`· OK: ${checkName}`);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`✗ Check failed (${checkName}): ${message}`);
    }
  }

  if (findings.length === 0) {
    console.log('No actionable findings this week.');
    return;
  }

  const selected = findings.slice(0, maxIssues);
  if (findings.length > maxIssues) {
    console.log(`Capped at ${maxIssues} issues (${findings.length} findings total).`);
  }

  let created = 0;

  for (const finding of selected) {
    if (dryRun) {
      console.log('\n---');
      console.log(finding.title);
      console.log(finding.body);
      created += 1;
      continue;
    }

    const exists = await hasOpenIssueForCheck(finding.id);
    if (exists) {
      console.log(`· Skipped (open issue exists): ${finding.id}`);
      continue;
    }

    const issue = await createIssue(finding);
    console.log(`✓ Created issue #${issue.number}: ${finding.title}`);
    created += 1;
  }

  console.log(`Done. ${created} issue(s) ${dryRun ? 'previewed' : 'created'}.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
