<template>
  <section id="credentials" class="section">
    <KhmerFlower class="ornament ornament--bl ornament--spin-rev" />
    <div class="container">
      <SectionHeader
        eyebrow="Credentials"
        title="Education & certifications."
        description="Formal training paired with continuous, hands-on learning."
      />

      <div class="creds">
        <div v-reveal:left class="creds__col">
          <h3 class="creds__heading">
            <AppIcon name="graduation" :size="18" /> Education
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

        <div v-reveal:right="120" class="creds__col">
          <h3 class="creds__heading">
            <AppIcon name="award" :size="18" /> Certifications
          </h3>
          <ul class="certs">
            <li v-for="cert in certificates" :key="cert.title" class="cert">
              <div class="cert__main">
                <h4 class="cert__title">{{ cert.title }}</h4>
                <p class="cert__issuer">{{ cert.issuer }} · {{ cert.year }}</p>
                <p class="cert__skills">{{ cert.skills.join(' · ') }}</p>
              </div>
              <a
                v-if="cert.url"
                :href="cert.url"
                target="_blank"
                rel="noopener noreferrer"
                class="icon-btn cert__link"
                :aria-label="`View ${cert.title} certificate`"
              >
                <AppIcon name="external" :size="16" />
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
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr);
  gap: 64px;
}

.creds__heading {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  font-weight: 600;
  padding-bottom: 16px;
  margin-bottom: 8px;
  border-bottom: 1px solid var(--border);
}

.creds__heading :deep(svg) { color: var(--accent); }

/* Timeline */
.timeline { list-style: none; position: relative; padding-left: 24px; }

.timeline::before {
  content: '';
  position: absolute;
  left: 5px;
  top: 30px;
  bottom: 30px;
  width: 1px;
  background: var(--border-strong);
}

.timeline__item { position: relative; padding: 20px 0; }

.timeline__dot {
  position: absolute;
  left: -24px;
  top: 26px;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: var(--bg);
  border: 2px solid var(--border-strong);
}

.timeline__item:first-child .timeline__dot { border-color: var(--accent); background: var(--accent); }

.timeline__period {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 4px;
}

.timeline__title { font-size: 16.5px; margin-bottom: 2px; }
.timeline__sub { font-size: 14.5px; }

/* Certificates */
.certs { display: flex; flex-direction: column; }

.cert {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid var(--border);
}

.cert:last-child { border-bottom: 0; }
.cert__main { flex: 1; min-width: 0; }
.cert__title { font-size: 15.5px; }
.cert__issuer { font-size: 14px; color: var(--text-secondary); }
.cert__skills { font-size: 13px; color: var(--text-muted); margin-top: 2px; }
.cert__link { width: 36px; height: 36px; }

@media (max-width: 900px) {
  .creds { grid-template-columns: 1fr; gap: 48px; }
}
</style>
