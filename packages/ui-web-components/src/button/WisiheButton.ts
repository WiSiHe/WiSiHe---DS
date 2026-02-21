export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonType = 'button' | 'submit' | 'reset';

const VALID_VARIANTS: readonly ButtonVariant[] = ['primary', 'secondary', 'ghost', 'danger'];
const VALID_SIZES: readonly ButtonSize[] = ['sm', 'md', 'lg'];
const VALID_TYPES: readonly ButtonType[] = ['button', 'submit', 'reset'];

const STYLES = `
:host {
  display: inline-flex;
  vertical-align: middle;
}

button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: 0.125rem;
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
  outline: 2px solid var(--color-accent, #2563eb);
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
  background-color: var(--color-accent, #2563eb);
  color: var(--color-accent-contrast, #ffffff);
  border-color: transparent;
}

button.variant-primary:hover:not(:disabled) {
  background-color: var(--color-accent-hover, #1d4ed8);
}

button.variant-secondary {
  background-color: var(--color-surface, #ffffff);
  color: var(--color-foreground, #111827);
  border-color: var(--color-border, #d1d5db);
}

button.variant-secondary:hover:not(:disabled) {
  background-color: var(--color-surface-hover, #f3f4f6);
}

button.variant-ghost {
  background-color: transparent;
  color: var(--color-accent, #2563eb);
  border-color: transparent;
}

button.variant-ghost:hover:not(:disabled) {
  background-color: var(--color-accent-subtle, #dbeafe);
}

button.variant-danger {
  background-color: var(--color-danger, #dc2626);
  color: var(--color-danger-contrast, #ffffff);
  border-color: transparent;
}

button.variant-danger:hover:not(:disabled) {
  background-color: var(--color-danger-text, #b91c1c);
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

function parseVariant(value: string | null): ButtonVariant {
  return VALID_VARIANTS.includes(value as ButtonVariant) ? (value as ButtonVariant) : 'primary';
}

function parseSize(value: string | null): ButtonSize {
  return VALID_SIZES.includes(value as ButtonSize) ? (value as ButtonSize) : 'md';
}

function parseType(value: string | null): ButtonType {
  return VALID_TYPES.includes(value as ButtonType) ? (value as ButtonType) : 'button';
}

export class WisiheButtonElement extends HTMLElement {
  static readonly tagName = 'wisihe-button';

  static get observedAttributes(): string[] {
    return ['variant', 'size', 'loading', 'full-width', 'disabled', 'type'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  get variant(): ButtonVariant {
    return parseVariant(this.getAttribute('variant'));
  }

  set variant(value: ButtonVariant) {
    this.setAttribute('variant', value);
  }

  get size(): ButtonSize {
    return parseSize(this.getAttribute('size'));
  }

  set size(value: ButtonSize) {
    this.setAttribute('size', value);
  }

  get type(): ButtonType {
    return parseType(this.getAttribute('type'));
  }

  set type(value: ButtonType) {
    this.setAttribute('type', value);
  }

  get loading(): boolean {
    return this.hasAttribute('loading');
  }

  set loading(value: boolean) {
    this.toggleAttribute('loading', value);
  }

  get fullWidth(): boolean {
    return this.hasAttribute('full-width');
  }

  set fullWidth(value: boolean) {
    this.toggleAttribute('full-width', value);
  }

  get disabled(): boolean {
    return this.hasAttribute('disabled');
  }

  set disabled(value: boolean) {
    this.toggleAttribute('disabled', value);
  }

  connectedCallback(): void {
    this.render();
  }

  attributeChangedCallback(): void {
    this.render();
  }

  private render(): void {
    if (!this.shadowRoot) {
      return;
    }

    const classNames = ['variant-' + this.variant, 'size-' + this.size];
    if (this.fullWidth) {
      classNames.push('full-width');
    }

    const isDisabled = this.disabled || this.loading;
    const spinnerMarkup = this.loading ? '<span class="spinner" aria-hidden="true"></span>' : '';

    this.shadowRoot.innerHTML = `
      <style>${STYLES}</style>
      <button
        class="${classNames.join(' ')}"
        type="${this.type}"
        ${isDisabled ? 'disabled' : ''}
        aria-busy="${this.loading ? 'true' : 'false'}"
      >
        ${spinnerMarkup}
        <slot></slot>
      </button>
    `;
  }
}

export function defineWisiheButtonElement(tagName = WisiheButtonElement.tagName): void {
  if (typeof customElements === 'undefined') {
    return;
  }

  if (!customElements.get(tagName)) {
    customElements.define(tagName, WisiheButtonElement);
  }
}
