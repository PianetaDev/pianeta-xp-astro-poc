<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import type { ContentItem } from '~/types/content'
import { useRailFlyout } from '~/composables/useRailFlyout'
import { useFormatters } from '~/composables/useFormatters'
import { useRoute, useState, $fetch } from '~/lib/nuxt-shims'
import Icon from '~/components/vue/shims/Icon.vue'
import NuxtLink from '~/components/vue/shims/NuxtLink.vue'
import NuxtImg from '~/components/vue/shims/NuxtImg.vue'

const { open, hide } = useRailFlyout()
const { formatDate } = useFormatters()
const route = useRoute()

const sections = {
  work:     { title: 'Work',     viewAll: '/work',     icon: 'lucide:briefcase' },
  bulletin: { title: 'Bulletin', viewAll: '/bulletin', icon: 'lucide:newspaper' },
  services: { title: 'Services', viewAll: '/services', icon: 'lucide:sparkles' },
  team:     { title: 'Team',     viewAll: '/team',     icon: 'lucide:users' },
  lab:      { title: 'Lab',      viewAll: '/lab',      icon: 'lucide:flask-conical' },
  careers:  { title: 'Careers',  viewAll: '/careers',  icon: 'lucide:briefcase-business' },
} as const

const cache = useState<Record<string, ContentItem[]>>('rail-flyout-cache', () => ({}))

const items = computed(() => (open.value ? (cache.value[open.value] || []) : []))
const current = computed(() => (open.value ? sections[open.value] : null))

watch(open, async (s) => {
  if (!s || cache.value[s]) return
  try {
    cache.value[s] = await $fetch<ContentItem[]>(`/api/content-list/${s}`)
  } catch {
    cache.value[s] = []
  }
})

watch(() => route.fullPath, () => hide())

const panelRef = ref<HTMLElement | null>(null)
function onDocClick(e: MouseEvent) {
  if (!open.value) return
  const target = e.target as HTMLElement | null
  if (!target) return
  if (panelRef.value?.contains(target)) return
  if (target.closest('.site-rail')) return
  hide()
}
function onKey(e: KeyboardEvent) { if (e.key === 'Escape') hide() }
onMounted(() => {
  document.addEventListener('click', onDocClick, true)
  document.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick, true)
  document.removeEventListener('keydown', onKey)
})

function meta(item: ContentItem, type: string) {
  if (type === 'work')     return [item.client, item.year].filter(Boolean).join(' · ')
  if (type === 'team')     return item.role
  if (type === 'bulletin') return formatDate(item.date, { day: '2-digit', month: 'short', year: 'numeric' })
  if (type === 'services') {
    const n = item.deliverables?.length
    return n ? `${n} deliverable${n === 1 ? '' : 's'}` : ''
  }
  if (type === 'lab')      return [item.kind, item.year].filter(Boolean).join(' · ')
  if (type === 'careers')  return [item.employmentType, item.location].filter(Boolean).join(' · ')
  return ''
}
</script>

<template>
  <Transition
    enter-active-class="transition duration-200"
    enter-from-class="opacity-0 -translate-x-2"
    enter-to-class="opacity-100 translate-x-0"
    leave-active-class="transition duration-150"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="open && current"
      ref="panelRef"
      class="rail-flyout fixed top-0 left-[88px] h-screen w-[360px] bg-white border-r border-black/10 z-40 shadow-xl flex flex-col"
    >
      <header class="px-6 pt-6 pb-3 flex items-center justify-between border-b border-black/5">
        <div class="flex items-center gap-2">
          <Icon :name="current.icon" :size="18" />
          <h3 class="text-sm uppercase tracking-wider font-semibold">{{ current.title }}</h3>
          <span class="text-xs text-black/40">{{ items.length }}</span>
        </div>
        <div class="flex items-center gap-2">
          <NuxtLink :to="current.viewAll" class="text-xs text-black/60 hover:text-black flex items-center gap-1">
            All <Icon name="lucide:arrow-right" :size="12" />
          </NuxtLink>
          <button @click="hide" class="text-black/40 hover:text-black p-1" aria-label="Chiudi pannello">
            <Icon name="lucide:x" :size="16" />
          </button>
        </div>
      </header>

      <div class="flex-1 overflow-y-auto px-3 py-3">
        <p v-if="!items.length" class="px-3 py-6 text-xs text-black/40">Nessun contenuto ancora.</p>

        <ul v-else class="space-y-1">
          <li v-for="item in items" :key="item.path">
            <NuxtLink
              :to="item.path"
              class="flex gap-3 p-2 rounded-lg hover:bg-black/5 transition group"
            >
              <div class="w-16 h-16 rounded-md bg-black/5 overflow-hidden flex-shrink-0">
                <NuxtImg
                  v-if="item.cover || item.photo"
                  :src="item.cover || item.photo"
                  :alt="item.title || item.name"
                  width="64"
                  height="64"
                  format="webp"
                  class="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  loading="lazy"
                />
                <div v-else class="w-full h-full flex items-center justify-center text-black/30">
                  <Icon :name="current.icon" :size="20" />
                </div>
              </div>
              <div class="flex-1 min-w-0 py-0.5">
                <p class="text-sm font-medium line-clamp-1">{{ item.title || item.name }}</p>
                <p class="text-xs text-black/50 mt-0.5 line-clamp-1">{{ meta(item, open!) }}</p>
                <p v-if="item.description" class="text-xs text-black/40 mt-1 line-clamp-2">{{ item.description }}</p>
              </div>
            </NuxtLink>
          </li>
        </ul>
      </div>

      <footer class="px-6 py-3 border-t border-black/5 text-[10px] text-black/40 uppercase tracking-wider">
        Esc per chiudere
      </footer>
    </div>
  </Transition>
</template>
