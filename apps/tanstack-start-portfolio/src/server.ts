import handler, { createServerEntry } from '@tanstack/react-start/server-entry';
import { lowPriorityModulePreloads } from './lib/lowPriorityModulePreloads';

export default createServerEntry({
  async fetch(request, opts) {
    return lowPriorityModulePreloads(await handler.fetch(request, opts));
  },
});
