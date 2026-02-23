<script setup lang="ts">
</script>

<template>
  <div class="flex flex-wrap items-center gap-3">
    <Button>Primary</Button>
    <Button variant="secondary">Secondary</Button>
    <Button variant="ghost">Ghost</Button>
    <Button variant="danger">Danger</Button>
    <Button :loading="true">Loading</Button>
  </div>
</template>
