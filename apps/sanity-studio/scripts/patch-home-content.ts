import { getCliClient } from 'sanity/cli';

async function main() {
  const client = await getCliClient({ apiVersion: '2024-10-28' });

  const overview = [
    {
      _key: 'hero-overview',
      _type: 'block',
      style: 'normal',
      markDefs: [],
      children: [
        {
          _key: 'hero-overview-span',
          _type: 'span',
          marks: [],
          text: "I'm a design engineer, painter and maker. Explore paintings, projects, and experiments from my portfolio.",
        },
      ],
    },
  ];

  const projectsDescription = [
    {
      _key: 'featured-projects-desc',
      _type: 'block',
      style: 'normal',
      markDefs: [],
      children: [
        {
          _key: 'featured-projects-desc-span',
          _type: 'span',
          marks: [],
          text: 'A curated gallery of engineering and design projects built with modern web technologies.',
        },
      ],
    },
  ];

  const showcasePaintingIds = [
    '15c0cb16-8ea2-4815-93a0-6458805c532e',
    '2a908178-99d4-462d-91dd-6a1e1c113929',
    '53fb0dc5-a077-424e-aa18-d3a6846d8290',
    '910a9574-ccf3-4eee-ac93-546621cc87cb',
    '5f082aaf-ac7f-47a8-882d-892033724441',
    '778d2873-7355-4b79-aa8f-be986196aece',
    'cd089f13-0ac0-499f-abe9-462700761c5c',
    'bb9c484a-a74a-4a24-8881-5cd18fa7543e',
    '75de41a2-ece0-4409-8657-e0a70ac84a3c',
    '72da3f07-42bf-4448-a9b8-dfba653ca82f',
  ];

  await client
    .patch('home')
    .set({ overview, projectsDescription })
    .commit({ autoGenerateArrayKeys: true });

  for (const paintingId of showcasePaintingIds) {
    await client.patch(paintingId).set({ isFeatured: true }).commit();
  }

  console.log(
    `Updated home copy and marked ${showcasePaintingIds.length} showcase paintings as featured.`,
  );
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
