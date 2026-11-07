<template>
  <section id="home" class="hero">
    <div class="hero__glow" aria-hidden="true"></div>

    <div class="container hero__inner">
      <!-- Visual: photo (or initials) inside a glowing organic shape -->
      <div class="hero__visual">
        <div class="hero__ring" aria-hidden="true"></div>
        <div class="hero__blob">
          <img v-if="profile.photo" :src="profile.photo" :alt="profile.name" class="hero__photo" />
          <span v-else class="hero__initials" aria-hidden="true">{{ profile.initials }}</span>
        </div>
      </div>

      <!-- Copy -->
      <div class="hero__content">
        <p v-if="profile.available" class="hero__status">
          <span class="status-dot"></span>
          {{ profile.availability }}
        </p>

        <p class="hero__hello">Hello, I'm</p>
        <h1 class="hero__name">{{ profile.name }}</h1>
        <p class="hero__role">
          And I'm a
          <span class="hero__typed">{{ typed }}</span><span class="hero__caret" aria-hidden="true"></span>
          <span class="sr-only">{{ profile.role }}</span>
        </p>

        <p class="hero__lead">{{ profile.summary }}</p>

        <ul class="hero__socials" aria-label="Social profiles">
          <li v-for="s in socials" :key="s.label">
            <a :href="s.href" target="_blank" rel="noopener noreferrer" class="hero__social" :aria-label="s.label">
              <AppIcon :name="s.icon" :size="16" />
            </a>
          </li>
        </ul>

        <div class="hero__actions">
          <a href="#contact" class="btn btn--accent">Hire Me</a>
          <a href="#contact" class="btn btn--outline-accent">Contact Me</a>
        </div>
      </div>
    </div>

    <!-- Stats bar -->
    <div class="container">
      <dl class="hero__stats">
        <div v-for="stat in heroStats" :key="stat.label" class="hero__stat">
          <dd>{{ stat.value }}</dd>
          <dt>{{ stat.label }}</dt>
        </div>
      </dl>
    </div>
  </section>
</template>

<script setup lang="ts">
import { profile, skillGroups, socials, stats } from '#shared/portfolio'

const techCount = new Set(skillGroups.flatMap(g => g.items)).size
const heroStats = [...stats, { value: `${techCount}+`, label: 'Technologies used' }]

/* Typing effect — shows the full first role during SSR and under reduced motion. */
const roles = profile.roles?.length ? profile.roles : [profile.role]
const typed = ref(roles[0]!)
let timer: ReturnType<typeof setTimeout> | undefined

onMounted(() => {
  if (roles.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  let index = 0
  let chars = roles[0]!.length
  let deleting = true

  const tick = () => {
    const word = roles[index]!
    chars += deleting ? -1 : 1
    typed.value = word.slice(0, chars)

    let delay = deleting ? 45 : 90
    if (!deleting && chars === word.length) { deleting = true; delay = 2200 }
    else if (deleting && chars === 0) { deleting = false; index = (index + 1) % roles.length; delay = 350 }
    timer = setTimeout(tick, delay)
  }
  timer = setTimeout(tick, 2200)
})

onBeforeUnmount(() => clearTimeout(timer))
</script>

<style scoped>
.hero {
  position: relative;
  padding: calc(var(--nav-height) + 72px) 0 0;
  overflow: hidden;
}

.hero__glow {
  position: absolute;
  top: 10%;
  left: 5%;
  width: 520px;
  height: 520px;
  border-radius: 50%;
  background: radial-gradient(circle, color-mix(in srgb, var(--accent) 22%, transparent), transparent 65%);
  filter: blur(20px);
  pointer-events: none;
}

.hero__inner {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr);
  gap: 72px;
  align-items: center;
  padding-bottom: 72px;
}

/* ---------- Visual ---------- */
.hero__visual {
  position: relative;
  width: min(100%, 420px);
  aspect-ratio: 1;
  margin-inline: auto;
}

.hero__ring {
  position: absolute;
  inset: -4%;
  border: 2px solid var(--accent);
  border-radius: 42% 58% 63% 37% / 45% 40% 60% 55%;
  opacity: 0.7;
  animation: morph 14s ease-in-out infinite reverse;
}

.hero__blob {
  position: absolute;
  inset: 4%;
  overflow: hidden;
  display: grid;
  place-items: center;
  border-radius: 58% 42% 38% 62% / 52% 58% 42% 48%;
  background:
    radial-gradient(circle at 30% 25%, color-mix(in srgb, var(--accent) 85%, #fff 15%), var(--accent) 45%, color-mix(in srgb, var(--accent) 55%, #000) 100%);
  box-shadow:
    0 0 60px color-mix(in srgb, var(--accent) 45%, transparent),
    0 0 140px color-mix(in srgb, var(--accent) 25%, transparent);
  animation: morph 12s ease-in-out infinite;
}

.hero__photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
}

.hero__initials {
  font-size: clamp(72px, 12vw, 140px);
  font-weight: 700;
  letter-spacing: -0.04em;
  color: var(--accent-contrast);
  opacity: 0.85;
}

@keyframes morph {
  0%, 100% { border-radius: 58% 42% 38% 62% / 52% 58% 42% 48%; }
  33% { border-radius: 40% 60% 54% 46% / 61% 41% 59% 39%; }
  66% { border-radius: 63% 37% 45% 55% / 41% 55% 45% 59%; }
}

/* ---------- Copy ---------- */
.hero__status {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 6px 14px 6px 12px;
  margin-bottom: 24px;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--surface);
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
}

.hero__hello { font-size: 20px; font-weight: 500; color: var(--text); margin-bottom: 4px; }

.hero__name {
  font-size: clamp(40px, 6vw, 64px);
  font-weight: 700;
  letter-spacing: -0.035em;
  line-height: 1.05;
  margin-bottom: 10px;
}

.hero__role {
  font-size: clamp(20px, 2.6vw, 28px);
  font-weight: 600;
  color: var(--text);
  margin-bottom: 22px;
  min-height: 1.4em;
}

.hero__typed { color: var(--accent); }

.hero__caret {
  display: inline-block;
  width: 2px;
  height: 1em;
  margin-left: 3px;
  vertical-align: -0.12em;
  background: var(--accent);
  animation: caret 1s steps(1) infinite;
}

@keyframes caret { 50% { opacity: 0; } }

.hero__lead { max-width: 540px; font-size: 16.5px; line-height: 1.75; margin-bottom: 28px; }

.hero__socials { display: flex; gap: 10px; margin-bottom: 28px; }

.hero__social {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-sm);
  border: 1px solid color-mix(in srgb, var(--accent) 45%, transparent);
  color: var(--accent);
  transition: background var(--dur) var(--ease), color var(--dur) var(--ease), transform var(--dur) var(--ease);
}

.hero__social:hover { background: var(--accent); color: var(--accent-contrast); transform: translateY(-2px); }

.hero__actions { display: flex; flex-wrap: wrap; gap: 12px; }
.hero__actions .btn { min-width: 132px; }

/* ---------- Stats bar ---------- */
.hero__stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border-top: 1px solid var(--border);
  padding: 32px 0 40px;
}

.hero__stat {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 4px 16px;
}

.hero__stat + .hero__stat { border-left: 1px solid var(--border-strong); }

.hero__stat dd { font-size: clamp(28px, 3.4vw, 40px); font-weight: 700; letter-spacing: -0.03em; color: var(--text); }
.hero__stat dt { max-width: 96px; font-size: 13px; line-height: 1.3; color: var(--text-secondary); }

@media (max-width: 900px) {
  .hero { padding-top: calc(var(--nav-height) + 40px); }
  .hero__inner { grid-template-columns: 1fr; gap: 48px; text-align: center; padding-bottom: 48px; }
  .hero__visual { width: min(72vw, 320px); }
  .hero__content { display: flex; flex-direction: column; align-items: center; }
  .hero__lead { margin-inline: auto; }
  .hero__stats { grid-template-columns: repeat(2, 1fr); row-gap: 24px; }
  .hero__stat:nth-child(3) { border-left: 0; }
}

@media (max-width: 480px) {
  .hero__stat { flex-direction: column; gap: 2px; text-align: center; }
  .hero__stat dt { max-width: none; }
}
</style>
