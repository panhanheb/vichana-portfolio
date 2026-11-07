# Vichna Oudom — Portfolio

Personal portfolio built with **Nuxt 4** and **Vue 3**. It includes a light/dark theme, scroll-aware navigation, a validated contact form, and an AI assistant powered by Google Gemini.

## Getting started

```bash
npm install
cp .env.example .env   # then fill in the values
npm run dev            # http://localhost:3000
```

| Command           | Description                        |
| ----------------- | ---------------------------------- |
| `npm run dev`     | Start the dev server               |
| `npm run build`   | Production build (`.output/`)      |
| `npm run preview` | Preview the production build       |
| `npm run generate`| Static build (disables the API endpoints) |

## Editing content

All content (profile, skills, projects, certificates, education, social links) lives in
**[`shared/portfolio.ts`](shared/portfolio.ts)**. The UI and the AI assistant both read from this file, so the assistant always answers from the same facts the site shows.

- **Headshot:** add an image to `public/` and set `profile.photo` (e.g. `'/profile.jpg'`). Without one, the site shows your initials.
- **CV:** add `public/cv.pdf` and set `profile.cv = '/cv.pdf'` to show the *Download CV* button.

## Environment variables

| Variable                   | Required | Purpose                                                             |
| -------------------------- | -------- | ------------------------------------------------------------------- |
| `NUXT_GEMINI_API_KEY`      | For chat | Gemini API key for the AI assistant (`GEMINI_API_KEY` also works). |
| `NUXT_CONTACT_WEBHOOK_URL` | Optional | Contact form submissions are POSTed here as JSON (Slack, Discord, Zapier, Make…). Without it, messages are only logged on the server. |

## Project structure

```
app/
  assets/css/main.css    Design tokens (light/dark), base styles, buttons, cards
  components/            Page sections + AppIcon, FormField, SectionHeader
  composables/           useTheme, useActiveSection (scroll-spy)
  plugins/reveal.ts      v-reveal scroll animation directive
  error.vue              404 / error page
server/
  api/chat.post.ts       Gemini proxy: validation, history cap, rate limit
  api/contact.post.ts    Contact form: validation, honeypot, rate limit, webhook
  utils/rateLimit.ts     In-memory per-IP rate limiter
shared/portfolio.ts      All site content
```

## Accessibility & quality

- Semantic landmarks, skip link, visible focus styles, ARIA on interactive widgets
- Keyboard support (Esc closes the mobile menu and chat)
- Respects `prefers-color-scheme` and `prefers-reduced-motion`
- SEO meta, Open Graph tags and JSON-LD `Person` schema
