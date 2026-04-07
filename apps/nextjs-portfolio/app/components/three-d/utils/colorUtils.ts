/**
 * Converts a CSS color value (including CSS variables with lab()/oklch() colors)
 * to a format that Three.js can understand (hex string)
 * @param cssColor - CSS color value (e.g., "lab(...)" or CSS variable value)
 * @param fallback - Fallback hex color if conversion fails
 * @returns Hex color string (e.g., "#3b82f6")
 */
export function cssColorToHex(cssColor: string, fallback: string = '#14b8a6'): string {
  if (!cssColor || typeof window === 'undefined') {
    return fallback;
  }

  // If it's already a hex color, return it
  if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(cssColor.trim())) {
    return cssColor.trim();
  }

  // If it's an rgb/rgba color, convert to hex
  const rgbMatch = cssColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1] ?? '0', 10);
    const g = parseInt(rgbMatch[2] ?? '0', 10);
    const b = parseInt(rgbMatch[3] ?? '0', 10);
    return `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`;
  }

  // For lab(), oklch(), or other CSS color functions, use the browser's computed color
  try {
    // Create a temporary element to get the computed color
    const tempEl = document.createElement('div');
    tempEl.style.color = cssColor;
    tempEl.style.position = 'absolute';
    tempEl.style.visibility = 'hidden';
    document.body.appendChild(tempEl);

    const computedColor = window.getComputedStyle(tempEl).color;
    document.body.removeChild(tempEl);

    // Convert rgb() to hex
    const computedRgbMatch = computedColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
    if (computedRgbMatch) {
      const r = parseInt(computedRgbMatch[1] ?? '0', 10);
      const g = parseInt(computedRgbMatch[2] ?? '0', 10);
      const b = parseInt(computedRgbMatch[3] ?? '0', 10);
      return `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`;
    }
  } catch (error) {
    console.warn('Failed to convert CSS color to hex:', error);
  }

  return fallback;
}

/**
 * Gets a CSS variable value and converts it to a hex color for Three.js
 * @param variableName - CSS variable name (e.g., "--color-accent")
 * @param fallback - Fallback hex color if variable doesn't exist or conversion fails
 * @returns Hex color string
 */
export function getCssVariableAsHex(variableName: string, fallback: string = '#14b8a6'): string {
  if (typeof window === 'undefined') {
    return fallback;
  }

  const value = getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();

  if (!value) {
    return fallback;
  }

  return cssColorToHex(value, fallback);
}

/**
 * Resolves CSS color values that may contain CSS variables
 * (e.g., "var(--color-accent)" or "hsl(var(--accent))")
 * to a color string (hex or rgba) that can be used in animations
 * @param cssColorValue - CSS color value that may contain CSS variables
 * @param fallback - Fallback hex color if conversion fails
 * @returns Color string (hex or rgba format)
 */
export function resolveCssColorForAnimation(
  cssColorValue: string,
  fallback: string = '#000000',
): string {
  if (typeof window === 'undefined') {
    return fallback;
  }

  // If it's already a hex color, return it
  if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(cssColorValue.trim())) {
    return cssColorValue.trim();
  }

  // If it's already an rgba color, return it
  if (/^rgba?\(/.test(cssColorValue.trim())) {
    return cssColorValue.trim();
  }

  // Handle CSS variable references like "var(--color-accent)"
  // or legacy patterns like "hsl(var(--accent) / 0.2)"
  // Use a temporary element to get the computed color value
  try {
    const tempEl = document.createElement('div');
    tempEl.style.position = 'absolute';
    tempEl.style.visibility = 'hidden';
    tempEl.style.color = cssColorValue;
    document.body.appendChild(tempEl);

    const computedColor = window.getComputedStyle(tempEl).color;
    document.body.removeChild(tempEl);

    // Check if there's an opacity modifier like "/ 0.2"
    const opacityMatch = cssColorValue.match(/\/\s*([\d.]+)/);
    if (opacityMatch) {
      const opacity = parseFloat(opacityMatch[1] ?? '0');
      // Convert computed color (rgb/rgba) to rgba with the specified opacity
      const rgbMatch = computedColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
      if (rgbMatch) {
        const r = parseInt(rgbMatch[1] ?? '0', 10);
        const g = parseInt(rgbMatch[2] ?? '0', 10);
        const b = parseInt(rgbMatch[3] ?? '0', 10);
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
      }
    }

    // If no opacity modifier, convert to hex
    return cssColorToHex(computedColor, fallback);
  } catch (error) {
    console.warn('Failed to resolve CSS color for animation:', error);
    return fallback;
  }
}
