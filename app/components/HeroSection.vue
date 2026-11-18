<template>
  <section id="home" class="hero">
    <div class="hero__bg" aria-hidden="true"></div>

    <div class="container hero__inner">
      <div class="hero__content">
        <p v-if="profile.available" class="hero__status enter" style="--d: 0ms">
          <span class="status-dot"></span>
          {{ profile.availability }}
        </p>

        <p class="hero__kicker enter" style="--d: 60ms">
          <strong class="hero__name">{{ profile.name }}</strong> <span aria-hidden="true">·</span> {{ profile.role }}
        </p>
        <h1 class="hero__title enter" style="--d: 120ms">{{ profile.headline }}</h1>
        <p class="hero__lead enter" style="--d: 180ms">{{ profile.summary }}</p>

        <div class="hero__actions enter" style="--d: 240ms">
          <a href="#projects" class="btn btn--primary">
            View my work <AppIcon name="arrow-right" :size="16" />
          </a>
          <a href="#contact" class="btn btn--secondary">Contact me</a>
        </div>

        <ul class="hero__socials enter" style="--d: 300ms" aria-label="Social profiles">
          <li v-for="s in socials" :key="s.label">
            <a :href="s.href" target="_blank" rel="noopener noreferrer" class="hero__social" :aria-label="s.label">
              <AppIcon :name="s.icon" :size="17" />
            </a>
          </li>
        </ul>
      </div>

      <div class="hero__visual enter" style="--d: 160ms">
        <div class="hero__frame">
          <img
            v-if="profile.photo"
            :src="profile.photo"
            :srcset="profile.photoSrcset || undefined"
            sizes="(max-width: 900px) 80vw, 440px"
            :alt="profile.name"
            class="hero__photo"
            width="1254"
            height="1254"
            fetchpriority="high"
            decoding="async"
          />
          <span v-else class="hero__initials" aria-hidden="true">{{ profile.initials }}</span>
        </div>

        <div class="hero__badge">
          <AppIcon name="map-pin" :size="15" />
          <span>{{ profile.location }}</span>
          <span class="hero__badge-sep" aria-hidden="true"></span>
          <span class="hero__badge-muted">{{ profile.timezone }}</span>
        </div>
      </div>
    </div>

    <div class="container">
      <dl class="hero__stats enter" style="--d: 360ms">
        <div v-for="stat in heroStats" :key="stat.label" class="hero__stat">
          <dt>{{ stat.label }}</dt>
          <dd><CountUp :value="stat.value" /></dd>
        </div>
      </dl>
    </div>
  </section>
</template>

<script setup lang="ts">
import { profile, skillGroups, socials, stats } from '#shared/portfolio'

const techCount = new Set(skillGroups.flatMap(g => g.items)).size
const heroStats = [...stats, { value: `${techCount}+`, label: 'Technologies used' }]
</script>

<style scoped>
.hero {
  position: relative;
  isolation: isolate;
  padding: calc(var(--nav-height) + 80px) 0 96px;
  overflow: hidden;
}

/* Fine grid fading out from the top, with a soft accent wash */
.hero__bg {
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background:
    radial-gradient(60% 50% at 70% 0%, color-mix(in srgb, var(--accent) 10%, transparent), transparent 70%),
    linear-gradient(var(--grid-line) 1px, transparent 1px) 0 0 / 56px 56px,
    linear-gradient(90deg, var(--grid-line) 1px, transparent 1px) 0 0 / 56px 56px;
  -webkit-mask-image: radial-gradient(ellipse 80% 70% at 50% 0%, #000 40%, transparent 100%);
  mask-image: radial-gradient(ellipse 80% 70% at 50% 0%, #000 40%, transparent 100%);
}

.hero__inner {
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr);
  gap: 72px;
  align-items: center;
}

/* ---------- Copy ---------- */
.hero__status {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 5px 12px 5px 10px;
  margin-bottom: 28px;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--surface);
  box-shadow: var(--shadow-sm);
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
}

.hero__kicker {
  font-size: 15px;
  font-weight: 500;
  color: var(--text-muted);
  margin-bottom: 14px;
}

.hero__kicker span { margin: 0 4px; }
.hero__name { font-weight: 700; color: var(--text); }

.hero__title {
  font-size: clamp(36px, 5.2vw, 58px);
  font-weight: 650;
  letter-spacing: -0.035em;
  line-height: 1.06;
  margin-bottom: 22px;
  text-wrap: balance;
}

.hero__lead {
  max-width: 560px;
  font-size: 17px;
  line-height: 1.7;
  margin-bottom: 32px;
}

.hero__actions { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 36px; }

.hero__socials { display: flex; gap: 4px; margin-left: -8px; }

.hero__social {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border-radius: var(--radius-sm);
  color: var(--text-muted);
  transition: color var(--dur) var(--ease), background var(--dur) var(--ease);
}

.hero__social:hover { color: var(--text); background: var(--surface-hover); }

/* ---------- Visual ---------- */
.hero__visual {
  position: relative;
  width: min(100%, 440px);
  margin-left: auto;
}

.hero__frame {
  position: relative;
  aspect-ratio: 4 / 5;
  overflow: hidden;
  display: grid;
  place-items: center;
  border: 1px solid var(--border);
  border-radius: 20px;
  background:
    radial-gradient(80% 60% at 50% 100%, color-mix(in srgb, var(--accent) 16%, transparent), transparent 70%),
    linear-gradient(180deg, var(--surface), var(--bg-subtle));
  box-shadow: var(--shadow-lg);
}

.hero__photo {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 45% center;
}

.hero__initials {
  font-size: clamp(72px, 12vw, 128px);
  font-weight: 700;
  letter-spacing: -0.04em;
  color: var(--text-muted);
}

.hero__badge {
  position: absolute;
  left: -24px;
  bottom: 32px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: color-mix(in srgb, var(--surface) 88%, transparent);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: var(--shadow-md);
  font-size: 13.5px;
  font-weight: 500;
  color: var(--text);
}

.hero__badge :deep(svg) { color: var(--accent-text); }
.hero__badge-sep { width: 1px; height: 14px; background: var(--border-strong); }
.hero__badge-muted { color: var(--text-muted); font-family: var(--font-mono); font-size: 12.5px; }

/* ---------- Stats ---------- */
.hero__stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  margin-top: 88px;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: var(--surface);
  box-shadow: var(--shadow-sm);
}

.hero__stat {
  display: flex;
  flex-direction: column-reverse;
  gap: 4px;
  padding: 24px 28px;
}

.hero__stat + .hero__stat { border-left: 1px solid var(--border); }

.hero__stat dd {
  font-size: clamp(28px, 3.2vw, 36px);
  font-weight: 650;
  letter-spacing: -0.03em;
  line-height: 1.1;
  color: var(--text);
  font-variant-numeric: tabular-nums;
}

.hero__stat dt { font-size: 13.5px; color: var(--text-muted); }

@media (max-width: 900px) {
  .hero { padding: calc(var(--nav-height) + 48px) 0 72px; }
  .hero__inner { grid-template-columns: 1fr; gap: 56px; }
  .hero__visual { width: min(84%, 380px); margin-inline: auto; }
  .hero__badge { left: 50%; transform: translateX(-50%); bottom: -18px; white-space: nowrap; }
  .hero__stats { grid-template-columns: repeat(2, 1fr); margin-top: 72px; }
  .hero__stat:nth-child(3) { border-left: 0; }
  .hero__stat:nth-child(n + 3) { border-top: 1px solid var(--border); }
}

@media (max-width: 480px) {
  .hero__stat { padding: 18px 18px; }
  .hero__actions .btn { flex: 1; }
}
</style>
