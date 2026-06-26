import { watch } from 'vue'
import { useRoute } from '~/lib/nuxt-shims'
import { useAlbaFloater } from './useAlbaFloater'

export function useAlbaContext() {
  const route = useRoute()
  const { setContext } = useAlbaFloater()
  watch(
    () => (route.meta as any)?.alba as any,
    (alba) => {
      if (alba) setContext({ context: alba.context, contextSlug: alba.contextSlug, suggested: alba.suggested })
      else setContext({})
    },
    { immediate: true }
  )
}
