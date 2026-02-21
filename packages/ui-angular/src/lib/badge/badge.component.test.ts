import { describe, expect, it } from 'vitest';
import { BadgeComponent } from './badge.component';

describe('BadgeComponent', () => {
  it('defaults to a medium default badge', () => {
    const component = new BadgeComponent();

    expect(component.variant).toBe('default');
    expect(component.size).toBe('md');
  });

  it('builds classes for variant and size', () => {
    const component = new BadgeComponent();
    component.variant = 'success';
    component.size = 'lg';

    const classes = component.classes;
    expect(classes).toContain('bg-success');
    expect(classes).toContain('text-sm');
  });
});
