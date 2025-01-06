import React, {useState, ChangeEvent} from 'react'
import {ArrayOfObjectsInputProps, setIfMissing, set, unset} from 'sanity'
import {Card, Stack, Text, TextInput, Button, Flex, Box, Dialog} from '@sanity/ui'
import {AddIcon, TrashIcon} from '@sanity/icons'

/** 1) Each 'view' item has a unique _key, plus viewerId & timestamp. */
interface ViewRecord {
  _key: string
  viewerId?: string
  timestamp?: string
}

/** Helper to create a new 'view' record with default fields. */
function createNewView(): ViewRecord {
  return {
    _key: crypto.randomUUID(),
    viewerId: '',
    timestamp: new Date().toISOString(),
  }
}

export default function ViewsArray(props: ArrayOfObjectsInputProps<ViewRecord>) {
  const {value = [], onChange, schemaType} = props

  /** Whether the dialog is open to show/edit all items */
  const [isModalOpen, setIsModalOpen] = useState(false)

  /** Only show the first 3 items inline */
  const inlineItems = value.slice(0, 3)

  /** Get the total number of views in the array */
  const totalViews = value.length

  /** Format the timestamp in a local, human-readable format. */
  function formatTimestamp(ts?: string) {
    return ts ? new Date(ts).toLocaleString() : ''
  }

  /** Update a single field (timestamp or viewerId) on an item. */
  function handleChange(index: number, field: keyof ViewRecord, e: ChangeEvent<HTMLInputElement>) {
    onChange(set(e.target.value, [index, field]))
  }

  /** Add a new 'view' record. */
  function handleAdd() {
    onChange(setIfMissing([]))
    onChange(set(createNewView(), [value.length]))
  }

  /** Remove an item by index. */
  function handleRemove(index: number) {
    onChange(unset([index]))
  }

  return (
    <Card padding={3} radius={2} shadow={1}>
      <Stack space={4}>
        {/* Title + total count of views */}
        <Flex align="center" justify="space-between">
          <Text weight="semibold" size={2}>
            {schemaType.title ?? 'Views'}
          </Text>
          <Text muted size={1}>
            {totalViews} {totalViews === 1 ? 'view' : 'views'}
          </Text>
        </Flex>

        {/* Inline preview (up to 3 items) */}
        <Stack space={2}>
          {inlineItems.map((item) => (
            <Card key={item._key} padding={2} radius={2} shadow={1}>
              <Flex direction="column" gap={1}>
                <Text size={2} weight="medium">
                  {formatTimestamp(item.timestamp)}
                </Text>
                {/* Optionally show viewerId if it exists */}
                {item.viewerId && (
                  <Text size={1} muted>
                    Viewer ID: {item.viewerId}
                  </Text>
                )}
              </Flex>
            </Card>
          ))}
        </Stack>

        {/* "Show More" if more than 3 items */}
        {totalViews > 3 && (
          <Button mode="ghost" text="Show More" onClick={() => setIsModalOpen(true)} />
        )}

        {/* Add a new 'view' */}
        <Box>
          <Button icon={AddIcon} text="Add View" tone="primary" onClick={handleAdd} />
        </Box>
      </Stack>

      {/* Dialog for viewing/editing all items */}
      {isModalOpen && (
        <Dialog
          id="views-dialog"
          header="All Views"
          onClose={() => setIsModalOpen(false)}
          width={1} // Full width; or use 0.5, 0.75, etc.
        >
          <Box padding={4}>
            <Stack space={4}>
              {value.map((item, index) => (
                <Card key={item._key} padding={3} radius={2} shadow={1}>
                  <Stack space={3}>
                    <Text size={1} muted>
                      View {index + 1}
                    </Text>

                    {/* Timestamp */}
                    <TextInput
                      label="Timestamp"
                      value={item.timestamp ?? ''}
                      onChange={(e) =>
                        handleChange(index, 'timestamp', e as ChangeEvent<HTMLInputElement>)
                      }
                    />

                    {/* Viewer ID */}
                    <TextInput
                      label="Viewer ID"
                      value={item.viewerId ?? ''}
                      onChange={(e) =>
                        handleChange(index, 'viewerId', e as ChangeEvent<HTMLInputElement>)
                      }
                    />

                    <Button
                      icon={TrashIcon}
                      mode="bleed"
                      tone="critical"
                      text="Remove this view"
                      onClick={() => handleRemove(index)}
                    />
                  </Stack>
                </Card>
              ))}

              {/* Add inside the dialog as well */}
              <Button icon={AddIcon} text="Add View" tone="primary" onClick={handleAdd} />
            </Stack>
          </Box>
        </Dialog>
      )}
    </Card>
  )
}
