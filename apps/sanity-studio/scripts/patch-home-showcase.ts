import { getCliClient } from 'sanity/cli';
import {
  HOME_SHOWCASE_PAINTING_IDS,
  HOME_SHOWCASE_PROJECT_IDS,
  toSanityReferences,
} from './homeShowcaseCuration';

async function main() {
  const client = await getCliClient({ apiVersion: '2024-10-28' });

  const home = await client.fetch<{
    sections?: Array<{ _type: string; _key: string }>;
  } | null>(`*[_id == "home"][0]{ sections[]{ _type, _key } }`);

  if (!home?.sections?.length) {
    throw new Error('Home document or sections array not found');
  }

  const projectsKey = home.sections.find(section => section._type === 'homeProjectsSection')?._key;
  const paintingsKey = home.sections.find(
    section => section._type === 'homePaintingsSection',
  )?._key;

  if (!projectsKey || !paintingsKey) {
    throw new Error('Missing homeProjectsSection or homePaintingsSection in home.sections');
  }

  const showcaseProjects = toSanityReferences(HOME_SHOWCASE_PROJECT_IDS, 'showcase-project');
  const showcasePaintings = toSanityReferences(HOME_SHOWCASE_PAINTING_IDS, 'showcase-painting');

  await client
    .patch('home')
    .set({
      [`sections[_key=="${projectsKey}"].showcaseProjects`]: showcaseProjects,
      [`sections[_key=="${paintingsKey}"].showcasePaintings`]: showcasePaintings,
    })
    .commit({ autoGenerateArrayKeys: true });

  const [projectNames, paintingTitles] = await Promise.all([
    client.fetch<string[]>(`*[_id in $ids].name`, { ids: [...HOME_SHOWCASE_PROJECT_IDS] }),
    client.fetch<string[]>(`*[_id in $ids].title`, { ids: [...HOME_SHOWCASE_PAINTING_IDS] }),
  ]);

  console.log('Updated home showcase projects:', projectNames.join(', '));
  console.log('Updated home showcase paintings:', paintingTitles.join(', '));
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
