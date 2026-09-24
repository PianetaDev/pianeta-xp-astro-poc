<script setup lang="ts">
/**
 * MediaCloud — Vue island per l'archivio foto Pianeta.Studio su xp.pianeta.studio.
 * Monta il motore Three.js (MediaCloudEngine) come Astro island client:only.
 *
 * Pattern: stessa struttura di ContactsBoard.vue — thin wrapper Vue su logica
 * TS pura, senza dipendenze React o Vue aggiuntive rispetto allo stack esistente.
 */
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { MediaCloudEngine, type MediaPhoto, type MediaUsage } from '../../../lib/media-cloud-engine'

/** Costruisce l'URL interno per un usage — /work/slug, /bulletin/slug, ecc. */
function usageUrl(u: MediaUsage): string {
  return `/${u.content_type}/${u.content_slug}`
}

/** Label human-readable del content_type */
const CONTENT_TYPE_LABELS: Record<string, string> = {
  work: 'Work',
  bulletin: 'Bulletin',
  services: 'Servizi',
  lab: 'Lab',
  team: 'Team',
  careers: 'Careers',
}

const containerRef = ref<HTMLDivElement | null>(null)
const photos = ref<MediaPhoto[]>([])
const photosLoaded = ref(false)
const selected = ref<MediaPhoto | null>(null)
const projectFilter = ref<string | null>(null)
const matchedIds = ref<Set<string> | null>(null)
const searchQuery = ref('')
const searching = ref(false)
const showLanding = ref(true)
const landingClosing = ref(false)
const similarLoading = ref(false)
const copyLinkState = ref<'idle' | 'copied'>('idle')

let engine: MediaCloudEngine | null = null

// Deduplicate project slugs present in photos
const projectsWithPhotos = ref<string[]>([])

function thumbUrl(path: string): string {
  return `/api/media/thumb?path=${encodeURIComponent(path)}`
}

async function loadPhotos(attempt = 0) {
  try {
    const res = await fetch('/api/media/photos')
    if (!res.ok) throw new Error(`${res.status}`)
    const json = await res.json()
    photos.value = json.photos ?? []
    photosLoaded.value = true
    projectsWithPhotos.value = [
      ...new Set(photos.value.map((p) => p.project_slug).filter((s): s is string => s !== null)),
    ]
  } catch {
    if (attempt < 4) setTimeout(() => loadPhotos(attempt + 1), 1000 * 2 ** attempt)
  }
}

async function runSearch(query: string) {
  const q = query.trim()
  if (!q) { matchedIds.value = null; return }
  searching.value = true
  try {
    const res = await fetch(`/api/media/search?q=${encodeURIComponent(q)}`)
    if (!res.ok) throw new Error(`search ${res.status}`)
    const json = await res.json()
    matchedIds.value = new Set((json.photos ?? []).map((p: { id: string }) => p.id))
  } catch {
    // leave previous filter
  } finally {
    searching.value = false
  }
}

async function seeSimilar(photoId: string) {
  similarLoading.value = true
  try {
    const res = await fetch(`/api/media/similar?id=${encodeURIComponent(photoId)}`)
    if (!res.ok) throw new Error(`similar ${res.status}`)
    const json = await res.json()
    const ids = new Set<string>((json.photos ?? []).map((p: { id: string }) => p.id))
    ids.add(photoId)
    projectFilter.value = null
    searchQuery.value = ''
    matchedIds.value = ids
    selected.value = null
  } catch {
    // leave view
  } finally {
    similarLoading.value = false
  }
}

const LANDING_CLOSE_MS = 500
function dismissLanding(slug?: string) {
  landingClosing.value = true
  if (slug) projectFilter.value = slug
  setTimeout(() => {
    showLanding.value = false
    landingClosing.value = false
    engine?.dismissLanding()
  }, LANDING_CLOSE_MS)
}

function clearFilters() {
  searchQuery.value = ''
  matchedIds.value = null
  projectFilter.value = null
}

onMounted(async () => {
  // Deep-link: skip landing immediately before fetching so the user never sees it
  const photoId = new URLSearchParams(window.location.search).get('photo')
  if (photoId) showLanding.value = false

  await loadPhotos()

  if (containerRef.value) {
    engine = new MediaCloudEngine({
      container: containerRef.value,
      thumbUrl,
      onPhotoClick: (photo) => { selected.value = photo },
      onProjectClick: (slug) => { projectFilter.value = slug },
    })
    syncEngine()
  }

  // After photos are loaded, open the deep-linked photo
  if (photoId) {
    const photo = photos.value.find((p) => p.id === photoId)
    if (photo) selected.value = photo
  }
})

onUnmounted(() => {
  engine?.destroy()
  engine = null
})

function syncEngine() {
  if (!engine) return
  engine.updatePhotos(photos.value, {
    projectFilter: projectFilter.value,
    matchedIds: matchedIds.value,
    showLanding: showLanding.value,
  })
}

watch([photos, projectFilter, matchedIds, showLanding], syncEngine)

const visiblePhotos = () =>
  photos.value.filter(
    (p) =>
      (matchedIds.value === null || matchedIds.value.has(p.id)) &&
      (projectFilter.value === null || p.project_slug === projectFilter.value),
  )

const selectedIndex = () => {
  const s = selected.value
  if (!s) return -1
  return visiblePhotos().findIndex((p) => p.id === s.id)
}

function stepSelected(delta: number) {
  const idx = selectedIndex()
  if (idx === -1) return
  const next = visiblePhotos()[idx + delta]
  if (next) selected.value = next
}

function handleKeydown(e: KeyboardEvent) {
  const tag = (document.activeElement as HTMLElement | null)?.tagName
  if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return
  if (!selected.value) return
  if (e.key === 'ArrowLeft') stepSelected(-1)
  else if (e.key === 'ArrowRight') stepSelected(1)
  else if (e.key === 'Escape') selected.value = null
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))

// Permalink: sync ?photo=<id> in URL when selection changes
watch(selected, (photo) => {
  const url = new URL(window.location.href)
  if (photo) {
    url.searchParams.set('photo', photo.id)
  } else {
    url.searchParams.delete('photo')
  }
  window.history.pushState({}, '', url.toString())
})

function copyPhotoLink() {
  navigator.clipboard.writeText(window.location.href)
  copyLinkState.value = 'copied'
  setTimeout(() => { copyLinkState.value = 'idle' }, 2000)
}
</script>

<template>
  <div class="media-cloud-wrap">
    <!-- Landing gate -->
    <div v-if="showLanding" :class="['media-landing', { closing: landingClosing }]">
      <div class="media-landing-content">
        <p class="media-landing-eyebrow">Pianeta.Studio</p>
        <h1>Portfolio<br>visivo</h1>
        <p class="media-landing-copy">
          <template v-if="photosLoaded">
            {{ photos.length }} foto di {{ projectsWithPhotos.length }} progetti, organizzate per prossimità visiva.
          </template>
          <template v-else>Caricamento archivio…</template>
        </p>
        <button type="button" class="media-landing-cta" @click="dismissLanding()">Esplora</button>
        <div v-if="projectsWithPhotos.length > 0" class="media-landing-projects">
          <p class="media-landing-hint">oppure scegli un progetto</p>
          <button
            v-for="slug in projectsWithPhotos"
            :key="slug"
            type="button"
            @click="dismissLanding(slug)"
          >{{ slug }}</button>
        </div>
      </div>
    </div>

    <!-- Three.js canvas mount point -->
    <div ref="containerRef" class="media-canvas" />

    <!-- Search + filter bar -->
    <div v-if="!showLanding" class="media-search-bar">
      <form @submit.prevent="runSearch(searchQuery)">
        <input
          type="text"
          placeholder="Cerca…"
          v-model="searchQuery"
        />
        <button type="submit" aria-label="Cerca" :disabled="searching">→</button>
      </form>
      <button
        v-if="matchedIds !== null || projectFilter !== null"
        type="button"
        class="media-search-clear"
        @click="clearFilters"
      >Azzera filtri ✕</button>
    </div>

    <!-- Photo lightbox -->
    <div v-if="selected" class="media-detail-backdrop" @click="selected = null">
      <aside class="media-detail" @click.stop>
        <div class="media-detail-header">
          <button class="media-detail-close" @click="selected = null">✕</button>
          <button class="media-copy-link" @click="copyPhotoLink">
            {{ copyLinkState === 'copied' ? 'Copiato!' : 'Copia link' }}
          </button>
        </div>
        <div class="media-detail-media">
          <img
            v-if="selected.thumbnail_path"
            class="media-detail-img"
            :src="thumbUrl(selected.thumbnail_path)"
            :alt="selected.caption ?? ''"
          />
        </div>
        <div class="media-detail-info">
          <p class="media-detail-caption">{{ selected.caption || 'Nessuna didascalia' }}</p>
          <p v-if="selected.photographer" class="media-detail-photographer">{{ selected.photographer }}</p>
          <!-- Usages: link cliccabili alle pagine del sito che usano questa foto -->
          <div v-if="selected.pianeta_media_usages?.length" class="media-detail-usages">
            <p class="media-detail-usages-label">Usata in</p>
            <ul class="media-detail-usages-list">
              <li v-for="u in selected.pianeta_media_usages" :key="u.id" class="media-usage-item">
                <a :href="usageUrl(u)" class="media-usage-link">
                  <span class="media-usage-type">{{ CONTENT_TYPE_LABELS[u.content_type] ?? u.content_type }}</span>
                  <span v-if="u.field !== 'cover'" class="media-usage-field">({{ u.field }})</span>
                  <span class="media-usage-title">{{ u.title ?? u.content_slug }}</span>
                </a>
                <p v-if="u.description" class="media-usage-description">{{ u.description }}</p>
              </li>
            </ul>
          </div>
          <button
            type="button"
            class="media-see-similar"
            :disabled="similarLoading"
            @click="seeSimilar(selected!.id)"
          >{{ similarLoading ? 'Cerco simili…' : 'Vedi simili' }}</button>
          <div class="media-detail-nav">
            <button type="button" :disabled="selectedIndex() <= 0" @click="stepSelected(-1)">‹ Precedente</button>
            <button type="button" :disabled="selectedIndex() === -1 || selectedIndex() >= visiblePhotos().length - 1" @click="stepSelected(1)">Successivo ›</button>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.media-cloud-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.media-canvas {
  flex: 1;
  width: 100%;
  min-height: 0;
  cursor: grab;
}
.media-canvas:active { cursor: grabbing; }

/* Landing gate */
.media-landing {
  position: absolute;
  inset: 0;
  z-index: 100;
  background: #fafaf7;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: media-fade-in 0.4s ease forwards;
}
.media-landing.closing {
  animation: media-fade-out 0.5s ease forwards;
}
@keyframes media-fade-in { from { opacity: 0 } to { opacity: 1 } }
@keyframes media-fade-out { from { opacity: 1 } to { opacity: 0 } }

.media-landing-content {
  text-align: center;
  max-width: 380px;
  padding: 2rem;
}
.media-landing-eyebrow {
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--pianeta-muted, #666);
  margin-bottom: 0.5rem;
}
.media-landing-content h1 {
  font-size: clamp(2rem, 8vw, 3.5rem);
  line-height: 1.1;
  margin: 0 0 1rem;
  color: var(--pianeta-text, #0e1116);
}
.media-landing-copy {
  color: var(--pianeta-muted, #666);
  margin-bottom: 1.5rem;
}
.media-landing-cta {
  display: inline-block;
  background: var(--cta-primary, #FF6B33);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  cursor: pointer;
  font-weight: 600;
}
.media-landing-projects {
  margin-top: 1.5rem;
}
.media-landing-hint {
  font-size: 0.8rem;
  color: var(--pianeta-muted, #999);
  margin-bottom: 0.5rem;
}
.media-landing-projects button {
  margin: 0.25rem;
  padding: 0.35rem 0.8rem;
  border: 1px solid var(--pianeta-border, #ddd);
  border-radius: 6px;
  background: transparent;
  cursor: pointer;
  font-size: 0.85rem;
}

/* Search bar */
.media-search-bar {
  position: absolute;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(250, 250, 247, 0.92);
  backdrop-filter: blur(8px);
  border: 1px solid var(--pianeta-border, #ddd);
  border-radius: 12px;
  padding: 0.75rem 1rem;
  min-width: 320px;
  max-width: 90vw;
  z-index: 10;
}
.media-search-bar form {
  display: flex;
  gap: 0.5rem;
}
.media-search-bar input {
  flex: 1;
  border: 1px solid var(--pianeta-border, #ddd);
  border-radius: 6px;
  padding: 0.4rem 0.75rem;
  font-size: 0.9rem;
  background: #fff;
}
.media-search-bar button[type="submit"] {
  border: 1px solid var(--pianeta-border, #ddd);
  border-radius: 6px;
  background: #fff;
  padding: 0.4rem 0.75rem;
  cursor: pointer;
}
.media-search-clear {
  display: block;
  margin-top: 0.5rem;
  background: none;
  border: none;
  font-size: 0.8rem;
  color: var(--pianeta-muted, #666);
  cursor: pointer;
  text-decoration: underline;
}

/* Lightbox */
.media-detail-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(14, 17, 22, 0.6);
  z-index: 200;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
}
.media-detail {
  background: #fafaf7;
  border-radius: 16px 0 0 0;
  width: min(420px, 95vw);
  max-height: 90vh;
  overflow-y: auto;
  padding: 1.5rem;
}
.media-detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}
.media-detail-close {
  background: none;
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  color: var(--pianeta-muted, #666);
  padding: 0;
}
.media-copy-link {
  background: none;
  border: 1px solid var(--pianeta-border, #ddd);
  border-radius: 6px;
  padding: 0.25rem 0.6rem;
  font-size: 0.78rem;
  cursor: pointer;
  color: var(--pianeta-muted, #666);
  transition: color 0.15s, border-color 0.15s;
}
.media-copy-link:hover { color: var(--cta-primary, #FF6B33); border-color: var(--cta-primary, #FF6B33); }
.media-detail-img {
  width: 100%;
  border-radius: 8px;
  display: block;
  margin-bottom: 1rem;
}
.media-detail-caption {
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}
.media-detail-photographer {
  font-size: 0.8rem;
  color: var(--pianeta-muted, #666);
  margin: 0.2rem 0;
}
.media-detail-usages {
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--pianeta-border, #eee);
}
.media-detail-usages-label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--pianeta-muted, #999);
  margin-bottom: 0.4rem;
}
.media-detail-usages-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.media-usage-item {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}
.media-usage-link {
  display: inline-flex;
  align-items: baseline;
  gap: 0.35rem;
  font-size: 0.85rem;
  color: var(--cta-primary, #FF6B33);
  text-decoration: none;
  flex-wrap: wrap;
}
.media-usage-link:hover .media-usage-title { text-decoration: underline; }
.media-usage-type {
  font-weight: 600;
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--pianeta-muted, #999);
  flex-shrink: 0;
}
.media-usage-title { color: var(--cta-primary, #FF6B33); font-weight: 500; }
.media-usage-field { color: var(--pianeta-muted, #bbb); font-size: 0.75rem; }
.media-usage-description {
  font-size: 0.78rem;
  color: var(--pianeta-muted, #666);
  margin: 0;
  line-height: 1.4;
}
.media-see-similar {
  margin-top: 1rem;
  display: block;
  width: 100%;
  border: 1px solid var(--pianeta-border, #ddd);
  border-radius: 8px;
  padding: 0.5rem;
  background: #fff;
  cursor: pointer;
  font-size: 0.85rem;
}
.media-detail-nav {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}
.media-detail-nav button {
  flex: 1;
  border: 1px solid var(--pianeta-border, #ddd);
  border-radius: 8px;
  padding: 0.5rem;
  background: #fff;
  cursor: pointer;
  font-size: 0.85rem;
}
.media-detail-nav button:disabled { opacity: 0.4; cursor: not-allowed; }
</style>
