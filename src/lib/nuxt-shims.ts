// Minimal Nuxt -> Vue3/Astro shims used by ported components/composables.
// Keep tiny — only what the islands need.
import { ref, computed, reactive, type Ref } from 'vue'

// useState: module-scoped singleton refs keyed by name (mimics Nuxt's per-key shared state).
const _stateRegistry = new Map<string, Ref<any>>()
export function useState<T>(key: string, init: () => T): Ref<T> {
  if (!_stateRegistry.has(key)) {
    _stateRegistry.set(key, ref(init()) as Ref<any>)
  }
  return _stateRegistry.get(key) as Ref<T>
}

// useRoute / useRouter — read window.location lazily and reactively-ish.
// Components mostly use route.path / route.query / route.fullPath / route.meta in watchers.
// We expose a reactive object refreshed on popstate + via a small SPA listener.
type RouteLike = {
  path: string
  fullPath: string
  hash: string
  query: Record<string, string>
  meta: Record<string, any>
}

function readRoute(): RouteLike {
  if (typeof window === 'undefined') {
    return { path: '/', fullPath: '/', hash: '', query: {}, meta: {} }
  }
  const url = new URL(window.location.href)
  const query: Record<string, string> = {}
  url.searchParams.forEach((v, k) => { query[k] = v })
  return {
    path: url.pathname,
    fullPath: url.pathname + url.search + url.hash,
    hash: url.hash,
    query,
    meta: {},
  }
}

const _route = reactive<RouteLike>(readRoute())
function refreshRoute() {
  const r = readRoute()
  _route.path = r.path
  _route.fullPath = r.fullPath
  _route.hash = r.hash
  _route.query = r.query
}
if (typeof window !== 'undefined') {
  window.addEventListener('popstate', refreshRoute)
  // Re-read on Astro view-transition or full nav (Astro uses full-page nav by default).
  // No-op otherwise.
}

export function useRoute(): RouteLike {
  return _route
}

type RouterLike = {
  replace: (loc: { path?: string; query?: Record<string, any>; hash?: string }) => void
  push: (loc: { path?: string; query?: Record<string, any>; hash?: string }) => void
}
export function useRouter(): RouterLike {
  const nav = (loc: { path?: string; query?: Record<string, any>; hash?: string }, replace: boolean) => {
    if (typeof window === 'undefined') return
    const url = new URL(loc.path || window.location.pathname, window.location.origin)
    if (loc.query) {
      Object.entries(loc.query).forEach(([k, v]) => {
        if (v === undefined || v === null) return
        url.searchParams.set(k, String(v))
      })
    }
    if (loc.hash) url.hash = loc.hash
    if (replace) window.history.replaceState({}, '', url.toString())
    else window.history.pushState({}, '', url.toString())
    refreshRoute()
  }
  return {
    replace: (loc) => nav(loc, true),
    push: (loc) => nav(loc, false),
  }
}

// $fetch: thin wrapper over fetch with JSON body + JSON response.
export async function $fetch<T = any>(
  url: string,
  opts: { method?: string; body?: any; headers?: Record<string, string> } = {}
): Promise<T> {
  const init: RequestInit = {
    method: opts.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(opts.headers || {}),
    },
  }
  if (opts.body !== undefined) {
    init.body = typeof opts.body === 'string' ? opts.body : JSON.stringify(opts.body)
  }
  const res = await fetch(url, init)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const ct = res.headers.get('content-type') || ''
  if (ct.includes('application/json')) return res.json() as Promise<T>
  return (await res.text()) as unknown as T
}

// navigateTo: replace with window.location assignment.
export function navigateTo(path: string) {
  if (typeof window !== 'undefined') window.location.href = path
}
