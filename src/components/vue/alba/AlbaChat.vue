<script setup lang="ts">
import { ref, watch, nextTick, onMounted, computed } from 'vue'
import { useAlbaSession } from '~/composables/useAlbaSession'
import type { AlbaChatChunk } from '~/lib/alba/session-types'
import MarkdownIt from 'markdown-it'

// Renderer markdown safe: linkify auto, no html raw, target _blank per link esterni
const md = new MarkdownIt({ html: false, linkify: true, breaks: true })
const defaultRender = md.renderer.rules.link_open || function (tokens, idx, options, env, self) {
  return self.renderToken(tokens, idx, options)
}
md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
  const t = tokens[idx]
  const href = t.attrGet('href') || ''
  if (/^https?:/i.test(href)) {
    t.attrSet('target', '_blank')
    t.attrSet('rel', 'noopener noreferrer')
  }
  return defaultRender(tokens, idx, options, env, self)
}
function renderMd(text: string): string {
  return md.render(text || '')
}

interface Msg { role: 'user' | 'assistant'; content: string; handoff?: boolean; toolHint?: string }

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

const albaSession = useAlbaSession()

const messages = ref<Msg[]>([])
const input = ref('')
const sending = ref(false)
const scrollEl = ref<HTMLElement | null>(null)

const DEFAULT_CHIPS = [
  { label: 'Vedi i lavori', prompt: 'Mostrami i vostri lavori più recenti' },
  { label: 'Cosa fate', prompt: 'In due righe: di cosa si occupa Pianeta.Studio?' },
  { label: 'Lavoriamo insieme', prompt: 'Vorrei fare una call con Max, founder di Pianeta.Studio' },
]

const showChips = computed(() => {
  return messages.value.filter(m => m.role === 'user').length === 0
})

const APERTURA = `Ciao, sono Alba — l'AI di gruppo di Pianeta.Studio.

Sono qui per ascoltarti e capire come Pianeta può esserti utile. Mi racconti cosa ti porta qui?

—Alba, AI di Pianeta.Studio · Le decisioni significative passano per Max.`

watch(() => props.open, (o) => {
  if (o) {
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

async function send(directText?: string) {
  const text = directText?.trim() || input.value.trim()
  if (!text || sending.value) return

  if (!albaSession.sessionId.value) {
    await albaSession.initSession({ url: typeof window !== 'undefined' ? window.location.pathname : '/' })
  }
  if (!albaSession.sessionId.value) return

  messages.value.push({ role: 'user', content: text })
  input.value = ''
  sending.value = true
  await nextTick(); scrollBottom()

  // Placeholder for streamed assistant response
  const asstIdx = messages.value.push({ role: 'assistant', content: '' }) - 1

  try {
    const res = await fetch('/api/alba/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        uid: albaSession.uid.value,
        session_id: albaSession.sessionId.value,
        messages: messages.value.slice(0, -1).slice(-10).map(m => ({ role: m.role, content: m.content })),
        page_context: { url: typeof window !== 'undefined' ? window.location.pathname : '/' },
      }),
    })

    if (!res.ok || !res.body) {
      messages.value[asstIdx].content = '⚠️ Errore di connessione. Riprova.'
      return
    }

    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let buf = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buf += decoder.decode(value, { stream: true })
      let nl: number
      while ((nl = buf.indexOf('\n\n')) !== -1) {
        const raw = buf.slice(0, nl)
        buf = buf.slice(nl + 2)
        if (!raw.startsWith('data:')) continue
        const json = raw.slice(5).trim()
        try {
          const chunk = JSON.parse(json) as AlbaChatChunk
          if (chunk.type === 'text') {
            messages.value[asstIdx].content += chunk.delta
            await nextTick(); scrollBottom()
          } else if (chunk.type === 'tool_use') {
            messages.value[asstIdx].toolHint = `Sto consultando ${chunk.name}…`
          } else if (chunk.type === 'error') {
            messages.value[asstIdx].content += `\n⚠️ ${chunk.message}`
          } else if (chunk.type === 'done') {
            messages.value[asstIdx].toolHint = undefined
          }
        } catch { /* ignore malformed chunk */ }
      }
    }
  } catch {
    messages.value[asstIdx].content = 'Mi spiace, qualcosa è andato storto. Scrivimi direttamente a max@pianeta.studio.\n\n—Alba, AI di Pianeta.Studio · Le decisioni significative passano per Max.'
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
          <div class="alba-bubble alba-bubble-md" v-html="renderMd(m.content)"></div>
          <p v-if="m.toolHint" class="italic text-sm text-black/50">{{ m.toolHint }}</p>
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
        <div v-if="showChips" class="alba-chips">
          <button
            v-for="(c, i) in DEFAULT_CHIPS"
            :key="i"
            type="button"
            class="alba-chip"
            @click="send(c.prompt)"
          >{{ c.label }}</button>
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
              <div class="alba-bubble alba-bubble-md" v-html="renderMd(m.content)"></div>
              <p v-if="m.toolHint" class="italic text-sm text-black/50">{{ m.toolHint }}</p>
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
            <div v-if="showChips" class="alba-chips">
              <button
                v-for="(c, i) in DEFAULT_CHIPS"
                :key="i"
                type="button"
                class="alba-chip"
                @click="send(c.prompt)"
              >{{ c.label }}</button>
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

.alba-chips {
  display: flex; flex-wrap: wrap; gap: 8px;
  padding: 8px 14px 16px;
}
.alba-chip {
  padding: 8px 14px;
  background: rgba(255,255,255,0.65);
  border: 1px solid rgba(14,17,22,0.10);
  border-radius: 999px;
  font-size: 13px;
  font-weight: 500;
  color: #0e1116;
  cursor: pointer;
  transition: background 150ms, border-color 150ms;
}
.alba-chip:hover {
  background: #ffffff;
  border-color: var(--cta-primary, #FF6B33);
  color: var(--cta-primary, #FF6B33);
}
</style>
