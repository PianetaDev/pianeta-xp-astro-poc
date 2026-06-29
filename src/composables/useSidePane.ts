import { useState } from '~/lib/nuxt-shims'

// Side-pane generico e riusabile: si apre a destra e (desktop) restringe la main.
// Stesso meccanismo del takeover di Alba (body class → padding-right su main),
// ma generalizzato a più contenuti. Mobile: overlay/bottom-sheet.

export type SidePaneKind = 'bulletin'

export type SidePaneState = { kind: SidePaneKind; title: string } | null

const TITLES: Record<SidePaneKind, string> = {
  bulletin: 'Iscriviti al Bulletin',
}

export const useSidePane = () => {
  const pane = useState<SidePaneState>('side-pane', () => null)
  const open = (kind: SidePaneKind, title?: string) => {
    pane.value = { kind, title: title ?? TITLES[kind] }
  }
  const close = () => { pane.value = null }
  return { pane, open, close }
}
