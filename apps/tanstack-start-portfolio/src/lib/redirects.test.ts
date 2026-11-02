import { describe, expect, it } from 'vite-plus/test';
import { type CmsRedirect, matchRedirect } from './redirects';

const redirects: CmsRedirect[] = [
  { source: '/old-page', destination: '/new-page', permanent: true },
  { source: '/blog/:slug', destination: '/articles/:slug', permanent: false },
  { source: '/shop', destination: 'https://shop.example.com/', permanent: true },
  { source: '/loop', destination: '/loop', permanent: true },
  { source: null, destination: '/x', permanent: true },
];

describe('matchRedirect', () => {
  it('matches exact sources and honours permanent/temporary', () => {
    expect(matchRedirect('/old-page', '', redirects)).toEqual({
      location: '/new-page',
      status: 301,
    });
  });
  it('fills :param placeholders and is case/trailing-slash tolerant', () => {
    expect(matchRedirect('/Blog/hello-world/', '', redirects)).toEqual({
      location: '/articles/hello-world',
      status: 302,
    });
  });
  it('passes through external destinations and keeps the query string', () => {
    expect(matchRedirect('/shop', '?ref=1', redirects)).toEqual({
      location: 'https://shop.example.com/?ref=1',
      status: 301,
    });
  });
  it('ignores non-matching paths, incomplete entries and self-redirects', () => {
    expect(matchRedirect('/about', '', redirects)).toBeNull();
    expect(matchRedirect('/loop', '', redirects)).toBeNull();
    expect(matchRedirect('/blog', '', redirects)).toBeNull();
  });
});
