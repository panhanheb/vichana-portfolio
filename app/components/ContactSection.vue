<template>
  <section id="contact" class="section section--alt">
    <KbachFlower class="ornament ornament--tr ornament--spin" />
    <div class="container contact">
      <div class="contact__info">
        <SectionHeader
          eyebrow="Contact"
          title="Let's build something together."
          description="Have a project, role or idea in mind? Send a message and I'll get back to you within one business day."
        />

        <ul v-reveal:left class="contact__channels">
          <li>
            <a :href="`mailto:${profile.email}`" class="contact__channel">
              <span class="contact__icon"><AppIcon name="mail" /></span>
              <span>
                <span class="contact__label">Email</span>
                <span class="contact__value">{{ profile.email }}</span>
              </span>
            </a>
          </li>
          <li>
            <div class="contact__channel">
              <span class="contact__icon"><AppIcon name="map-pin" /></span>
              <span>
                <span class="contact__label">Location</span>
                <span class="contact__value">{{ profile.location }} ({{ profile.timezone }})</span>
              </span>
            </div>
          </li>
          <li v-if="linkedin">
            <a :href="linkedin.href" target="_blank" rel="noopener noreferrer" class="contact__channel">
              <span class="contact__icon"><AppIcon name="linkedin" /></span>
              <span>
                <span class="contact__label">LinkedIn</span>
                <span class="contact__value">{{ linkedin.href.replace(/^https?:\/\//, '') }}</span>
              </span>
            </a>
          </li>
        </ul>
      </div>

      <div v-reveal:right="120" class="card contact__card">
        <div v-if="status === 'success'" class="contact__success" role="status">
          <span class="contact__success-icon"><AppIcon name="check-circle" :size="28" /></span>
          <h3>Message sent</h3>
          <p>Thanks for reaching out, {{ sentName }}. I'll reply to your email shortly.</p>
          <button type="button" class="btn btn--secondary" @click="reset">Send another message</button>
        </div>

        <form v-else class="form" novalidate @submit.prevent="submit">
          <div class="form__row">
            <FormField id="name" v-model="form.name" label="Name" autocomplete="name" placeholder="Jane Doe" :error="errors.name" @blur="validate('name')" />
            <FormField id="email" v-model="form.email" label="Email" type="email" autocomplete="email" placeholder="jane@company.com" :error="errors.email" @blur="validate('email')" />
          </div>
          <FormField id="subject" v-model="form.subject" label="Subject" placeholder="Project inquiry" :error="errors.subject" @blur="validate('subject')" />
          <FormField
            id="message"
            v-model="form.message"
            label="Message"
            multiline
            :maxlength="LIMITS.message"
            placeholder="Tell me about your project, timeline and budget…"
            :error="errors.message"
            :hint="`${form.message.length}/${LIMITS.message}`"
            @blur="validate('message')"
          />

          <!-- Honeypot: hidden from users, catches naive bots -->
          <input v-model="form.company" type="text" name="company" class="form__hp" tabindex="-1" autocomplete="off" aria-hidden="true" />

          <p v-if="status === 'error'" class="form__alert" role="alert">
            <AppIcon name="alert" :size="16" />
            <span>{{ serverError }} You can also email <a :href="`mailto:${profile.email}`">{{ profile.email }}</a>.</span>
          </p>

          <button type="submit" class="btn btn--accent btn--block" :disabled="status === 'sending'">
            <span v-if="status === 'sending'" class="spinner" aria-hidden="true"></span>
            <AppIcon v-else name="send" :size="16" />
            {{ status === 'sending' ? 'Sending…' : 'Send message' }}
          </button>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { profile, socials } from '#shared/portfolio'

type Field = 'name' | 'email' | 'subject' | 'message'

const LIMITS = { name: 100, subject: 150, message: 2000 }
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const linkedin = socials.find(s => s.icon === 'linkedin')

const form = reactive({ name: '', email: '', subject: '', message: '', company: '' })
const errors = reactive<Partial<Record<Field, string>>>({})
const status = ref<'idle' | 'sending' | 'success' | 'error'>('idle')
const serverError = ref('')
const sentName = ref('')

const rules: Record<Field, (v: string) => string | undefined> = {
  name: v => !v ? 'Please enter your name.' : v.length > LIMITS.name ? 'Name is too long.' : undefined,
  email: v => !v ? 'Please enter your email.' : !EMAIL_RE.test(v) ? 'Please enter a valid email address.' : undefined,
  subject: v => !v ? 'Please add a subject.' : v.length > LIMITS.subject ? 'Subject is too long.' : undefined,
  message: v => v.length < 10 ? 'Message should be at least 10 characters.' : v.length > LIMITS.message ? 'Message is too long.' : undefined,
}

const validate = (field: Field) => {
  const msg = rules[field](form[field].trim())
  if (msg) errors[field] = msg
  else delete errors[field]
  return !msg
}

const submit = async () => {
  const fields = Object.keys(rules) as Field[]
  const valid = fields.map(validate).every(Boolean)
  if (!valid) {
    const first = fields.find(f => errors[f])
    if (first) document.getElementById(first)?.focus()
    return
  }

  status.value = 'sending'
  try {
    await $fetch('/api/contact', { method: 'POST', body: { ...form } })
    sentName.value = form.name.trim().split(' ')[0] ?? ''
    status.value = 'success'
    Object.assign(form, { name: '', email: '', subject: '', message: '', company: '' })
  } catch (err: any) {
    serverError.value = err?.data?.message || 'Something went wrong while sending your message.'
    status.value = 'error'
  }
}

const reset = () => { status.value = 'idle' }
</script>

<style scoped>
.contact {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr);
  gap: 64px;
  align-items: start;
}

.contact__info :deep(.section-header) { margin-bottom: 36px; }

.contact__channels { display: flex; flex-direction: column; gap: 8px; }

.contact__channel {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px;
  margin-left: -12px;
  border-radius: var(--radius);
  transition: background var(--dur) var(--ease);
}

a.contact__channel:hover { background: var(--surface-hover); }

.contact__icon {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text-secondary);
  flex-shrink: 0;
}

.contact__label { display: block; font-size: 13px; color: var(--text-muted); }
.contact__value { display: block; font-size: 15px; font-weight: 500; color: var(--text); word-break: break-word; }

.contact__card { padding: 32px; box-shadow: var(--shadow-md); }

.form { display: flex; flex-direction: column; gap: 20px; }
.form__row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

.form__hp { position: absolute; left: -9999px; width: 1px; height: 1px; opacity: 0; }

.form__alert {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  padding: 12px 14px;
  border-radius: var(--radius-sm);
  background: color-mix(in srgb, var(--danger) 10%, transparent);
  color: var(--danger);
  font-size: 14px;
}

.form__alert :deep(svg) { margin-top: 3px; flex-shrink: 0; }
.form__alert a { text-decoration: underline; }

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 700ms linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.contact__success {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 12px;
  padding: 40px 8px;
}

.contact__success-icon {
  display: grid;
  place-items: center;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: color-mix(in srgb, var(--success) 12%, transparent);
  color: var(--success);
  margin-bottom: 4px;
}

.contact__success h3 { font-size: 20px; }
.contact__success .btn { margin-top: 12px; }

@media (max-width: 900px) {
  .contact { grid-template-columns: 1fr; gap: 40px; }
}

@media (max-width: 560px) {
  .contact__card { padding: 22px; }
  .form__row { grid-template-columns: 1fr; }
}
</style>
