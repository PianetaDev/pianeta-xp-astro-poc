<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { useAlbaFloater } from '~/composables/useAlbaFloater'
import { useAlbaSession } from '~/composables/useAlbaSession'
import ClientOnly from '~/components/vue/shims/ClientOnly.vue'
import AlbaTakeover from './AlbaTakeover.vue'

const { open, openPanel } = useAlbaFloater()
const session = useAlbaSession()
const popupVisible = ref(false)

function onClick() {
  session.trackEvent('floater_clicked', { url: typeof window !== 'undefined' ? window.location.pathname : '/' })
  // GTM dataLayer: alba_chat_open
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({ event: 'alba_chat_open', trigger: 'floater', page: window.location.pathname })
  }
  openPanel()
}

const onExternalOpenWithTracking = () => {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({ event: 'alba_chat_open', trigger: 'cta', page: window.location.pathname })
  }
  openPanel()
}

const onPopupShown = () => { popupVisible.value = true }
const onPopupClosed = () => { popupVisible.value = false }

onMounted(() => {
  window.addEventListener('alba:open', onExternalOpenWithTracking)
  window.addEventListener('alba:popup-shown', onPopupShown)
  window.addEventListener('alba:popup-closed', onPopupClosed)
})
onBeforeUnmount(() => {
  window.removeEventListener('alba:open', onExternalOpenWithTracking)
  window.removeEventListener('alba:popup-shown', onPopupShown)
  window.removeEventListener('alba:popup-closed', onPopupClosed)
})
</script>

<template>
  <button
    v-if="!open && !popupVisible"
    @click="onClick"
    aria-label="Apri chat Alba"
    class="alba-launcher"
  >
    <span class="alba-launcher-avatar">A</span>
    <span class="alba-launcher-label">Parla con Alba</span>
  </button>

  <ClientOnly>
    <AlbaTakeover />
  </ClientOnly>
</template>

<style scoped>
.alba-launcher {
  position: fixed;
  bottom: 72px; /* sopra il widget Segnala che sta a bottom-right */
  right: 16px;
  z-index: 30;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: #0e1116;
  color: #ffffff;
  padding: 10px 18px 10px 12px;
  border: 0;
  border-radius: var(--r-pill);
  box-shadow: 0 10px 30px rgba(14,17,22,0.25);
  cursor: pointer;
  font: inherit;
  transition: transform 200ms ease, box-shadow 200ms ease;
}
.alba-launcher:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 16px 40px rgba(14,17,22,0.32);
}
.alba-launcher-avatar {
  flex-shrink: 0;
  width: 26px; height: 26px;
  border-radius: var(--r-pill);
  background: linear-gradient(135deg, #fbcfe8, #fed7aa, #fef3c7);
  color: #0e1116;
  display: inline-flex; align-items: center; justify-content: center;
  font-size: var(--ty-eyebrow); font-weight: 800;
}
.alba-launcher-label {
  font-size: var(--ty-meta);
  font-weight: 500;
  white-space: nowrap;
}

@media (prefers-reduced-motion: reduce) {
  .alba-launcher:hover { transform: none; }
}
</style>
