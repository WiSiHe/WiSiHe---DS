import { getCliClient } from 'sanity/cli';

/** Canonical tag id when duplicate documents share the same name. */
const MERGE_DUPLICATE_TAGS: Record<string, string> = {
  '4e7db5c6-f2af-424b-9d0b-943d72215153': '149d60c2-5962-41c9-89d8-41dac437a544', // Turborepo
};

/** Merge alias tags into a canonical tag document. */
const MERGE_ALIASES: Record<string, string> = {
  '26ba7cc9-ddf2-4665-815a-d51f50c2dfdd': '2129ce23-3d8f-4ded-b901-f014e2388373', // a11y -> Accessibility
};

/** Rename tag documents to consistent casing/spelling. */
const RENAME_TAGS: Record<string, string> = {
  '970fb442-fa7c-42bb-8cd7-a20bcdbc6f4c': 'TypeScript',
  '65851e27-7ec4-4b54-b4c2-1d0602bc3fbb': 'JavaScript',
};

const FEATURED_TAG_NAMES = [
  'React',
  'NextJS',
  'TailwindCSS',
  'Design',
  'Game',
  'Designsystem',
  'Sanity',
  'ThreeJS',
  'Accessibility',
  'Wordpress',
  'Unity',
  'Hackathon',
];

async function replaceTagOnProjects(
  client: Awaited<ReturnType<typeof getCliClient>>,
  fromId: string,
  toId: string,
) {
  const projects = await client.fetch<Array<{ _id: string; tags?: Array<{ _ref: string }> }>>(
    `*[_type == "project" && references($fromId)]{ _id, tags }`,
    { fromId },
  );

  for (const project of projects) {
    if (!project.tags?.length) continue;
    const nextTags = project.tags.map(tag => (tag._ref === fromId ? { ...tag, _ref: toId } : tag));
    const unique = nextTags.filter(
      (tag, index, arr) => arr.findIndex(t => t._ref === tag._ref) === index,
    );
    await client.patch(project._id).set({ tags: unique }).commit({ autoGenerateArrayKeys: true });
  }
}

async function main() {
  const client = await getCliClient({ apiVersion: '2024-10-28' });

  for (const [fromId, toId] of Object.entries({ ...MERGE_DUPLICATE_TAGS, ...MERGE_ALIASES })) {
    await replaceTagOnProjects(client, fromId, toId);
    await client.delete(fromId);
    console.log(`Merged tag ${fromId} -> ${toId}`);
  }

  for (const [tagId, name] of Object.entries(RENAME_TAGS)) {
    await client.patch(tagId).set({ name }).commit();
    console.log(`Renamed tag ${tagId} to ${name}`);
  }

  const featuredIds = await client.fetch<string[]>(`*[_type == "tag" && name in $names]._id`, {
    names: FEATURED_TAG_NAMES,
  });
  const allFeaturedIds = [...new Set(featuredIds)];

  for (const tagId of allFeaturedIds) {
    await client.patch(tagId).set({ isFeatured: true }).commit();
  }

  console.log(`Marked ${allFeaturedIds.length} tags as featured for project filters.`);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
