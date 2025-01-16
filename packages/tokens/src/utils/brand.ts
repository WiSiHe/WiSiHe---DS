import type { Brand } from './types';
import { BRANDS } from './types';

/**
 * Retrieves the brand name from a given collection name.
 *
 * This function takes a collection name, converts it to lowercase, and checks if it includes any of the known brand names.
 * If a match is found, the corresponding brand name is returned. If no match is found, it returns null.
 *
 * @param collectionName - The name of the collection to search for a brand.
 * @returns The brand name if found, otherwise null.
 */
export function getBrandFromCollectionName(collectionName: string): Brand | null {
  const lowerName = collectionName.toLowerCase();
  for (const brand of BRANDS) {
    if (lowerName.includes(brand.toLowerCase())) {
      return brand;
    }
  }
  return null;
}
