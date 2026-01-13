import { ThreeDSlideDeckClient } from './ThreeDSlideDeckClient';
import { fetchPresentationSlides } from '@/sanity/lib/fetchPresentations';
import { presentationSlides as fallbackSlides } from './presentationSlides';

// The slug of the presentation in Sanity for the 3D page
const PRESENTATION_SLUG = 'houston-we-re-coding-3d';

export default async function ThreeDSlideDeck() {
  // Fetch presentation slides from Sanity
  const sanitySlides = await fetchPresentationSlides(PRESENTATION_SLUG);

  // Use Sanity slides if available, otherwise fall back to static slides
  const slides = sanitySlides && sanitySlides.length > 0 ? sanitySlides : fallbackSlides;

  return <ThreeDSlideDeckClient slides={slides} />;
}
