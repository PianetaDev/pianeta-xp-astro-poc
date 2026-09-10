<script setup lang="ts">
/**
 * MediaCloud — Vue island per l'archivio foto Pianeta.Studio su xp.pianeta.studio.
 * Monta il motore Three.js (MediaCloudEngine) come Astro island client:only.
 *
 * Pattern: stessa struttura di ContactsBoard.vue — thin wrapper Vue su logica
 * TS pura, senza dipendenze React o Vue aggiuntive rispetto allo stack esistente.
 */
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { MediaCloudEngine, type MediaPhoto } from '../../../lib/media-cloud-engine'

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
      <div class="media-filter-row">
        <button
          type="button"
          :class="['media-chip', { 'media-chip-active': projectFilter === null }]"
          @click="projectFilter = null"
        >Tutti</button>
        <button
          v-for="slug in projectsWithPhotos"
          :key="slug"
          type="button"
          :class="['media-chip', { 'media-chip-active': projectFilter === slug }]"
          @click="projectFilter = (projectFilter === slug ? null : slug)"
        >{{ slug }}</button>
      </div>
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
        <button class="media-detail-close" @click="selected = null">✕</button>
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
          <p v-if="selected.project_slug" class="media-detail-project">{{ selected.project_slug }}</p>
          <p v-if="selected.photographer" class="media-detail-photographer">{{ selected.photographer }}</p>
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
  margin-bottom: 0.5rem;
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
.media-filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}
.media-chip {
  padding: 0.25rem 0.65rem;
  border: 1px solid var(--pianeta-border, #ddd);
  border-radius: 100px;
  background: transparent;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.media-chip-active {
  background: var(--cta-primary, #FF6B33);
  color: #fff;
  border-color: var(--cta-primary, #FF6B33);
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
  position: relative;
}
.media-detail-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  color: var(--pianeta-muted, #666);
}
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
.media-detail-project,
.media-detail-photographer {
  font-size: 0.8rem;
  color: var(--pianeta-muted, #666);
  margin: 0.2rem 0;
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
