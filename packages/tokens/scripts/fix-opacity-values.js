
import fs from 'fs';
import path from 'path';

const effectsPath = path.join(process.cwd(), 'tokens/primitives/effects.json');
const effects = JSON.parse(fs.readFileSync(effectsPath, 'utf8'));

if (effects.opacity) {
  for (const [key, token] of Object.entries(effects.opacity)) {
    let value = token.$value;
    if (typeof value === 'string' && value.endsWith('%')) {
      const num = parseFloat(value) / 100;
      token.$value = num.toString();
      // Remove leading zero for consistency if preferred, but toString() is fine.
      // 0.5, 0.95, 1
    }
  }
}

fs.writeFileSync(effectsPath, JSON.stringify(effects, null, 2) + '\n');
console.log('Converted opacity values to decimals.');
