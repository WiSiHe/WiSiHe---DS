import { getPaintings, getPosts } from '$lib/utils/sanity';
import { error } from '@sveltejs/kit';
import type { PageLoad } from '../$types';

export const ssr = false;

export const load = (async () => {

	const paintings = await getPaintings();

	if (paintings) {
		return { paintings };
	}

	throw error(404, 'Not found');
}) satisfies PageLoad;
