
import fs from 'fs';
import path from 'path';

const effectsPath = path.join(process.cwd(), 'tokens/primitives/effects.json');
const effects = JSON.parse(fs.readFileSync(effectsPath, 'utf8'));

if (effects.opacity) {
  for (const [key, token] of Object.entries(effects.opacity)) {
    let value = token.$value;
    // If it's a decimal string like "0.95" or "0.5", convert to percentage
    if (typeof value === 'string' && !value.endsWith('%')) {
        const num = parseFloat(value);
        if (!isNaN(num) && num <= 1) {
             token.$value = `${num * 100}%`;
        }
    }
  }
}

fs.writeFileSync(effectsPath, JSON.stringify(effects, null, 2) + '\n');
console.log('Reverted opacity values to percentages.');
