import { buildAssistantContext, profile } from '#shared/portfolio'

const MAX_MESSAGE = 500
const MAX_HISTORY = 20

const SYSTEM_PROMPT = `You are the assistant on ${profile.name}'s professional portfolio website. You help visitors \
(recruiters, clients, collaborators) learn about ${profile.shortName}'s work.

Facts you may use:
${buildAssistantContext()}

Guidelines:
- Be professional, warm and concise: 2–4 sentences unless the visitor asks for detail.
- Only state facts listed above. If you don't know something, say so and suggest using the contact form or emailing ${profile.email}.
- Do not invent personal details, rates, or employers.
- No emojis. Plain text only (no markdown headings or tables).
- Politely decline requests unrelated to ${profile.shortName}'s professional work.`

interface Turn { role: 'user' | 'model'; text: string }

export default defineEventHandler(async (event) => {
  enforceRateLimit(event, 'chat', 20, 60_000)

  const body = await readBody<{ message?: unknown; history?: unknown }>(event)
  const message = typeof body?.message === 'string' ? body.message.trim() : ''

  if (!message) throw createError({ statusCode: 400, message: 'Please enter a question.' })
  if (message.length > MAX_MESSAGE) {
    throw createError({ statusCode: 400, message: `Questions are limited to ${MAX_MESSAGE} characters.` })
  }

  const history: Turn[] = Array.isArray(body?.history)
    ? (body.history as any[])
        .filter(h => (h?.role === 'user' || h?.role === 'model') && typeof h?.text === 'string')
        .slice(-MAX_HISTORY)
        .map(h => ({ role: h.role, text: String(h.text).slice(0, 2000) }))
    : []

  const config = useRuntimeConfig(event)
  const apiKey = config.geminiApiKey || process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw createError({
      statusCode: 503,
      message: `The assistant isn't configured yet. Please use the contact form or email ${profile.email}.`,
    })
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${config.geminiModel}:generateContent`

  try {
    const res = await $fetch<{ candidates?: { content?: { parts?: { text?: string }[] } }[] }>(url, {
      method: 'POST',
      headers: { 'X-goog-api-key': apiKey },
      timeout: 20_000,
      body: {
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [
          ...history.map(h => ({ role: h.role, parts: [{ text: h.text }] })),
          { role: 'user', parts: [{ text: message }] },
        ],
        generationConfig: { temperature: 0.4, maxOutputTokens: 400 },
      },
    })

    const reply = res.candidates?.[0]?.content?.parts?.map(p => p.text ?? '').join('').trim()
    if (!reply) throw new Error('Empty response from model')
    return { reply }
  } catch (err) {
    console.error('[api/chat] Gemini request failed:', err)
    throw createError({
      statusCode: 502,
      message: 'The assistant is temporarily unavailable. Please try again shortly.',
    })
  }
})
