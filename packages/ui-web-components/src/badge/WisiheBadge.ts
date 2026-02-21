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

const STYLES = `
:host {
  display: inline-flex;
  vertical-align: middle;
}

span {
  display: inline-flex;
  align-items: center;
  border-radius: 9999px;
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
  background-color: var(--color-accent, #2563eb);
  color: var(--color-accent-contrast, #ffffff);
  border-color: transparent;
}

span.variant-secondary {
  background-color: var(--color-surface-hover, #f3f4f6);
  color: var(--color-foreground, #111827);
  border-color: transparent;
}

span.variant-success {
  background-color: var(--color-success, #16a34a);
  color: var(--color-success-contrast, #ffffff);
  border-color: transparent;
}

span.variant-warning {
  background-color: var(--color-warning, #d97706);
  color: var(--color-warning-contrast, #ffffff);
  border-color: transparent;
}

span.variant-danger {
  background-color: var(--color-danger, #dc2626);
  color: var(--color-danger-contrast, #ffffff);
  border-color: transparent;
}

span.variant-outline {
  background-color: transparent;
  color: var(--color-foreground, #111827);
  border-color: var(--color-border, #d1d5db);
}
`;

function parseVariant(value: string | null): BadgeVariant {
  return VALID_VARIANTS.includes(value as BadgeVariant) ? (value as BadgeVariant) : 'default';
}

function parseSize(value: string | null): BadgeSize {
  return VALID_SIZES.includes(value as BadgeSize) ? (value as BadgeSize) : 'md';
}

export class WisiheBadgeElement extends HTMLElement {
  static readonly tagName = 'wisihe-badge';

  static get observedAttributes(): string[] {
    return ['variant', 'size'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  get variant(): BadgeVariant {
    return parseVariant(this.getAttribute('variant'));
  }

  set variant(value: BadgeVariant) {
    this.setAttribute('variant', value);
  }

  get size(): BadgeSize {
    return parseSize(this.getAttribute('size'));
  }

  set size(value: BadgeSize) {
    this.setAttribute('size', value);
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

    this.shadowRoot.innerHTML = `
      <style>${STYLES}</style>
      <span class="variant-${this.variant} size-${this.size}">
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
