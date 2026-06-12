import { InfoOutlineIcon, WarningOutlineIcon } from '@sanity/icons';
import { Badge, Button, Card, Flex, Spinner, Stack, Text } from '@sanity/ui';
import { useCallback, useEffect, useState } from 'react';
import {
  PatchEvent,
  type StringInputProps,
  set,
  useClient,
  useFormCallbacks,
  useFormValue,
} from 'sanity';
import {
  buildPhotographyApplyPatches,
  extractPhotographyFileMetadata,
  fetchImageAssetMetadata,
  type SanityImageAssetRecord,
  summarizeAssetMetadata,
} from '../utils/photographyFileMetadata';

type ImageValue = {
  asset?: { _ref?: string };
};

export function PhotographyFileMetadataInput(_props: StringInputProps) {
  const client = useClient({ apiVersion: '2024-10-28' });
  const { onChange: patchDocument } = useFormCallbacks();
  const image = useFormValue(['image']) as ImageValue | undefined;
  const country = useFormValue(['country']) as string | undefined;
  const countryCode = useFormValue(['countryCode']) as string | undefined;
  const coordinates = useFormValue(['coordinates']);
  const capturedAt = useFormValue(['capturedAt']);
  const camera = useFormValue(['camera']);

  const assetRef = image?.asset?._ref;
  const [asset, setAsset] = useState<SanityImageAssetRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    if (!assetRef) {
      setAsset(null);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);
    setApplied(false);

    void fetchImageAssetMetadata(client, assetRef)
      .then(record => {
        if (!cancelled) setAsset(record);
      })
      .catch(err => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load file metadata');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [assetRef, client]);

  const summaryLines = summarizeAssetMetadata(asset);
  const extract = extractPhotographyFileMetadata(asset);
  const pendingPatches = buildPhotographyApplyPatches(extract, {
    existingCountry: country,
    existingCountryCode: countryCode,
    existingCoordinates: coordinates,
    existingCapturedAt: capturedAt as string | undefined,
    existingCamera: camera as string | undefined,
  });

  const applyMetadata = useCallback(
    (overwrite: boolean) => {
      const patches = buildPhotographyApplyPatches(extract, {
        existingCountry: country,
        existingCountryCode: countryCode,
        existingCoordinates: coordinates,
        existingCapturedAt: capturedAt as string | undefined,
        existingCamera: camera as string | undefined,
        overwrite,
      });

      if (patches.length === 0) {
        setError(
          'Nothing to apply from this file. Add GPS/EXIF to the image or set country for ISO code.',
        );
        return;
      }

      setError(null);
      patchDocument(PatchEvent.from(patches.map(p => set(p.value, [p.path]))));
      setApplied(true);
    },
    [capturedAt, camera, coordinates, country, countryCode, extract, patchDocument],
  );

  const hasGps = Boolean(extract.coordinates);
  const hasExif = Boolean(extract.capturedAt || extract.camera);
  const fieldAlreadySet = {
    coordinates: Boolean(coordinates),
    capturedAt: Boolean(capturedAt),
    camera: Boolean(camera),
    countryCode: Boolean(countryCode?.trim()),
  };

  return (
    <Card padding={4} radius={2} border shadow={1}>
      <Stack space={4}>
        <Flex align='center' gap={2}>
          <InfoOutlineIcon />
          <Text size={1} weight='semibold'>
            From uploaded file
          </Text>
          {loading ? (
            <Badge tone='primary'>
              <Flex align='center' gap={1}>
                <Spinner />
                <Text size={0}>Reading metadata…</Text>
              </Flex>
            </Badge>
          ) : null}
        </Flex>

        <Text size={1} muted>
          EXIF and GPS are extracted when the file contains them. Enable re-upload if you added
          metadata options after the original upload.
        </Text>

        <Stack space={2}>
          {summaryLines.map(line => (
            <Text key={line} size={1}>
              {line}
            </Text>
          ))}
        </Stack>

        {!hasGps && !hasExif ? (
          <Flex align='flex-start' gap={2}>
            <WarningOutlineIcon />
            <Text size={1} muted>
              No GPS or camera EXIF detected. AI fields can still suggest place and copy;
              coordinates must be set manually or from a file with location data.
            </Text>
          </Flex>
        ) : null}

        <Flex gap={2} wrap='wrap'>
          <Button
            text='Apply from file'
            tone='primary'
            disabled={loading || pendingPatches.length === 0}
            onClick={() => applyMetadata(false)}
          />
          <Button
            text='Apply and overwrite'
            mode='ghost'
            disabled={loading || pendingPatches.length === 0}
            onClick={() => applyMetadata(true)}
          />
        </Flex>

        {pendingPatches.length > 0 ? (
          <Text size={0} muted>
            Will set: {pendingPatches.map(p => p.label).join(' · ')}
            {fieldAlreadySet.coordinates || fieldAlreadySet.capturedAt || fieldAlreadySet.camera
              ? ' (filled fields are skipped unless you overwrite)'
              : ''}
          </Text>
        ) : null}

        {error ? (
          <Text size={1} style={{ color: 'var(--card-danger-fg-color)' }}>
            {error}
          </Text>
        ) : null}

        {applied ? (
          <Text size={1} style={{ color: 'var(--card-success-fg-color)' }}>
            Document fields updated from file metadata.
          </Text>
        ) : null}
      </Stack>
    </Card>
  );
}
