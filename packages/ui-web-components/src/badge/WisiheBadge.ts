import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

export type BadgeVariant = 'default' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline';
export type BadgeSize = 'sm' | 'md' | 'lg';

const VALID_VARIANTS: readonly BadgeVariant[] = [
  'default',
  'secondary',
  'success',
  'warning',
  'danger',
  'outline',
];
const VALID_SIZES: readonly BadgeSize[] = ['sm', 'md', 'lg'];

/**
 * Wisihe Badge Component
 *
 * @slot - The badge content.
 */
@customElement('wisihe-badge')
export class WisiheBadgeElement extends LitElement {
  static readonly tagName = 'wisihe-badge';

  @property({ type: String }) variant: BadgeVariant = 'default';
  @property({ type: String }) size: BadgeSize = 'md';

  static styles = css`
    :host {
      display: inline-flex;
      vertical-align: middle;
    }

    span {
      display: inline-flex;
      align-items: center;
      border-radius: var(--size-radius-full-val, 9999px);
      border: 1px solid transparent;
      font-family: inherit;
      font-weight: 600;
      line-height: 1.1;
      transition:
        background-color 150ms ease,
        color 150ms ease,
        border-color 150ms ease;
    }

    span.size-sm {
      font-size: 0.75rem;
      padding: 0.125rem 0.5rem;
    }

    span.size-md {
      font-size: 0.75rem;
      padding: 0.125rem 0.625rem;
    }

    span.size-lg {
      font-size: 0.875rem;
      padding: 0.25rem 0.75rem;
    }

    span.variant-default {
      background-color: var(--color-accent-val, #db006d);
      color: var(--color-accent-contrast-val, #ffffff);
      border-color: transparent;
    }

    span.variant-secondary {
      background-color: var(--color-surface-hover-val, #f5f5f5);
      color: var(--color-foreground-val, #171717);
      border-color: transparent;
    }

    span.variant-success {
      background-color: var(--color-success-val, #16a34a);
      color: var(--color-success-contrast-val, #ffffff);
      border-color: transparent;
    }

    span.variant-warning {
      background-color: var(--color-warning-val, #d97706);
      color: var(--color-warning-contrast-val, #ffffff);
      border-color: transparent;
    }

    span.variant-danger {
      background-color: var(--color-danger-val, #dc2626);
      color: var(--color-danger-contrast-val, #ffffff);
      border-color: transparent;
    }

    span.variant-outline {
      background-color: transparent;
      color: var(--color-foreground-val, #171717);
      border-color: var(--color-border-val, #e5e5e5);
    }
  `;

  render() {
    const validVariant = VALID_VARIANTS.includes(this.variant) ? this.variant : 'default';
    const validSize = VALID_SIZES.includes(this.size) ? this.size : 'md';

    const classes = {
      [`variant-${validVariant}`]: true,
      [`size-${validSize}`]: true,
    };

    return html`
      <span class=${classMap(classes)}>
        <slot></slot>
      </span>
    `;
  }
}

export function defineWisiheBadgeElement(tagName = WisiheBadgeElement.tagName): void {
  if (typeof customElements === 'undefined') {
    return;
  }

  if (!customElements.get(tagName)) {
    customElements.define(tagName, WisiheBadgeElement);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'wisihe-badge': WisiheBadgeElement;
  }
}
