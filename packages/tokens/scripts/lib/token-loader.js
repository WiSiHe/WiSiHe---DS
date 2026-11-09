import fs from 'node:fs';
import path from 'node:path';

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
    if (isPlainObject(value) && Object.hasOwn(value, '$value')) {
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

function getTokenNode(root, pathParts) {
  let current = root;
  for (const part of pathParts) {
    if (!isPlainObject(current) || !(part in current)) {
      return null;
    }
    current = current[part];
  }

  if (isPlainObject(current) && Object.hasOwn(current, '$value')) {
    return current;
  }

  return null;
}

export function buildTokenResolutionRoot() {
  const { primitives, semanticLight, semanticDark, component } = loadLayeredTokens();

  return mergeDeep(
    mergeDeep(mergeDeep({}, primitives), semanticLight),
    mergeDeep(semanticDark, component),
  );
}

export function resolveTokenValue(value, root = buildTokenResolutionRoot(), visited = new Set()) {
  if (typeof value !== 'string') {
    return value;
  }

  const referenceMatch = value.match(/^\{([^}]+)\}$/);
  if (!referenceMatch) {
    return value;
  }

  const tokenPath = referenceMatch[1].trim();
  if (visited.has(tokenPath)) {
    return value;
  }

  visited.add(tokenPath);
  const tokenNode = getTokenNode(root, tokenPath.split('.'));
  if (!tokenNode) {
    return value;
  }

  return resolveTokenValue(tokenNode.$value, root, visited);
}

// Compatibility for consumers of the legacy comma-separated RGB variables.
export function resolveRgbChannels(reference, root = buildTokenResolutionRoot()) {
  const color = resolveTokenValue(reference, root);
  if (typeof color !== 'string' || !/^#[\da-f]{6}$/i.test(color)) {
    throw new Error(`Expected a six-digit hex color for ${reference}, received ${color}`);
  }
  return [1, 3, 5].map(index => Number.parseInt(color.slice(index, index + 2), 16)).join(', ');
}

export function loadFlatTokensForExport() {
  return buildTokenResolutionRoot();
}
