<script lang="ts">
	import { urlFor } from '$lib/utils/image';
	import type { PageData } from '../$types';

	export let data: PageData;
	console.log(data);
</script>

<section class="grid bg-stone-50 grid-cols-12 gap-4 items-start">
	<div class="col-span-8">
		<img
			src={urlFor(data.image).width(400).height(400).url()}
			alt={data.title}
			class="w-full rounded"
		/>
	</div>
	<div class="col-span-4 sticky top-10 p-4 bg-white drop-shadow">
		<h1 class="text-blue-800">{data.title}</h1>
		<p>{data.description}</p>
	</div>
</section>
