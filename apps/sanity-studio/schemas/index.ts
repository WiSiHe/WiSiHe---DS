import home from './singletons/home';
import settings from './singletons/settings';
import blockContent from './blockContent';

import project from './project';
import { tag } from './tag';
import video from './video';
import { seoType } from './seoType';
import { redirectType } from './redirectType';
import { socialType } from './socialType';
import painting from './painting';
import recipe from './recipe';
import presentation, {
  sourceType,
  toolType,
  exampleType,
  metricType,
  mediaType,
  contentSlideType,
  titleSlideType,
  separatorSlideType,
} from './presentation';
import presentationCategory from './presentationCategory';

export const schemaTypes = [
  home,
  settings,
  painting,
  project,
  video,
  tag,
  blockContent,
  seoType,
  redirectType,
  socialType,
  recipe,
  // Presentation schema and supporting types
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
