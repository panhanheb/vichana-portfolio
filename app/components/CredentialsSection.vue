<template>
  <section id="credentials" class="section">
    <div class="container">
      <SectionHeader
        eyebrow="Credentials"
        title="Education & certifications."
        description="Formal training paired with continuous, hands-on learning."
      />

      <div class="creds">
        <div v-reveal class="creds__col">
          <h3 class="creds__heading">
            <AppIcon name="graduation" :size="17" /> Education
          </h3>
          <ol class="timeline">
            <li v-for="item in education" :key="item.degree" class="timeline__item">
              <span class="timeline__dot" aria-hidden="true"></span>
              <p class="timeline__period">{{ item.period }}</p>
              <h4 class="timeline__title">{{ item.degree }}</h4>
              <p class="timeline__sub">
                {{ item.school }}<template v-if="item.note"> · {{ item.note }}</template>
              </p>
            </li>
          </ol>
        </div>

        <div v-reveal="80" class="creds__col">
          <h3 class="creds__heading">
            <AppIcon name="award" :size="17" /> Certifications
          </h3>
          <ul class="certs">
            <li v-for="cert in certificates" :key="cert.title" class="cert">
              <span class="cert__badge" aria-hidden="true">{{ cert.issuer.slice(0, 1) }}</span>
              <div class="cert__main">
                <h4 class="cert__title">{{ cert.title }}</h4>
                <p class="cert__issuer">{{ cert.issuer }} <span aria-hidden="true">·</span> {{ cert.year }}</p>
                <p class="cert__skills">{{ cert.skills.join(' · ') }}</p>
              </div>
              <a
                v-if="cert.url"
                :href="cert.url"
                target="_blank"
                rel="noopener noreferrer"
                class="cert__link"
                :aria-label="`View ${cert.title} certificate`"
              >
                <AppIcon name="arrow-up-right" :size="16" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { certificates, education } from '#shared/portfolio'
</script>

<style scoped>
.creds {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr);
  gap: 64px;
}

.creds__heading {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 20px;
}

.creds__heading :deep(svg) { color: var(--accent-text); }

/* Timeline */
.timeline { position: relative; padding-left: 28px; }

.timeline::before {
  content: '';
  position: absolute;
  left: 5px;
  top: 8px;
  bottom: 8px;
  width: 1px;
  background: var(--border);
}

.timeline__item { position: relative; padding-bottom: 32px; }
.timeline__item:last-child { padding-bottom: 0; }

.timeline__dot {
  position: absolute;
  left: -28px;
  top: 5px;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: var(--bg);
  border: 2px solid var(--border-strong);
}

.timeline__item:first-child .timeline__dot {
  border-color: var(--accent);
  background: var(--accent);
  box-shadow: 0 0 0 4px var(--accent-soft);
}

.timeline__period {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 6px;
}

.timeline__title { font-size: 16.5px; margin-bottom: 2px; }
.timeline__sub { font-size: 14.5px; }

/* Certificates */
.certs {
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: var(--surface);
  box-shadow: var(--shadow-sm);
}

.cert {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
}

.cert + .cert { border-top: 1px solid var(--border); }

.cert__badge {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  background: var(--bg-subtle);
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary);
  flex-shrink: 0;
}

.cert__main { flex: 1; min-width: 0; }
.cert__title { font-size: 15px; font-weight: 600; }
.cert__issuer { font-size: 13.5px; color: var(--text-secondary); }
.cert__skills { font-size: 12.5px; color: var(--text-muted); margin-top: 2px; }

.cert__link {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  color: var(--text-muted);
  transition: color var(--dur) var(--ease), background var(--dur) var(--ease);
}

.cert__link:hover { color: var(--text); background: var(--surface-hover); }

@media (max-width: 900px) {
  .creds { grid-template-columns: 1fr; gap: 48px; }
}
</style>
