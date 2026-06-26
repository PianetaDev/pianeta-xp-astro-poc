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
  if (typeof document === 'undefined') return
  if (o) {
    initialPrompt.value = consumePendingPrompt()
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

watch(() => route.fullPath, () => { if (open.value) closePanel() })

const onSuggested = (prompt: string) => { initialPrompt.value = prompt }
const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && open.value) closePanel() }
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => {
  if (typeof window !== 'undefined') window.removeEventListener('keydown', onKey)
  if (typeof document !== 'undefined') document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        role="dialog"
        aria-label="Alba — AI di Pianeta.Studio"
        class="alba-takeover fixed inset-0 lg:left-[88px] z-[55] bg-[linear-gradient(135deg,#fdf6f0_0%,#fcf1ec_30%,#fbeef0_60%,#f7eef7_100%)] flex flex-col"
      >
        <header class="flex items-center justify-between px-6 md:px-10 py-4 border-b border-black/5 bg-white/60 backdrop-blur-sm">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-full bg-gradient-to-br from-pink-300 via-orange-200 to-yellow-100 flex items-center justify-center text-sm font-bold">A</div>
            <div>
              <p class="text-sm font-bold leading-tight">Alba</p>
              <p class="text-[11px] text-black/55 leading-tight">AI di gruppo · Pianeta.Studio</p>
            </div>
          </div>
          <div class="flex items-center gap-1.5 text-[11px] text-black/50">
            <span class="hidden sm:inline">Esc per chiudere</span>
            <button @click="closePanel" aria-label="Chiudi Alba" class="ml-2 w-9 h-9 rounded-full hover:bg-black/5 flex items-center justify-center text-black/70">
              <Icon name="lucide:x" :size="18" />
            </button>
          </div>
        </header>

        <div class="flex-1 flex min-h-0">
          <div class="flex-1 flex flex-col min-w-0">
            <div class="flex-1 overflow-hidden flex flex-col items-center">
              <div class="w-full max-w-[760px] flex-1 flex flex-col min-h-0 px-4 md:px-6">
                <AlbaChat
                  :open="true"
                  :embedded="true"
                  :initial-prompt="initialPrompt"
                  :page-context="{ context: ctx.context, contextSlug: ctx.contextSlug }"
                  :suggested="ctx.suggested || []"
                  @suggested-click="onSuggested"
                />
              </div>
            </div>
          </div>

          <Transition
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="opacity-0 translate-x-6"
            enter-to-class="opacity-100 translate-x-0"
            leave-active-class="transition duration-200 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0 translate-x-6"
          >
            <aside
              v-if="artifact"
              class="hidden lg:flex flex-col w-[520px] xl:w-[620px] border-l border-black/10 bg-white"
            >
              <div class="flex items-center justify-between px-5 py-3 border-b border-black/5">
                <div class="flex items-center gap-2 min-w-0">
                  <Icon name="lucide:file-text" :size="14" class="text-black/50 flex-shrink-0" />
                  <p class="text-xs uppercase tracking-wider font-semibold truncate">{{ artifact.title }}</p>
                </div>
                <button @click="closeArtifact" aria-label="Chiudi artefatto" class="text-black/40 hover:text-black p-1">
                  <Icon name="lucide:x" :size="14" />
                </button>
              </div>
              <div class="flex-1 overflow-y-auto p-5 text-sm">
                <component
                  v-if="artifact.kind === 'html'"
                  :is="'div'"
                  v-html="artifact.payload"
                />
                <pre v-else class="text-xs whitespace-pre-wrap font-mono">{{ JSON.stringify(artifact.payload, null, 2) }}</pre>
              </div>
            </aside>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
@media (prefers-reduced-motion: reduce) {
  .alba-takeover * { transition-duration: 0ms !important; }
}
</style>
