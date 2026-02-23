import { defineWisiheBadgeElement, WisiheBadgeElement } from './badge/WisiheBadge';
import { defineWisiheButtonElement, WisiheButtonElement } from './button/WisiheButton';

export * from './badge/WisiheBadge';
// --- Atoms ---
export * from './button/WisiheButton';

export function registerWisiheWebComponents(): void {
  defineWisiheButtonElement(WisiheButtonElement.tagName);
  defineWisiheBadgeElement(WisiheBadgeElement.tagName);
}
