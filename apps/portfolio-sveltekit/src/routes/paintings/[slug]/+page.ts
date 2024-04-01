// import { dev } from '$app/environment';

// we don't need any JS on this page, though we'll load
// it in dev so that we get hot module replacement
// export const csr = dev;

// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
// export const prerender = true;

import { error } from '@sveltejs/kit';
import type { PageLoad } from '../../$types';
import { getPainting, getPost } from '$lib/utils/sanity';

export const ssr = false;

export const load = (async ({ params }) => {
	const { slug = '' } = params as { slug: string };
	if (!slug) throw error(404, 'Not found');

	// const post = await getPost(slug);
	const painting = await getPainting(slug);
	if (painting) return painting;

	throw error(404, 'Not found');
}) satisfies PageLoad;
