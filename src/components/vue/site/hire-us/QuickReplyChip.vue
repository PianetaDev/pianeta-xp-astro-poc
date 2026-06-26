<script setup lang="ts">
defineProps<{ label: string; sublabel?: string; emoji?: string }>()
</script>
<template>
  <button class="inline-flex items-center gap-2 bg-white border border-black/15 hover:border-black px-4 py-2 rounded-full text-sm transition">
    <span v-if="emoji">{{ emoji }}</span>
    <span>
      {{ label }}
      <span v-if="sublabel" class="text-black/50 text-xs ml-1">{{ sublabel }}</span>
    </span>
  </button>
</template>
