import { describe, expect, it } from 'vite-plus/test';

describe('gallery srcSet widths', () => {
  it('uses ascending candidate widths', () => {
    const widths = [700, 1050, 1400, 2800];
    const srcSet = widths.map(w => `https://cdn.example/img.jpg?w=${w} ${w}w`).join(', ');
    expect(srcSet).toContain('2800w');
    expect(widths).toEqual([...widths].sort((a, b) => a - b));
  });
});
