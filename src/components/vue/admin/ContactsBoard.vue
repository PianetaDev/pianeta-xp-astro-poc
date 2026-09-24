<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Contact {
  id: string
  email: string
  first_name?: string | null
  last_name?: string | null
  unsubscribed?: boolean
  created_at?: string
}

const AUDIENCES: { key: string; label: string; when: string }[] = [
  { key: 'bulletin', label: 'Bulletin pubblico', when: 'Nuovi articoli, case study, annunci pubblici' },
  { key: 'network', label: 'Network qualificato', when: 'Update progetti, partner, ex-clienti, press · trimestrale' },
  { key: 'pipeline', label: 'Pre-vendita pipeline', when: 'Prospect Alba in conversazione · ad hoc' },
]

const active = ref<string>('pipeline')
const contactsByAudience = ref<Record<string, Contact[]>>({})
const loading = ref<Set<string>>(new Set())
const errorMsg = ref<string | null>(null)
const search = ref('')

const addEmail = ref('')
const addFirstName = ref('')
const addLastName = ref('')
const adding = ref(false)

const importText = ref('')
const importing = ref(false)
const importResult = ref<{ ok: number; skipped: number; failed: number; total: number } | null>(null)

const counts = computed<Record<string, number>>(() => {
  const c: Record<string, number> = {}
  for (const a of AUDIENCES) c[a.key] = contactsByAudience.value[a.key]?.length ?? 0
  return c
})

const filtered = computed(() => {
  const rows = contactsByAudience.value[active.value] ?? []
  const q = search.value.trim().toLowerCase()
  if (!q) return rows
  return rows.filter((c) =>
    [c.email, c.first_name, c.last_name].filter(Boolean).some((v) => (v as string).toLowerCase().includes(q))
  )
})

async function loadAudience(key: string) {
  loading.value.add(key)
  errorMsg.value = null
  try {
    const res = await fetch(`/api/admin/contacts/list?audience=${encodeURIComponent(key)}`, { credentials: 'same-origin' })
    if (!res.ok) throw new Error(`Errore ${res.status}`)
    const data = await res.json()
    contactsByAudience.value[key] = data.contacts ?? []
  } catch (err: any) {
    errorMsg.value = `Impossibile caricare "${key}": ${err.message}`
  } finally {
    loading.value.delete(key)
  }
}

onMounted(() => {
  for (const a of AUDIENCES) loadAudience(a.key)
})

async function addContact() {
  if (!addEmail.value.trim()) return
  adding.value = true
  errorMsg.value = null
  try {
    const res = await fetch('/api/admin/contacts/add', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({
        email: addEmail.value.trim(),
        audience: active.value,
        firstName: addFirstName.value.trim() || undefined,
        lastName: addLastName.value.trim() || undefined,
      }),
    })
    const body = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(body?.error || `Errore ${res.status}`)
    addEmail.value = ''
    addFirstName.value = ''
    addLastName.value = ''
    await loadAudience(active.value)
  } catch (err: any) {
    errorMsg.value = `Impossibile aggiungere il contatto: ${err.message}`
  } finally {
    adding.value = false
  }
}

function parseImportText(text: string): Array<{ email: string; firstName?: string; lastName?: string }> {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split(',').map((p) => p.trim())
      return { email: parts[0], firstName: parts[1] || undefined, lastName: parts[2] || undefined }
    })
}

async function runImport() {
  const contacts = parseImportText(importText.value)
  if (!contacts.length) return
  importing.value = true
  importResult.value = null
  errorMsg.value = null
  try {
    const res = await fetch('/api/admin/contacts/import', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ audience: active.value, contacts }),
    })
    const body = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(body?.error || `Errore ${res.status}`)
    importResult.value = body
    importText.value = ''
    await loadAudience(active.value)
  } catch (err: any) {
    errorMsg.value = `Import fallito: ${err.message}`
  } finally {
    importing.value = false
  }
}

async function removeContact(c: Contact) {
  if (!confirm(`Rimuovere ${c.email} da questo gruppo?`)) return
  errorMsg.value = null
  try {
    const res = await fetch('/api/admin/contacts/remove', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ email: c.email, audience: active.value }),
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body?.error || `Errore ${res.status}`)
    }
    await loadAudience(active.value)
  } catch (err: any) {
    errorMsg.value = `Impossibile rimuovere "${c.email}": ${err.message}`
  }
}

async function moveContact(c: Contact, toKey: string) {
  errorMsg.value = null
  try {
    const res = await fetch('/api/admin/contacts/move', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ email: c.email, from: active.value, to: toKey }),
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body?.error || `Errore ${res.status}`)
    }
    await Promise.all([loadAudience(active.value), loadAudience(toKey)])
  } catch (err: any) {
    errorMsg.value = `Impossibile spostare "${c.email}": ${err.message}`
  }
}
</script>

<template>
  <div class="contacts-board">
    <div class="contacts-tabs">
      <button
        v-for="a in AUDIENCES"
        :key="a.key"
        type="button"
        class="contacts-tab"
        :class="{ 'is-active': active === a.key }"
        @click="active = a.key"
      >
        {{ a.label }}
        <span class="contacts-tab-count">{{ loading.has(a.key) ? '…' : counts[a.key] }}</span>
      </button>
    </div>
    <p class="contacts-tab-desc">{{ AUDIENCES.find((a) => a.key === active)?.when }}</p>

    <p v-if="errorMsg" class="contacts-error">{{ errorMsg }}</p>

    <div class="contacts-panel">
      <div class="contacts-panel-col">
        <h3 class="contacts-panel-title">Aggiungi contatto</h3>
        <form class="contacts-add-form" @submit.prevent="addContact">
          <input v-model="addEmail" type="email" required placeholder="email@esempio.com" />
          <input v-model="addFirstName" type="text" placeholder="Nome (opz.)" />
          <input v-model="addLastName" type="text" placeholder="Cognome (opz.)" />
          <button type="submit" class="cta-btn cta-primary" :disabled="adding">{{ adding ? 'Aggiungo…' : 'Aggiungi' }}</button>
        </form>

        <h3 class="contacts-panel-title">Import bulk</h3>
        <p class="contacts-import-hint">Una riga per contatto: <code>email,nome,cognome</code> (nome/cognome opzionali)</p>
        <textarea v-model="importText" rows="6" placeholder="mario@esempio.com,Mario,Rossi&#10;altra@esempio.com"></textarea>
        <button type="button" class="cta-btn cta-ghost" :disabled="importing || !importText.trim()" @click="runImport">
          {{ importing ? 'Importo…' : `Importa in "${AUDIENCES.find((a) => a.key === active)?.label}"` }}
        </button>
        <p v-if="importResult" class="contacts-import-result">
          ✓ {{ importResult.ok }} aggiunti · {{ importResult.skipped }} saltati (email non valida) · {{ importResult.failed }} falliti (su {{ importResult.total }})
        </p>
      </div>

      <div class="contacts-panel-col contacts-panel-list">
        <input v-model="search" type="search" class="contacts-search" placeholder="Cerca email, nome…" />
        <div v-if="loading.has(active)" class="contacts-empty">Carico…</div>
        <div v-else-if="filtered.length === 0" class="contacts-empty">Nessun contatto in questo gruppo.</div>
        <table v-else class="contacts-table">
          <thead>
            <tr><th>Email</th><th>Nome</th><th>Sposta in</th><th></th></tr>
          </thead>
          <tbody>
            <tr v-for="c in filtered" :key="c.id">
              <td>{{ c.email }}</td>
              <td>{{ [c.first_name, c.last_name].filter(Boolean).join(' ') || '—' }}</td>
              <td>
                <select @change="(e) => moveContact(c, (e.target as HTMLSelectElement).value)">
                  <option value="" selected disabled>—</option>
                  <option v-for="a in AUDIENCES.filter((a) => a.key !== active)" :key="a.key" :value="a.key">{{ a.label }}</option>
                </select>
              </td>
              <td><button type="button" class="contacts-remove-btn" @click="removeContact(c)">Rimuovi</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.contacts-tabs { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 8px; }
.contacts-tab {
  font-size: 13px; font-weight: 600; padding: 8px 16px; border-radius: 999px;
  border: 1px solid var(--pianeta-border); background: var(--pianeta-bg-card); color: var(--pianeta-muted-strong);
  cursor: pointer; display: flex; align-items: center; gap: 6px;
}
.contacts-tab.is-active { background: var(--cta-primary); border-color: var(--cta-primary); color: #fff; }
.contacts-tab-count { font-size: 11px; opacity: 0.75; }
.contacts-tab-desc { font-size: 13px; color: var(--pianeta-muted); margin: 0 0 20px; }
.contacts-error { padding: 12px 16px; background: #fff3cd; border: 1px solid #ffc107; border-radius: 10px; margin-bottom: 16px; font-size: 13px; color: #856404; }

.contacts-panel { display: grid; grid-template-columns: 280px 1fr; gap: 32px; align-items: start; }
@media (max-width: 800px) { .contacts-panel { grid-template-columns: 1fr; } }

.contacts-panel-title { font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: var(--pianeta-muted-strong); margin: 0 0 8px; }
.contacts-add-form { display: flex; flex-direction: column; gap: 8px; margin-bottom: 24px; }
.contacts-add-form input {
  padding: 9px 12px; border-radius: 8px; border: 1px solid var(--pianeta-border-strong);
  background: var(--pianeta-bg); color: var(--pianeta-text); font-size: 13px;
}
.contacts-import-hint { font-size: 12px; color: var(--pianeta-muted); margin: 0 0 8px; }
.contacts-panel-col textarea {
  width: 100%; padding: 10px 12px; border-radius: 8px; border: 1px solid var(--pianeta-border-strong);
  background: var(--pianeta-bg); color: var(--pianeta-text); font-size: 12px; font-family: monospace;
  margin-bottom: 8px; resize: vertical;
}
.contacts-import-result { font-size: 12px; color: var(--pianeta-muted-strong); margin-top: 8px; }

.contacts-search {
  width: 100%; padding: 9px 12px; border-radius: 8px; border: 1px solid var(--pianeta-border-strong);
  background: var(--pianeta-bg); color: var(--pianeta-text); font-size: 13px; margin-bottom: 12px;
}
.contacts-empty { padding: 24px; text-align: center; color: var(--pianeta-muted); font-size: 13px; }
.contacts-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.contacts-table th, .contacts-table td { padding: 10px 12px; text-align: left; border-bottom: 1px solid var(--pianeta-border); }
.contacts-table th { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: rgba(14,17,22,0.5); font-weight: 600; }
.contacts-table select {
  font-size: 12px; padding: 4px 6px; border-radius: 6px; border: 1px solid var(--pianeta-border-strong);
  background: var(--pianeta-bg); color: var(--pianeta-text);
}
.contacts-remove-btn {
  font-size: 12px; color: var(--pianeta-muted-strong); background: none; border: none; cursor: pointer;
  text-decoration: underline;
}
.contacts-remove-btn:hover { color: #cc3333; }
</style>
