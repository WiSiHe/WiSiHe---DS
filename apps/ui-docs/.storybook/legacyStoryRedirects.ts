import { resolveLegacyStoryId } from '../../../packages/ui-react/src/storybook/titles';

export function redirectLegacyStorybookUrl(): void {
  if (typeof window === 'undefined') return;

  const params = new URLSearchParams(window.location.search);
  const path = params.get('path');
  const storyId = path?.startsWith('/story/') ? path.slice('/story/'.length) : params.get('id');
  if (!storyId) return;

  const target = resolveLegacyStoryId(storyId);
  if (!target || target === storyId) return;

  if (path?.startsWith('/story/')) {
    params.set('path', `/story/${target}`);
  } else {
    params.set('id', target);
  }

  window.location.replace(`${window.location.pathname}?${params.toString()}`);
}
