import home from './singletons/home'
import settings from './singletons/settings'
import blockContent from './documents/blockContent'

import painting from './painting'
import project from './project'
import {tag} from './tag'
import video from './video'
import {seoType} from './seoType'
import {redirectType} from './redirectType'
import {socialType} from './socialType'

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
]
