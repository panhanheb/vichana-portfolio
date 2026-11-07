<template>
  <div class="chat">
    <Transition name="pop">
      <button
        v-if="!isOpen"
        ref="triggerEl"
        class="chat__fab"
        aria-haspopup="dialog"
        aria-controls="ai-chat-panel"
        @click="open"
      >
        <AppIcon name="sparkles" :size="18" />
        <span>Ask AI</span>
      </button>
    </Transition>

    <Transition name="panel">
      <section
        v-if="isOpen"
        id="ai-chat-panel"
        class="chat__panel"
        role="dialog"
        aria-modal="false"
        aria-labelledby="ai-chat-title"
        @keydown.esc="close"
      >
        <header class="chat__header">
          <span class="chat__avatar"><AppIcon name="sparkles" :size="16" /></span>
          <div class="chat__heading">
            <h2 id="ai-chat-title">Ask about {{ profile.shortName }}</h2>
            <p>AI assistant · usually instant</p>
          </div>
          <button v-if="messages.length" class="chat__icon-btn" title="Clear conversation" @click="clear">
            Clear
          </button>
          <button class="chat__icon-btn" aria-label="Close assistant" @click="close">
            <AppIcon name="close" :size="16" />
          </button>
        </header>

        <div ref="logEl" class="chat__log" role="log" aria-live="polite" aria-relevant="additions">
          <div v-if="!messages.length" class="chat__empty">
            <p class="chat__intro">
              Hi! I can answer questions about {{ profile.shortName }}'s experience, skills and projects.
            </p>
            <div class="chat__suggestions">
              <button v-for="q in suggestions" :key="q" class="chat__suggestion" @click="send(q)">
                {{ q }}
                <AppIcon name="arrow-right" :size="14" />
              </button>
            </div>
          </div>

          <div
            v-for="(msg, i) in messages"
            :key="i"
            class="chat__msg"
            :class="`chat__msg--${msg.role}`"
          >
            <span class="sr-only">{{ msg.role === 'user' ? 'You said:' : 'Assistant said:' }}</span>
            <div class="chat__bubble" :class="{ 'chat__bubble--error': msg.error }">{{ msg.text }}</div>
            <button v-if="msg.error && i === messages.length - 1" class="chat__retry" @click="retry">Try again</button>
          </div>

          <div v-if="pending" class="chat__msg chat__msg--assistant" aria-label="Assistant is typing">
            <div class="chat__bubble chat__bubble--typing"><span></span><span></span><span></span></div>
          </div>
        </div>

        <form class="chat__composer" @submit.prevent="send()">
          <label for="ai-chat-input" class="sr-only">Your question</label>
          <textarea
            id="ai-chat-input"
            ref="inputEl"
            v-model="input"
            rows="1"
            :maxlength="MAX_LEN"
            placeholder="Ask a question…"
            @keydown.enter.exact.prevent="send()"
            @input="autosize"
          ></textarea>
          <button type="submit" class="chat__send" :disabled="!input.trim() || pending" aria-label="Send">
            <AppIcon name="send" :size="16" />
          </button>
        </form>
        <p class="chat__note">
          AI answers may be inaccurate. For anything important, <a href="#contact" @click="close">contact {{ profile.shortName }} directly</a>.
        </p>
      </section>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { profile } from '#shared/portfolio'

interface Message { role: 'user' | 'assistant'; text: string; error?: boolean }

const MAX_LEN = 500
const MAX_HISTORY = 20
const STORAGE_KEY = 'ai-chat'

const suggestions = [
  'What is the core tech stack?',
  'Tell me about recent projects',
  'Is Vichna available for work?',
  'What certifications are there?',
]

const isOpen = ref(false)
const input = ref('')
const messages = ref<Message[]>([])
const pending = ref(false)
const logEl = ref<HTMLElement | null>(null)
const inputEl = ref<HTMLTextAreaElement | null>(null)
const triggerEl = ref<HTMLButtonElement | null>(null)

const persist = () => {
  try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.value.filter(m => !m.error))) } catch { /* ignore */ }
}

onMounted(() => {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY)
    if (saved) messages.value = JSON.parse(saved)
  } catch { /* ignore */ }
})

const scrollToEnd = () => nextTick(() => {
  if (logEl.value) logEl.value.scrollTop = logEl.value.scrollHeight
})

const autosize = () => {
  const el = inputEl.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = `${Math.min(el.scrollHeight, 120)}px`
}

const open = () => {
  isOpen.value = true
  nextTick(() => { inputEl.value?.focus(); scrollToEnd() })
}

const close = () => {
  isOpen.value = false
  nextTick(() => triggerEl.value?.focus())
}

const clear = () => {
  messages.value = []
  persist()
  inputEl.value?.focus()
}

const request = async (text: string) => {
  pending.value = true
  scrollToEnd()
  const history = messages.value
    .slice(0, -1)
    .filter(m => !m.error)
    .slice(-MAX_HISTORY)
    .map(m => ({ role: m.role === 'user' ? 'user' : 'model', text: m.text }))

  try {
    const data = await $fetch<{ reply: string }>('/api/chat', { method: 'POST', body: { message: text, history } })
    messages.value.push({ role: 'assistant', text: data.reply })
  } catch (err: any) {
    messages.value.push({
      role: 'assistant',
      text: err?.data?.message || 'Sorry, I couldn\'t reach the assistant right now.',
      error: true,
    })
  } finally {
    pending.value = false
    persist()
    scrollToEnd()
  }
}

const send = (preset?: string) => {
  const text = (preset ?? input.value).trim().slice(0, MAX_LEN)
  if (!text || pending.value) return
  messages.value.push({ role: 'user', text })
  input.value = ''
  nextTick(autosize)
  request(text)
}

const retry = () => {
  const last = messages.value[messages.value.length - 1]
  if (!last?.error) return
  messages.value.pop()
  const lastUser = [...messages.value].reverse().find(m => m.role === 'user')
  if (lastUser) request(lastUser.text)
}
</script>

<style scoped>
.chat__fab {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 950;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 44px;
  padding: 0 18px;
  border: 0;
  border-radius: 999px;
  background: var(--accent);
  color: var(--accent-contrast);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  box-shadow: var(--shadow-lg);
  transition: transform var(--dur) var(--ease), background var(--dur) var(--ease);
}

.chat__fab:hover { transform: translateY(-2px); background: var(--accent-hover); }

.chat__panel {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 1001;
  width: 380px;
  height: min(600px, calc(100vh - 48px));
  display: flex;
  flex-direction: column;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
}

.chat__header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 14px 14px 16px;
  border-bottom: 1px solid var(--border);
}

.chat__avatar {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: var(--accent-soft);
  color: var(--accent);
  flex-shrink: 0;
}

.chat__heading { flex: 1; min-width: 0; }
.chat__heading h2 { font-size: 15px; letter-spacing: -0.01em; }
.chat__heading p { font-size: 12.5px; color: var(--text-muted); }

.chat__icon-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 32px;
  min-width: 32px;
  justify-content: center;
  padding: 0 8px;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--text-muted);
  font-size: 12.5px;
  cursor: pointer;
}

.chat__icon-btn:hover { color: var(--text); background: var(--surface-hover); }

.chat__log {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overscroll-behavior: contain;
}

.chat__empty { display: flex; flex-direction: column; gap: 16px; }
.chat__intro { font-size: 14px; line-height: 1.6; }

.chat__suggestions { display: flex; flex-direction: column; gap: 6px; }

.chat__suggestion {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 10px 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--bg);
  color: var(--text);
  font-size: 13.5px;
  text-align: left;
  cursor: pointer;
  transition: border-color var(--dur) var(--ease), background var(--dur) var(--ease);
}

.chat__suggestion :deep(svg) { color: var(--text-muted); flex-shrink: 0; }
.chat__suggestion:hover { border-color: var(--border-strong); background: var(--surface-hover); }

.chat__msg { display: flex; flex-direction: column; align-items: flex-start; gap: 4px; }
.chat__msg--user { align-items: flex-end; }

.chat__bubble {
  max-width: 85%;
  padding: 9px 13px;
  border-radius: 14px;
  font-size: 14px;
  line-height: 1.55;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.chat__msg--assistant .chat__bubble { background: var(--bg-subtle); border: 1px solid var(--border); color: var(--text); border-bottom-left-radius: 4px; }
.chat__msg--user .chat__bubble { background: var(--text); color: var(--bg); border-bottom-right-radius: 4px; }
.chat__bubble--error { color: var(--danger) !important; border-color: color-mix(in srgb, var(--danger) 30%, transparent) !important; }

.chat__retry {
  border: 0;
  background: none;
  color: var(--accent);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  padding: 2px 4px;
}

.chat__bubble--typing { display: flex; gap: 4px; padding: 13px 14px; }
.chat__bubble--typing span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--text-muted);
  animation: blink 1.2s infinite ease-in-out;
}
.chat__bubble--typing span:nth-child(2) { animation-delay: 0.15s; }
.chat__bubble--typing span:nth-child(3) { animation-delay: 0.3s; }

@keyframes blink { 0%, 80%, 100% { opacity: 0.3; } 40% { opacity: 1; } }

.chat__composer {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  margin: 0 12px;
  padding: 8px 8px 8px 12px;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius);
  background: var(--bg);
  transition: border-color var(--dur) var(--ease), box-shadow var(--dur) var(--ease);
}

.chat__composer:focus-within { border-color: var(--accent); box-shadow: 0 0 0 3px var(--ring); }

.chat__composer textarea {
  flex: 1;
  min-height: 24px;
  max-height: 120px;
  padding: 4px 0;
  border: 0;
  outline: none;
  resize: none;
  background: transparent;
  font-size: 14px;
  line-height: 1.5;
}

.chat__composer textarea::placeholder { color: var(--text-muted); }

.chat__send {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border: 0;
  border-radius: var(--radius-sm);
  background: var(--accent);
  color: var(--accent-contrast);
  cursor: pointer;
  flex-shrink: 0;
  transition: opacity var(--dur) var(--ease);
}

.chat__send:disabled { opacity: 0.35; cursor: not-allowed; }

.chat__note {
  padding: 8px 16px 12px;
  font-size: 11.5px;
  color: var(--text-muted);
  text-align: center;
}

.chat__note a { color: var(--text-secondary); text-decoration: underline; }

.pop-enter-active, .pop-leave-active { transition: opacity 180ms var(--ease), transform 180ms var(--ease); }
.pop-enter-from, .pop-leave-to { opacity: 0; transform: scale(0.9); }

.panel-enter-active, .panel-leave-active { transition: opacity 200ms var(--ease), transform 200ms var(--ease); transform-origin: bottom right; }
.panel-enter-from, .panel-leave-to { opacity: 0; transform: translateY(12px) scale(0.98); }

@media (max-width: 480px) {
  .chat__fab { right: 16px; bottom: 16px; }
  .chat__panel { inset: auto 8px 8px 8px; width: auto; height: calc(100dvh - 16px); }
}
</style>
