<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const props = withDefaults(defineProps<{ locale?: 'it' | 'en' }>(), { locale: 'it' })
const T = {
  it: {
    bulletinHref: '/bulletin', prefLabel: 'Preferenze', title: 'Le tue preferenze', loading: 'Caricamento…',
    notFound: (email: string) => `Iscrizione non trovata per ${email}. Forse hai già confermato la disiscrizione?`,
    resubscribe: 'Iscriviti di nuovo →', resubscribeHref: '/bulletin/iscrivimi',
    subscriptionLabel: 'Iscrizione:', unsubscribedNote: 'Risulti attualmente disiscritto. Riattiva una preferenza qui sotto per tornare a ricevere.',
    bulletinTitle: 'Bulletin', bulletinDesc: 'Articoli, casi reali, ricerca · 1-2 al mese',
    announceTitle: 'Annunci grossi', announceDesc: 'Nuovi servizi, cambi rilevanti dello studio · trimestrale',
    save: 'Salva preferenze', saving: 'Salvo…', saved: 'Salvato ✓', unsubscribeAll: 'Disiscriviti del tutto',
    invalidLink: 'Link non valido o scaduto. Iscriviti di nuovo per ricevere un nuovo link.', genericError: 'Errore.', saveError: 'Errore di salvataggio.',
  },
  en: {
    bulletinHref: '/en/bulletin', prefLabel: 'Preferences', title: 'Your preferences', loading: 'Loading…',
    notFound: (email: string) => `Subscription not found for ${email}. Maybe you already confirmed the unsubscribe?`,
    resubscribe: 'Subscribe again →', resubscribeHref: '/en/bulletin/iscrivimi',
    subscriptionLabel: 'Subscription:', unsubscribedNote: 'You are currently unsubscribed. Turn a preference back on below to start receiving emails again.',
    bulletinTitle: 'Bulletin', bulletinDesc: 'Articles, real cases, research · 1-2 per month',
    announceTitle: 'Big announcements', announceDesc: 'New services, major studio changes · quarterly',
    save: 'Save preferences', saving: 'Saving…', saved: 'Saved ✓', unsubscribeAll: 'Unsubscribe from everything',
    invalidLink: 'Invalid or expired link. Subscribe again to get a new link.', genericError: 'Error.', saveError: 'Error while saving.',
  },
}[props.locale]

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
      if (!r.ok) throw new Error(T.genericError)
      return r.json()
    })
    topics.value = { bulletin: !!res.topics?.bulletin, announcements: !!res.topics?.announcements }
    unsubscribed.value = !!res.unsubscribed
  } catch (e: any) {
    if (e?.statusCode === 401) errorMsg.value = T.invalidLink
    else if (e?.statusCode === 404) notFound.value = true
    else errorMsg.value = e?.message || T.genericError
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
    if (!r.ok) throw new Error(T.saveError)
    savedAt.value = Date.now()
  } catch (e: any) {
    errorMsg.value = e?.message || T.genericError
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
  <div class="pref-wrap">
    <p class="pref-breadcrumb">
      <a :href="T.bulletinHref">Bulletin</a> · {{ T.prefLabel }}
    </p>
    <h1 class="pref-title">{{ T.title }}</h1>

    <p v-if="!loaded" class="pref-loading">{{ T.loading }}</p>

    <div v-else-if="notFound" class="pref-notice">
      {{ T.notFound(email) }}
      <a :href="T.resubscribeHref" class="pref-notice-link">{{ T.resubscribe }}</a>
    </div>

    <div v-else-if="errorMsg" class="pref-notice pref-notice--error">
      {{ errorMsg }}
    </div>

    <div v-else>
      <p class="pref-email-line">{{ T.subscriptionLabel }} <strong>{{ email }}</strong></p>
      <p v-if="unsubscribed" class="pref-notice pref-notice--warn">
        {{ T.unsubscribedNote }}
      </p>

      <form @submit.prevent="save" class="pref-form">
        <label class="pref-topic-label">
          <input type="checkbox" v-model="topics.bulletin" class="pref-checkbox">
          <span>
            <span class="pref-topic-name">{{ T.bulletinTitle }}</span>
            <span class="pref-topic-desc">{{ T.bulletinDesc }}</span>
          </span>
        </label>
        <label class="pref-topic-label">
          <input type="checkbox" v-model="topics.announcements" class="pref-checkbox">
          <span>
            <span class="pref-topic-name">{{ T.announceTitle }}</span>
            <span class="pref-topic-desc">{{ T.announceDesc }}</span>
          </span>
        </label>

        <div class="pref-actions">
          <button
            type="submit"
            :disabled="saving"
            class="cta-btn cta-primary"
            :style="saving ? 'opacity:0.55;cursor:default' : ''"
          >{{ saving ? T.saving : T.save }}</button>
          <span v-if="savedAt" class="pref-saved">{{ T.saved }}</span>

          <span style="flex:1"></span>

          <a :href="unsubscribeHref" class="pref-unsub-link">{{ T.unsubscribeAll }}</a>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.pref-wrap {
  max-width: 600px;
  margin: 0 auto;
  padding: 80px 24px 96px;
}
.pref-breadcrumb {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--pianeta-muted);
  margin: 0 0 24px;
}
.pref-breadcrumb a { color: inherit; text-decoration: none; }
.pref-breadcrumb a:hover { text-decoration: underline; }
.pref-title {
  font-size: var(--ty-hero);
  font-weight: 600;
  letter-spacing: var(--ty-hero-tracking);
  line-height: var(--ty-hero-lh);
  margin: 0 0 24px;
}
.pref-loading {
  font-size: 0.875rem;
  color: var(--pianeta-muted);
  margin-top: 32px;
}
.pref-notice {
  margin-top: 32px;
  padding: 16px 20px;
  border-radius: 12px;
  background: rgba(14,17,22,0.04);
  font-size: 0.875rem;
  color: var(--pianeta-text);
}
.pref-notice--error { background: #fef2f2; color: #7f1d1d; }
.pref-notice--warn { background: #fefce8; color: #713f12; }
.pref-notice-link { margin-left: 4px; text-decoration: underline; }
.pref-email-line {
  font-size: 0.875rem;
  color: var(--pianeta-muted-strong);
  margin: 0 0 8px;
}
.pref-form {
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.pref-topic-label {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid var(--pianeta-border);
  cursor: pointer;
  transition: border-color 150ms;
}
.pref-topic-label:hover { border-color: var(--pianeta-border-strong); }
.pref-checkbox { margin-top: 2px; width: 16px; height: 16px; flex-shrink: 0; }
.pref-topic-name { display: block; font-weight: 600; }
.pref-topic-desc { display: block; font-size: 0.875rem; color: var(--pianeta-muted-strong); }
.pref-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  padding-top: 8px;
}
.pref-saved { font-size: 0.75rem; color: #15803d; }
.pref-unsub-link { font-size: 0.75rem; color: var(--pianeta-muted); text-decoration: underline; }
.pref-unsub-link:hover { color: #b91c1c; }
</style>
