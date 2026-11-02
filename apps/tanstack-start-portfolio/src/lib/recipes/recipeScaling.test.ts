import { describe, expect, it } from 'vite-plus/test';
import { resolveIngredientTokens, resolveInstructionBlocks, scaleAmount } from './recipeScaling';

describe('scaleAmount', () => {
  it('scales single values', () => {
    expect(scaleAmount('75', 0.5)).toBe('37.5');
  });
  it('preserves both range endpoints', () => {
    expect(scaleAmount('250–300', 0.5)).toBe('125–150');
    expect(scaleAmount('0–1', 0.5)).toBe('0–0.5');
  });
  it('handles fractions', () => {
    expect(scaleAmount('1/2', 2)).toBe('1');
    expect(scaleAmount('1 1/2', 2)).toBe('3');
    expect(scaleAmount('½', 4)).toBe('2');
  });
  it('keeps non-numeric text and avoids drift at factor 1', () => {
    expect(scaleAmount('a pinch', 2)).toBe('a pinch');
    expect(scaleAmount('33.333', 1)).toBe('33.333');
    expect(scaleAmount(null, 2)).toBe('');
  });
});

describe('resolveIngredientTokens', () => {
  const ingredients = [
    { ingredient: 'egg', amount: '4', unit: 'pcs' },
    { ingredient: 'sugar', amount: '75', unit: 'g' },
  ];
  it('resolves and scales matched tokens', () => {
    expect(
      resolveIngredientTokens('whisk {{egg}} and {{ingredient:sugar}}', ingredients, 0.5),
    ).toBe('whisk 2 pcs egg and 37.5 g sugar');
  });
  it('falls back to the bare name for unmatched tokens', () => {
    expect(resolveIngredientTokens('add {{sour cream}}', ingredients)).toBe('add sour cream');
  });
});

describe('resolveInstructionBlocks', () => {
  it('resolves tokens split across spans', () => {
    const blocks = [
      {
        _type: 'block',
        children: [
          { _type: 'span', text: 'mix {{su' },
          { _type: 'span', text: 'gar}}' },
        ],
      },
    ];
    const [block] = resolveInstructionBlocks(blocks, [
      { ingredient: 'sugar', amount: '75', unit: 'g' },
    ]);
    expect(block.children).toEqual([{ _type: 'span', text: 'mix 75 g sugar' }]);
  });
});
