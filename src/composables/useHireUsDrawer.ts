import { watch } from 'vue'
import { useState, useRoute, useRouter } from '~/lib/nuxt-shims'

export function shouldOpenFromQuery(query: Record<string, any>): boolean {
  const v = query['hire-us']
  return v === 'open'
}

export function useHireUsDrawer() {
  const isOpen = useState<boolean>('hire-us-open', () => false)
  const route = useRoute()
  const router = useRouter()

  const open = () => {
    isOpen.value = true
    const q: Record<string, any> = { ...route.query, 'hire-us': 'open' }
    router.replace({ path: route.path, query: q, hash: route.hash })
  }
  const close = () => {
    isOpen.value = false
    const q: Record<string, any> = { ...route.query }
    delete q['hire-us']
    router.replace({ path: route.path, query: q, hash: route.hash })
  }
  const syncFromUrl = () => {
    isOpen.value = shouldOpenFromQuery(route.query as any)
  }

  if (typeof window !== 'undefined') {
    watch(() => route.query['hire-us'], () => syncFromUrl(), { immediate: true })
  }

  return { isOpen, open, close, syncFromUrl }
}
