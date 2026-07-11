<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { useAlbaSession } from '~/composables/useAlbaSession';
import { useAlbaFloater } from '~/composables/useAlbaFloater';

const session = useAlbaSession();
const floater = useAlbaFloater();

const visible = ref(false);
const dismissed = ref(false);

const SS_DISMISSED = 'alba_popup_dismissed';
const DEFAULT_DELAY_MS = 30_000;
const ROUTE_DELAY_MS: Record<string, number> = {
  '/work/eclag': 15_000,
  '/services/neuromarketing-lab': 18_000,
  '/lab/atlas': 18_000,
};

// Titolo statico contestualizzato + prompt che scorrono
function buildHeader(): { title: string; sub: string } {
  const path = typeof window !== 'undefined' ? window.location.pathname : '/';
  if (path.startsWith('/work/eclag')) return { title: 'Stai guardando ECLAG', sub: 'Posso raccontarti:' };
  if (path.startsWith('/work/bc3-rebranding')) return { title: 'BC3 rebranding', sub: 'Posso aiutarti su:' };
  if (path.startsWith('/work/untwist')) return { title: 'UNTWIST · nodi e fili', sub: 'Posso raccontarti:' };
  if (path.startsWith('/work/childfund')) return { title: 'ChildFund · data storytelling', sub: 'Posso aiutarti su:' };
  if (path.startsWith('/work/aries')) return { title: 'Aries · open science', sub: 'Posso aiutarti su:' };
  if (path.startsWith('/work/')) return { title: 'Curioso di questo progetto?', sub: 'Posso aiutarti su:' };
  if (path.startsWith('/services/')) return { title: 'Domanda su questo servizio?', sub: 'Posso aiutarti su:' };
  if (path.startsWith('/lab/')) return { title: 'Lab di Pianeta', sub: 'Posso aiutarti su:' };
  if (path.startsWith('/bulletin/')) return { title: 'C\'è qualcosa che ti rimbalza?', sub: 'Posso aiutarti su:' };
  if (path.startsWith('/team')) return { title: 'Persone di Pianeta', sub: 'Posso aiutarti su:' };
  if (path.startsWith('/careers')) return { title: 'Carriere in Pianeta', sub: 'Posso aiutarti su:' };
  return { title: 'Ciao 👋 Sono Alba', sub: 'Posso aiutarti su:' };
}

function buildPrompts(): string[] {
  const path = typeof window !== 'undefined' ? window.location.pathname : '/';
  if (path.startsWith('/work/eclag')) {
    return [
      'Raccontami ECLAG in 2 minuti',
      'Come avete validato i video?',
      'Posso applicarlo al mio caso?',
      'Fissiamo una call con Max',
    ];
  }
  if (path.startsWith('/work/')) {
    return [
      'Raccontami questo progetto',
      'Quanto ha richiesto?',
      'Posso parlarne con Max?',
      'Mostrami lavori simili',
    ];
  }
  if (path.startsWith('/services/')) {
    return [
      'Questo servizio fa al caso mio?',
      'Quanto costa indicativamente?',
      'Mostrami un caso pratico',
      'Posso fissare una call?',
    ];
  }
  if (path.startsWith('/lab/')) {
    return [
      'Come funziona questo progetto?',
      'Posso usarlo nel mio lavoro?',
      'Aprite a contributi esterni?',
      'Parla con Max del lab',
    ];
  }
  if (path.startsWith('/bulletin/')) {
    return [
      'Approfondisci questo articolo',
      'Avete altri pezzi simili?',
      'Posso fare qualche domanda?',
      'Mi iscrivo al bulletin',
    ];
  }
  if (path.startsWith('/team')) {
    return [
      'Posso parlare con qualcuno?',
      'Cercate persone nel team?',
      'Come lavorate insieme?',
      'Voglio capire chi siete',
    ];
  }
  if (path.startsWith('/careers')) {
    return [
      'Mi candido per la posizione',
      'Cosa cercate davvero?',
      'Come è l\'ambiente di studio?',
      'Posso parlare con Max?',
    ];
  }
  return [
    'Mostrami i lavori più recenti',
    'Posso fissare una call con Max?',
    'Cosa fate per la sostenibilità?',
    'Raccontami il caso ECLAG',
    'Cercate persone nel team?',
    'Come funziona la validazione AI?',
    'Vedi il framework Atlas',
  ];
}

const header = ref<{ title: string; sub: string }>({ title: '', sub: '' });
const prompts = ref<string[]>([]);
const currentIdx = ref(0);
const currentPrompt = computed(() => prompts.value[currentIdx.value] || '');

let popupTimer: number | null = null;
let rotateTimer: number | null = null;
const ROTATE_MS = 3200;

async function init() {
  if (session.initializing.value) return;
  if (!session.variant.value) {
    try { await session.initSession({ url: window.location.pathname }); } catch { /* offline */ }
  }
  if (session.variant.value !== 'proactive') return;
  if (sessionStorage.getItem(SS_DISMISSED) === '1') { dismissed.value = true; return; }

  const delay = ROUTE_DELAY_MS[window.location.pathname] ?? DEFAULT_DELAY_MS;
  popupTimer = window.setTimeout(() => {
    if (dismissed.value || floater.open.value) return;
    header.value = buildHeader();
    prompts.value = buildPrompts();
    visible.value = true;
    window.dispatchEvent(new CustomEvent('alba:popup-shown'));
    session.trackEvent('popup_shown', { url: window.location.pathname, after_ms: delay });

    // Rotazione prompts
    rotateTimer = window.setInterval(() => {
      currentIdx.value = (currentIdx.value + 1) % prompts.value.length;
    }, ROTATE_MS);
  }, delay);
}

function onPromptClick() {
  const p = currentPrompt.value;
  if (!p) return;
  session.trackEvent('popup_prompt_clicked', { prompt: p, url: window.location.pathname });
  visible.value = false;
  dismissed.value = true;
  sessionStorage.setItem(SS_DISMISSED, '1');
  window.dispatchEvent(new CustomEvent('alba:popup-closed'));
  floater.openWithPrompt(p);
}

function onOpenFree() {
  session.trackEvent('popup_clicked', { url: window.location.pathname });
  visible.value = false;
  dismissed.value = true;
  sessionStorage.setItem(SS_DISMISSED, '1');
  window.dispatchEvent(new CustomEvent('alba:popup-closed'));
  floater.openPanel();
}

function onDismiss() {
  session.trackEvent('popup_dismissed', { url: window.location.pathname });
  visible.value = false;
  dismissed.value = true;
  sessionStorage.setItem(SS_DISMISSED, '1');
  window.dispatchEvent(new CustomEvent('alba:popup-closed'));
}

onMounted(init);
onBeforeUnmount(() => {
  if (popupTimer !== null) clearTimeout(popupTimer);
  if (rotateTimer !== null) clearInterval(rotateTimer);
});
</script>

<template>
  <Transition name="alba-popup">
    <div v-if="visible" class="alba-popup" role="dialog" aria-label="Alba">
      <button type="button" class="alba-popup-close" @click="onDismiss" aria-label="Chiudi">×</button>
      <div class="alba-popup-body">
        <div class="alba-popup-avatar">A</div>
        <div class="alba-popup-text">
          <p class="alba-popup-title">{{ header.title }}</p>
          <p class="alba-popup-sub">{{ header.sub }}</p>

          <button
            type="button"
            class="alba-popup-prompts"
            @click="onPromptClick"
            :aria-label="`Apri Alba con: ${currentPrompt}`"
          >
            <Transition name="alba-popup-scroll" mode="out-in">
              <span class="alba-popup-prompt" :key="currentIdx">{{ currentPrompt }}</span>
            </Transition>
          </button>

          <button type="button" class="alba-popup-free" @click="onOpenFree">
            o scrivi tu →
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.alba-popup {
  position: fixed;
  right: 16px;
  bottom: 80px;
  width: calc(100% - 32px);
  max-width: 360px;
  background: linear-gradient(135deg, #fdf6f0 0%, #fcf1ec 100%);
  border: 1px solid rgba(14,17,22,0.08);
  border-radius: 16px;
  box-shadow: 0 20px 50px rgba(14,17,22,0.18);
  z-index: 55;
  overflow: hidden;
}
.alba-popup-close {
  position: absolute; top: 8px; right: 10px;
  width: 26px; height: 26px;
  background: transparent; border: 0;
  font-size: var(--ty-sub); line-height: 1; color: rgba(14,17,22,0.5);
  cursor: pointer; border-radius: 50%;
  z-index: 2;
}
.alba-popup-close:hover { background: rgba(14,17,22,0.06); color: #0e1116; }
.alba-popup-body {
  display: flex; gap: 12px; align-items: flex-start;
  padding: 18px 22px 18px 18px;
}
.alba-popup-avatar {
  flex-shrink: 0;
  width: 36px; height: 36px; border-radius: var(--r-pill);
  background: linear-gradient(135deg, #fbcfe8, #fed7aa, #fef3c7);
  display: flex; align-items: center; justify-content: center;
  font-weight: 800; font-size: var(--ty-meta); color: #0e1116;
}
.alba-popup-text { flex: 1; min-width: 0; }
.alba-popup-title { font-size: var(--ty-meta); font-weight: 700; margin: 0; line-height: 1.25; }
.alba-popup-sub { font-size: 12px; color: var(--pianeta-muted); margin: 4px 0 10px; line-height: 1.35; }

/* Carosello prompt: scroll verticale + maschera sfumata sopra/sotto */
.alba-popup-prompts {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 56px;
  padding: 0 12px;
  background: rgba(255,107,51,0.07);
  border: 1px solid rgba(255,107,51,0.20);
  border-radius: 10px;
  cursor: pointer;
  overflow: hidden;
  text-align: left;
  font: inherit;
  color: inherit;
  /* Maschera sfumata in alto e in basso — il testo "emerge" e "sparisce" sfumato */
  -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 28%, black 72%, transparent 100%);
  mask-image: linear-gradient(to bottom, transparent 0%, black 28%, black 72%, transparent 100%);
  transition: background 150ms, border-color 150ms, transform 150ms;
}
.alba-popup-prompts:hover {
  background: rgba(255,107,51,0.12);
  border-color: rgba(255,107,51,0.38);
  transform: translateY(-1px);
}
.alba-popup-prompt {
  font-size: var(--ty-meta);
  font-weight: 700;
  line-height: 1.3;
  color: var(--cta-primary, #FF6B33);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  display: block;
}

.alba-popup-free {
  display: block;
  margin: 10px 0 0;
  padding: 0;
  background: transparent;
  border: 0;
  color: var(--pianeta-muted);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 3px;
}
.alba-popup-free:hover { color: #0e1116; }

/* Scroll verticale tra prompts: il nuovo entra dal basso, il vecchio esce in alto */
.alba-popup-scroll-enter-active,
.alba-popup-scroll-leave-active {
  transition: transform 480ms cubic-bezier(0.16,1,0.3,1), opacity 360ms;
}
.alba-popup-scroll-enter-from { transform: translateY(32px); opacity: 0; }
.alba-popup-scroll-leave-to { transform: translateY(-32px); opacity: 0; }

/* Animazione entry popup */
.alba-popup-enter-active, .alba-popup-leave-active { transition: transform 280ms cubic-bezier(0.16,1,0.3,1), opacity 200ms; }
.alba-popup-enter-from, .alba-popup-leave-to { opacity: 0; transform: translateY(20px); }

@media (prefers-reduced-motion: reduce) {
  .alba-popup-enter-active, .alba-popup-leave-active,
  .alba-popup-scroll-enter-active, .alba-popup-scroll-leave-active { transition: none !important; }
  .alba-popup-prompts:hover { transform: none; }
}
</style>
