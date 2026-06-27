<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useAlbaFloater } from '~/composables/useAlbaFloater';
import { useAlbaSession } from '~/composables/useAlbaSession';

const floater = useAlbaFloater();
const session = useAlbaSession();

const PROMPTS = [
  'Mostrami i lavori più recenti',
  'Posso fissare una call con Max?',
  'Cosa fate per la sostenibilità digitale?',
  'Raccontami il caso ECLAG in 2 minuti',
  'Avete uno stack tecnico aperto?',
  'Cercate persone nel team?',
  'Come funziona la validazione AI delle campagne?',
  'Posso vedere il vostro framework Atlas?',
];

const ROTATE_MS = 4500;

const idx = ref(0);
let timer: number | null = null;

function tick() {
  idx.value = (idx.value + 1) % PROMPTS.length;
}

onMounted(() => {
  timer = window.setInterval(tick, ROTATE_MS);
});
onBeforeUnmount(() => {
  if (timer !== null) clearInterval(timer);
});

function onClick() {
  const p = PROMPTS[idx.value];
  session.trackEvent('rotating_prompt_clicked', { prompt: p, index: idx.value });
  floater.openWithPrompt(p);
}
</script>

<template>
  <button type="button" class="alba-rotating" @click="onClick" :aria-label="`Apri Alba con: ${PROMPTS[idx]}`">
    <div class="alba-rotating-content">
      <p class="alba-rotating-kicker">Parla con Alba</p>
      <div class="alba-rotating-prompt-wrap">
        <Transition name="alba-rotating-fade" mode="out-in">
          <p class="alba-rotating-prompt" :key="idx">{{ PROMPTS[idx] }}</p>
        </Transition>
      </div>
      <p class="alba-rotating-cta">→ chiedi ora</p>
    </div>
  </button>
</template>

<style scoped>
.alba-rotating {
  width: 100%;
  height: 100%;
  display: block;
  background: transparent;
  border: 0;
  padding: 0;
  cursor: pointer;
  font: inherit;
  color: inherit;
  text-align: left;
}
.alba-rotating-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px 22px;
  color: #ffffff;
}
.alba-rotating-kicker {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  opacity: 0.85;
  margin: 0 0 12px;
  font-weight: 600;
}
.alba-rotating-prompt-wrap {
  flex: 1;
  display: flex;
  align-items: flex-start;
  min-height: 60px;
}
.alba-rotating-prompt {
  font-size: clamp(1rem, 1.8vw, 1.35rem);
  font-weight: 800;
  letter-spacing: -0.01em;
  line-height: 1.2;
  margin: 0;
  color: #ffffff;
}
.alba-rotating-cta {
  font-size: 12px;
  opacity: 0.9;
  margin: 12px 0 0;
  font-weight: 600;
}

.alba-rotating-fade-enter-active,
.alba-rotating-fade-leave-active {
  transition: opacity 380ms cubic-bezier(0.16, 1, 0.3, 1), transform 380ms cubic-bezier(0.16, 1, 0.3, 1);
}
.alba-rotating-fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.alba-rotating-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@media (prefers-reduced-motion: reduce) {
  .alba-rotating-fade-enter-active,
  .alba-rotating-fade-leave-active { transition: none !important; }
}
</style>
