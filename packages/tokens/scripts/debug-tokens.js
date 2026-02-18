import { loadLayeredTokens } from './lib/token-loader.js';

const { primitives } = loadLayeredTokens();
console.log('Primitives keys:', Object.keys(primitives));

if (primitives.borderRadius) {
  console.log('borderRadius keys:', Object.keys(primitives.borderRadius));
} else {
  console.log('borderRadius NOT FOUND in primitives');
}
