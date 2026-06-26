<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from '~/lib/nuxt-shims'
import Icon from '~/components/vue/shims/Icon.vue'
import NuxtLink from '~/components/vue/shims/NuxtLink.vue'

const open = ref(false)
const links = [
  { label: 'Home',     href: '/' },
  { label: 'Work',     href: '/work' },
  { label: 'Bulletin', href: '/bulletin' },
  { label: 'Services', href: '/services' },
  { label: 'Team',     href: '/team' },
  { label: 'Lab',      href: '/lab' },
  { label: 'Careers',  href: '/careers' },
]
const close = () => { open.value = false }
const route = useRoute()
watch(() => route.path, close)
</script>

<template>
  <div class="md:hidden">
    <button @click="open = true" aria-label="Open menu" class="fixed top-4 left-4 z-30 bg-white border border-black/10 p-2">
      <Icon name="lucide:menu" :size="20" />
    </button>
    <Teleport to="body">
      <Transition name="slide">
        <div v-if="open" class="fixed inset-0 z-50 bg-[#fafaf7] flex flex-col p-6">
          <div class="flex justify-between items-center mb-8">
            <p class="font-black text-lg">PIANETA.STUDIO</p>
            <button @click="close" aria-label="Close menu"><Icon name="lucide:x" :size="24" /></button>
          </div>
          <nav class="flex-1 flex flex-col gap-4 text-2xl font-bold">
            <NuxtLink v-for="l in links" :key="l.href" :to="l.href">{{ l.label }}</NuxtLink>
          </nav>
          <div class="text-sm text-black/50 space-y-2 pt-6 border-t border-black/10">
            <p>IT / EN</p>
            <NuxtLink to="/privacy" class="block">Privacy</NuxtLink>
            <NuxtLink to="/cookie" class="block">Cookie</NuxtLink>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.slide-enter-active, .slide-leave-active { transition: transform 200ms ease-out; }
.slide-enter-from, .slide-leave-to { transform: translateX(-100%); }
@media (prefers-reduced-motion: reduce) { .slide-enter-active, .slide-leave-active { transition: none; } }
</style>
