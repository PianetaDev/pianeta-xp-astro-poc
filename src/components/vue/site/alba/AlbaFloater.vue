<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, computed } from 'vue'
import { useAlbaFloater } from '~/composables/useAlbaFloater'
import { useAlbaSession } from '~/composables/useAlbaSession'
import ClientOnly from '~/components/vue/shims/ClientOnly.vue'
import AlbaTakeover from './AlbaTakeover.vue'

const { open, openPanel, openWithPrompt } = useAlbaFloater()
const session = useAlbaSession()
const popupVisible = ref(false)

// null = etichetta "Parla con Alba" base. Le altre = prompt cliccabili.
const ROTATING_PROMPTS: (string | null)[] = [
  null,
  'Mostrami i lavori più recenti',
  'Posso fissare una call con Max?',
  'Cosa fate per la sostenibilità?',
  'Raccontami il caso ECLAG',
  'Cercate persone nel team?',
  null,
  'Come funziona la validazione AI?',
  'Vedi il framework Atlas',
]
const ROTATE_MS = 4500

const idx = ref(0)
let timer: number | null = null

const currentPrompt = computed(() => ROTATING_PROMPTS[idx.value])
const label = computed(() => currentPrompt.value || 'Parla con Alba')

function rotate() {
  idx.value = (idx.value + 1) % ROTATING_PROMPTS.length
}

function onClick() {
  const p = currentPrompt.value
  if (p) {
    session.trackEvent('floater_prompt_clicked', { prompt: p, index: idx.value })
    openWithPrompt(p)
  } else {
    session.trackEvent('floater_clicked', { url: typeof window !== 'undefined' ? window.location.pathname : '/' })
    openPanel()
  }
}

const onExternalOpen = () => openPanel()
const onPopupShown = () => { popupVisible.value = true }
const onPopupClosed = () => { popupVisible.value = false }

onMounted(() => {
  window.addEventListener('alba:open', onExternalOpen)
  window.addEventListener('alba:popup-shown', onPopupShown)
  window.addEventListener('alba:popup-closed', onPopupClosed)
  timer = window.setInterval(rotate, ROTATE_MS)
})
onBeforeUnmount(() => {
  window.removeEventListener('alba:open', onExternalOpen)
  window.removeEventListener('alba:popup-shown', onPopupShown)
  window.removeEventListener('alba:popup-closed', onPopupClosed)
  if (timer !== null) clearInterval(timer)
})
</script>

<template>
  <button
    v-if="!open && !popupVisible"
    @click="onClick"
    :aria-label="currentPrompt ? `Apri Alba con: ${currentPrompt}` : 'Apri chat Alba'"
    class="alba-launcher"
  >
    <span class="alba-launcher-avatar">A</span>
    <Transition name="alba-launcher-fade" mode="out-in">
      <span class="alba-launcher-label" :key="idx">{{ label }}</span>
    </Transition>
  </button>

  <ClientOnly>
    <AlbaTakeover />
  </ClientOnly>
</template>

<style scoped>
.alba-launcher {
  position: fixed;
  bottom: 16px;
  right: 16px;
  z-index: 30;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: #0e1116;
  color: #ffffff;
  padding: 10px 18px 10px 12px;
  border: 0;
  border-radius: 999px;
  box-shadow: 0 10px 30px rgba(14,17,22,0.25);
  cursor: pointer;
  font: inherit;
  max-width: calc(100vw - 32px);
  transition: transform 200ms ease, box-shadow 200ms ease;
}
.alba-launcher:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 16px 40px rgba(14,17,22,0.32);
}
.alba-launcher-avatar {
  flex-shrink: 0;
  width: 26px; height: 26px;
  border-radius: 999px;
  background: linear-gradient(135deg, #fbcfe8, #fed7aa, #fef3c7);
  color: #0e1116;
  display: inline-flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 800;
}
.alba-launcher-label {
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 280px;
}

.alba-launcher-fade-enter-active,
.alba-launcher-fade-leave-active {
  transition: opacity 340ms cubic-bezier(0.16,1,0.3,1), transform 340ms cubic-bezier(0.16,1,0.3,1);
}
.alba-launcher-fade-enter-from { opacity: 0; transform: translateY(6px); }
.alba-launcher-fade-leave-to { opacity: 0; transform: translateY(-6px); }

@media (prefers-reduced-motion: reduce) {
  .alba-launcher-fade-enter-active,
  .alba-launcher-fade-leave-active { transition: none !important; }
  .alba-launcher:hover { transform: none; }
}
</style>
