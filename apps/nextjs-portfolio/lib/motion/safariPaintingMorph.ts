const STORAGE_KEY = 'wisihe:safari-painting-morph';

export type SafariPaintingMorphRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export type SafariPaintingMorphPayload = {
  title: string;
  imageSrc: string;
  rect: SafariPaintingMorphRect;
  borderRadius: number;
};

export function storeSafariPaintingMorph(payload: SafariPaintingMorphPayload): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // sessionStorage unavailable (private browsing, quota, etc.)
  }
}

export function consumeSafariPaintingMorph(title: string): SafariPaintingMorphPayload | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const payload = JSON.parse(raw) as SafariPaintingMorphPayload;
    sessionStorage.removeItem(STORAGE_KEY);

    if (payload.title !== title || !payload.imageSrc) return null;
    return payload;
  } catch {
    return null;
  }
}
