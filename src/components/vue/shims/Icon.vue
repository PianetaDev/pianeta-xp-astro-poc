<script setup lang="ts">
// Minimal Icon shim: shows a tiny circle placeholder. Real icons would need lucide-vue-next.
defineProps<{ name?: string; size?: string | number }>()
</script>
<template>
  <span class="inline-block align-middle" :style="{ width: (size || 16) + 'px', height: (size || 16) + 'px' }" :data-icon="name">
    <svg viewBox="0 0 16 16" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
      <circle cx="8" cy="8" r="5" />
    </svg>
  </span>
</template>
