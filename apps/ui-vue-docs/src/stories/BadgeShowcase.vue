<script setup lang="ts">
import { Badge } from '@wisihe/ui-vue';
</script>

<template>
  <div class="flex flex-wrap items-center gap-3">
    <Badge>Default</Badge>
    <Badge variant="secondary">Secondary</Badge>
    <Badge variant="success">Success</Badge>
    <Badge variant="warning">Warning</Badge>
    <Badge variant="danger">Danger</Badge>
    <Badge variant="outline">Outline</Badge>
  </div>
</template>
