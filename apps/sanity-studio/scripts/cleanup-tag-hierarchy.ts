import { getCliClient } from 'sanity/cli';

/** Remove legacy hierarchy fields after flattening the tag schema. */
async function main() {
  const client = await getCliClient({ apiVersion: '2024-10-28' });

  const tags = await client.fetch<Array<{ _id: string }>>(
    `*[_type == "tag" && (defined(parent) || defined(children) || isRoot == true)]{ _id }`,
  );

  if (tags.length === 0) {
    console.log('No legacy tag hierarchy fields to clean up.');
    return;
  }

  for (const tag of tags) {
    await client
      .patch(tag._id)
      .unset(['parent', 'children', 'isRoot'])
      .commit({ autoGenerateArrayKeys: true });
    console.log(`Cleaned hierarchy fields on ${tag._id}`);
  }

  console.log(`Removed hierarchy fields from ${tags.length} tag(s).`);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
