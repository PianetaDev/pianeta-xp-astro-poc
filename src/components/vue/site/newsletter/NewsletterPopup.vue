<script setup lang="ts">
import { ref, onMounted } from 'vue'
import NewsletterForm from './NewsletterForm.vue'

const DISMISS_KEY = 'newsletter-popup-dismissed-until'
const open = ref(false)

onMounted(() => {
  const dismissedUntil = localStorage.getItem(DISMISS_KEY)
  if (dismissedUntil && Date.now() < parseInt(dismissedUntil)) return
  setTimeout(() => { open.value = true }, 30_000)
})

const dismiss = () => {
  open.value = false
  localStorage.setItem(DISMISS_KEY, String(Date.now() + 7 * 86400_000))
}
</script>

<template>
  <Teleport to="body">
    <Transition name="popup">
      <div
        v-if="open"
        role="dialog"
        aria-label="Subscribe to Bulletin"
        class="fixed bottom-4 left-4 right-4 md:right-auto md:max-w-sm z-40 bg-black text-white p-6 shadow-2xl"
      >
        <button @click="dismiss" aria-label="Close" class="absolute top-2 right-3 text-white/60 hover:text-white text-lg">×</button>
        <NewsletterForm variant="popup" />
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.popup-enter-active, .popup-leave-active { transition: all 200ms ease-out; }
.popup-enter-from, .popup-leave-to { opacity: 0; transform: translateY(8px); }
@media (prefers-reduced-motion: reduce) { .popup-enter-active, .popup-leave-active { transition: none; } }
</style>
