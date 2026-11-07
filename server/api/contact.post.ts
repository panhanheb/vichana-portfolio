const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const LIMITS = { name: 100, email: 200, subject: 150, message: 2000 }

const clean = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

export default defineEventHandler(async (event) => {
  enforceRateLimit(event, 'contact', 5, 10 * 60_000)

  const body = await readBody<Record<string, unknown>>(event)

  // Honeypot: real users never fill this hidden field. Pretend success for bots.
  if (typeof body?.company === 'string' && body.company.trim()) return { ok: true }

  const data = {
    name: clean(body?.name, LIMITS.name),
    email: clean(body?.email, LIMITS.email),
    subject: clean(body?.subject, LIMITS.subject),
    message: clean(body?.message, LIMITS.message),
  }

  if (!data.name || !data.subject) throw createError({ statusCode: 400, message: 'Please fill in all required fields.' })
  if (!EMAIL_RE.test(data.email)) throw createError({ statusCode: 400, message: 'Please provide a valid email address.' })
  if (data.message.length < 10) throw createError({ statusCode: 400, message: 'Your message is too short.' })

  const { contactWebhookUrl } = useRuntimeConfig(event)

  if (contactWebhookUrl) {
    try {
      await $fetch(contactWebhookUrl, {
        method: 'POST',
        timeout: 10_000,
        body: {
          // `text` / `content` make the payload readable in Slack / Discord out of the box.
          text: `New portfolio message from ${data.name} <${data.email}>\nSubject: ${data.subject}\n\n${data.message}`,
          content: `**New portfolio message** from ${data.name} <${data.email}>\n**Subject:** ${data.subject}\n\n${data.message}`,
          ...data,
          receivedAt: new Date().toISOString(),
        },
      })
    } catch (err) {
      console.error('[api/contact] Webhook delivery failed:', err)
      throw createError({ statusCode: 502, message: "Your message couldn't be delivered right now." })
    }
  } else {
    // No delivery channel configured — log so nothing is silently lost in development.
    console.info('[api/contact] New message (set NUXT_CONTACT_WEBHOOK_URL to deliver):', data)
  }

  return { ok: true }
})
