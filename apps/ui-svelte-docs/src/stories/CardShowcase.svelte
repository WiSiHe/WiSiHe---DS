<script lang="ts">
  import { Badge, Button, Card, Stack } from '@wisihe/ui-svelte';
</script>

<Card variant="elevated" class="w-[420px]">
  <Stack gap="sm">
    <Badge variant="secondary">New</Badge>
    <h3 class="text-lg font-semibold">Svelte UI Card</h3>
    <p class="text-sm text-foreground-subtle">
      A composable card example using design-system components.
    </p>
    <div class="pt-2">
      <Button size="sm">Action</Button>
    </div>
  </Stack>
</Card>
