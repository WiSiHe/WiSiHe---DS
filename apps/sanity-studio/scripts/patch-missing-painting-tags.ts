import { getCliClient } from 'sanity/cli';

const PAINTING_TAGS: Record<string, string[]> = {
  '41f71e18-ee57-4afe-8422-6ac5465207e8': [
    'd62b8008-3aca-4114-a5d3-13d0301a4f2b', // Concept Art
    'fadabf1d-5c21-4dc3-b32e-44e971c4ef90', // Fantasy
    '9e3f8c2a-6dbc-411f-88a5-a52e783eb0a1', // Landscape
  ],
  '5f082aaf-ac7f-47a8-882d-892033724441': [
    '0615d553-3951-4e34-aaf8-9b4ea8ba1103', // Horror
    'fadabf1d-5c21-4dc3-b32e-44e971c4ef90', // Fantasy
    '9e3f8c2a-6dbc-411f-88a5-a52e783eb0a1', // Landscape
  ],
};

async function main() {
  const client = await getCliClient({ apiVersion: '2024-10-28' });

  for (const [paintingId, tagIds] of Object.entries(PAINTING_TAGS)) {
    await client
      .patch(paintingId)
      .set({
        tagsV2: tagIds.map((ref, index) => ({
          _key: `tag-${index + 1}`,
          _type: 'reference',
          _ref: ref,
        })),
      })
      .commit({ autoGenerateArrayKeys: true });

    const title = await client.fetch<string>(`*[_id == $id][0].title`, { id: paintingId });
    console.log(`Tagged "${title}" with ${tagIds.length} tags.`);
  }
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
