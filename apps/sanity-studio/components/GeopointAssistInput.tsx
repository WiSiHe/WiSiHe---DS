import { EarthGlobeIcon } from '@sanity/icons/EarthGlobe';
import { Card, Flex, Spinner, Stack, Text } from '@sanity/ui';
import { useEffect, useState } from 'react';
import type { ObjectInputProps } from 'sanity';
import { reverseGeocode } from '../utils/reverseGeocode';

type GeopointValue = { lat?: number; lng?: number; alt?: number };

export function GeopointAssistInput(props: ObjectInputProps) {
  const value = props.value as GeopointValue | undefined;
  const lat = value?.lat;
  const lng = value?.lng;
  const hasCoords = typeof lat === 'number' && typeof lng === 'number';

  const [label, setLabel] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);

  useEffect(() => {
    if (!hasCoords) {
      setLabel(null);
      setLookupError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setLookupError(null);

    void reverseGeocode(lat, lng)
      .then(result => {
        if (!cancelled) setLabel(result?.label ?? null);
      })
      .catch(err => {
        if (!cancelled) {
          setLookupError(err instanceof Error ? err.message : 'Could not resolve location');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [hasCoords, lat, lng]);

  return (
    <Stack space={3}>
      {hasCoords ? (
        <Card padding={3} radius={2} border tone='transparent'>
          <Flex align='center' gap={2}>
            <EarthGlobeIcon />
            <Stack space={2}>
              <Text size={1} weight='semibold'>
                {loading ? 'Looking up place name…' : label ? `Near ${label}` : 'GPS pin set'}
              </Text>
              <Text size={1} muted>
                Numbers below are from the camera GPS — you rarely need to edit them. Use the
                location assistant above to fill name and country, or generate a fun fact with AI.
              </Text>
              {typeof value?.alt === 'number' ? (
                <Text size={0} muted>
                  Altitude {value.alt.toFixed(0)} m (from GPS, optional)
                </Text>
              ) : null}
              {lookupError ? (
                <Text size={0} style={{ color: 'var(--card-muted-fg-color)' }}>
                  {lookupError}
                </Text>
              ) : null}
              {loading ? <Spinner /> : null}
            </Stack>
          </Flex>
        </Card>
      ) : (
        <Text size={1} muted>
          Set coordinates from a photo&apos;s GPS (location assistant) or pick a point on the map.
        </Text>
      )}
      {props.renderDefault(props)}
    </Stack>
  );
}
