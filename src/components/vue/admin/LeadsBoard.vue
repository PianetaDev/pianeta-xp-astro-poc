<script setup lang="ts">
import { ref, computed } from 'vue'

interface Lead {
  id: string
  source: 'green_machine' | 'alba' | 'manual'
  company: string | null
  contact_name: string | null
  contact_role: string | null
  email: string | null
  url: string | null
  sector: string | null
  rating: string | null
  co2_per_visit: string | null
  status: 'draft' | 'sent' | 'replied' | 'call' | 'won' | 'discarded'
  notes: string | null
  week_label: string | null
  created_at: string
  updated_at: string
}

const props = defineProps<{ initialLeads: Lead[] }>()

const leads = ref<Lead[]>([...props.initialLeads])
const activeSource = ref<'all' | 'green_machine' | 'alba'>('all')
const search = ref('')
const savingIds = ref<Set<string>>(new Set())
const errorMsg = ref<string | null>(null)

const SOURCE_TABS: { key: 'all' | 'green_machine' | 'alba'; label: string }[] = [
  { key: 'all', label: 'Tutti' },
  { key: 'green_machine', label: 'GreenMachine' },
  { key: 'alba', label: 'Alba' },
]

const STATUS_OPTIONS: { value: Lead['status']; label: string }[] = [
  { value: 'draft', label: '📝 Bozza' },
  { value: 'sent', label: '✉️ Inviato' },
  { value: 'replied', label: '💬 Risposto' },
  { value: 'call', label: '📞 Call' },
  { value: 'won', label: '🤝 Chiuso' },
  { value: 'discarded', label: '❌ Scartato' },
]

const statusLabel = (s: Lead['status']) => STATUS_OPTIONS.find((o) => o.value === s)?.label ?? s

const counts = computed(() => {
  const c: Record<string, number> = { all: leads.value.length, green_machine: 0, alba: 0 }
  for (const l of leads.value) {
    if (l.source === 'green_machine') c.green_machine++
    if (l.source === 'alba') c.alba++
  }
  return c
})

const filtered = computed(() => {
  let rows = leads.value
  if (activeSource.value !== 'all') rows = rows.filter((l) => l.source === activeSource.value)
  const q = search.value.trim().toLowerCase()
  if (q) {
    rows = rows.filter((l) =>
      [l.company, l.contact_name, l.sector, l.email]
        .filter(Boolean)
        .some((v) => (v as string).toLowerCase().includes(q))
    )
  }
  return rows
})

const fmtDate = (l: Lead) => {
  if (l.week_label) return l.week_label
  try {
    return new Date(l.created_at).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' })
  } catch {
    return '—'
  }
}

async function updateStatus(lead: Lead, next: Lead['status']) {
  const prev = lead.status
  lead.status = next // optimistic
  savingIds.value.add(lead.id)
  errorMsg.value = null
  try {
    const res = await fetch('/api/admin/leads/update-status', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ id: lead.id, status: next }),
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body?.error || `Errore ${res.status}`)
    }
  } catch (err: any) {
    lead.status = prev // rollback
    errorMsg.value = `Impossibile aggiornare "${lead.company ?? lead.id}": ${err.message}`
  } finally {
    savingIds.value.delete(lead.id)
  }
}
</script>

<template>
  <div class="leads-board">
    <div class="leads-toolbar">
      <div class="leads-tabs">
        <button
          v-for="tab in SOURCE_TABS"
          :key="tab.key"
          type="button"
          class="leads-tab"
          :class="{ 'is-active': activeSource === tab.key }"
          @click="activeSource = tab.key"
        >
          {{ tab.label }}
          <span class="leads-tab-count">{{ counts[tab.key] }}</span>
        </button>
      </div>
      <input
        v-model="search"
        type="search"
        class="leads-search"
        placeholder="Cerca azienda, contatto, settore, email…"
      />
    </div>

    <p v-if="errorMsg" class="leads-error">{{ errorMsg }}</p>

    <div v-if="activeSource === 'alba' && filtered.length === 0" class="leads-empty">
      Nessun lead da Alba ancora — l'integrazione arriverà in una fase successiva.
    </div>
    <div v-else-if="filtered.length === 0" class="leads-empty">
      Nessun lead trovato.
    </div>

    <div v-else class="leads-table-wrap">
      <table class="leads-table">
        <thead>
          <tr>
            <th>Azienda</th>
            <th>Contatto</th>
            <th>Settore</th>
            <th>Rating</th>
            <th>Status</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="lead in filtered" :key="lead.id">
            <td class="leads-cell-company">
              <a v-if="lead.url" :href="`https://${lead.url.replace(/^https?:\/\//, '')}`" target="_blank" rel="noopener" class="leads-company-link">
                {{ lead.company ?? '—' }}
              </a>
              <span v-else>{{ lead.company ?? '—' }}</span>
              <span v-if="lead.source !== 'green_machine'" class="leads-source-badge">{{ lead.source }}</span>
            </td>
            <td>
              <div class="leads-contact">
                <span class="leads-contact-name">{{ lead.contact_name ?? '—' }}</span>
                <span v-if="lead.contact_role" class="leads-contact-role">{{ lead.contact_role }}</span>
              </div>
              <a v-if="lead.email" :href="`mailto:${lead.email}`" class="leads-contact-email">{{ lead.email }}</a>
            </td>
            <td class="leads-cell-muted">{{ lead.sector ?? '—' }}</td>
            <td>
              <span v-if="lead.rating" class="leads-rating" :data-rating="lead.rating">{{ lead.rating }}</span>
              <span v-else class="leads-cell-muted">—</span>
            </td>
            <td>
              <select
                class="leads-status-select"
                :data-status="lead.status"
                :disabled="savingIds.has(lead.id)"
                :value="lead.status"
                @change="updateStatus(lead, ($event.target as HTMLSelectElement).value as Lead['status'])"
              >
                <option v-for="opt in STATUS_OPTIONS" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
              </select>
            </td>
            <td class="leads-cell-muted leads-cell-nowrap">{{ fmtDate(lead) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.leads-board { display: flex; flex-direction: column; gap: 20px; }

.leads-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  align-items: center;
  justify-content: space-between;
}

.leads-tabs { display: flex; gap: 6px; flex-wrap: wrap; }
.leads-tab {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid var(--pianeta-border);
  background: transparent;
  color: var(--pianeta-muted-strong);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 150ms, color 150ms, background 150ms;
}
.leads-tab:hover { border-color: var(--pianeta-border-strong); }
.leads-tab.is-active {
  background: var(--pianeta-text);
  color: var(--pianeta-bg);
  border-color: var(--pianeta-text);
}
.leads-tab-count {
  font-size: 11px;
  font-weight: 700;
  padding: 1px 7px;
  border-radius: 999px;
  background: rgba(127,127,127,0.18);
}
.leads-tab.is-active .leads-tab-count { background: rgba(255,255,255,0.22); }

.leads-search {
  flex: 0 1 320px;
  padding: 9px 14px;
  border-radius: 10px;
  border: 1px solid var(--pianeta-border-strong);
  background: var(--pianeta-bg-card);
  color: var(--pianeta-text);
  font-size: 13px;
}
.leads-search:focus { outline: none; border-color: var(--cta-primary); }

.leads-error {
  padding: 12px 16px;
  background: #fdecea;
  border: 1px solid #f5c6cb;
  color: #a12622;
  border-radius: 10px;
  font-size: 13px;
  margin: 0;
}

.leads-empty {
  padding: 44px 20px;
  text-align: center;
  color: var(--pianeta-muted);
  border: 1px dashed var(--pianeta-border-strong);
  border-radius: 16px;
  font-size: 14px;
}

.leads-table-wrap {
  border: 1px solid var(--pianeta-border);
  border-radius: 16px;
  overflow: auto;
  background: var(--pianeta-bg-card);
}

.leads-table { width: 100%; border-collapse: collapse; font-size: 13px; min-width: 760px; }
.leads-table th {
  text-align: left;
  padding: 12px 16px;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--pianeta-muted);
  font-weight: 700;
  background: rgba(127,127,127,0.06);
  border-bottom: 1px solid var(--pianeta-border);
  white-space: nowrap;
}
.leads-table td {
  padding: 12px 16px;
  border-bottom: 1px solid var(--pianeta-border);
  vertical-align: top;
  color: var(--pianeta-text);
}
.leads-table tbody tr:last-child td { border-bottom: none; }
.leads-table tbody tr:hover { background: rgba(127,127,127,0.04); }

.leads-cell-company { font-weight: 700; white-space: nowrap; }
.leads-company-link { color: var(--pianeta-text); text-decoration: none; }
.leads-company-link:hover { color: var(--cta-primary); }
.leads-source-badge {
  display: inline-block;
  margin-left: 8px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 1px 8px;
  border-radius: 999px;
  background: var(--pianeta-accent);
  color: #fff;
  vertical-align: middle;
}

.leads-contact { display: flex; flex-direction: column; }
.leads-contact-name { font-weight: 600; }
.leads-contact-role { font-size: 11px; color: var(--pianeta-muted); }
.leads-contact-email {
  display: block;
  margin-top: 2px;
  font-size: 12px;
  font-family: ui-monospace, 'Cascadia Code', monospace;
  color: var(--pianeta-muted-strong);
  text-decoration: none;
}
.leads-contact-email:hover { color: var(--cta-primary); }

.leads-cell-muted { color: var(--pianeta-muted); }
.leads-cell-nowrap { white-space: nowrap; }

.leads-rating {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 8px;
  font-weight: 800;
  font-size: 12px;
  background: rgba(127,127,127,0.15);
  color: var(--pianeta-text);
}
.leads-rating[data-rating="A"], .leads-rating[data-rating="B"] { background: rgba(26,138,58,0.15); color: #1a8a3a; }
.leads-rating[data-rating="C"], .leads-rating[data-rating="D"] { background: rgba(224,168,0,0.18); color: #a17700; }
.leads-rating[data-rating="E"], .leads-rating[data-rating="F"] { background: rgba(204,51,51,0.15); color: #cc3333; }

.leads-status-select {
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid var(--pianeta-border-strong);
  background: var(--pianeta-bg);
  color: var(--pianeta-text);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}
.leads-status-select:disabled { opacity: 0.5; cursor: wait; }
.leads-status-select:focus { outline: none; border-color: var(--cta-primary); }
</style>
