<script setup lang="ts">
import { computed } from 'vue'

interface Slot {
  start_iso: string
  end_iso: string
  day_key: string
  label: string
}

const props = defineProps<{
  slots: Slot[]
  duration_min: number
  from_iso: string
  next_from_iso: string | null
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'pick', slot: Slot): void
  (e: 'navigate', direction: 'back' | 'forward'): void
}>()

const grouped = computed(() => {
  const map = new Map<string, Slot[]>()
  for (const s of props.slots) {
    if (!map.has(s.day_key)) map.set(s.day_key, [])
    map.get(s.day_key)!.push(s)
  }
  return Array.from(map.entries()).map(([day_key, slots]) => ({
    day_key,
    day_label: formatDayHeader(slots[0].start_iso),
    slots: slots.map(s => ({ ...s, time_label: formatTimeOnly(s.start_iso) })),
  }))
})

function formatDayHeader(iso: string): string {
  return new Intl.DateTimeFormat('it-IT', {
    weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Europe/Rome',
  }).format(new Date(iso))
}
function formatTimeOnly(iso: string): string {
  return new Intl.DateTimeFormat('it-IT', {
    hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Europe/Rome',
  }).format(new Date(iso))
}

// Mostra "indietro" solo se from_iso è oltre 24h da adesso (non possiamo andare prima)
const canGoBack = computed(() => {
  const min = Date.now() + 24 * 3600_000
  return new Date(props.from_iso).getTime() > min + 60_000
})
const canGoForward = computed(() => !!props.next_from_iso)
</script>

<template>
  <div class="slot-picker" role="group" aria-label="Scegli un orario per la call">
    <div v-if="slots.length === 0" class="slot-picker-empty">
      Nessuno slot libero in questa finestra. Prova a spostarti più avanti nel tempo.
    </div>

    <div v-for="g in grouped" :key="g.day_key" class="slot-day">
      <p class="slot-day-label">{{ g.day_label }}</p>
      <div class="slot-day-times">
        <button
          v-for="s in g.slots" :key="s.start_iso"
          type="button"
          class="slot-btn"
          :disabled="disabled"
          @click="emit('pick', s)"
        >
          {{ s.time_label }}
        </button>
      </div>
    </div>

    <div class="slot-nav">
      <button
        type="button" class="slot-nav-btn"
        :disabled="!canGoBack || disabled"
        @click="emit('navigate', 'back')"
      >◀ Indietro</button>
      <span class="slot-nav-meta">{{ duration_min }} min · fuso Roma</span>
      <button
        type="button" class="slot-nav-btn"
        :disabled="!canGoForward || disabled"
        @click="emit('navigate', 'forward')"
      >Più avanti ▶</button>
    </div>
  </div>
</template>

<style scoped>
.slot-picker {
  margin: 8px 0 4px;
  padding: 14px 16px;
  background: rgba(255,107,51,0.06);
  border: 1px solid rgba(255,107,51,0.18);
  border-radius: var(--radius-chip);
}
.slot-picker-empty {
  font-size: var(--ty-meta); color: rgba(14,17,22,0.6);
  padding: 10px 0;
}
.slot-day { margin-bottom: 12px; }
.slot-day:last-of-type { margin-bottom: 0; }
.slot-day-label {
  font-size: var(--ty-eyebrow);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 700;
  color: var(--pianeta-muted);
  margin: 0 0 8px;
}
.slot-day-times {
  display: flex; flex-wrap: wrap; gap: 8px;
}
.slot-btn {
  padding: 8px 14px;
  font-size: var(--ty-meta);
  font-weight: 600;
  background: #fff;
  color: var(--cta-primary, #FF6B33);
  border: 1px solid rgba(255,107,51,0.32);
  border-radius: 8px;
  cursor: pointer;
  transition: background 120ms, transform 120ms, border-color 120ms;
}
.slot-btn:hover:not(:disabled) {
  background: var(--cta-primary, #FF6B33);
  color: #fff;
  border-color: var(--cta-primary, #FF6B33);
  transform: translateY(-1px);
}
.slot-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.slot-nav {
  display: flex; align-items: center; justify-content: space-between;
  margin-top: 14px; padding-top: 12px;
  border-top: 1px solid rgba(255,107,51,0.18);
  gap: 8px;
}
.slot-nav-btn {
  background: transparent;
  border: 0;
  color: var(--pianeta-muted-strong);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: background 120ms, color 120ms;
}
.slot-nav-btn:hover:not(:disabled) {
  background: rgba(14,17,22,0.06);
  color: #0e1116;
}
.slot-nav-btn:disabled { opacity: 0.35; cursor: not-allowed; }
.slot-nav-meta {
  font-size: var(--ty-eyebrow); color: rgba(14,17,22,0.45);
  text-transform: uppercase;
  letter-spacing: 1px;
}

@media (prefers-reduced-motion: reduce) {
  .slot-btn:hover:not(:disabled) { transform: none; }
}
</style>
