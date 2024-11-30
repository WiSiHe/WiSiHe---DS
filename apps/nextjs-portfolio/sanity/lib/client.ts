import { createClient } from 'next-sanity';

import {
  apiVersion,
  dataset,
  projectId,
  studioUrl,
  writeToken,
} from '@/sanity/lib/api';

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
  token: writeToken,
  stega: {
    studioUrl,
    // logger: console,
    filter: (props) => {
      if (props.sourcePath.at(-1) === 'title') {
        return true;
      }

      return props.filterDefault(props);
    },
  },
});
