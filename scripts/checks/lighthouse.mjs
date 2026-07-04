/**
 * Lighthouse checks for the weekly site-health review.
 *
 * Runs Lighthouse against a small set of stable production routes and captures
 * the accessibility, SEO, best-practices, and performance categories. A11y and
 * SEO regressions are the primary signals; the performance finding is opt-in
 * (generous threshold) so it does not nag.
 *
 * Findings list the failing audits with their titles/descriptions straight from
 * the Lighthouse result, so each issue is directly actionable.
 *
 * Optional env:
 *   SITE_HEALTH_BASE_URL  — default https://www.wisihe.no
 *   SITE_HEALTH_A11Y_MIN  — default 0.9
 *   SITE_HEALTH_SEO_MIN   — default 0.9
 *   SITE_HEALTH_PERF_MIN  — default 0.75
 */

import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { buildFinding } from '../lib/site-health-report.mjs';

/** @typedef {import('../lib/site-health-report.mjs').Finding} Finding */

const repoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

function siteHealthToolImport(moduleName) {
  const resolvers = [
    createRequire(path.join(repoRoot, 'tools', 'site-health', 'package.json')),
    createRequire(path.join(repoRoot, 'package.json')),
  ];

  for (const resolver of resolvers) {
    try {
      return import(pathToFileURL(resolver.resolve(moduleName)).href);
    } catch {
      // try next resolver
    }
  }

  throw new Error(
    `Missing ${moduleName}. Run "pnpm install" (tools/site-health) or use --only=analytics,structured-data.`,
  );
}

/** Representative, stable routes (no slug fragility). */
const ROUTES = ['/', '/projects', '/paintings', '/videos', '/contact'];

/**
 * @param {number} score 0..1
 * @returns {string}
 */
function formatScore(score) {
  return `${Math.round(score * 100)}`;
}

/**
 * Extract failing audits (score < 0.9, scored 0..1) for a category.
 *
 * @param {import('lighthouse').Result} lhr
 * @param {string} categoryId
 * @returns {Array<{ title: string, description: string }>}
 */
function failingAudits(lhr, categoryId) {
  const category = lhr.categories?.[categoryId];
  if (!category) return [];

  /** @type {Array<{ title: string, description: string }>} */
  const failing = [];
  for (const ref of category.auditRefs ?? []) {
    const audit = lhr.audits?.[ref.id];
    if (!audit) continue;
    if (audit.scoreDisplayMode === 'notApplicable' || audit.scoreDisplayMode === 'informative') {
      continue;
    }
    if (typeof audit.score === 'number' && audit.score < 0.9) {
      const description = (audit.description ?? '').split('[Learn')[0].trim();
      failing.push({ title: audit.title ?? ref.id, description });
    }
  }
  return failing;
}

/**
 * @param {Array<{ url: string, score: number, failing: Array<{ title: string, description: string }> }>} perUrl
 * @returns {string[]}
 */
function auditActions(perUrl) {
  /** @type {Map<string, string>} */
  const unique = new Map();
  for (const { failing } of perUrl) {
    for (const audit of failing) {
      if (!unique.has(audit.title)) unique.set(audit.title, audit.description);
    }
  }
  return [...unique.entries()]
    .slice(0, 8)
    .map(([title, description]) =>
      description ? `**${title}** — ${description}` : `**${title}**`,
    );
}

/**
 * @param {Array<{ url: string, score: number }>} perUrl
 * @returns {string}
 */
function scoreTable(perUrl) {
  const header = '| URL | Score |';
  const divider = '| --- | --- |';
  const rows = perUrl.map(({ url, score }) => `| ${url} | ${formatScore(score)} |`).join('\n');
  return `${header}\n${divider}\n${rows}`;
}

/**
 * Create Lighthouse-backed checks bound to the given config.
 *
 * @param {{ baseUrl: string, a11yMin: number, seoMin: number, perfMin: number, includePerf: boolean, reviewDate: string }} config
 * @returns {Array<() => Promise<Finding | null>>}
 */
export function createLighthouseChecks(config) {
  const { baseUrl, a11yMin, seoMin, perfMin, includePerf, reviewDate } = config;

  /**
   * Run Lighthouse once per route, memoized across category checks.
   * @type {Promise<Array<{ url: string, lhr: import('lighthouse').Result }>> | null}
   */
  let resultsPromise = null;

  async function collectResults() {
    if (resultsPromise) return resultsPromise;

    resultsPromise = (async () => {
      const [{ default: lighthouse }, chromeLauncher] = await Promise.all([
        siteHealthToolImport('lighthouse'),
        siteHealthToolImport('chrome-launcher'),
      ]);

      const chrome = await chromeLauncher.launch({
        chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu'],
      });

      /** @type {Array<{ url: string, lhr: import('lighthouse').Result }>} */
      const collected = [];

      try {
        for (const route of ROUTES) {
          const url = new URL(route, baseUrl).toString();
          const runnerResult = await lighthouse(
            url,
            { port: chrome.port, output: 'json', logLevel: 'error' },
            {
              extends: 'lighthouse:default',
              settings: {
                onlyCategories: ['performance', 'accessibility', 'seo', 'best-practices'],
              },
            },
          );

          if (runnerResult?.lhr) {
            collected.push({ url, lhr: runnerResult.lhr });
          }
        }
      } finally {
        await chrome.kill();
      }

      return collected;
    })();

    return resultsPromise;
  }

  /**
   * @param {string} checkId
   * @param {'accessibility' | 'seo' | 'performance'} categoryId
   * @param {import('../lib/site-health-report.mjs').FindingCategory} findingCategory
   * @param {number} min
   * @param {string} label
   * @returns {Promise<Finding | null>}
   */
  async function categoryCheck(checkId, categoryId, findingCategory, min, label) {
    const results = await collectResults();
    if (results.length === 0) return null;

    const perUrl = results
      .map(({ url, lhr }) => ({
        url,
        score:
          typeof lhr.categories?.[categoryId]?.score === 'number'
            ? lhr.categories[categoryId].score
            : 1,
        failing: failingAudits(lhr, categoryId),
      }))
      .filter(({ score }) => score < min);

    if (perUrl.length === 0) return null;

    const worst = perUrl.reduce((a, b) => (b.score < a.score ? b : a));

    return buildFinding({
      id: checkId,
      category: findingCategory,
      summary: `${label} below target on ${perUrl.length} page(s) (worst: ${new URL(worst.url).pathname} @ ${formatScore(worst.score)})`,
      details: scoreTable(perUrl),
      actions:
        auditActions(perUrl).length > 0
          ? auditActions(perUrl)
          : [`Investigate the ${label.toLowerCase()} regression on the listed pages.`],
      source: 'Lighthouse (lab)',
      reviewDate,
    });
  }

  const checks = [
    function lighthouseAccessibility() {
      return categoryCheck(
        'lighthouse-a11y-regression',
        'accessibility',
        'a11y',
        a11yMin,
        'Accessibility score',
      );
    },
    function lighthouseSeo() {
      return categoryCheck('lighthouse-seo-regression', 'seo', 'seo', seoMin, 'SEO score');
    },
  ];

  if (includePerf) {
    checks.push(function lighthousePerformance() {
      return categoryCheck(
        'lighthouse-perf-regression',
        'performance',
        'perf',
        perfMin,
        'Performance score',
      );
    });
  }

  return checks;
}
