import fs from 'fs';
import path from 'path';

function isPlainObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function mergeDeep(target, source) {
  const output = { ...target };
  for (const [key, sourceValue] of Object.entries(source)) {
    const targetValue = output[key];
    if (isPlainObject(sourceValue) && isPlainObject(targetValue)) {
      output[key] = mergeDeep(targetValue, sourceValue);
      continue;
    }
    if (isPlainObject(sourceValue)) {
      output[key] = mergeDeep({}, sourceValue);
      continue;
    }
    output[key] = sourceValue;
  }
  return output;
}

function collectJsonFiles(directory) {
  if (!fs.existsSync(directory)) {
    return [];
  }

  const entries = fs.readdirSync(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectJsonFiles(fullPath));
      continue;
    }
    if (entry.isFile() && entry.name.endsWith('.json')) {
      files.push(fullPath);
    }
  }

  return files.sort((a, b) => a.localeCompare(b));
}

function loadTokenDirectory(relativeDirectory) {
  const absoluteDirectory = path.join(import.meta.dirname, '..', '..', relativeDirectory);
  const jsonFiles = collectJsonFiles(absoluteDirectory);
  return jsonFiles.reduce((acc, filePath) => {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(fileContents);
    return mergeDeep(acc, parsed);
  }, {});
}

export function loadLayeredTokens() {
  const primitives = loadTokenDirectory('tokens/primitives');
  const semanticLight = loadTokenDirectory('tokens/semantic/light');
  const semanticDark = loadTokenDirectory('tokens/semantic/dark');
  const component = loadTokenDirectory('tokens/component');

  return {
    primitives,
    semanticLight,
    semanticDark,
    component,
    base: mergeDeep(mergeDeep(mergeDeep({}, primitives), semanticLight), component),
  };
}

export function replaceReferencesWithCssVars(value) {
  if (typeof value !== 'string') {
    return value;
  }

  return value.replace(/\{([^}]+)\}/g, (_fullMatch, tokenPath) => {
    let pathStr = String(tokenPath).trim();
    let isSemantic = false;

    // Detect if this is a reference to a semantic token
    // We append -val to ALL semantic tokens to allow for runtime switching (colors, radius, etc.)
    if (pathStr.startsWith('semantic.')) {
      isSemantic = true;
      // Remove the specific semantic prefixes to unify under 'color' (or other root namespaces)
      pathStr = pathStr
        .replace(/^semantic\.dark\.color\./, 'color.')
        .replace(/^semantic\.light\.color\./, 'color.')
        .replace(/^semantic\.color\./, 'color.')
        .replace(/^semantic\./, ''); // Fallback for other semantic tokens
    }

    let normalizedPath = pathStr.replace(/\./g, '-');
    
    // Explicitly fix double prefixes if they occur (e.g. from naive replacements)
    if (normalizedPath.startsWith('color-color-')) {
      normalizedPath = normalizedPath.replace('color-color-', 'color-');
    }
    
    // Append -val suffix if it was a semantic reference, as these now use the private variable strategy
    if (isSemantic) {
      normalizedPath += '-val';
    }
    
    return `var(--${normalizedPath})`;
  });
}

export function flattenTokenTree(node, pathParts = []) {
  const flattened = [];

  if (!isPlainObject(node)) {
    return flattened;
  }

  for (const [key, value] of Object.entries(node)) {
    if (isPlainObject(value) && Object.prototype.hasOwnProperty.call(value, '$value')) {
      flattened.push({
        path: [...pathParts, key],
        token: value,
      });
      continue;
    }
    flattened.push(...flattenTokenTree(value, [...pathParts, key]));
  }

  return flattened;
}
