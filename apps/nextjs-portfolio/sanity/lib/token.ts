import 'server-only';
import { sanityReadToken } from '@/lib/env';

export const token = sanityReadToken();

if (!token) {
  throw new Error('Missing SANITY_API_READ_TOKEN (or legacy NEXT_PUBLIC_SANITY_API_READ_TOKEN)');
}
