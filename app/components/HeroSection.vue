<template>
  <section id="home" ref="heroEl" class="hero">
    <div class="hero__glow" aria-hidden="true"></div>
    <KbachFlower class="ornament ornament--br ornament--spin hero__ornament" />

    <!-- Floating particles -->
    <div class="hero__particles" aria-hidden="true">
      <span
        v-for="p in particles"
        :key="p.id"
        class="hero__particle"
        :style="{ left: p.x + '%', top: p.y + '%', width: p.size + 'px', height: p.size + 'px', animationDuration: p.dur + 's', animationDelay: p.delay + 's' }"
      ></span>
    </div>

    <div class="container hero__inner">
      <!-- Visual: photo (or initials) inside a glowing organic shape -->
      <div class="hero__visual-wrap">
        <div class="hero__visual enter-zoom" style="--d: 150ms">
          <!-- Flickering fire glow -->
          <div class="hero__fire" aria-hidden="true"></div>
          <!-- Rumduol flower embers rising behind the profile -->
          <span v-for="e in embersBack" :key="e.id" class="hero__ember" :style="e.style" aria-hidden="true"></span>

          <div class="hero__ring" aria-hidden="true"></div>
          <div class="hero__blob" @pointerenter="fireBurst">
            <img v-if="profile.photo" :src="profile.photo" :alt="profile.name" class="hero__photo" />
            <span v-else class="hero__initials" aria-hidden="true">{{ profile.initials }}</span>
          </div>

          <!-- …and a few in front -->
          <span v-for="e in embersFront" :key="e.id" class="hero__ember hero__ember--front" :style="e.style" aria-hidden="true"></span>
        </div>
      </div>

      <!-- Copy -->
      <div class="hero__content">
        <p v-if="profile.available" class="hero__status enter" style="--d: 100ms">
          <span class="status-dot"></span>
          {{ profile.availability }}
        </p>

        <p class="hero__hello enter" style="--d: 200ms">Hello, I'm</p>
        <h1 class="hero__name enter" style="--d: 300ms">{{ profile.name }}</h1>
        <p class="hero__role enter" style="--d: 420ms">
          And I'm a
          <span class="hero__typed">{{ typed }}</span><span class="hero__caret" aria-hidden="true"></span>
          <span class="sr-only">{{ profile.role }}</span>
        </p>

        <p class="hero__lead enter" style="--d: 540ms">{{ profile.summary }}</p>

        <ul class="hero__socials enter" style="--d: 660ms" aria-label="Social profiles">
          <li v-for="s in socials" :key="s.label">
            <a :href="s.href" target="_blank" rel="noopener noreferrer" class="hero__social" :aria-label="s.label">
              <AppIcon :name="s.icon" :size="16" />
            </a>
          </li>
        </ul>

        <div class="hero__actions enter" style="--d: 780ms">
          <a href="#contact" class="btn btn--accent">Hire Me</a>
          <a href="#contact" class="btn btn--outline-accent">Contact Me</a>
        </div>
      </div>
    </div>

    <!-- Stats bar -->
    <div class="container">
      <dl class="hero__stats">
        <div
          v-for="(stat, i) in heroStats"
          :key="stat.label"
          class="hero__stat enter"
          :style="{ '--d': `${900 + i * 120}ms` }"
        >
          <dd><CountUp :value="stat.value" /></dd>
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

/* Floating particles — deterministic pseudo-random layout so server and browser render the same markup. */
const rand = (n: number) => { const v = Math.sin(n * 9301 + 49297) * 233280; return v - Math.floor(v) }
const particles = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: Math.round(rand(i + 1) * 100),
  y: Math.round(rand(i + 101) * 90),
  size: 2 + Math.round(rand(i + 201) * 4),
  dur: 6 + Math.round(rand(i + 301) * 8),
  delay: -Math.round(rand(i + 401) * 10),
}))

/* Fire embers — Rumduol flowers rising from around the profile (deterministic, SSR-safe). */
const embers = Array.from({ length: 16 }, (_, i) => {
  const angle = (-20 + rand(i + 501) * 220) * (Math.PI / 180) // mostly around the lower half
  const dur = 3.5 + rand(i + 601) * 2.5
  return {
    id: i,
    style: {
      left: `${f2(50 + 46 * Math.cos(angle))}%`,
      top: `${f2(52 + 40 * Math.sin(angle))}%`,
      width: `${Math.round(14 + rand(i + 701) * 12)}px`,
      '--rise': `${Math.round(170 + rand(i + 801) * 150)}px`,
      '--sway': `${Math.round(-40 + rand(i + 901) * 80)}px`,
      '--spin': `${Math.round(-220 + rand(i + 1001) * 440)}deg`,
      animationDuration: `${f2(dur)}s`,
      animationDelay: `${f2(-rand(i + 1101) * dur)}s`,
    },
  }
})
function f2(n: number) { return Math.round(n * 100) / 100 }
const embersBack = embers.slice(0, 11)
const embersFront = embers.slice(11)

/* Hovering the profile fires a burst of flowers (handled by FlowerTrail.vue). */
let lastBurst = 0
const fireBurst = (e: PointerEvent) => {
  const now = performance.now()
  if (now - lastBurst < 1200) return
  lastBurst = now
  const r = (e.currentTarget as HTMLElement).getBoundingClientRect()
  window.dispatchEvent(new CustomEvent('flower-burst', {
    detail: { x: r.left + r.width / 2, y: r.top + r.height / 2, count: 16, spread: 1.7 },
  }))
}

/* Parallax — exposes scroll progress through the hero (0 → 1) as the --p CSS variable. */
const heroEl = ref<HTMLElement | null>(null)
let frame = 0

const updateParallax = () => {
  frame = 0
  const el = heroEl.value
  if (!el) return
  const p = Math.min(Math.max(window.scrollY / el.offsetHeight, 0), 1)
  el.style.setProperty('--p', p.toFixed(3))
}
const onScroll = () => { if (!frame) frame = requestAnimationFrame(updateParallax) }

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  updateParallax()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => {
  clearTimeout(timer)
  cancelAnimationFrame(frame)
  window.removeEventListener('scroll', onScroll)
})
</script>

<style scoped>
.hero {
  --p: 0;
  position: relative;
  isolation: isolate;
  padding: calc(var(--nav-height) + 72px) 0 0;
  overflow: hidden;
}

/* Gold diamond lattice, fading out from the top-right */
.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background: var(--gold);
  opacity: 0.15;
  -webkit-mask: var(--lattice) center / 80px 80px repeat, radial-gradient(ellipse 75% 70% at 75% 30%, #000 20%, transparent 75%);
  -webkit-mask-composite: source-in;
  mask: var(--lattice) center / 80px 80px repeat, radial-gradient(ellipse 75% 70% at 75% 30%, #000 20%, transparent 75%);
  mask-composite: intersect;
}

.hero__ornament { opacity: 0.1; width: clamp(260px, 36vw, 480px); }

/* Parallax layers (driven by --p) */
.hero__visual-wrap { transform: translateY(calc(var(--p) * 90px)) rotate(calc(var(--p) * 8deg)); }
.hero__content { transform: translateY(calc(var(--p) * 40px)); opacity: calc(1 - var(--p) * 0.7); }
.hero__glow { transform: translateY(calc(var(--p) * 160px)); }
.hero__particles { transform: translateY(calc(var(--p) * -120px)); }

/* Particles */
.hero__particles { position: absolute; inset: 0; pointer-events: none; }

.hero__particle {
  position: absolute;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 8px var(--accent);
  opacity: 0.45;
  animation: particle 10s ease-in-out infinite;
}

@keyframes particle {
  0%, 100% { transform: translate(0, 0); opacity: 0.15; }
  50% { transform: translate(14px, -38px); opacity: 0.6; }
}

/* Slowly rotating dashed orbit around the profile shape */
.hero__visual::after {
  content: '';
  position: absolute;
  inset: -10%;
  border-radius: 50%;
  border: 1px dashed color-mix(in srgb, var(--accent) 35%, transparent);
  animation: spin 40s linear infinite;
  pointer-events: none;
}

@keyframes spin { to { transform: rotate(360deg); } }

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
  animation: morph 12s ease-in-out infinite, glow-flicker 2.3s ease-in-out infinite;
}

/* ---------- Fire ---------- */
.hero__fire {
  position: absolute;
  inset: -6% -2% 10% -2%;
  border-radius: 50% 50% 45% 45% / 60% 60% 40% 40%;
  background:
    radial-gradient(ellipse 45% 60% at 50% 70%, rgba(255, 170, 70, 0.55), transparent 70%),
    radial-gradient(ellipse 60% 75% at 50% 60%, color-mix(in srgb, var(--gold) 45%, transparent), transparent 72%),
    radial-gradient(ellipse 30% 45% at 35% 40%, rgba(255, 120, 50, 0.35), transparent 70%),
    radial-gradient(ellipse 30% 45% at 65% 35%, rgba(255, 140, 60, 0.3), transparent 70%);
  filter: blur(18px);
  transform-origin: 50% 90%;
  animation: flame 1.9s ease-in-out infinite;
  pointer-events: none;
}

@keyframes flame {
  0%, 100% { transform: scale(1, 1) translateY(0); opacity: 0.8; }
  20% { transform: scale(1.03, 1.08) translateY(-8px); opacity: 1; }
  40% { transform: scale(0.98, 1.02) translateY(-3px); opacity: 0.75; }
  60% { transform: scale(1.05, 1.12) translateY(-12px); opacity: 0.95; }
  80% { transform: scale(1, 1.04) translateY(-5px); opacity: 0.85; }
}

@keyframes glow-flicker {
  0%, 100% { box-shadow: 0 0 60px color-mix(in srgb, var(--accent) 45%, transparent), 0 0 140px color-mix(in srgb, var(--accent) 25%, transparent); }
  30% { box-shadow: 0 0 80px color-mix(in srgb, var(--accent) 60%, transparent), 0 0 170px rgba(255, 150, 60, 0.3); }
  55% { box-shadow: 0 0 55px color-mix(in srgb, var(--accent) 40%, transparent), 0 0 120px color-mix(in srgb, var(--accent) 22%, transparent); }
  75% { box-shadow: 0 0 90px color-mix(in srgb, var(--accent) 65%, transparent), 0 0 180px rgba(255, 140, 50, 0.35); }
}

/* Rumduol embers */
.hero__ember {
  position: absolute;
  aspect-ratio: 1;
  background: var(--rumduol) center / contain no-repeat;
  filter: drop-shadow(0 0 6px rgba(255, 190, 100, 0.8));
  opacity: 0;
  pointer-events: none;
  animation-name: ember-rise;
  animation-timing-function: ease-out;
  animation-iteration-count: infinite;
}

.hero__ember--front { z-index: 2; }

@keyframes ember-rise {
  0% { transform: translate(-50%, -50%) scale(0.3) rotate(0deg); opacity: 0; }
  15% { transform: translate(-50%, -50%) translate(calc(var(--sway) * 0.2), calc(var(--rise) * -0.12)) scale(1) rotate(calc(var(--spin) * 0.15)); opacity: 1; }
  55% { transform: translate(-50%, -50%) translate(var(--sway), calc(var(--rise) * -0.55)) scale(0.9) rotate(calc(var(--spin) * 0.55)); opacity: 0.85; }
  100% { transform: translate(-50%, -50%) translate(calc(var(--sway) * -0.5), calc(var(--rise) * -1)) scale(0.45) rotate(var(--spin)); opacity: 0; }
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
