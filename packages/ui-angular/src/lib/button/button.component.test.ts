import '@angular/compiler';
import { describe, expect, it } from 'vitest';
import { ButtonComponent } from './button.component';

describe('ButtonComponent', () => {
  it('defaults to an enabled primary medium button', () => {
    const component = new ButtonComponent();

    expect(component.variant).toBe('primary');
    expect(component.size).toBe('md');
    expect(component.loading).toBe(false);
    expect(component.disabled).toBe(false);
    expect(component.isDisabled).toBe(false);
  });

  it('marks button as disabled when loading', () => {
    const component = new ButtonComponent();
    component.loading = true;

    expect(component.isDisabled).toBe(true);
  });

  it('builds classes for selected variants', () => {
    const component = new ButtonComponent();
    component.variant = 'danger';
    component.size = 'lg';

    const classes = component.classes;
    expect(classes).toContain('bg-danger');
    expect(classes).toContain('h-12');
  });
});
