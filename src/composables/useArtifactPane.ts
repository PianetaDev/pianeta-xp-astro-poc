import { watch } from 'vue'
import { useState } from '~/lib/nuxt-shims'

export type ArtifactKind = 'image' | 'video' | 'pdf' | 'html' | 'gallery' | 'embed'

export type Artifact = {
  title: string
  kind: ArtifactKind
  src?: string
  caption?: string
  items?: Array<{ src: string; caption?: string }>
  html?: string
} | null

export const useArtifactPane = () => {
  const artifact = useState<Artifact>('artifact-pane', () => null)
  const galleryIndex = useState<number>('artifact-pane-gallery-idx', () => 0)
  const open = (a: NonNullable<Artifact>) => { artifact.value = a }
  const close = () => { artifact.value = null }
  const next = () => {
    if (!artifact.value || artifact.value.kind !== 'gallery' || !artifact.value.items?.length) return
    galleryIndex.value = (galleryIndex.value + 1) % artifact.value.items.length
  }
  const prev = () => {
    if (!artifact.value || artifact.value.kind !== 'gallery' || !artifact.value.items?.length) return
    const n = artifact.value.items.length
    galleryIndex.value = (galleryIndex.value - 1 + n) % n
  }
  watch(artifact, (a) => { if (!a || a.kind !== 'gallery') galleryIndex.value = 0 })
  return { artifact, galleryIndex, open, close, next, prev }
}
