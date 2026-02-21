import { defineWisiheBadgeElement, WisiheBadgeElement } from './badge/WisiheBadge';
import { defineWisiheButtonElement, WisiheButtonElement } from './button/WisiheButton';

export * from './button/WisiheButton';
export * from './badge/WisiheBadge';

export function registerWisiheWebComponents(): void {
  defineWisiheButtonElement(WisiheButtonElement.tagName);
  defineWisiheBadgeElement(WisiheBadgeElement.tagName);
}
