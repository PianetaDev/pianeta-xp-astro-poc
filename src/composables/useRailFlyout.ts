import { useState } from '~/lib/nuxt-shims'

type RailSection = 'work' | 'bulletin' | 'services' | 'team' | 'lab' | 'careers'

export const useRailFlyout = () => {
  const open = useState<RailSection | null>('rail-flyout', () => null)

  const show = (section: RailSection) => { open.value = section }
  const hide = () => { open.value = null }
  const toggle = (section: RailSection) => {
    open.value = open.value === section ? null : section
  }
  // backwards-compat noops
  const cancelClose = () => {}
  const scheduleClose = () => {}

  return { open, show, hide, toggle, cancelClose, scheduleClose }
}
