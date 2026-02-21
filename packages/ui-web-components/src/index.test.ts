import { describe, expect, it } from 'vitest';
import { registerWisiheWebComponents } from './index';

registerWisiheWebComponents();

describe('web components registration', () => {
  it('registers default elements safely', () => {
    registerWisiheWebComponents();
    registerWisiheWebComponents();

    expect(customElements.get('wisihe-button')).toBeDefined();
    expect(customElements.get('wisihe-badge')).toBeDefined();
  });

  it('renders a loading danger button', () => {
    const element = document.createElement('wisihe-button');
    element.textContent = 'Delete';
    element.setAttribute('variant', 'danger');
    element.setAttribute('size', 'lg');
    element.setAttribute('loading', '');
    document.body.appendChild(element);

    const button = element.shadowRoot?.querySelector('button');
    expect(button).toBeTruthy();
    expect(button?.className).toContain('variant-danger');
    expect(button?.className).toContain('size-lg');
    expect(button?.hasAttribute('disabled')).toBe(true);
    expect(button?.querySelector('.spinner')).toBeTruthy();

    element.remove();
  });

  it('renders a success badge', () => {
    const element = document.createElement('wisihe-badge');
    element.textContent = 'Success';
    element.setAttribute('variant', 'success');
    element.setAttribute('size', 'sm');
    document.body.appendChild(element);

    const badge = element.shadowRoot?.querySelector('span');
    expect(badge).toBeTruthy();
    expect(badge?.className).toContain('variant-success');
    expect(badge?.className).toContain('size-sm');

    element.remove();
  });
});
