import { InfoOutlineIcon } from '@sanity/icons/InfoOutline';
import { WarningOutlineIcon } from '@sanity/icons/WarningOutline';
import { Badge, Button, Card, Flex, Spinner, Stack, Text } from '@sanity/ui';
import { useCallback, useEffect, useMemo, useState } from 'react';
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
  fetchImageAssetMetadataWhenReady,
  getImageAssetRef,
  type ImageFieldValue,
  type SanityImageAssetRecord,
  summarizeAssetMetadata,
} from '../utils/photographyFileMetadata';

export function PhotographyFileMetadataInput(_props: StringInputProps) {
  const client = useClient({ apiVersion: '2024-10-28' });
  const { onChange: patchDocument } = useFormCallbacks();
  const image = useFormValue(['image']) as ImageFieldValue | undefined;
  const capturedAt = useFormValue(['capturedAt']);
  const camera = useFormValue(['camera']);

  const assetRef = useMemo(() => getImageAssetRef(image), [image]);
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

    void fetchImageAssetMetadataWhenReady(client, assetRef)
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
  const existingCapturedAt = capturedAt as string | undefined;
  const existingCamera = camera as string | undefined;
  const pendingPatches = buildPhotographyApplyPatches(extract, {
    existingCapturedAt,
    existingCamera,
    exifOnly: true,
  });

  const applyMetadata = useCallback(
    (overwrite: boolean) => {
      const patches = buildPhotographyApplyPatches(extract, {
        existingCapturedAt,
        existingCamera,
        exifOnly: true,
        overwrite,
      });

      if (patches.length === 0) {
        setError('Nothing to apply from this file — no capture date or camera EXIF found.');
        return;
      }

      setError(null);
      patchDocument(PatchEvent.from(patches.map(p => set(p.value, [p.path]))));
      setApplied(true);
    },
    [extract, patchDocument, existingCapturedAt, existingCamera],
  );

  const hasExif = Boolean(extract.capturedAt || extract.camera);
  const hasGps = Boolean(extract.coordinates);
  const fieldAlreadySet = {
    capturedAt: Boolean(capturedAt),
    camera: Boolean(camera),
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
          Applies capture date and camera from EXIF. GPS from the file is shown for reference — set
          map location on the linked <strong>Travel place</strong> document (use its location
          assistant).
        </Text>

        <Stack space={2}>
          {summaryLines.map(line => (
            <Text key={line} size={1}>
              {line}
            </Text>
          ))}
        </Stack>

        {hasGps && extract.coordinates ? (
          <Text size={1} muted>
            GPS in file: {extract.coordinates.lat.toFixed(5)}, {extract.coordinates.lng.toFixed(5)}—
            copy to a new Travel place if this photo defines a new map pin.
          </Text>
        ) : null}

        {!hasGps && !hasExif ? (
          <Flex align='flex-start' gap={2}>
            <WarningOutlineIcon />
            <Text size={1} muted>
              No EXIF detected. You can still link a travel place and generate title and caption.
            </Text>
          </Flex>
        ) : null}

        <Flex gap={2} wrap='wrap'>
          <Button
            text='Apply date & camera'
            tone='primary'
            disabled={loading || pendingPatches.length === 0}
            onClick={() => applyMetadata(false)}
          />
          <Button
            text='Overwrite date & camera'
            mode='ghost'
            disabled={loading || pendingPatches.length === 0}
            onClick={() => applyMetadata(true)}
          />
        </Flex>

        {pendingPatches.length > 0 ? (
          <Text size={0} muted>
            Will set: {pendingPatches.map(p => p.label).join(' · ')}
            {fieldAlreadySet.capturedAt || fieldAlreadySet.camera
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
            Capture date and camera updated from file.
          </Text>
        ) : null}
      </Stack>
    </Card>
  );
}
