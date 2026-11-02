import handler, { createServerEntry } from '@tanstack/react-start/server-entry';
import { lowPriorityModulePreloads } from './lib/lowPriorityModulePreloads';
import { cmsRedirectResponse } from './lib/redirects';

export default createServerEntry({
  async fetch(request, opts) {
    const redirect = await cmsRedirectResponse(request);
    if (redirect) return redirect;
    return lowPriorityModulePreloads(await handler.fetch(request, opts));
  },
});
