import { getCliClient } from 'sanity/cli';
import { HOME_SHOWCASE_PROJECT_IDS, toSanityReferences } from './homeShowcaseCuration';

async function main() {
  const client = await getCliClient({ apiVersion: '2024-10-28' });

  const projectsKey = await client.fetch<string | null>(
    `*[_id == "home"][0].sections[_type == "homeProjectsSection"][0]._key`,
  );

  if (!projectsKey) {
    throw new Error('homeProjectsSection not found on home document');
  }

  await client
    .patch('home')
    .set({
      [`sections[_key=="${projectsKey}"].showcaseProjects`]: toSanityReferences(
        HOME_SHOWCASE_PROJECT_IDS,
        'showcase-project',
      ),
    })
    .commit({ autoGenerateArrayKeys: true });

  const names = await client.fetch<string[]>(`*[_id in $ids].name`, {
    ids: [...HOME_SHOWCASE_PROJECT_IDS],
  });
  console.log(`Updated home showcase projects: ${names.join(', ')}`);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
