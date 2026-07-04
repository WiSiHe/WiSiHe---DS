/**
 * PostHog analytics checks for the weekly site-health review.
 *
 * Queries the PostHog Query API (HogQL) for the last 7 days and returns
 * findings for actionable product/engagement issues.
 *
 * Required env:
 *   POSTHOG_PERSONAL_API_KEY  — personal API key with query:read scope
 *   POSTHOG_PROJECT_ID        — PostHog project ID
 * Optional env:
 *   POSTHOG_API_HOST          — default https://us.posthog.com
 */

import { buildFinding, markdownTable, toNumber } from '../lib/site-health-report.mjs';

const LOOKBACK_DAYS = 7;
const intervalClause = `INTERVAL ${LOOKBACK_DAYS} DAY`;

/** @typedef {import('../lib/site-health-report.mjs').Finding} Finding */

/**
 * Create the set of analytics checks bound to the given config.
 *
 * @param {{ apiKey: string, projectId: string, apiHost: string, reviewDate: string }} config
 * @returns {Array<() => Promise<Finding | null>>}
 */
export function createAnalyticsChecks({ apiKey, projectId, apiHost, reviewDate }) {
  /**
   * @param {string} hogql
   * @returns {Promise<{ columns: string[], results: unknown[][] }>}
   */
  async function runHogQL(hogql) {
    const response = await fetch(`${apiHost}/api/projects/${projectId}/query/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: {
          kind: 'HogQLQuery',
          query: hogql,
        },
        name: 'weekly-site-health-review',
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
    return results.map(row =>
      Object.fromEntries(columns.map((column, index) => [column, row[index]])),
    );
  }

  /**
   * @param {string} id
   * @param {string} summary
   * @param {string} details
   * @param {string[]} actions
   * @returns {Finding}
   */
  function finding(id, summary, details, actions) {
    return buildFinding({
      id,
      category: 'analytics',
      summary,
      details,
      actions,
      source: `PostHog, last ${LOOKBACK_DAYS} days`,
      reviewDate,
    });
  }

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

    return finding(
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

    return finding(
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
   * @returns {Promise<Finding | null>}
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

    return finding(
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

    return finding(
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

    return finding(
      'project-filter-underuse',
      'Project filters never used despite listing traffic',
      markdownTable([
        { metric: 'Projects listing views', value: listingViews },
        { metric: 'Filter interactions', value: filterUses },
      ]),
      [
        'Surface default filters or featured tags above the fold.',
        'Add a "popular tags" chip row for one-click filtering.',
        'Consider whether filters are visually buried on mobile.',
      ],
    );
  }

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

    return finding(
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

    return finding(
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

  return [
    checkSearchNoResultRate,
    checkTopNoResultQueries,
    () =>
      checkListingDropoff(
        'paintings-listing-dropoff',
        'paintings_listing',
        'painting_viewed',
        'paintings',
      ),
    () =>
      checkListingDropoff(
        'projects-listing-dropoff',
        'projects_listing',
        'project_viewed',
        'projects',
      ),
    checkContactFormGap,
    checkProjectFilterUnderuse,
    checkTrafficWeekDrop,
    checkFooterCtaEngagement,
  ];
}
