import { ref, type Ref } from 'vue'

export type ConsentState = {
  necessary: boolean
  analytics: boolean
  marketing: boolean
  decided: boolean
  decidedAt: string | null
}

export const DEFAULT_CONSENT: ConsentState = {
  necessary: true,
  analytics: false,
  marketing: false,
  decided: false,
  decidedAt: null,
}

const STORAGE_KEY = 'cookie-consent'

function loadFromStorage(): ConsentState {
  if (typeof window === 'undefined') return { ...DEFAULT_CONSENT }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...DEFAULT_CONSENT, ...JSON.parse(raw) }
  } catch {}
  return { ...DEFAULT_CONSENT }
}

let _state: Ref<ConsentState> | null = null
function getState(): Ref<ConsentState> {
  if (!_state) _state = ref<ConsentState>(loadFromStorage())
  return _state
}

export function useConsent() {
  const stateRef = getState()
  const state = stateRef.value

  const persist = () => {
    if (typeof window === 'undefined') return
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(stateRef.value)) } catch {}
  }

  const apply = (patch: Partial<ConsentState>) => {
    Object.assign(stateRef.value, patch)
    persist()
  }

  const acceptAll = () => apply({ necessary: true, analytics: true, marketing: true, decided: true, decidedAt: new Date().toISOString() })
  const rejectAll = () => apply({ necessary: true, analytics: false, marketing: false, decided: true, decidedAt: new Date().toISOString() })
  const updatePartial = (patch: Partial<ConsentState>) =>
    apply({ ...patch, necessary: true, decided: true, decidedAt: new Date().toISOString() })
  const reopen = () => apply({ decided: false })

  return { state, acceptAll, rejectAll, updatePartial, reopen }
}
