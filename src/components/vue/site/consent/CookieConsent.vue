<script setup lang="ts">
import { ref } from 'vue'
import { useConsent } from '~/composables/useConsent'
import NuxtLink from '~/components/vue/shims/NuxtLink.vue'

const { state, acceptAll, rejectAll, updatePartial } = useConsent()
const showCustomize = ref(false)
const analyticsLocal = ref(state.analytics)
const marketingLocal = ref(state.marketing)

const saveCustom = () => {
  updatePartial({ analytics: analyticsLocal.value, marketing: marketingLocal.value })
  showCustomize.value = false
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="!state.decided"
      role="dialog"
      aria-label="Cookie consent"
      class="fixed bottom-4 inset-x-4 md:left-auto md:right-4 md:max-w-md z-50 bg-white border border-black/10 shadow-xl p-6"
    >
      <h2 class="font-bold text-lg mb-2">Cookie</h2>
      <p class="text-sm text-black/70 mb-4">
        Usiamo cookie necessari per il sito. Con il tuo consenso anche analytics (GA4) e marketing (LinkedIn, Google Ads) per migliorare il prodotto e farti vedere campagne rilevanti. Vedi <NuxtLink to="/cookie" class="underline">policy</NuxtLink>.
      </p>
      <div v-if="showCustomize" class="space-y-2 mb-4 text-sm">
        <label class="flex items-center gap-2"><input type="checkbox" checked disabled> Necessari (sempre attivi)</label>
        <label class="flex items-center gap-2"><input v-model="analyticsLocal" type="checkbox"> Analytics</label>
        <label class="flex items-center gap-2"><input v-model="marketingLocal" type="checkbox"> Marketing</label>
      </div>
      <div class="flex flex-wrap gap-2">
        <button @click="acceptAll" class="bg-black text-white px-4 py-2 text-sm">Accetta tutti</button>
        <button @click="rejectAll" class="border border-black/20 px-4 py-2 text-sm">Rifiuta tutti</button>
        <button v-if="!showCustomize" @click="showCustomize = true" class="text-sm underline">Personalizza</button>
        <button v-else @click="saveCustom" class="text-sm font-medium underline">Salva scelte</button>
      </div>
    </div>
  </Teleport>
</template>
