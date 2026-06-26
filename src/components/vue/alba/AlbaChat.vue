<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from 'vue'
import { $fetch } from '~/lib/nuxt-shims'

interface Msg { role: 'user' | 'assistant'; content: string; handoff?: boolean }

const props = defineProps<{
  open: boolean
  embedded?: boolean
  initialPrompt?: string | null
  pageContext?: { context?: string; contextSlug?: string }
  suggested?: string[]
}>()
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'suggested-click', prompt: string): void
}>()

const messages = ref<Msg[]>([])
const input = ref('')
const sending = ref(false)
const sessionId = ref<string>('')
const scrollEl = ref<HTMLElement | null>(null)

const APERTURA = `Ciao, sono Alba — l'AI di gruppo di Pianeta.Studio.

Sono qui per ascoltarti e capire come Pianeta può esserti utile. Mi racconti cosa ti porta qui?

—Alba, AI di Pianeta.Studio · Le decisioni significative passano per Max.`

function uuid() {
  if (typeof crypto !== 'undefined' && (crypto as any).randomUUID) return (crypto as any).randomUUID()
  return 'sess-' + Math.random().toString(36).slice(2) + Date.now().toString(36)
}

function ensureSession() {
  if (typeof window === 'undefined') return
  const stored = window.localStorage.getItem('alba_session')
  if (stored && /^[a-zA-Z0-9-]{8,64}$/.test(stored)) {
    sessionId.value = stored
  } else {
    sessionId.value = uuid()
    window.localStorage.setItem('alba_session', sessionId.value)
  }
}

watch(() => props.open, (o) => {
  if (o) {
    ensureSession()
    if (!messages.value.length) {
      messages.value = [{ role: 'assistant', content: APERTURA }]
    }
    nextTick(() => scrollBottom())
    if (props.initialPrompt) {
      nextTick(() => {
        input.value = props.initialPrompt!
        send()
      })
    }
  }
})

watch(() => props.initialPrompt, (p) => {
  if (p && (props.open || props.embedded)) {
    input.value = p
    nextTick(() => send())
  }
})

onMounted(() => {
  if (props.embedded) {
    ensureSession()
    if (!messages.value.length) {
      messages.value = [{ role: 'assistant', content: APERTURA }]
    }
    nextTick(() => scrollBottom())
    if (props.initialPrompt) {
      nextTick(() => {
        input.value = props.initialPrompt!
        send()
      })
    }
  }
})

function scrollBottom() {
  if (scrollEl.value) scrollEl.value.scrollTop = scrollEl.value.scrollHeight
}

function scrollLastIntoView() {
  if (!scrollEl.value) return
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (!scrollEl.value) return
      const msgs = scrollEl.value.querySelectorAll<HTMLElement>('.alba-msg')
      const last = msgs[msgs.length - 1]
      if (!last) return
      const offset = last.offsetTop - 12
      scrollEl.value.scrollTo({ top: Math.max(0, offset), behavior: 'smooth' })
    })
  })
}

async function send() {
  const text = input.value.trim()
  if (!text || sending.value) return
  messages.value.push({ role: 'user', content: text })
  input.value = ''
  sending.value = true
  await nextTick(); scrollBottom()
  try {
    const payload = messages.value.slice(-10).map(m => ({ role: m.role, content: m.content }))
    const res = await $fetch<{ reply: string; handoff_to_max: boolean; handoff_reason: string | null; session_id: string }>('/api/alba/chat', {
      method: 'POST',
      body: { messages: payload, session_id: sessionId.value, pageContext: props.pageContext },
    })
    if (res.session_id) sessionId.value = res.session_id
    messages.value.push({ role: 'assistant', content: res.reply, handoff: res.handoff_to_max })
  } catch (e: any) {
    messages.value.push({
      role: 'assistant',
      content: 'Mi spiace, qualcosa è andato storto. Scrivimi direttamente a max@pianeta.studio.\n\n—Alba, AI di Pianeta.Studio · Le decisioni significative passano per Max.',
    })
  } finally {
    sending.value = false
    await nextTick(); scrollLastIntoView()
  }
}

function handleKey(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
}

function close() { emit('close') }
</script>

<template>
  <template v-if="embedded">
    <div class="alba-modal" style="display:contents">
      <div ref="scrollEl" class="alba-body">
        <div v-for="(m, i) in messages" :key="i" :class="['alba-msg', m.role]">
          <div class="alba-bubble" v-html="m.content.split('\n').map(l => l ? l : '&nbsp;').join('<br/>')"></div>
          <div v-if="m.handoff" class="alba-handoff-tag">→ Max viene avvisato</div>
        </div>
        <div v-if="props.suggested && props.suggested.length && messages.length === 1" class="flex flex-wrap gap-2 p-3">
          <button
            v-for="s in props.suggested" :key="s"
            @click="$emit('suggested-click', s)"
            class="bg-black/5 hover:bg-black/10 px-3 py-1.5 text-sm rounded-full"
          >
            {{ s }}
          </button>
        </div>
        <div v-if="sending" class="alba-msg assistant">
          <div class="alba-bubble alba-typing"><span></span><span></span><span></span></div>
        </div>
      </div>
      <div class="alba-input">
        <textarea
          v-model="input"
          @keydown="handleKey"
          placeholder="Scrivi qui — Invio per inviare, Shift+Invio per andare a capo"
          rows="2"
          :disabled="sending"
        />
        <button @click="send" :disabled="sending || !input.trim()" class="alba-send">Invia</button>
      </div>
      <footer class="alba-foot">
        <span>Sono un'AI. Conversazione conservata 24 mesi (audit AI Act).</span>
      </footer>
    </div>
  </template>

  <Teleport v-else to="body">
    <Transition name="alba-fade">
      <div v-if="open" class="alba-overlay" @click.self="close">
        <div class="alba-modal" role="dialog" aria-modal="true" aria-label="Chat con Alba">
          <header class="alba-header">
            <div class="alba-avatar" aria-hidden="true"></div>
            <div class="alba-meta">
              <div class="alba-name">Alba</div>
              <div class="alba-sub">AI di Pianeta.Studio</div>
            </div>
            <button class="alba-close" @click="close" aria-label="Chiudi chat">×</button>
          </header>

          <div ref="scrollEl" class="alba-body">
            <div v-for="(m, i) in messages" :key="i" :class="['alba-msg', m.role]">
              <div class="alba-bubble" v-html="m.content.split('\n').map(l => l ? l : '&nbsp;').join('<br/>')"></div>
              <div v-if="m.handoff" class="alba-handoff-tag">→ Max viene avvisato</div>
            </div>
            <div v-if="props.suggested && props.suggested.length && messages.length === 1" class="flex flex-wrap gap-2 p-3">
              <button
                v-for="s in props.suggested" :key="s"
                @click="$emit('suggested-click', s)"
                class="bg-black/5 hover:bg-black/10 px-3 py-1.5 text-sm rounded-full"
              >
                {{ s }}
              </button>
            </div>
            <div v-if="sending" class="alba-msg assistant">
              <div class="alba-bubble alba-typing"><span></span><span></span><span></span></div>
            </div>
          </div>

          <div class="alba-input">
            <textarea
              v-model="input"
              @keydown="handleKey"
              placeholder="Scrivi qui — Invio per inviare, Shift+Invio per andare a capo"
              rows="2"
              :disabled="sending"
            />
            <button @click="send" :disabled="sending || !input.trim()" class="alba-send">Invia</button>
          </div>

          <footer class="alba-foot">
            <span>Sono un'AI. Conversazione conservata 24 mesi (audit AI Act).</span>
            <button @click="close" class="alba-close-link">Chiudi</button>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.alba-overlay {
  position: fixed; inset: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  z-index: 9999;
  display: flex; align-items: center; justify-content: center;
  padding: 16px;
}
.alba-modal {
  width: 100%; max-width: 600px; height: min(640px, calc(100vh - 32px));
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 24px 80px rgba(0,0,0,0.25);
  display: flex; flex-direction: column;
  overflow: hidden;
  font-family: system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif;
  color: #1e293b;
}
.alba-header {
  display: flex; align-items: center; gap: 12px;
  padding: 16px 18px;
  border-bottom: 1px solid #e2e8f0;
  background: #ffffff;
}
.alba-avatar {
  width: 40px; height: 40px; border-radius: 50%;
  background: linear-gradient(135deg, #046BD2 0%, #FF6B33 100%);
  flex-shrink: 0;
}
.alba-meta { flex: 1; min-width: 0; }
.alba-name { font-weight: 700; font-size: 16px; line-height: 1.1; color: #0f172a; }
.alba-sub { font-size: 12px; color: #64748b; margin-top: 2px; }
.alba-close {
  border: 0; background: transparent; font-size: 28px; line-height: 1; color: #64748b;
  cursor: pointer; padding: 4px 8px; border-radius: 6px;
}
.alba-close:hover { background: #f1f5f9; color: #0f172a; }

.alba-body {
  flex: 1; overflow-y: auto;
  padding: 20px 18px;
  background: #F9FAFB;
  display: flex; flex-direction: column; gap: 12px;
}
.alba-msg { display: flex; flex-direction: column; max-width: 85%; }
.alba-msg.user { align-self: flex-end; align-items: flex-end; }
.alba-msg.assistant { align-self: flex-start; align-items: flex-start; }
.alba-bubble {
  padding: 12px 14px;
  border-radius: 14px;
  font-size: 14px; line-height: 1.55;
  word-wrap: break-word;
}
.alba-msg.user .alba-bubble {
  background: #046BD2; color: #ffffff;
  border-bottom-right-radius: 4px;
}
.alba-msg.assistant .alba-bubble {
  background: #ffffff; color: #1e293b;
  border: 1px solid #e2e8f0;
  border-bottom-left-radius: 4px;
}
.alba-handoff-tag {
  font-size: 11px; color: #FF6B33; font-weight: 600;
  margin-top: 4px; text-transform: uppercase; letter-spacing: 0.05em;
}

.alba-typing { display: inline-flex; gap: 4px; padding: 14px 16px; }
.alba-typing span {
  width: 6px; height: 6px; border-radius: 50%;
  background: #94a3b8;
  animation: alba-blink 1.2s infinite ease-in-out;
}
.alba-typing span:nth-child(2) { animation-delay: 0.2s; }
.alba-typing span:nth-child(3) { animation-delay: 0.4s; }
@keyframes alba-blink {
  0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
  40% { opacity: 1; transform: scale(1); }
}

.alba-input {
  display: flex; gap: 8px;
  padding: 12px 14px;
  border-top: 1px solid #e2e8f0;
  background: #ffffff;
}
.alba-input textarea {
  flex: 1; resize: none;
  border: 1px solid #cbd5e1; border-radius: 8px;
  padding: 10px 12px;
  font-family: inherit; font-size: 14px; line-height: 1.4;
  color: #1e293b; background: #ffffff;
  outline: none;
}
.alba-input textarea:focus { border-color: #046BD2; }
.alba-input textarea:disabled { opacity: 0.6; }
.alba-send {
  border: 0; background: #046BD2; color: #ffffff;
  padding: 0 18px; border-radius: 8px;
  font-weight: 600; font-size: 14px; cursor: pointer;
  transition: background 0.15s;
}
.alba-send:hover:not(:disabled) { background: #035aab; }
.alba-send:disabled { opacity: 0.4; cursor: not-allowed; }

.alba-foot {
  display: flex; justify-content: space-between; align-items: center;
  padding: 8px 14px;
  background: #F0F5FA;
  border-top: 1px solid #e2e8f0;
  font-size: 11px; color: #64748b;
}
.alba-close-link {
  border: 0; background: transparent; color: #046BD2;
  cursor: pointer; font-size: 11px; text-decoration: underline;
}

.alba-fade-enter-active, .alba-fade-leave-active { transition: opacity 0.2s ease; }
.alba-fade-enter-from, .alba-fade-leave-to { opacity: 0; }
</style>
