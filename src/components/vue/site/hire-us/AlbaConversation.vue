<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useState, $fetch } from '~/lib/nuxt-shims'
import QuickReplyChip from './QuickReplyChip.vue'

type Message = { role: 'user' | 'assistant'; content: any }
type Chip = { id: string; label: string; sublabel?: string; emoji?: string }

const STORAGE_KEY = 'alba-hire-us-conversation-v1'
const userName = useState<string>('alba-hire-us-name', () => '')
const messages = useState<Message[]>('alba-hire-us-messages', () => [])
const loading = ref(false)
const inputText = ref('')
const nameInput = ref('')
const phase = computed<'name' | 'chat'>(() => userName.value ? 'chat' : 'name')

onMounted(() => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const saved = JSON.parse(raw)
      userName.value = saved.userName || ''
      messages.value = saved.messages || []
    }
  } catch {}
})

watch([userName, messages], () => {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ userName: userName.value, messages: messages.value }))
  } catch {}
}, { deep: true })

const getAlbaSessionId = (): string => {
  let id = localStorage.getItem('alba-session-id')
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem('alba-session-id', id)
  }
  return id
}

const submitName = (name: string) => {
  if (!name.trim()) return
  userName.value = name.trim()
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'hire_us_name_entered')
  }
  sendToAlba('__start__')
}

const sendToAlba = async (text: string) => {
  if (text !== '__start__') {
    messages.value.push({ role: 'user', content: text })
  }
  loading.value = true
  try {
    const res = await $fetch<{ mode: string; content: any[]; stop_reason: string }>('/api/alba/chat', {
      method: 'POST',
      body: {
        mode: 'hire-us',
        userName: userName.value,
        messages: text === '__start__'
          ? [{ role: 'user', content: 'Ciao, è la prima volta che apro la chat.' }]
          : messages.value,
      },
    })
    messages.value.push({ role: 'assistant', content: res.content })
    for (const block of res.content) {
      if (block.type === 'tool_use') await handleToolUse(block)
    }
  } catch (e: any) {
    messages.value.push({ role: 'assistant', content: [{ type: 'text', text: 'Ho avuto un intoppo, riprova tra un attimo 🙏' }] })
  } finally {
    loading.value = false
  }
}

const handleToolUse = async (block: any) => {
  if (block.name === 'start_subscription_checkout') {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'hire_us_checkout_started')
    }
    try {
      const res = await $fetch<{ url: string }>('/api/hire-us/start-subscription', {
        method: 'POST',
        body: { formula: block.input.formula, albaSessionId: getAlbaSessionId() },
      })
      window.location.href = res.url
    } catch (e) {
      console.error('Stripe checkout error', e)
    }
  } else if (block.name === 'submit_project_lead') {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'hire_us_lead_submitted')
    }
    try {
      await $fetch('/api/hire-us/lead', {
        method: 'POST',
        body: {
          ...block.input,
          name: block.input.name || userName.value,
          transcript: messages.value,
          albaSessionId: getAlbaSessionId(),
        },
      })
    } catch (e) {
      console.error('Lead submit error', e)
    }
  }
}

const onSubmit = () => {
  const t = inputText.value.trim()
  if (!t) return
  inputText.value = ''
  sendToAlba(t)
}

const onChipClick = (label: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'hire_us_chip_clicked', { chip_id: label })
  }
  sendToAlba(label)
}

const extractChips = (msg: Message): Chip[] => {
  if (msg.role !== 'assistant' || !Array.isArray(msg.content)) return []
  for (const block of msg.content) {
    if (block.type === 'text' && block.text?.includes('CHIPS:')) {
      const match = block.text.match(/CHIPS:\s*(\[.*?\])/s)
      if (match) try { return JSON.parse(match[1]) } catch { return [] }
    }
  }
  return []
}

const renderText = (msg: Message): string => {
  if (!Array.isArray(msg.content)) return String(msg.content)
  return msg.content.filter((b: any) => b.type === 'text').map((b: any) => b.text.replace(/CHIPS:\s*\[.*?\]/s, '').trim()).join('\n')
}

const lastMessageChips = computed<Chip[]>(() => {
  const lastAssistant = [...messages.value].reverse().find(m => m.role === 'assistant')
  if (!lastAssistant) return []
  return extractChips(lastAssistant)
})
</script>

<template>
  <div class="alba-conversation flex flex-col h-full bg-[#fafaf7]">
    <div class="flex-1 overflow-y-auto px-6 py-8">
      <div class="max-w-[700px] mx-auto space-y-6">

        <div v-if="phase === 'name'" class="space-y-6">
          <div class="alba-msg">
            <p class="text-sm font-medium mb-1">Alba 🌱</p>
            <p>Ciao 👋 Sono <strong>Alba</strong>, l'AI di gruppo di Pianeta.Studio.</p>
            <p class="mt-2 text-sm text-black/65">Sono qui per ascoltarti e capire come Pianeta può esserti utile. Le decisioni significative passano sempre per Max e il team — io faccio da prima soglia.</p>
          </div>
          <div class="alba-msg">
            <p>Per cominciare, come ti chiami?</p>
          </div>
          <form @submit.prevent="submitName(nameInput)" class="bg-white border border-black/15 rounded-lg p-4 max-w-[400px]">
            <label class="text-xs text-black/60 mb-1.5 block">Il mio nome è</label>
            <div class="flex gap-2">
              <input
                v-model="nameInput"
                type="text"
                required
                autofocus
                class="flex-1 bg-white text-black border-b border-black/30 focus:border-black outline-none py-1 placeholder:text-black/40"
              />
              <button type="submit" class="text-sm font-medium hover:underline">OK →</button>
            </div>
          </form>
        </div>

        <template v-else>
          <div v-for="(msg, i) in messages" :key="i" class="alba-msg" :class="msg.role === 'user' ? 'is-user' : ''">
            <p v-if="msg.role === 'assistant'" class="text-sm font-medium mb-1">Alba 🌱</p>
            <p v-else class="text-sm font-medium mb-1 text-right">Tu</p>
            <p class="whitespace-pre-wrap" :class="msg.role === 'user' ? 'text-right' : ''">{{ renderText(msg) }}</p>
            <div v-if="Array.isArray(msg.content)" class="mt-3 space-y-2">
              <template v-for="(block, j) in msg.content" :key="j">
                <div v-if="block.type === 'tool_use' && block.name === 'start_subscription_checkout'" class="bg-black text-white rounded-lg p-4 max-w-[420px]">
                  <p class="font-bold">Team-as-a-Service</p>
                  <p class="text-sm text-white/70 mb-3">€4.000/mese · IVA inclusa</p>
                  <p class="text-xs text-white/60">Apertura Stripe Checkout…</p>
                </div>
                <div v-if="block.type === 'tool_use' && block.name === 'submit_project_lead'" class="bg-green-50 border border-green-200 rounded-lg p-3 max-w-[420px]">
                  <p class="text-sm">📨 Lead inviato al team</p>
                </div>
              </template>
            </div>
          </div>

          <div v-if="lastMessageChips.length" class="flex flex-wrap gap-3">
            <QuickReplyChip
              v-for="c in lastMessageChips"
              :key="c.id"
              :label="c.label"
              :sublabel="c.sublabel"
              :emoji="c.emoji"
              @click="onChipClick(c.label)"
            />
          </div>

          <div v-if="loading" class="alba-msg">
            <p class="text-sm text-black/40">Alba sta scrivendo…</p>
          </div>
        </template>

      </div>
    </div>

    <div v-if="phase === 'chat'" class="border-t border-black/10 bg-white p-4">
      <form @submit.prevent="onSubmit" class="max-w-[700px] mx-auto flex gap-2">
        <input
          v-model="inputText"
          type="text"
          placeholder="scrivimi qualsiasi cosa…"
          class="flex-1 bg-white text-black border border-black/15 rounded px-3 py-2 outline-none focus:border-black placeholder:text-black/40"
          :disabled="loading"
        />
        <button type="submit" :disabled="loading || !inputText.trim()" class="bg-black text-white px-4 py-2 rounded font-medium disabled:opacity-50">
          Invia
        </button>
      </form>
    </div>
  </div>
</template>
