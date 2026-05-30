import blockContent from './blockContent';
import painting from './painting';
import post from './post';
import presentation, {
  contentSlideType,
  exampleType,
  mediaType,
  metricType,
  separatorSlideType,
  sourceType,
  titleSlideType,
  toolType,
} from './presentation';
import presentationCategory from './presentationCategory';
import project from './project';
import recipe from './recipe';
import { redirectType } from './redirectType';
import { seoType } from './seoType';
import home from './singletons/home';
import settings from './singletons/settings';
import { socialType } from './socialType';
import { tag } from './tag';
import video from './video';

export const schemaTypes = [
  home,
  settings,
  painting,
  post,
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
