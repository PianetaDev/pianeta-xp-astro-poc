<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from '~/lib/nuxt-shims'
import { useHireUsDrawer } from '~/composables/useHireUsDrawer'

const route = useRoute()
const drawer = useHireUsDrawer()

const EXCLUDED = ['/', '/choosetoseethem', '/hire-us']
const shouldHide = computed(() => {
  if (EXCLUDED.includes(route.path)) return true
  if (route.path.startsWith('/orbit/')) return true
  if (route.path.startsWith('/hire-us/')) return true
  return false
})

const onClick = () => {
  drawer.open()
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'hire_us_opened', { source_page: route.path })
  }
}
</script>

<template>
  <button
    v-if="!shouldHide"
    @click="onClick"
    aria-label="Open Hire Us conversation"
    class="hire-us-launcher hidden md:flex fixed top-4 right-4 z-30 group items-center gap-1.5 bg-black text-white px-4 py-2.5 text-sm font-medium hover:bg-black/85 transition"
  >
    Hire Us
    <span class="group-hover:rotate-45 transition-transform duration-200">+</span>
  </button>
</template>
