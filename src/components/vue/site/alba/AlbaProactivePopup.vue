<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useAlbaSession } from '~/composables/useAlbaSession';
import { useAlbaFloater } from '~/composables/useAlbaFloater';

const session = useAlbaSession();
const floater = useAlbaFloater();

const visible = ref(false);
const dismissed = ref(false);
const prompt = ref<{ title: string; sub: string }>({ title: '', sub: '' });

const SS_DISMISSED = 'alba_popup_dismissed';
const DEFAULT_DELAY_MS = 30_000;
const ROUTE_DELAY_MS: Record<string, number> = {
  '/work/eclag': 15_000,
  '/services/neuromarketing-lab': 18_000,
  '/lab/atlas': 18_000,
};

function buildPrompt(): { title: string; sub: string } {
  const path = window.location.pathname;
  if (path.startsWith('/work/eclag'))
    return { title: 'Stai guardando ECLAG', sub: 'Ti racconto come l\'abbiamo fatto in 2 minuti?' };
  if (path.startsWith('/services/'))
    return { title: 'Domanda su questo servizio?', sub: 'Posso spiegartelo e dirti se fa al caso vostro.' };
  if (path.startsWith('/lab/'))
    return { title: 'Lab di Pianeta', sub: 'Curioso di come funziona dietro le quinte?' };
  if (path.startsWith('/bulletin/'))
    return { title: 'C\'è qualcosa che ti rimbalza?', sub: 'Posso approfondire o collegarti col team.' };
  if (path === '/' || path === '')
    return { title: 'Ciao 👋 Sono Alba', sub: 'Ti aiuto a capire cosa fa Pianeta.Studio?' };
  return { title: 'Ciao, sono Alba', sub: 'AI di Pianeta. Posso aiutarti?' };
}

let timer: number | null = null;

async function init() {
  if (session.initializing.value) return;
  if (!session.variant.value) {
    try { await session.initSession({ url: window.location.pathname }); } catch { /* offline */ }
  }
  if (session.variant.value !== 'proactive') return;
  if (sessionStorage.getItem(SS_DISMISSED) === '1') { dismissed.value = true; return; }

  const delay = ROUTE_DELAY_MS[window.location.pathname] ?? DEFAULT_DELAY_MS;
  timer = window.setTimeout(() => {
    if (dismissed.value || floater.open.value) return;
    prompt.value = buildPrompt();
    visible.value = true;
    session.trackEvent('popup_shown', { url: window.location.pathname, after_ms: delay });
  }, delay);
}

function onClick() {
  session.trackEvent('popup_clicked', { url: window.location.pathname });
  visible.value = false;
  dismissed.value = true;
  sessionStorage.setItem(SS_DISMISSED, '1');
  floater.openPanel();
}

function onDismiss() {
  session.trackEvent('popup_dismissed', { url: window.location.pathname });
  visible.value = false;
  dismissed.value = true;
  sessionStorage.setItem(SS_DISMISSED, '1');
}

onMounted(init);
onBeforeUnmount(() => { if (timer !== null) clearTimeout(timer); });
</script>

<template>
  <Transition name="alba-popup">
    <div v-if="visible" class="alba-popup" role="dialog" aria-label="Alba">
      <button type="button" class="alba-popup-close" @click="onDismiss" aria-label="Chiudi">×</button>
      <button type="button" class="alba-popup-body" @click="onClick">
        <div class="alba-popup-avatar">A</div>
        <div class="alba-popup-text">
          <p class="alba-popup-title">{{ prompt.title }}</p>
          <p class="alba-popup-sub">{{ prompt.sub }}</p>
          <p class="alba-popup-cta">Parla con Alba →</p>
        </div>
      </button>
    </div>
  </Transition>
</template>

<style scoped>
.alba-popup {
  position: fixed;
  right: 16px;
  bottom: 80px;
  width: calc(100% - 32px);
  max-width: 340px;
  background: linear-gradient(135deg, #fdf6f0 0%, #fcf1ec 100%);
  border: 1px solid rgba(14,17,22,0.08);
  border-radius: 16px;
  box-shadow: 0 20px 50px rgba(14,17,22,0.18);
  z-index: 55;
  overflow: hidden;
}
.alba-popup-close {
  position: absolute; top: 6px; right: 8px;
  width: 24px; height: 24px;
  background: transparent; border: 0;
  font-size: 18px; line-height: 1; color: rgba(14,17,22,0.5);
  cursor: pointer; border-radius: 50%;
}
.alba-popup-close:hover { background: rgba(14,17,22,0.06); color: #0e1116; }
.alba-popup-body {
  display: flex; gap: 12px; align-items: flex-start;
  padding: 16px 18px 18px;
  background: transparent; border: 0; cursor: pointer;
  text-align: left; width: 100%; font: inherit; color: inherit;
}
.alba-popup-body:hover { background: rgba(255,255,255,0.4); }
.alba-popup-avatar {
  flex-shrink: 0;
  width: 36px; height: 36px; border-radius: 999px;
  background: linear-gradient(135deg, #fbcfe8, #fed7aa, #fef3c7);
  display: flex; align-items: center; justify-content: center;
  font-weight: 800; font-size: 14px; color: #0e1116;
}
.alba-popup-text { flex: 1; min-width: 0; }
.alba-popup-title { font-size: 14px; font-weight: 700; margin: 0; line-height: 1.25; }
.alba-popup-sub { font-size: 13px; color: rgba(14,17,22,0.65); margin: 4px 0 8px; line-height: 1.35; }
.alba-popup-cta { font-size: 12px; font-weight: 600; color: var(--cta-primary, #FF6B33); margin: 0; }

.alba-popup-enter-active, .alba-popup-leave-active { transition: transform 280ms cubic-bezier(0.16,1,0.3,1), opacity 200ms; }
.alba-popup-enter-from, .alba-popup-leave-to { opacity: 0; transform: translateY(20px); }

@media (prefers-reduced-motion: reduce) {
  .alba-popup-enter-active, .alba-popup-leave-active { transition: none !important; }
}
</style>
