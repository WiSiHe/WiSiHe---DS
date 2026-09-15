import { draftMode } from 'next/headers';
import { VisualEditing } from 'next-sanity/visual-editing';
import DraftModeToast from './DraftModeToast';

/**
 * Isolated draft mode check inside a Suspense boundary so that reading cookies
 * does not opt the entire RootLayout into dynamic rendering for static/ISR pages.
 */
export async function DraftModeBridge() {
  const { isEnabled } = await draftMode();

  if (!isEnabled) return null;

  return (
    <>
      <DraftModeToast />
      <VisualEditing />
    </>
  );
}
