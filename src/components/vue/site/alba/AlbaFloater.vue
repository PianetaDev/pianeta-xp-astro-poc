<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
import { useAlbaFloater } from '~/composables/useAlbaFloater'
import ClientOnly from '~/components/vue/shims/ClientOnly.vue'
import AlbaTakeover from './AlbaTakeover.vue'

const { open, openPanel } = useAlbaFloater()

const onExternalOpen = () => openPanel()
onMounted(() => window.addEventListener('alba:open', onExternalOpen))
onBeforeUnmount(() => window.removeEventListener('alba:open', onExternalOpen))
</script>

<template>
  <button
    v-if="!open"
    @click="openPanel"
    aria-label="Apri chat Alba"
    class="alba-launcher fixed bottom-4 right-4 z-30 group flex items-center gap-2 bg-black text-white pl-3 pr-4 py-2.5 rounded-full shadow-lg hover:scale-105 transition"
  >
    <span class="w-6 h-6 rounded-full bg-gradient-to-br from-pink-300 via-orange-200 to-yellow-100 text-black flex items-center justify-center text-[11px] font-bold">A</span>
    <span class="text-sm font-medium">Parla con Alba</span>
  </button>

  <ClientOnly>
    <AlbaTakeover />
  </ClientOnly>
</template>
