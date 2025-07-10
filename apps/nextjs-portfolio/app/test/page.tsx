import { sanityFetch } from '@/sanity/lib/live';
import { getAllPaintingsandTags } from '@/sanity/lib/queries';
import { GetAllPaintingsandTagsResult } from '@/sanity.types';

export default async function TestPage() {
  const result = await sanityFetch({
    query: getAllPaintingsandTags,
  });

  const paintings = result.data?.paintings || [];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug: All Paintings and Tags</h1>
      <div className="space-y-4">
        {paintings?.map((painting: GetAllPaintingsandTagsResult['paintings'][0]) => (
          <div key={painting._id} className="border p-4 rounded">
            <h2 className="font-semibold">{painting.title}</h2>
            <p className="text-sm text-gray-600">
              Tags: {painting.tagsV2?.map(t => t.name).join(', ') || 'No tags'}
            </p>
            <div className="mt-2">
              <p className="text-xs text-gray-500">Raw tags data:</p>
              <pre className="text-xs bg-gray-100 p-2 rounded">
                {JSON.stringify(painting.tagsV2, null, 2)}
              </pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
