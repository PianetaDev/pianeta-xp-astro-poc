import { useState } from '~/lib/nuxt-shims'

type AlbaContext = { context?: string; contextSlug?: string; suggested?: string[] }

export function useAlbaFloater() {
  const open = useState<boolean>('alba-open', () => false)
  const pendingPrompt = useState<string | null>('alba-pending-prompt', () => null)
  const ctx = useState<AlbaContext>('alba-ctx', () => ({}))

  const setContext = (next: AlbaContext) => {
    ctx.value = { ...next }
  }
  const openPanel = () => { open.value = true }
  const closePanel = () => { open.value = false }
  const openWithPrompt = (prompt: string, override?: AlbaContext) => {
    if (override) setContext(override)
    pendingPrompt.value = prompt
    open.value = true
  }
  const consumePendingPrompt = () => {
    const p = pendingPrompt.value
    pendingPrompt.value = null
    return p
  }

  return { open, ctx, setContext, openPanel, closePanel, openWithPrompt, consumePendingPrompt }
}
