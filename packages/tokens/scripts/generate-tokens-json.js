import fs from 'node:fs';
import path from 'node:path';
import { loadFlatTokensForExport } from './lib/token-loader.js';

export function writeTokensJson() {
  const tokens = loadFlatTokensForExport();
  const outputPath = path.join(import.meta.dirname, '..', 'tokens.json');
  fs.writeFileSync(outputPath, `${JSON.stringify(tokens, null, 2)}\n`);
  return outputPath;
}
