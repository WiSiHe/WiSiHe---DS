/**
 * Shared reporting core for the weekly "site health" pipeline.
 *
 * Multiple sources (PostHog analytics, Lighthouse, structured-data validation)
 * produce findings, and this module funnels them all into one deduplicated
 * GitHub issue pipeline — one Monday run, one triage surface.
 *
 * Findings are deduplicated by a hidden marker in the issue body. A single
 * marker namespace (`site-health-check-id:`) is used across all sources; the
 * legacy `analytics-check-id:` marker is also matched during the transition so
 * existing open analytics issues are not re-created.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, '..', '..');

/** Marker namespace written into every issue body for deduplication. */
export const CHECK_MARKER = 'site-health-check-id';
/** Legacy marker kept for transition so old analytics issues stay deduped. */
export const LEGACY_CHECK_MARKER = 'analytics-check-id';

/** @typedef {'analytics' | 'perf' | 'a11y' | 'seo' | 'structured-data'} FindingCategory */

/** @typedef {{ id: string, category: FindingCategory, title: string, body: string }} Finding */

const CATEGORY_META = /** @type {const} */ ({
  analytics: { prefix: 'Analytics', label: 'analytics' },
  perf: { prefix: 'Perf', label: 'performance' },
  a11y: { prefix: 'A11y', label: 'a11y' },
  seo: { prefix: 'SEO', label: 'seo' },
  'structured-data': { prefix: 'Structured data', label: 'structured-data' },
});

/** Load apps/tanstack-start-portfolio/.env.local when present (local dev only). */
export function loadLocalEnvFile() {
  const envPath = path.join(repoRoot, 'apps/tanstack-start-portfolio/.env.local');

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

/**
 * @param {number | string | null | undefined} value
 * @returns {number}
 */
export function toNumber(value) {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

/**
 * @param {Record<string, unknown>[]} rows
 * @returns {string}
 */
export function markdownTable(rows) {
  if (rows.length === 0) return '_No rows returned._';

  const columns = Object.keys(rows[0]);
  const header = `| ${columns.join(' | ')} |`;
  const divider = `| ${columns.map(() => '---').join(' | ')} |`;
  const body = rows
    .map(row => `| ${columns.map(column => String(row[column] ?? '')).join(' | ')} |`)
    .join('\n');

  return `${header}\n${divider}\n${body}`;
}

/**
 * Build a normalized finding that renders into a GitHub issue.
 *
 * @param {{
 *   id: string,
 *   category: FindingCategory,
 *   summary: string,
 *   details: string,
 *   actions: string[],
 *   source: string,
 *   reviewDate: string,
 * }} input
 * @returns {Finding}
 */
export function buildFinding({ id, category, summary, details, actions, source, reviewDate }) {
  const meta = CATEGORY_META[category];
  const actionList = actions.map(action => `- ${action}`).join('\n');

  return {
    id,
    category,
    title: `[${meta.prefix}] ${summary}`,
    body: `<!-- ${CHECK_MARKER}:${id} -->
_Auto-generated weekly site-health review (${source}, ${reviewDate})._

## Summary
${summary}

## Data
${details}

## Suggested actions
${actionList}

---
_Re-run manually: **Actions → Weekly site health → Run workflow**_`,
  };
}

/**
 * @param {{ githubRepository: string, githubToken: string }} gh
 * @param {string} checkId
 * @returns {Promise<boolean>}
 */
async function hasOpenIssueForCheck({ githubRepository, githubToken }, checkId) {
  const [owner, repo] = githubRepository.split('/');
  // Match either the new or legacy marker so we don't duplicate existing issues.
  const markerQuery = `("${CHECK_MARKER}:${checkId}" OR "${LEGACY_CHECK_MARKER}:${checkId}")`;
  const query = encodeURIComponent(`repo:${owner}/${repo} is:issue is:open ${markerQuery} in:body`);

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
 * @param {{ githubRepository: string, githubToken: string }} gh
 * @param {Finding} finding
 */
async function createIssue({ githubRepository, githubToken }, finding) {
  const [owner, repo] = githubRepository.split('/');
  const labels = [CATEGORY_META[finding.category].label, 'improvement'];

  const postIssue = async issueLabels => {
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
        ...(issueLabels ? { labels: issueLabels } : {}),
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`GitHub issue creation failed (${response.status}): ${detail}`);
    }

    return response.json();
  };

  try {
    return await postIssue(labels);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (!message.includes('(422)')) throw error;
    console.log(`· Retrying without labels for ${finding.id}`);
    return postIssue();
  }
}

/**
 * Run a list of checks, dedupe against open issues, and create issues.
 *
 * @param {{
 *   checks: Array<() => Promise<Finding | Finding[] | null>>,
 *   dryRun: boolean,
 *   maxIssues: number,
 *   githubRepository?: string,
 *   githubToken?: string,
 * }} options
 */
export async function runReport({ checks, dryRun, maxIssues, githubRepository, githubToken }) {
  console.log(`Running weekly site-health review (${dryRun ? 'dry run' : 'live'})…`);

  /** @type {Finding[]} */
  const findings = [];

  for (const runCheck of checks) {
    const checkName = runCheck.name || 'anonymous-check';

    try {
      const result = await runCheck();
      if (!result) {
        console.log(`· OK: ${checkName}`);
        continue;
      }

      const produced = Array.isArray(result) ? result : [result];
      for (const finding of produced) {
        findings.push(finding);
        console.log(`✓ Triggered: ${finding.id}`);
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

  const gh = { githubRepository: githubRepository ?? '', githubToken: githubToken ?? '' };
  let created = 0;

  for (const finding of selected) {
    if (dryRun) {
      console.log('\n---');
      console.log(finding.title);
      console.log(finding.body);
      created += 1;
      continue;
    }

    const exists = await hasOpenIssueForCheck(gh, finding.id);
    if (exists) {
      console.log(`· Skipped (open issue exists): ${finding.id}`);
      continue;
    }

    const issue = await createIssue(gh, finding);
    console.log(`✓ Created issue #${issue.number}: ${finding.title}`);
    created += 1;
  }

  console.log(`Done. ${created} issue(s) ${dryRun ? 'previewed' : 'created'}.`);
}
