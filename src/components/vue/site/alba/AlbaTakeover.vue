<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, defineAsyncComponent } from 'vue'
import { useAlbaFloater } from '~/composables/useAlbaFloater'
import { useAlbaArtifact } from '~/composables/useAlbaArtifact'
import { useRoute } from '~/lib/nuxt-shims'
import Icon from '~/components/vue/shims/Icon.vue'

const { open, ctx, closePanel, consumePendingPrompt } = useAlbaFloater()
const { artifact, close: closeArtifact } = useAlbaArtifact()
const route = useRoute()

const AlbaChat = defineAsyncComponent(() => import('~/components/vue/alba/AlbaChat.vue'))

const initialPrompt = ref<string | null>(null)
watch(open, (o) => {
  if (o) initialPrompt.value = consumePendingPrompt()
  if (typeof document !== 'undefined') {
    document.body.classList.toggle('alba-open', !!o)
  }
})

watch(() => route.fullPath, () => { if (open.value) closePanel() })

const onSuggested = (prompt: string) => { initialPrompt.value = prompt }
const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && open.value) closePanel() }
// Mutua esclusività: se si apre il side-pane generico, chiudi Alba
const onSidePaneOpen = () => { if (open.value) closePanel() }
onMounted(() => {
  window.addEventListener('keydown', onKey)
  window.addEventListener('sidepane:open', onSidePaneOpen)
})
onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', onKey)
    window.removeEventListener('sidepane:open', onSidePaneOpen)
  }
})

// Mobile bottom-sheet: drag-to-close
const sheetRef = ref<HTMLElement | null>(null)
const dragStartY = ref<number | null>(null)
const dragDeltaY = ref(0)
const onTouchStart = (e: TouchEvent) => { dragStartY.value = e.touches[0].clientY; dragDeltaY.value = 0 }
const onTouchMove = (e: TouchEvent) => {
  if (dragStartY.value === null) return
  const dy = e.touches[0].clientY - dragStartY.value
  if (dy > 0) dragDeltaY.value = dy
}
const onTouchEnd = () => {
  if (dragDeltaY.value > 120) closePanel()
  dragStartY.value = null
  dragDeltaY.value = 0
}
</script>

<template>
  <Teleport to="body">
    <Transition name="alba-panel">
      <div
        v-if="open"
        ref="sheetRef"
        role="dialog"
        aria-label="Alba — AI di Pianeta.Studio"
        class="alba-panel"
        :style="{ transform: dragDeltaY > 0 ? `translateY(${dragDeltaY}px)` : '' }"
      >
        <div class="alba-panel-handle" @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd" aria-hidden="true" />

        <header class="alba-head">
          <div class="alba-head-id">
            <div class="alba-avatar">A</div>
            <div>
              <p class="alba-name">Alba</p>
              <p class="alba-sub">AI di Pianeta.Studio</p>
            </div>
          </div>
          <button @click="closePanel" aria-label="Chiudi Alba" class="alba-close">
            <Icon name="lucide:x" :size="18" />
          </button>
        </header>

        <div class="alba-body">
          <AlbaChat
            :open="true"
            :embedded="true"
            :initial-prompt="initialPrompt"
            :page-context="{ context: ctx.context, contextSlug: ctx.contextSlug }"
            :suggested="ctx.suggested || []"
            @suggested-click="onSuggested"
          />
        </div>

        <Transition name="artifact">
          <aside v-if="artifact" class="alba-artifact">
            <div class="alba-artifact-head">
              <div class="alba-artifact-title">
                <Icon name="lucide:file-text" :size="14" />
                <span>{{ artifact.title }}</span>
              </div>
              <button @click="closeArtifact" aria-label="Chiudi artefatto" class="alba-close-sm">
                <Icon name="lucide:x" :size="14" />
              </button>
            </div>
            <div class="alba-artifact-body">
              <div v-if="artifact.kind === 'html'" v-html="artifact.payload" />
              <pre v-else>{{ JSON.stringify(artifact.payload, null, 2) }}</pre>
            </div>
          </aside>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style>
.alba-panel {
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100%;
  max-width: 480px;
  background: linear-gradient(135deg, #fdf6f0 0%, #fcf1ec 30%, #fbeef0 60%, #f7eef7 100%);
  border-left: 1px solid rgba(14,17,22,0.08);
  box-shadow: -20px 0 60px rgba(14,17,22,0.12);
  display: flex;
  flex-direction: column;
  z-index: 60;
  transition: transform 200ms ease-out;
}
@media (min-width: 1280px) {
  .alba-panel { max-width: 560px; }
}

/* 3-pannel layout: quando Alba apre, il main centrale si rimpicciolisce */
@media (min-width: 1024px) {
  main.site-main { transition: padding-right 280ms cubic-bezier(0.16, 1, 0.3, 1); }
  body.alba-open main.site-main { padding-right: 480px; }
  body.alba-open footer.site-main { padding-right: 480px; }
}
@media (min-width: 1280px) {
  body.alba-open main.site-main { padding-right: 560px; }
  body.alba-open footer.site-main { padding-right: 560px; }
}
@media (prefers-reduced-motion: reduce) {
  main.site-main { transition: none !important; }
}
/* Mobile: bottom-sheet 85vh */
@media (max-width: 767px) {
  .alba-panel {
    top: auto;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    max-width: 100%;
    height: 85vh;
    border-left: 0;
    border-top: 1px solid rgba(14,17,22,0.08);
    border-radius: 20px 20px 0 0;
    box-shadow: 0 -20px 60px rgba(14,17,22,0.18);
  }
}

.alba-panel-handle {
  display: none;
  width: 48px;
  height: 5px;
  background: rgba(14,17,22,0.25);
  border-radius: var(--r-pill);
  margin: 8px auto 0;
  flex-shrink: 0;
  cursor: grab;
  touch-action: none;
}
@media (max-width: 767px) {
  .alba-panel-handle { display: block; }
}

.alba-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  border-bottom: 1px solid rgba(14,17,22,0.06);
  background: rgba(255,255,255,0.6);
  backdrop-filter: blur(6px);
}
.alba-head-id { display: flex; align-items: center; gap: 10px; }
.alba-avatar {
  width: 36px; height: 36px; border-radius: var(--r-pill);
  background: linear-gradient(135deg, #fbcfe8, #fed7aa, #fef3c7);
  display: flex; align-items: center; justify-content: center;
  font-weight: 800; font-size: var(--ty-meta); color: #0e1116;
}
.alba-name { font-size: var(--ty-meta); font-weight: 700; margin: 0; line-height: 1.1; }
.alba-sub { font-size: var(--ty-eyebrow); color: var(--pianeta-muted); margin: 2px 0 0; line-height: 1.1; }
.alba-close, .alba-close-sm {
  background: transparent; border: 0;
  width: 36px; height: 36px;
  border-radius: var(--r-pill);
  display: flex; align-items: center; justify-content: center;
  color: var(--pianeta-muted-strong);
  cursor: pointer;
  transition: background 150ms;
}
.alba-close:hover, .alba-close-sm:hover { background: rgba(14,17,22,0.05); }
.alba-close-sm { width: 28px; height: 28px; }

.alba-body { flex: 1; overflow: hidden; display: flex; flex-direction: column; padding: 0 16px; }

.alba-artifact {
  position: absolute;
  right: 100%;
  top: 0; bottom: 0;
  width: 520px;
  background: #fff;
  border-left: 1px solid rgba(14,17,22,0.06);
  border-right: 1px solid rgba(14,17,22,0.08);
  box-shadow: -10px 0 30px rgba(14,17,22,0.06);
  display: flex; flex-direction: column;
}
@media (max-width: 1023px) { .alba-artifact { display: none; } }
.alba-artifact-head {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 18px;
  border-bottom: 1px solid rgba(14,17,22,0.06);
}
.alba-artifact-title {
  display: flex; align-items: center; gap: 8px;
  font-size: var(--ty-eyebrow); text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700;
  color: rgba(14,17,22,0.6);
}
.alba-artifact-body { flex: 1; overflow-y: auto; padding: 18px; font-size: var(--ty-meta); }
.alba-artifact-body pre { font-size: 12px; white-space: pre-wrap; font-family: ui-monospace, SFMono-Regular, monospace; }

/* Enter/leave: slide from right desktop, slide from bottom mobile */
.alba-panel-enter-active, .alba-panel-leave-active { transition: transform 280ms cubic-bezier(0.16, 1, 0.3, 1), opacity 200ms; }
.alba-panel-enter-from, .alba-panel-leave-to { transform: translateX(100%); opacity: 0; }
@media (max-width: 767px) {
  .alba-panel-enter-from, .alba-panel-leave-to { transform: translateY(100%); opacity: 1; }
}
.artifact-enter-active, .artifact-leave-active { transition: transform 240ms ease-out, opacity 200ms; }
.artifact-enter-from, .artifact-leave-to { opacity: 0; transform: translateX(20px); }
@media (prefers-reduced-motion: reduce) {
  .alba-panel, .alba-panel-enter-active, .alba-panel-leave-active,
  .artifact-enter-active, .artifact-leave-active { transition: none !important; }
}
</style>
