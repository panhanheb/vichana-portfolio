// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    // Server-only. Set via NUXT_GEMINI_API_KEY (legacy GEMINI_API_KEY is also read in server/api/chat.post.ts).
    geminiApiKey: '',
    geminiModel: 'gemini-flash-latest',
    // Optional: POST contact submissions to a webhook (Slack, Discord, Make, Zapier…).
    contactWebhookUrl: '',
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      meta: [
        { name: 'theme-color', content: '#fbf4ea', media: '(prefers-color-scheme: light)' },
        { name: 'theme-color', content: '#3a1911', media: '(prefers-color-scheme: dark)' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap',
        },
      ],
      script: [
        {
          // Apply saved theme before first paint to avoid a flash.
          innerHTML:
            "var d=document.documentElement;d.dataset.theme='dark';try{var t=localStorage.getItem('theme');if(t==='light')d.dataset.theme=t}catch(e){}",
          tagPosition: 'head',
        },
      ],
    },
  },
})
