/**
 * Homepage showcase curation — featured projects + paintings for hero collage and sections.
 * Run via patch-home-showcase.ts
 */

/** Enterprise DS, recent client work, e-commerce — no duplicate DS or old demos. */
export const HOME_SHOWCASE_PROJECT_IDS = [
  '7c2e6663-3d89-4463-b807-45402c101fb7', // Bane NOR | Design System Lead
  'd128c4e9-c0d3-4527-8b22-2ef792aa3421', // NoA Ignite | Website Performance Dashboard
  '03f8855c-bbfc-4933-a862-c49c0f8a47e4', // Project Babel | UE4 Adventure
] as const;

/** Recent work first, then strong classics — mix of formats for the gallery grid. */
export const HOME_SHOWCASE_PAINTING_IDS = [
  'ca6c4138-8d9b-4b78-af7c-a6100e6c7801', // Sigrid (2025)
  '0c633f7e-3e24-4d5f-9f12-d02eb9bd5e35', // Philosopher's Stone (2025)
  '6a738102-04c7-4e73-809c-807403973ee1', // To War (2025)
  'ca8ba227-cf68-409b-86cc-e7aa591f23ab', // Smirk (2024)
  '35cfb97f-ffcb-49fd-8462-78c6cc114d59', // Retro Space (2024)
  '53fb0dc5-a077-424e-aa18-d3a6846d8290', // Lille Torungen
  '910a9574-ccf3-4eee-ac93-546621cc87cb', // Stargazer
  'bb9c484a-a74a-4a24-8881-5cd18fa7543e', // Dread
  '72da3f07-42bf-4448-a9b8-dfba653ca82f', // Ghibli Clouds
  'cd089f13-0ac0-499f-abe9-462700761c5c', // Duckie's Kingdom
] as const;

export function toSanityReferences(ids: readonly string[], keyPrefix: string) {
  return ids.map((ref, index) => ({
    _key: `${keyPrefix}-${index + 1}`,
    _type: 'reference' as const,
    _ref: ref,
  }));
}
