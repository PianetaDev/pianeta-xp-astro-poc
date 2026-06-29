<script setup lang="ts">
import { computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useArtifactPane } from '~/composables/useArtifactPane'
import { useRoute } from '~/lib/nuxt-shims'
import Icon from '~/components/vue/shims/Icon.vue'

const { artifact, galleryIndex, close, next, prev } = useArtifactPane()
const route = useRoute()

watch(() => route.fullPath, () => { if (artifact.value) close() })

// Split su schermi larghi: restringe la main quando l'artifact è aperto (≥1280px)
watch(artifact, (a) => {
  if (typeof document !== 'undefined') document.body.classList.toggle('artifact-open', !!a)
})
// Mutua esclusività con gli altri pannelli
function closeOnOtherPane() { if (artifact.value) close() }

function onKey(e: KeyboardEvent) {
  if (!artifact.value) return
  if (e.key === 'Escape') close()
  if (artifact.value.kind === 'gallery') {
    if (e.key === 'ArrowRight') next()
    if (e.key === 'ArrowLeft') prev()
  }
}
onMounted(() => {
  window.addEventListener('keydown', onKey)
  window.addEventListener('sidepane:open', closeOnOtherPane)
  window.addEventListener('alba:open', closeOnOtherPane)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  window.removeEventListener('sidepane:open', closeOnOtherPane)
  window.removeEventListener('alba:open', closeOnOtherPane)
  if (typeof document !== 'undefined') document.body.classList.remove('artifact-open')
})

const currentGalleryItem = computed(() => {
  if (!artifact.value || artifact.value.kind !== 'gallery' || !artifact.value.items?.length) return null
  return artifact.value.items[galleryIndex.value]
})

const kindIcon: Record<string, string> = {
  image: 'lucide:image',
  video: 'lucide:play',
  pdf: 'lucide:file-text',
  html: 'lucide:layout-template',
  gallery: 'lucide:images',
  embed: 'lucide:link',
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="artifact"
        class="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
        @click="close"
      />
    </Transition>

    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 translate-x-8"
      enter-to-class="opacity-100 translate-x-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0 translate-x-8"
    >
      <aside
        v-if="artifact"
        class="artifact-pane fixed top-0 right-0 h-screen w-full sm:w-[90vw] md:w-[640px] lg:w-[720px] xl:w-[820px] bg-white border-l border-black/10 shadow-2xl z-50 flex flex-col"
        role="dialog"
        :aria-label="artifact.title"
      >
        <header class="flex items-center justify-between px-5 py-3 border-b border-black/5">
          <div class="flex items-center gap-2 min-w-0">
            <Icon :name="kindIcon[artifact.kind]" :size="14" class="text-black/50 flex-shrink-0" />
            <p class="text-xs uppercase tracking-wider font-semibold truncate">{{ artifact.title }}</p>
            <span v-if="artifact.kind === 'gallery' && artifact.items?.length" class="text-xs text-black/40 ml-1">
              {{ galleryIndex + 1 }}/{{ artifact.items.length }}
            </span>
          </div>
          <button @click="close" aria-label="Chiudi" class="text-black/40 hover:text-black p-1">
            <Icon name="lucide:x" :size="16" />
          </button>
        </header>

        <div class="flex-1 overflow-y-auto bg-[#fafaf7] relative">
          <div v-if="artifact.kind === 'image' && artifact.src" class="h-full flex flex-col">
            <div class="flex-1 flex items-center justify-center p-4">
              <img :src="artifact.src" :alt="artifact.title" class="max-w-full max-h-full object-contain">
            </div>
            <p v-if="artifact.caption" class="px-5 py-3 text-xs text-black/60 border-t border-black/5 bg-white">{{ artifact.caption }}</p>
          </div>

          <div v-else-if="artifact.kind === 'gallery' && currentGalleryItem" class="h-full flex flex-col">
            <div class="flex-1 flex items-center justify-center p-4 relative">
              <img :src="currentGalleryItem.src" :alt="currentGalleryItem.caption || artifact.title" class="max-w-full max-h-full object-contain">
              <button v-if="(artifact.items?.length ?? 0) > 1" @click="prev" aria-label="Precedente" class="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white shadow flex items-center justify-center">
                <Icon name="lucide:chevron-left" :size="18" />
              </button>
              <button v-if="(artifact.items?.length ?? 0) > 1" @click="next" aria-label="Successivo" class="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white shadow flex items-center justify-center">
                <Icon name="lucide:chevron-right" :size="18" />
              </button>
            </div>
            <p v-if="currentGalleryItem.caption" class="px-5 py-3 text-xs text-black/60 border-t border-black/5 bg-white">{{ currentGalleryItem.caption }}</p>
          </div>

          <div v-else-if="artifact.kind === 'video' && artifact.src" class="h-full flex items-center justify-center p-4 bg-black">
            <video :src="artifact.src" controls autoplay class="max-w-full max-h-full" />
          </div>

          <iframe v-else-if="artifact.kind === 'pdf' && artifact.src" :src="artifact.src" class="w-full h-full" :title="artifact.title" />

          <div v-else-if="artifact.kind === 'html'" class="p-6 prose prose-sm max-w-none" v-html="artifact.html" />

          <iframe v-else-if="artifact.kind === 'embed' && artifact.src" :src="artifact.src" class="w-full h-full" allowfullscreen :title="artifact.title" />
        </div>

        <footer class="px-5 py-2 border-t border-black/5 text-[10px] text-black/40 uppercase tracking-wider">
          Esc per chiudere<span v-if="artifact.kind === 'gallery'"> · ← → per navigare</span>
        </footer>
      </aside>
    </Transition>
  </Teleport>
</template>

<style scoped>
@media (prefers-reduced-motion: reduce) {
  .artifact-pane { transition: none !important; }
}
</style>

<style>
/* Split: su schermi larghi (≥1280px) la main si restringe invece di essere coperta */
@media (min-width: 1280px) {
  main.site-main { transition: padding-right 280ms cubic-bezier(0.16, 1, 0.3, 1); }
  body.artifact-open main.site-main { padding-right: 820px; }
}
@media (prefers-reduced-motion: reduce) {
  main.site-main { transition: none !important; }
}
</style>
