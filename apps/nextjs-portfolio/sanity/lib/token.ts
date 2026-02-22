import 'server-only';
import { readToken } from './api';

export const token = readToken;

if (!token) {
  throw new Error('Missing NEXT_PUBLIC_SANITY_API_READ_TOKEN');
}
