import { useState } from '~/lib/nuxt-shims'

export type AlbaArtifact = {
  title: string
  kind: 'preview' | 'document' | 'schedule' | 'card' | 'html'
  payload: any
} | null

export const useAlbaArtifact = () => {
  const artifact = useState<AlbaArtifact>('alba-artifact', () => null)
  const open = (a: NonNullable<AlbaArtifact>) => { artifact.value = a }
  const close = () => { artifact.value = null }
  return { artifact, open, close }
}
