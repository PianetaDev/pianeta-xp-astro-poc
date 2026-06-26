<script setup lang="ts">
defineEmits<{ (e: 'close'): void; (e: 'reset'): void }>()
</script>

<template>
  <header class="hire-us-header sticky top-0 z-10 bg-white border-b border-black/10 px-6 py-3 flex items-center justify-between">
    <p class="font-bold">Hire Us</p>
    <div class="flex items-center gap-3">
      <button @click="$emit('reset')" class="text-xs text-black/60 hover:text-black underline">Resetta conversazione</button>
      <button @click="$emit('close')" aria-label="Close" class="text-xl text-black/60 hover:text-black">✕</button>
    </div>
  </header>
</template>
