import { getCliClient } from 'sanity/cli';

/** One DS flagship + varied dev/3D work — avoid two design-system projects on the landing page. */
const SHOWCASE_PROJECT_IDS = [
  '7c2e6663-3d89-4463-b807-45402c101fb7', // Bane NOR | Design System Lead
  '037cce21-55e4-44be-beb1-17991a33f877', // 3D Black Hole
  '030150dd-650c-48ae-9d85-a7d1e9401f9d', // Anton Sport Online Retail
];

async function main() {
  const client = await getCliClient({ apiVersion: '2024-10-28' });

  await client
    .patch('home')
    .set({
      showcaseProjects: SHOWCASE_PROJECT_IDS.map((ref, index) => ({
        _key: `showcase-project-${index + 1}`,
        _type: 'reference',
        _ref: ref,
      })),
    })
    .commit({ autoGenerateArrayKeys: true });

  const names = await client.fetch<string[]>(`*[_id in $ids].name`, { ids: SHOWCASE_PROJECT_IDS });
  console.log(`Updated home showcase projects: ${names.join(', ')}`);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
