<script setup lang="ts">
defineProps<{
  src?: string
  alt?: string
  width?: string | number
  height?: string | number
  format?: string
  loading?: string
  fetchpriority?: string
  decoding?: string
}>()
</script>

<template>
  <img
    :src="src"
    :alt="alt || ''"
    :width="width"
    :height="height"
    :loading="(loading as any) || 'lazy'"
    :decoding="(decoding as any) || 'async'"
    :fetchpriority="(fetchpriority as any) || undefined"
  />
</template>
