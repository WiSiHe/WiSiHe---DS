import { InfoOutlineIcon } from '@sanity/icons/InfoOutline';
import { Card, Flex, Stack, Text } from '@sanity/ui';
import type { StringInputProps } from 'sanity';

export function TravelPlaceWorkflowIntro(_props: StringInputProps) {
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
          1. Choose kind (city or adventure) → 2. Upload hero image with GPS → 3. Use location
          assistant to apply GPS and fill name &amp; country → 4. Open Map card tab and generate fun
          fact and notes → 5. Link photography docs to this place.
        </Text>
      </Stack>
    </Card>
  );
}
