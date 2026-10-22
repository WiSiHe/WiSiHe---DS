import type { CaptureResult } from 'posthog-js';
import { describe, expect, it } from 'vite-plus/test';
import { getPageType } from '@/lib/analytics/pageType';
import { addPageType, getPostHogInitOptions } from './config';

const event = (name: string, properties: Record<string, unknown> = {}) =>
  ({ uuid: 'x', event: name, properties }) as CaptureResult;

describe('addPageType', () => {
  it('tags pageviews with page_type and page_path', () => {
    const result = addPageType(
      event('$pageview', { $pathname: '/paintings/over-the-garden-wall' }),
    );
    expect(result?.properties).toMatchObject({
      page_path: '/paintings/over-the-garden-wall',
      page_type: 'painting_detail',
    });
  });

  it('leaves other events untouched', () => {
    const other = event('$pageleave', { $pathname: '/' });
    expect(addPageType(other)).toBe(other);
  });

  it('passes null through', () => {
    expect(addPageType(null)).toBeNull();
  });
});

describe('getPageType', () => {
  it.each([
    ['/', 'home'],
    ['/projects', 'projects_listing'],
    ['/projects/scentwise', 'project_detail'],
    ['/paintings', 'paintings_listing'],
    ['/about', 'about'],
    ['/three-d/slides', 'three_d'],
    ['/nope', 'other'],
  ])('%s -> %s', (path, type) => {
    expect(getPageType(path)).toBe(type);
  });
});

describe('getPostHogInitOptions', () => {
  it('uses the SPA pageview handling and no cookieless mode', () => {
    const options = getPostHogInitOptions('https://eu.i.posthog.com');
    expect(options.capture_pageview).toBe('history_change');
    expect(options.capture_pageleave).toBe(true);
    expect(options.persistence).toBe('memory');
    expect(options).not.toHaveProperty('cookieless_mode');
    expect(options.ui_host).toBe('https://eu.posthog.com');
  });
});
