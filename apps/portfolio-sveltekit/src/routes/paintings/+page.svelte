<script>
	import { urlFor } from '$lib/utils/image';
	import { fade, fly } from 'svelte/transition';

	/** @type {import('./$types').PageData} */
	export let data;

	const { paintings = [] } = data;
</script>

<section>
	<h1 class="text-blue-800">Paintings</h1>
	<h2>All paintings here</h2>
	<section class="grid grid-cols-12 gap-4">
		{#each paintings as painting (painting.slug)}
			<article
				class="relative col-span-12 rounded overflow-clip sm:col-span-6 md:col-span-4 lg:col-span-3"
				in:fly={{ y: 200, duration: 2000 }}
				out:fade
			>
				<a href={`/paintings/${painting.slug}`}>
					<div class="absolute bottom-0 left-0 right-0 z-10 p-2 text-white bg-dark/40">
						<p>{painting.title}</p>
					</div>
					<img
						src={urlFor(painting.image).width(400).height(400).url()}
						alt={painting.title}
						class="w-full rounded"
					/>
				</a>
			</article>
		{/each}
	</section>
</section>
