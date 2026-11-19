#!/usr/bin/env node
// Usage: node check-srcset.mjs <page-url> [--out evidence.json]
// For every <img> on the page: each srcset candidate must deliver an image whose real pixel width
// equals its `w` descriptor. Sanity images with no srcset are reported as MISSING.
import { writeFileSync } from 'node:fs';

const [pageUrl, ...rest] = process.argv.slice(2);
const outIndex = rest.indexOf('--out');
const outFile = outIndex >= 0 ? rest[outIndex + 1] : undefined;
if (!pageUrl) {
  console.error('usage: node check-srcset.mjs <page-url> [--out evidence.json]');
  process.exit(2);
}

const decode = s => s.replaceAll('&amp;', '&');

function pixelWidth(bytes) {
  const b = Buffer.from(bytes);
  if (b.subarray(1, 4).toString() === 'PNG') return b.readUInt32BE(16);
  if (b[0] === 0xff && b[1] === 0xd8) {
    for (let i = 2; i < b.length - 9; ) {
      if (b[i] !== 0xff) return undefined;
      const marker = b[i + 1];
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return b.readUInt16BE(i + 7);
      }
      i += 2 + b.readUInt16BE(i + 2);
    }
    return undefined;
  }
  if (b.subarray(0, 4).toString() === 'RIFF' && b.subarray(8, 12).toString() === 'WEBP') {
    const kind = b.subarray(12, 16).toString();
    if (kind === 'VP8 ') return b.readUInt16LE(26) & 0x3fff;
    if (kind === 'VP8L') return (b.readUInt16LE(21) & 0x3fff) + 1;
    if (kind === 'VP8X') return b.readUIntLE(24, 3) + 1;
  }
  return undefined;
}

let page;
try {
  page = await fetch(pageUrl);
} catch (error) {
  console.error(`cannot reach ${pageUrl}: ${error.cause?.code ?? error.message}`);
  process.exit(2);
}
if (!page.ok) {
  console.error(`page returned HTTP ${page.status}: ${pageUrl}`);
  process.exit(2);
}
const html = await page.text();
const imgs = [...html.matchAll(/<img\b[^>]*>/gi)].map(m => m[0]);
const results = [];

for (const tag of imgs) {
  const src = decode(/\ssrc="([^"]*)"/i.exec(tag)?.[1] ?? '');
  const srcset = decode(/\ssrcset="([^"]*)"/i.exec(tag)?.[1] ?? '');
  if (!srcset) {
    if (src.includes('cdn.sanity.io'))
      results.push({ src, status: 'MISSING', note: 'Sanity image has no srcset' });
    continue;
  }
  for (const candidate of srcset.split(/,\s+(?=https?:)/)) {
    const [url, descriptor] = candidate.trim().split(/\s+/);
    const wanted = Number.parseInt(descriptor, 10);
    const res = await fetch(url, { headers: { Range: 'bytes=0-262143' } });
    const delivered = pixelWidth(await res.arrayBuffer());
    const status = delivered === wanted ? 'PASS' : delivered === undefined ? 'UNSUPPORTED' : 'FAIL';
    results.push({ src, url, descriptor, delivered, http: res.status, status });
  }
}

if (results.length === 0) {
  console.error(`no Sanity images found on ${pageUrl}: nothing was checked`);
  process.exit(2);
}

for (const r of results) {
  console.log(
    `${r.status.padEnd(7)} ${r.descriptor ?? '-'}  delivered=${r.delivered ?? '-'}  ${(r.url ?? r.src).slice(0, 110)}`,
  );
}
const count = status => results.filter(r => r.status === status).length;
const failed = results.length - count('PASS');
const unsupported = count('UNSUPPORTED');
console.log(
  `\n${results.length - failed} pass, ${failed} not passing (${count('FAIL') + count('MISSING')} wrong or missing, ${unsupported} unreadable and not verified), ${imgs.length} img tags on ${pageUrl}`,
);
if (outFile)
  writeFileSync(
    outFile,
    JSON.stringify({ pageUrl, checkedAt: new Date().toISOString(), results }, null, 2),
  );
process.exit(failed ? 1 : 0);
