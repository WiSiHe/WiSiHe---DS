import { describe, expect, it } from 'vite-plus/test';
import { lowPriorityModulePreloads } from './lowPriorityModulePreloads';

const html =
  '<!DOCTYPE html><html lang="no"><head><meta charSet="utf-8"/><title>Tromsø – æøå 🙂</title>' +
  '<link rel="modulepreload" href="/assets/a.js"/><link rel="modulepreload" href="/assets/b.js"/>' +
  '<link rel="stylesheet" href="/assets/x.css"/><link rel="modulepreload" href="/assets/c.js"/></head>' +
  '<body><p>æøå</p><link rel="modulepreload" href="/assets/in-body.js"/></body></html>';

const expected = html.replace(
  /<link rel="modulepreload" (?=href="\/assets\/[abc]\.js")/g,
  '<link rel="modulepreload" fetchpriority="low" ',
);
const bytes = new TextEncoder().encode(html);

async function rewrite(chunks: Uint8Array[], contentType = 'text/html; charset=utf-8') {
  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      for (const chunk of chunks) controller.enqueue(chunk);
      controller.close();
    },
  });
  const response = lowPriorityModulePreloads(
    new Response(body, { headers: { 'content-type': contentType, 'content-length': '999' } }),
  );
  return { response, text: await response.text() };
}

describe('lowPriorityModulePreloads', () => {
  it('marks head modulepreload links low priority, leaving the rest untouched', async () => {
    const { response, text } = await rewrite([bytes]);
    expect(text).toBe(expected);
    expect(response.headers.has('content-length')).toBe(false);
    expect(text).toContain('<link rel="modulepreload" href="/assets/in-body.js"/>');
    expect(text).toContain('Tromsø – æøå 🙂');
  });

  it('gives the same result when the stream is split at any byte position', async () => {
    for (let i = 0; i <= bytes.length; i++) {
      const { text } = await rewrite([bytes.slice(0, i), bytes.slice(i)]);
      expect(text, `split at ${i}`).toBe(expected);
    }
  });

  it('handles one-byte chunks and double splits', async () => {
    expect((await rewrite(Array.from(bytes, byte => new Uint8Array([byte])))).text).toBe(expected);
    for (let i = 0; i < bytes.length; i += 7) {
      for (let j = i + 1; j < bytes.length; j += 11) {
        const { text } = await rewrite([bytes.slice(0, i), bytes.slice(i, j), bytes.slice(j)]);
        expect(text, `splits at ${i}, ${j}`).toBe(expected);
      }
    }
  });

  it('does not touch non-HTML responses', async () => {
    const json = '{"a":"<link rel=\\"modulepreload\\" "}';
    expect((await rewrite([new TextEncoder().encode(json)], 'application/json')).text).toBe(json);
  });
});
