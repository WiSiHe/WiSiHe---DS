function cssColorToHex(cssColor: string, fallback: string): string {
  if (!cssColor || typeof window === 'undefined') return fallback;

  if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(cssColor.trim())) {
    return cssColor.trim();
  }

  const rgbMatch = cssColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
  if (rgbMatch) {
    const r = Number.parseInt(rgbMatch[1] ?? '0', 10);
    const g = Number.parseInt(rgbMatch[2] ?? '0', 10);
    const b = Number.parseInt(rgbMatch[3] ?? '0', 10);
    return `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`;
  }

  try {
    const tempEl = document.createElement('div');
    tempEl.style.color = cssColor;
    tempEl.style.position = 'absolute';
    tempEl.style.visibility = 'hidden';
    document.body.appendChild(tempEl);
    const computedColor = window.getComputedStyle(tempEl).color;
    document.body.removeChild(tempEl);

    const computedRgbMatch = computedColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
    if (computedRgbMatch) {
      const r = Number.parseInt(computedRgbMatch[1] ?? '0', 10);
      const g = Number.parseInt(computedRgbMatch[2] ?? '0', 10);
      const b = Number.parseInt(computedRgbMatch[3] ?? '0', 10);
      return `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`;
    }
  } catch {
    // ignore
  }

  return fallback;
}

export function getCssVariableAsHex(variableName: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback;

  const value = getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
  if (!value) return fallback;

  return cssColorToHex(value, fallback);
}
