<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
import { useHireUsDrawer } from '~/composables/useHireUsDrawer'
import { useState } from '~/lib/nuxt-shims'
import HireUsHeader from './HireUsHeader.vue'
import AlbaConversation from './AlbaConversation.vue'

const drawer = useHireUsDrawer()

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && drawer.isOpen.value) drawer.close()
}
const onExternalOpen = () => drawer.open()
onMounted(() => {
  window.addEventListener('keydown', onKeydown)
  window.addEventListener('hire-us:open', onExternalOpen)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  window.removeEventListener('hire-us:open', onExternalOpen)
})

const onReset = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('alba-hire-us-conversation-v1')
    const name = useState<string>('alba-hire-us-name', () => '')
    const messages = useState<any[]>('alba-hire-us-messages', () => [])
    name.value = ''
    messages.value = []
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="hire-us">
      <div
        v-if="drawer.isOpen.value"
        class="hire-us-drawer-wrap fixed inset-0 z-40 flex"
        @click.self="drawer.close()"
      >
        <div class="absolute inset-0 bg-black/30" @click="drawer.close()" />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Hire Us conversation"
          class="hire-us-drawer relative ml-auto h-full w-full lg:w-[calc(100vw-88px)] bg-[#fafaf7] flex flex-col shadow-2xl"
        >
          <HireUsHeader @close="drawer.close()" @reset="onReset" />
          <div class="flex-1 overflow-hidden">
            <AlbaConversation />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.hire-us-enter-active, .hire-us-leave-active { transition: opacity 240ms ease-out; }
.hire-us-enter-active .hire-us-drawer, .hire-us-leave-active .hire-us-drawer { transition: transform 240ms ease-out; }
.hire-us-enter-from, .hire-us-leave-to { opacity: 0; }
.hire-us-enter-from .hire-us-drawer, .hire-us-leave-to .hire-us-drawer { transform: translateX(100%); }
@media (prefers-reduced-motion: reduce) {
  .hire-us-enter-active, .hire-us-leave-active,
  .hire-us-enter-active .hire-us-drawer, .hire-us-leave-active .hire-us-drawer { transition: none; }
}
</style>
