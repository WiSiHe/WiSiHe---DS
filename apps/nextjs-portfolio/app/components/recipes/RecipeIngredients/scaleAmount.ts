const FRACTION_CHARS: Record<string, number> = {
  '½': 0.5,
  '¼': 0.25,
  '¾': 0.75,
  '⅓': 0.333,
  '⅔': 0.667,
  '⅛': 0.125,
};

const RANGE_SPLIT = /\s*[-–—]\s*/;

function parseAmountToNumber(amount: string): number | null {
  const trimmed = amount.trim();
  if (!trimmed) return null;

  for (const [symbol, value] of Object.entries(FRACTION_CHARS)) {
    if (trimmed.includes(symbol)) {
      const wholePart = trimmed.replace(symbol, '').trim();
      const whole = wholePart ? Number.parseFloat(wholePart.replace(',', '.')) : 0;
      if (!Number.isNaN(whole)) return whole + value;
    }
  }

  const slashMatch = trimmed.match(/^(\d+(?:[.,]\d+)?)\s*\/\s*(\d+(?:[.,]\d+)?)$/);
  if (slashMatch?.[1] && slashMatch[2]) {
    const numerator = Number.parseFloat(slashMatch[1].replace(',', '.'));
    const denominator = Number.parseFloat(slashMatch[2].replace(',', '.'));
    if (!Number.isNaN(numerator) && !Number.isNaN(denominator) && denominator !== 0) {
      return numerator / denominator;
    }
  }

  const numeric = Number.parseFloat(trimmed.replace(',', '.'));
  return Number.isNaN(numeric) ? null : numeric;
}

function formatScaledNumber(value: number, isDiscrete?: boolean | null): string {
  if (isDiscrete) {
    return String(Math.max(0, Math.round(value)));
  }

  if (Number.isInteger(value) || Math.abs(value - Math.round(value)) < 0.05) {
    return String(Math.round(value));
  }

  return value.toFixed(1).replace(/\.0$/, '');
}

export function scaleAmount(
  amount: string,
  multiplier: number,
  isDiscrete?: boolean | null,
): string {
  if (multiplier === 1) return amount;

  const trimmed = amount.trim();
  if (!trimmed) return amount;

  const rangeParts = trimmed.split(RANGE_SPLIT);
  if (rangeParts.length === 2 && rangeParts[0] && rangeParts[1]) {
    const low = parseAmountToNumber(rangeParts[0]);
    const high = parseAmountToNumber(rangeParts[1]);
    if (low !== null && high !== null) {
      return `${formatScaledNumber(low * multiplier, isDiscrete)}-${formatScaledNumber(high * multiplier, isDiscrete)}`;
    }
  }

  const numeric = parseAmountToNumber(trimmed);
  if (numeric === null) return amount;

  return formatScaledNumber(numeric * multiplier, isDiscrete);
}

export function clampServings(value: number): number {
  if (!Number.isFinite(value)) return 1;
  return Math.min(999, Math.max(1, Math.round(value)));
}
