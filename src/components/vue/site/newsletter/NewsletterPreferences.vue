<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
const email = computed(() => params.get('email') || '')
const token = computed(() => params.get('t') || '')

const loaded = ref(false)
const notFound = ref(false)
const unsubscribed = ref(false)
const topics = ref({ bulletin: true, announcements: true })
const saving = ref(false)
const savedAt = ref<number | null>(null)
const errorMsg = ref('')

async function load() {
  if (!email.value || !token.value) { notFound.value = true; loaded.value = true; return }
  try {
    const url = `/api/newsletter/preferences?email=${encodeURIComponent(email.value)}&t=${encodeURIComponent(token.value)}`
    const res = await fetch(url).then(r => {
      if (r.status === 401) throw { statusCode: 401 }
      if (r.status === 404) throw { statusCode: 404 }
      if (!r.ok) throw new Error('Errore')
      return r.json()
    })
    topics.value = { bulletin: !!res.topics?.bulletin, announcements: !!res.topics?.announcements }
    unsubscribed.value = !!res.unsubscribed
  } catch (e: any) {
    if (e?.statusCode === 401) errorMsg.value = 'Link non valido o scaduto. Iscriviti di nuovo per ricevere un nuovo link.'
    else if (e?.statusCode === 404) notFound.value = true
    else errorMsg.value = e?.message || 'Errore.'
  } finally {
    loaded.value = true
  }
}

async function save() {
  saving.value = true
  errorMsg.value = ''
  try {
    const r = await fetch('/api/newsletter/preferences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, t: token.value, topics: topics.value }),
    })
    if (!r.ok) throw new Error('Errore di salvataggio.')
    savedAt.value = Date.now()
  } catch (e: any) {
    errorMsg.value = e?.message || 'Errore.'
  } finally {
    saving.value = false
  }
}

const unsubscribeHref = computed(() =>
  `/api/newsletter/unsubscribe?email=${encodeURIComponent(email.value)}&t=${encodeURIComponent(token.value)}`,
)

onMounted(load)
</script>

<template>
  <div class="px-6 lg:px-10 py-12 md:py-16 max-w-[640px] mx-auto">
    <p class="text-xs uppercase tracking-wider text-black/50 mb-6">
      <a href="/bulletin" class="hover:underline">Bulletin</a> · Preferenze
    </p>
    <h1 class="text-3xl md:text-4xl font-black tracking-tight">Le tue preferenze</h1>

    <p v-if="!loaded" class="mt-8 text-sm text-black/55">Caricamento…</p>

    <div v-else-if="notFound" class="mt-8 p-5 rounded-xl bg-black/[0.03] text-sm">
      Iscrizione non trovata per <strong>{{ email }}</strong>. Forse hai già confermato la disiscrizione?
      <a href="/bulletin/iscrivimi" class="underline ml-1">Iscriviti di nuovo →</a>
    </div>

    <div v-else-if="errorMsg" class="mt-8 p-5 rounded-xl bg-red-50 text-red-900 text-sm">
      {{ errorMsg }}
    </div>

    <div v-else>
      <p class="mt-2 text-sm text-black/65">Iscrizione: <strong class="text-black">{{ email }}</strong></p>
      <p v-if="unsubscribed" class="mt-4 p-4 rounded-lg bg-yellow-50 text-sm">
        Risulti attualmente disiscritto. Riattiva una preferenza qui sotto per tornare a ricevere.
      </p>

      <form @submit.prevent="save" class="mt-8 space-y-5">
        <label class="flex items-start gap-3 p-4 rounded-xl border border-black/10 cursor-pointer hover:border-black/30">
          <input type="checkbox" v-model="topics.bulletin" class="mt-1 w-4 h-4">
          <span>
            <span class="block font-semibold">📰 Bulletin</span>
            <span class="block text-sm text-black/65">Articoli, casi reali, ricerca · 1-2 al mese</span>
          </span>
        </label>
        <label class="flex items-start gap-3 p-4 rounded-xl border border-black/10 cursor-pointer hover:border-black/30">
          <input type="checkbox" v-model="topics.announcements" class="mt-1 w-4 h-4">
          <span>
            <span class="block font-semibold">✨ Annunci grossi</span>
            <span class="block text-sm text-black/65">Nuovi servizi, cambi rilevanti dello studio · trimestrale</span>
          </span>
        </label>

        <div class="flex flex-wrap items-center gap-3 pt-4">
          <button
            type="submit"
            :disabled="saving"
            class="bg-black text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-black/85 disabled:opacity-50"
          >{{ saving ? 'Salvo…' : 'Salva preferenze' }}</button>
          <span v-if="savedAt" class="text-xs text-green-700">Salvato ✓</span>

          <span class="flex-1"></span>

          <a :href="unsubscribeHref" class="text-xs text-black/55 hover:text-red-700 underline">Disiscriviti del tutto</a>
        </div>
      </form>
    </div>
  </div>
</template>
