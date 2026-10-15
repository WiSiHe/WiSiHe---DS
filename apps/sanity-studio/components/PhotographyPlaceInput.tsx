import { EarthGlobeIcon } from '@sanity/icons/EarthGlobe';
import { InfoOutlineIcon } from '@sanity/icons/InfoOutline';
import { Card, Flex, Stack, Text } from '@sanity/ui';
import { useEffect, useState } from 'react';
import type { ReferenceInputProps } from 'sanity';
import { useClient, useFormValue } from 'sanity';

type LinkedPlace = {
  name?: string;
  countryName?: string;
  countryCode?: string;
};

export function PhotographyWorkflowIntro(_props: { schemaType?: string }) {
  return (
    <Card padding={4} radius={2} border tone='transparent'>
      <Stack space={3}>
        <Flex align='center' gap={2}>
          <InfoOutlineIcon />
          <Text size={1} weight='semibold'>
            Suggested workflow
          </Text>
        </Flex>
        <Text size={1} muted>
          1. Upload the photo → 2. Apply date/camera from file (if available) → 3. Link a{' '}
          <strong>Travel place</strong> (create one under Management if needed — GPS and map copy
          live there) → 4. Generate title, caption, and alt text.
        </Text>
      </Stack>
    </Card>
  );
}

export function PhotographyPlaceReferenceInput(props: ReferenceInputProps) {
  const client = useClient({ apiVersion: '2024-10-28' });
  const placeRef = useFormValue(['place']) as { _ref?: string } | undefined;
  const [linked, setLinked] = useState<LinkedPlace | null>(null);

  useEffect(() => {
    const id = placeRef?._ref;
    if (!id) {
      setLinked(null);
      return;
    }

    let cancelled = false;
    void client
      .fetch<LinkedPlace | null>(`*[_id == $id][0]{ name, countryName, countryCode }`, { id })
      .then(doc => {
        if (!cancelled) setLinked(doc);
      })
      .catch(() => {
        if (!cancelled) setLinked(null);
      });

    return () => {
      cancelled = true;
    };
  }, [client, placeRef?._ref]);

  return (
    <Stack space={3}>
      <Card padding={3} radius={2} border>
        <Stack space={2}>
          <Flex align='center' gap={2}>
            <EarthGlobeIcon />
            <Text size={1} weight='semibold'>
              Travel place
            </Text>
          </Flex>
          <Text size={1} muted>
            One link is enough — name and country come from the travel place document (shown on the
            about map). Create or edit places under Management → Travel places.
          </Text>
          {linked?.name ? (
            <Text size={1}>
              Linked: <strong>{linked.name}</strong>
              {linked.countryName ? ` · ${linked.countryName}` : ''}
              {linked.countryCode ? ` (${linked.countryCode})` : ''}
            </Text>
          ) : placeRef?._ref ? (
            <Text size={1} muted>
              Loading place…
            </Text>
          ) : (
            <Text size={1} muted>
              No place linked — this photo won&apos;t appear on the about travel map until you pick
              one.
            </Text>
          )}
        </Stack>
      </Card>
      {props.renderDefault(props)}
    </Stack>
  );
}
