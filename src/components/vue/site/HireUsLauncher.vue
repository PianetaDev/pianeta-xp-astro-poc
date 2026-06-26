<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useHireUsDrawer } from '~/composables/useHireUsDrawer'

const drawer = useHireUsDrawer()
const pathname = ref('')

const EXCLUDED = ['/', '/choosetoseethem', '/hire-us']
const shouldHide = computed(() => {
  if (!pathname.value) return true
  if (EXCLUDED.includes(pathname.value)) return true
  if (pathname.value.startsWith('/orbit/')) return true
  if (pathname.value.startsWith('/hire-us/')) return true
  return false
})

onMounted(() => {
  pathname.value = window.location.pathname
})

const onClick = () => {
  drawer.open()
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'hire_us_opened', { source_page: pathname.value })
  }
}
</script>

<template>
  <button
    v-if="!shouldHide"
    @click="onClick"
    aria-label="Open Hire Us conversation"
    class="hire-us-launcher hidden md:flex fixed top-4 right-4 z-30 group items-center gap-1.5 bg-black text-white px-4 py-2.5 text-sm font-medium hover:bg-black/85 transition rounded-full"
  >
    Hire Us
    <span class="group-hover:rotate-45 transition-transform duration-200">+</span>
  </button>
</template>
