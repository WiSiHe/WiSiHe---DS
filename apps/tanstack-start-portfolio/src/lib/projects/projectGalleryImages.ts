export type ProjectGalleryImage = {
  _key?: string;
  asset?: { _ref?: string };
  alt?: string | null;
  lqip?: string | null;
  aspectRatio?: number | null;
};

export const PROJECT_GALLERY_VIEWPORT_HEIGHT = 'h-[clamp(280px,62vh,720px)]';

export function dedupeProjectGalleryImages(images: ProjectGalleryImage[]): ProjectGalleryImage[] {
  const seen = new Set<string>();

  return images.filter(img => {
    const ref = img?.asset?._ref;
    if (!ref) return true;
    if (seen.has(ref)) return false;
    seen.add(ref);
    return true;
  });
}

export function collectProjectGalleryImages(
  image: ProjectGalleryImage | null | undefined,
  extraImages: ProjectGalleryImage[] | null | undefined,
): ProjectGalleryImage[] {
  const extras = extraImages ?? [];
  const combined = (image ? [image, ...extras] : extras).filter(Boolean) as ProjectGalleryImage[];
  return dedupeProjectGalleryImages(combined);
}

export function getProjectGalleryImageKey(img: ProjectGalleryImage, index: number): string {
  if (img._key) return img._key;
  return `slide-${index}-${img?.asset?._ref ?? 'unknown'}`;
}
