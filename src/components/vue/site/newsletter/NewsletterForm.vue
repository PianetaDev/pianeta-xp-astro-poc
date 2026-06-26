<script setup lang="ts">
import { ref } from 'vue'
import { useNewsletter } from '~/composables/useNewsletter'
import NuxtLink from '~/components/vue/shims/NuxtLink.vue'

const props = defineProps<{
  variant?: 'footer' | 'inline' | 'popup'
}>()

const email = ref('')
const consent = ref(false)
const { state, errorMsg, submit } = useNewsletter()

const onSubmit = async (e: Event) => {
  e.preventDefault()
  if (!email.value || !consent.value) return
  await submit(email.value, consent.value)
  if (state.value === 'success') email.value = ''
}
</script>

<template>
  <form @submit="onSubmit" class="newsletter-form">
    <p v-if="props.variant !== 'inline'" class="font-bold text-sm mb-2 text-white">Bulletin Pianeta</p>
    <p v-if="props.variant !== 'inline'" class="text-xs text-white/70 mb-3">Riceverai un articolo ogni paio di settimane. Niente spam.</p>

    <div v-if="state === 'success'" class="text-sm text-green-400">Controlla la tua mail per confermare.</div>
    <div v-else-if="state === 'already'" class="text-sm text-white/70">Sei già iscritto/a. Grazie.</div>
    <div v-else-if="state === 'error'" class="text-sm text-red-400">Errore: {{ errorMsg }}</div>
    <template v-else>
      <div class="flex gap-2">
        <input
          v-model="email"
          type="email"
          required
          autocomplete="email"
          placeholder="la-tua-email@..."
          class="flex-1 bg-transparent border border-white/30 text-white placeholder-white/40 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          :disabled="state === 'loading' || !consent"
          class="bg-white text-black px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          {{ state === 'loading' ? '...' : 'Iscriviti' }}
        </button>
      </div>
      <label class="flex items-start gap-2 text-xs text-white/70 mt-2">
        <input v-model="consent" type="checkbox" required class="mt-0.5">
        <span>Accetto di ricevere il Bulletin e dichiaro di aver letto la <NuxtLink to="/privacy" class="underline">privacy policy</NuxtLink>.</span>
      </label>
    </template>
  </form>
</template>
