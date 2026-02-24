import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonType = 'button' | 'submit' | 'reset';

const VALID_VARIANTS: readonly ButtonVariant[] = ['primary', 'secondary', 'ghost', 'danger'];
const VALID_SIZES: readonly ButtonSize[] = ['sm', 'md', 'lg'];
const VALID_TYPES: readonly ButtonType[] = ['button', 'submit', 'reset'];

/**
 * Wisihe Button Component
 *
 * @slot - The button content.
 */
@customElement('wisihe-button')
export class WisiheButtonElement extends LitElement {
  static readonly tagName = 'wisihe-button';

  @property({ type: String }) variant: ButtonVariant = 'primary';
  @property({ type: String }) size: ButtonSize = 'md';
  @property({ type: String }) type: ButtonType = 'button';
  @property({ type: Boolean }) loading = false;
  @property({ type: Boolean, attribute: 'full-width' }) fullWidth = false;
  @property({ type: Boolean }) disabled = false;

  static styles = css`
    :host {
      display: inline-flex;
      vertical-align: middle;
    }

    button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      border-radius: var(--size-radius-md-val, 0.125rem);
      border: 1px solid transparent;
      font-family: inherit;
      font-weight: 500;
      line-height: 1;
      white-space: nowrap;
      cursor: pointer;
      transition:
        background-color 150ms ease,
        color 150ms ease,
        border-color 150ms ease,
        opacity 150ms ease;
    }

    button:focus-visible {
      outline: 2px solid var(--color-accent-val, #db006d);
      outline-offset: 2px;
    }

    button:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }

    button.full-width {
      width: 100%;
    }

    button.size-sm {
      height: 2rem;
      padding: 0 0.75rem;
      font-size: 0.875rem;
    }

    button.size-md {
      height: 2.5rem;
      padding: 0 1rem;
      font-size: 1rem;
    }

    button.size-lg {
      height: 3rem;
      padding: 0 1.5rem;
      font-size: 1.125rem;
    }

    button.variant-primary {
      background-color: var(--color-accent-val, #db006d);
      color: var(--color-accent-contrast-val, #ffffff);
      border-color: transparent;
    }

    button.variant-primary:hover:not(:disabled) {
      background-color: var(--color-accent-hover-val, #b30059);
    }

    button.variant-secondary {
      background-color: var(--color-surface-val, #ffffff);
      color: var(--color-foreground-val, #171717);
      border-color: var(--color-border-val, #e5e5e5);
    }

    button.variant-secondary:hover:not(:disabled) {
      background-color: var(--color-surface-hover-val, #f5f5f5);
    }

    button.variant-ghost {
      background-color: transparent;
      color: var(--color-accent-text-val, #db006d);
      border-color: transparent;
    }

    button.variant-ghost:hover:not(:disabled) {
      background-color: var(--color-accent-subtle-val, #fdf2f8);
    }

    button.variant-danger {
      background-color: var(--color-danger-val, #dc2626);
      color: var(--color-danger-contrast-val, #ffffff);
      border-color: transparent;
    }

    button.variant-danger:hover:not(:disabled) {
      background-color: var(--color-scale-danger-base-hover-val, #b91c1c);
    }

    .spinner {
      width: 1rem;
      height: 1rem;
      border-radius: 9999px;
      border: 2px solid currentColor;
      border-top-color: transparent;
      animation: wisihe-button-spin 1s linear infinite;
    }

    @keyframes wisihe-button-spin {
      to {
        transform: rotate(360deg);
      }
    }
  `;

  render() {
    const validVariant = VALID_VARIANTS.includes(this.variant) ? this.variant : 'primary';
    const validSize = VALID_SIZES.includes(this.size) ? this.size : 'md';
    const validType = VALID_TYPES.includes(this.type) ? this.type : 'button';

    const classes = {
      [`variant-${validVariant}`]: true,
      [`size-${validSize}`]: true,
      'full-width': this.fullWidth,
    };

    const isDisabled = this.disabled || this.loading;

    return html`
      <button
        class=${classMap(classes)}
        type=${validType}
        ?disabled=${isDisabled}
        aria-busy=${this.loading ? 'true' : 'false'}
      >
        ${this.loading ? html`<span class="spinner" aria-hidden="true"></span>` : ''}
        <slot></slot>
      </button>
    `;
  }
}

// Keep the explicit definition function for side-effects if folks prefer to call it manually
export function defineWisiheButtonElement(tagName = WisiheButtonElement.tagName): void {
  if (typeof customElements === 'undefined') {
    return;
  }

  if (!customElements.get(tagName)) {
    customElements.define(tagName, WisiheButtonElement);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'wisihe-button': WisiheButtonElement;
  }
}
