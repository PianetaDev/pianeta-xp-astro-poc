<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useSidePane, type SidePaneKind } from '~/composables/useSidePane'
import { useRoute } from '~/lib/nuxt-shims'
import Icon from '~/components/vue/shims/Icon.vue'

const { pane, open, close } = useSidePane()
const route = useRoute()

// Restringe la main quando il pane è aperto (desktop) — vedi CSS body.sidepane-open.
watch(pane, (p) => {
  if (typeof document !== 'undefined') {
    document.body.classList.toggle('sidepane-open', !!p)
  }
  if (p) { email.value = ''; status.value = 'idle' }
})

// Chiudi al cambio pagina
watch(() => route.fullPath, () => { if (pane.value) close() })

// Trigger esterni (link Astro server-rendered): window.dispatchEvent(new CustomEvent('sidepane:open',{detail:'bulletin'}))
function onExternalOpen(e: Event) {
  const kind = (e as CustomEvent).detail as SidePaneKind
  if (kind) open(kind)
}
function onKey(e: KeyboardEvent) { if (e.key === 'Escape' && pane.value) close() }
// Mutua esclusività: se si apre Alba, chiudi il side-pane
function onAlbaOpen() { if (pane.value) close() }
onMounted(() => {
  window.addEventListener('sidepane:open', onExternalOpen)
  window.addEventListener('alba:open', onAlbaOpen)
  window.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  window.removeEventListener('sidepane:open', onExternalOpen)
  window.removeEventListener('alba:open', onAlbaOpen)
  window.removeEventListener('keydown', onKey)
  if (typeof document !== 'undefined') document.body.classList.remove('sidepane-open')
})

// --- Bulletin form ---
const email = ref('')
const status = ref<'idle' | 'loading' | 'done' | 'error'>('idle')
async function submitBulletin() {
  if (!email.value || status.value === 'loading') return
  status.value = 'loading'
  try {
    const res = await fetch('/api/newsletter/subscribe', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ email: email.value }),
    })
    status.value = res.ok ? 'done' : 'error'
  } catch {
    status.value = 'error'
  }
}
</script>

<template>
  <Teleport to="body">
    <!-- Backdrop solo mobile (desktop = split, niente overlay) -->
    <Transition enter-active-class="transition duration-200" enter-from-class="opacity-0" enter-to-class="opacity-100"
                leave-active-class="transition duration-150" leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="pane" class="sidepane-backdrop" @click="close" />
    </Transition>

    <Transition name="sidepane">
      <aside v-if="pane" class="sidepane" role="dialog" :aria-label="pane.title">
        <header class="sidepane-head">
          <p class="sidepane-title">{{ pane.title }}</p>
          <button @click="close" aria-label="Chiudi" class="sidepane-close"><Icon name="lucide:x" :size="18" /></button>
        </header>

        <div class="sidepane-body">
          <!-- Bulletin -->
          <div v-if="pane.kind === 'bulletin'">
            <template v-if="status !== 'done'">
              <p class="sidepane-lead">Una mail al mese su sustainable creativity, design e tecnologia.</p>
              <form class="sidepane-form" @submit.prevent="submitBulletin">
                <input v-model="email" type="email" required placeholder="tu@email.it" class="sidepane-input" />
                <button type="submit" class="sidepane-btn" :disabled="status === 'loading'">
                  {{ status === 'loading' ? '…' : 'Iscrivimi' }}
                </button>
              </form>
              <p v-if="status === 'error'" class="sidepane-err">Qualcosa è andato storto. Riprova.</p>
              <p class="sidepane-fine">Iscrivendoti accetti la nostra <a href="/privacy">privacy</a>.</p>
            </template>
            <div v-else class="sidepane-done">
              <Icon name="lucide:check-circle" :size="28" />
              <p>Iscrizione ricevuta. Controlla la mail per confermare.</p>
            </div>
          </div>
        </div>
      </aside>
    </Transition>
  </Teleport>
</template>

<style>
/* ── Shrink della main quando il pane è aperto (desktop) ── */
@media (min-width: 1024px) {
  main.site-main { transition: padding-right 280ms cubic-bezier(0.16, 1, 0.3, 1); }
  body.sidepane-open main.site-main { padding-right: 440px; }
}
@media (prefers-reduced-motion: reduce) {
  main.site-main { transition: none !important; }
}

.sidepane-backdrop { position: fixed; inset: 0; background: rgba(14,17,22,0.3); backdrop-filter: blur(2px); z-index: 40; }
@media (min-width: 1024px) { .sidepane-backdrop { display: none; } }

.sidepane {
  position: fixed; top: 0; right: 0; bottom: 0;
  width: 100%; max-width: 420px;
  background: var(--pianeta-bg-card, #fff);
  color: var(--pianeta-text, #0e1116);
  border-left: 1px solid rgba(14,17,22,0.08);
  box-shadow: -20px 0 60px rgba(14,17,22,0.12);
  z-index: 50; display: flex; flex-direction: column;
}
@media (max-width: 1023px) {
  .sidepane { top: auto; left: 0; width: 100%; max-width: 100%; height: 86vh;
    border-left: 0; border-top: 1px solid rgba(14,17,22,0.08); border-radius: 20px 20px 0 0; }
}

.sidepane-head { display: flex; align-items: center; justify-content: space-between;
  padding: 16px 20px; border-bottom: 1px solid rgba(14,17,22,0.06); }
.sidepane-title { font-size: 13px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; margin: 0; }
.sidepane-close { background: transparent; border: 0; width: 34px; height: 34px; border-radius: 999px;
  display: flex; align-items: center; justify-content: center; color: inherit; cursor: pointer; }
.sidepane-close:hover { background: rgba(14,17,22,0.06); }

.sidepane-body { flex: 1; overflow-y: auto; padding: 22px 20px; }
.sidepane-lead { font-size: 14px; opacity: 0.7; margin: 0 0 16px; }
.sidepane-form { display: flex; flex-direction: column; gap: 10px; }
.sidepane-input { border: 1px solid rgba(14,17,22,0.2); border-radius: 10px; padding: 12px 14px;
  background: var(--pianeta-bg, #fff); color: inherit; font: inherit; }
.sidepane-btn { background: #0e1116; color: #fff; border: 0; border-radius: 10px; padding: 12px;
  font-weight: 600; cursor: pointer; }
.sidepane-btn:disabled { opacity: 0.6; cursor: default; }
.sidepane-err { color: #c0392b; font-size: 13px; margin: 10px 0 0; }
.sidepane-fine { font-size: 11px; opacity: 0.5; margin: 14px 0 0; }
.sidepane-fine a { text-decoration: underline; }
.sidepane-done { display: flex; flex-direction: column; align-items: center; gap: 12px;
  text-align: center; padding: 30px 10px; color: #1f7a3a; }

/* Slide-in: da destra (desktop), dal basso (mobile) */
.sidepane-enter-active, .sidepane-leave-active { transition: transform 280ms cubic-bezier(0.16, 1, 0.3, 1), opacity 200ms; }
.sidepane-enter-from, .sidepane-leave-to { transform: translateX(100%); opacity: 0; }
@media (max-width: 1023px) {
  .sidepane-enter-from, .sidepane-leave-to { transform: translateY(100%); opacity: 1; }
}
@media (prefers-reduced-motion: reduce) {
  .sidepane, .sidepane-enter-active, .sidepane-leave-active { transition: none !important; }
}
</style>
