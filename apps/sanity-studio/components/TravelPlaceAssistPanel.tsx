import { EarthGlobeIcon, InfoOutlineIcon, WarningOutlineIcon } from '@sanity/icons';
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
import { countryNameToIso } from '../utils/countryCodes';
import {
  extractPhotographyFileMetadata,
  fetchImageAssetMetadataWhenReady,
  getImageAssetRef,
  type ImageFieldValue,
  summarizeAssetMetadata,
} from '../utils/photographyFileMetadata';
import { reverseGeocode } from '../utils/reverseGeocode';

type GeopointValue = { lat?: number; lng?: number; alt?: number };

export function TravelPlaceAssistPanel(_props: StringInputProps) {
  const client = useClient({ apiVersion: '2024-10-28' });
  const { onChange: patchDocument } = useFormCallbacks();

  const name = useFormValue(['name']) as string | undefined;
  const countryName = useFormValue(['countryName']) as string | undefined;
  const countryCode = useFormValue(['countryCode']) as string | undefined;
  const coordinates = useFormValue(['coordinates']) as GeopointValue | undefined;
  const image = useFormValue(['image']) as ImageFieldValue | undefined;

  const assetRef = useMemo(() => getImageAssetRef(image), [image]);
  const hasImageField = Boolean(image);
  const hasCoords = typeof coordinates?.lat === 'number' && typeof coordinates?.lng === 'number';

  const [resolvedLabel, setResolvedLabel] = useState<string | null>(null);
  const [resolveLoading, setResolveLoading] = useState(false);
  const [assetLoading, setAssetLoading] = useState(false);
  const [assetSummary, setAssetSummary] = useState<string[]>([]);
  const [imageGps, setImageGps] = useState<GeopointValue | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hasCoords) {
      setResolvedLabel(null);
      return;
    }

    let cancelled = false;
    setResolveLoading(true);
    const lat = coordinates.lat;
    const lng = coordinates.lng;
    if (typeof lat !== 'number' || typeof lng !== 'number') return;

    void reverseGeocode(lat, lng)
      .then(result => {
        if (!cancelled) setResolvedLabel(result?.label ?? null);
      })
      .catch(() => {
        if (!cancelled) setResolvedLabel(null);
      })
      .finally(() => {
        if (!cancelled) setResolveLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [coordinates?.lat, coordinates?.lng, hasCoords]);

  useEffect(() => {
    if (!assetRef) {
      setAssetSummary([]);
      setImageGps(null);
      setAssetLoading(false);
      return;
    }

    let cancelled = false;
    setAssetLoading(true);
    setAssetSummary(['Reading metadata from uploaded image…']);
    setImageGps(null);
    setError(null);

    void fetchImageAssetMetadataWhenReady(client, assetRef)
      .then(record => {
        if (cancelled) return;
        const extract = extractPhotographyFileMetadata(record);
        setAssetSummary(summarizeAssetMetadata(record));
        setImageGps(extract.coordinates ?? null);
      })
      .catch(() => {
        if (!cancelled) {
          setAssetSummary(['Could not read image metadata.']);
          setImageGps(null);
        }
      })
      .finally(() => {
        if (!cancelled) setAssetLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [assetRef, client]);

  const applyImageGps = useCallback(
    (overwrite: boolean) => {
      if (!imageGps?.lat || !imageGps?.lng) {
        setError('No GPS in the hero image. Re-upload with location metadata enabled.');
        return;
      }

      if (!overwrite && hasCoords) {
        setError('Coordinates already set — use overwrite or clear them first.');
        return;
      }

      patchDocument(
        PatchEvent.from([
          set(
            {
              _type: 'geopoint',
              lat: imageGps.lat,
              lng: imageGps.lng,
              ...(typeof imageGps.alt === 'number' ? { alt: imageGps.alt } : {}),
            },
            ['coordinates'],
          ),
        ]),
      );
      setError(null);
      setMessage('Map coordinates updated from image GPS.');
    },
    [hasCoords, imageGps, patchDocument],
  );

  const applyResolvedPlace = useCallback(
    async (overwrite: boolean) => {
      if (!hasCoords) {
        setError('Set coordinates first (from image GPS or the map pin).');
        return;
      }

      const lat = coordinates?.lat;
      const lng = coordinates?.lng;
      if (typeof lat !== 'number' || typeof lng !== 'number') return;

      setError(null);
      setMessage(null);

      try {
        const resolved = await reverseGeocode(lat, lng);
        if (!resolved) {
          setError('Could not resolve a place name for these coordinates.');
          return;
        }

        const patches: Array<{ path: string[]; value: unknown }> = [];

        const nextName = resolved.placeName?.trim();
        if (nextName && (overwrite || !name?.trim())) {
          patches.push({ path: ['name'], value: nextName });
        }

        const nextCountry = resolved.country?.trim();
        if (nextCountry && (overwrite || !countryName?.trim())) {
          patches.push({ path: ['countryName'], value: nextCountry });
          const iso = countryNameToIso(nextCountry);
          if (iso && (overwrite || !countryCode?.trim())) {
            patches.push({ path: ['countryCode'], value: iso });
          }
        }

        if (patches.length === 0) {
          setError('Name and country already filled — use overwrite to replace from GPS.');
          return;
        }

        patchDocument(PatchEvent.from(patches.map(p => set(p.value, p.path))));
        setMessage(`Filled from GPS: ${resolved.label}`);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Location lookup failed');
      }
    },
    [countryCode, countryName, coordinates, hasCoords, name, patchDocument],
  );

  return (
    <Card padding={4} radius={2} border shadow={1}>
      <Stack space={4}>
        <Flex align='center' gap={2}>
          <EarthGlobeIcon />
          <Text size={1} weight='semibold'>
            Location assistant
          </Text>
          {resolveLoading || assetLoading ? (
            <Badge tone='primary'>
              <Flex align='center' gap={1}>
                <Spinner />
                <Text size={0}>Working…</Text>
              </Flex>
            </Badge>
          ) : null}
        </Flex>

        <Text size={1} muted>
          You don&apos;t need to read latitude and longitude. Apply GPS from a photo, let us resolve
          the place name, then use AI on fun fact and notes below.
        </Text>

        {hasCoords ? (
          <Card padding={3} radius={2} border tone='positive'>
            <Stack space={2}>
              <Text size={1} weight='medium'>
                {resolvedLabel ? `GPS points to: ${resolvedLabel}` : 'GPS coordinates are set'}
              </Text>
              <Flex gap={2} wrap='wrap'>
                <Button
                  text='Fill name & country from GPS'
                  tone='primary'
                  onClick={() => void applyResolvedPlace(false)}
                />
                <Button
                  text='Overwrite name & country'
                  mode='ghost'
                  onClick={() => void applyResolvedPlace(true)}
                />
              </Flex>
            </Stack>
          </Card>
        ) : (
          <Flex align='flex-start' gap={2}>
            <InfoOutlineIcon />
            <Text size={1} muted>
              No map pin yet. Apply GPS from the hero image above, or set coordinates on the map.
            </Text>
          </Flex>
        )}

        {hasImageField ? (
          <Stack space={2}>
            <Text size={1} weight='medium'>
              From hero image
            </Text>
            {!assetRef ? (
              <Text size={1} muted>
                Waiting for upload to finish…
              </Text>
            ) : (
              <>
                {assetSummary.map(line => (
                  <Text key={line} size={1}>
                    {line}
                  </Text>
                ))}
                <Flex gap={2} wrap='wrap'>
                  <Button
                    text='Apply GPS from image'
                    disabled={assetLoading || !imageGps}
                    onClick={() => applyImageGps(false)}
                  />
                  <Button
                    text='Overwrite coordinates from image'
                    mode='ghost'
                    disabled={assetLoading || !imageGps}
                    onClick={() => applyImageGps(true)}
                  />
                </Flex>
              </>
            )}
          </Stack>
        ) : null}

        {!hasImageField && !hasCoords ? (
          <Flex align='flex-start' gap={2}>
            <WarningOutlineIcon />
            <Text size={1} muted>
              Upload a hero image with GPS above, or set coordinates on the map.
            </Text>
          </Flex>
        ) : null}

        {message ? (
          <Text size={1} style={{ color: 'var(--card-success-fg-color)' }}>
            {message}
          </Text>
        ) : null}
        {error ? (
          <Text size={1} style={{ color: 'var(--card-danger-fg-color)' }}>
            {error}
          </Text>
        ) : null}
      </Stack>
    </Card>
  );
}
