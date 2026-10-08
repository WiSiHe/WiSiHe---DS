/**
 * Direct schema generator using tsx + Sanity's internal tools.
 * Bypasses the CLI's broken module resolution in this monorepo.
 */
import { writeFileSync } from 'node:fs';
import { createSchema, type SchemaTypeDefinition } from 'sanity';

// Import all schema types
import blockContent from './schemas/blockContent';
import blockContentMinimal from './schemas/blockContentMinimal';
import { homePageSectionTypes } from './schemas/objects/homePageSections';
import homeSectionIntro from './schemas/objects/homeSectionIntro';
import painting from './schemas/painting';
import post from './schemas/post';
import presentation, {
  contentSlideType,
  exampleType,
  mediaType,
  metricType,
  separatorSlideType,
  sourceType,
  titleSlideType,
  toolType,
} from './schemas/presentation';
import presentationCategory from './schemas/presentationCategory';
import project from './schemas/project';
import recipe from './schemas/recipe';
import { redirectType } from './schemas/redirectType';
import { seoType } from './schemas/seoType';
import about from './schemas/singletons/about';
import home from './schemas/singletons/home';
import settings from './schemas/singletons/settings';
import { socialType } from './schemas/socialType';
import { tag } from './schemas/tag';
import video from './schemas/video';

const schemaTypes = [
  home,
  settings,
  about,
  homeSectionIntro,
  ...homePageSectionTypes,
  painting,
  post,
  project,
  video,
  tag,
  blockContent,
  blockContentMinimal,
  seoType,
  redirectType,
  socialType,
  recipe,
  presentationCategory,
  sourceType,
  toolType,
  exampleType,
  metricType,
  mediaType,
  contentSlideType,
  titleSlideType,
  separatorSlideType,
  presentation,
];

const compiled = createSchema({ name: 'default', types: schemaTypes as SchemaTypeDefinition[] });

// Access the internal schema representation
type InternalType = { name: string };
const internal = compiled as unknown as {
  _schema?: { types?: InternalType[] };
  _original?: { types?: InternalType[] };
  _typeMap?: Record<string, InternalType>;
};
const allTypes: InternalType[] =
  internal._schema?.types ?? internal._original?.types ?? Object.values(internal._typeMap ?? {});

writeFileSync('schema.json', JSON.stringify(allTypes, null, 2));
const custom = allTypes.filter(
  (t: InternalType) => !t.name.startsWith('sanity.') && !['geopoint', 'slug'].includes(t.name),
);
console.log(`✅ schema.json written: ${allTypes.length} total, ${custom.length} custom`);
console.log('   Custom types:', custom.map((t: InternalType) => t.name).join(', '));
