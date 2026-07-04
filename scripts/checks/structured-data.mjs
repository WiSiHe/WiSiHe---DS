/**
 * Structured-data (JSON-LD) validation for the weekly site-health review.
 *
 * Fetches the rendered HTML of stable production routes, extracts every
 * <script type="application/ld+json"> block, and validates:
 *   - the JSON parses
 *   - a global @graph with a Person + WebSite node is present (emitted in the
 *     root layout via lib/seo/jsonLd + layout.tsx)
 *   - required schema.org fields per @type are present and non-empty
 *   - no obvious placeholder/empty values
 *
 * This catches silent breakage of rich-result markup without any paid API.
 *
 * Optional env:
 *   SITE_HEALTH_BASE_URL — default https://www.wisihe.no
 */

import { buildFinding } from '../lib/site-health-report.mjs';

/** @typedef {import('../lib/site-health-report.mjs').Finding} Finding */

/** Routes expected to render the global Person + WebSite graph. */
const ROUTES = ['/', '/projects', '/paintings', '/videos', '/contact'];

/** Required non-empty fields per schema.org @type we emit. */
const REQUIRED_FIELDS = /** @type {Record<string, string[]>} */ ({
  Person: ['name', 'url'],
  WebSite: ['name', 'url'],
  BreadcrumbList: ['itemListElement'],
});

/** @type {RegExp} */
const LD_JSON_RE = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;

/**
 * @param {string} html
 * @returns {string[]}
 */
function extractLdJsonBlocks(html) {
  /** @type {string[]} */
  const blocks = [];
  let match = LD_JSON_RE.exec(html);
  while (match !== null) {
    blocks.push(match[1].trim());
    match = LD_JSON_RE.exec(html);
  }
  LD_JSON_RE.lastIndex = 0;
  return blocks;
}

/**
 * Flatten any JSON-LD value (object, @graph, or array) into individual nodes.
 * @param {unknown} parsed
 * @returns {Record<string, unknown>[]}
 */
function collectNodes(parsed) {
  /** @type {Record<string, unknown>[]} */
  const nodes = [];
  const visit = value => {
    if (Array.isArray(value)) {
      for (const item of value) visit(item);
      return;
    }
    if (value && typeof value === 'object') {
      const record = /** @type {Record<string, unknown>} */ (value);
      if (Array.isArray(record['@graph'])) {
        visit(record['@graph']);
      }
      if (record['@type']) nodes.push(record);
    }
  };
  visit(parsed);
  return nodes;
}

/**
 * @param {Record<string, unknown>} node
 * @returns {string}
 */
function nodeType(node) {
  const type = node['@type'];
  return Array.isArray(type) ? type.join('/') : String(type ?? 'Unknown');
}

/**
 * Validate a single URL's JSON-LD. Returns a list of human-readable problems.
 * @param {string} url
 * @param {string} html
 * @returns {string[]}
 */
function validateUrl(url, html) {
  /** @type {string[]} */
  const problems = [];
  const blocks = extractLdJsonBlocks(html);

  if (blocks.length === 0) {
    problems.push('No JSON-LD (`application/ld+json`) found in the rendered HTML.');
    return problems;
  }

  /** @type {Record<string, unknown>[]} */
  const nodes = [];
  blocks.forEach((block, index) => {
    try {
      nodes.push(...collectNodes(JSON.parse(block)));
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      problems.push(`JSON-LD block #${index + 1} failed to parse: ${message}`);
    }
  });

  const types = new Set(nodes.map(nodeType));
  if (!types.has('Person')) problems.push('Missing global `Person` node.');
  if (!types.has('WebSite')) problems.push('Missing global `WebSite` node.');

  for (const node of nodes) {
    const type = nodeType(node);
    const required = REQUIRED_FIELDS[type];
    if (!required) continue;

    for (const field of required) {
      const value = node[field];
      const isEmpty =
        value === undefined ||
        value === null ||
        (typeof value === 'string' && value.trim() === '') ||
        (Array.isArray(value) && value.length === 0);
      if (isEmpty) problems.push(`\`${type}\` is missing a non-empty \`${field}\`.`);
    }
  }

  return problems;
}

/**
 * Create the structured-data check bound to the given config.
 *
 * @param {{ baseUrl: string, reviewDate: string }} config
 * @returns {Array<() => Promise<Finding | null>>}
 */
export function createStructuredDataChecks({ baseUrl, reviewDate }) {
  async function structuredDataValidation() {
    /** @type {Record<string, string>} */
    const failuresByUrl = {};

    for (const route of ROUTES) {
      const url = new URL(route, baseUrl).toString();
      try {
        const response = await fetch(url, {
          headers: { 'User-Agent': 'wisihe-site-health-bot' },
        });
        if (!response.ok) {
          failuresByUrl[route] = `HTTP ${response.status} fetching page.`;
          continue;
        }
        const html = await response.text();
        const problems = validateUrl(url, html);
        if (problems.length > 0) failuresByUrl[route] = problems.join(' ');
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        failuresByUrl[route] = `Fetch failed: ${message}`;
      }
    }

    const failedRoutes = Object.keys(failuresByUrl);
    if (failedRoutes.length === 0) return null;

    const header = '| Route | Problem |';
    const divider = '| --- | --- |';
    const rows = failedRoutes.map(route => `| ${route} | ${failuresByUrl[route]} |`).join('\n');

    return buildFinding({
      id: 'structured-data-invalid',
      category: 'structured-data',
      summary: `Invalid or missing JSON-LD on ${failedRoutes.length} page(s)`,
      details: `${header}\n${divider}\n${rows}`,
      actions: [
        'Check `lib/seo/jsonLd.ts` and `app/layout.tsx` — the global Person + WebSite `@graph` should render on every page.',
        'Verify page-specific JSON-LD builders (recipes, about, projects, paintings) emit required fields.',
        'Validate the affected URLs in Google’s Rich Results Test to confirm eligibility.',
      ],
      source: 'JSON-LD validation',
      reviewDate,
    });
  }

  return [structuredDataValidation];
}
