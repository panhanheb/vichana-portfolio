<template>
  <footer class="footer pattern-lattice">
    <KhmerFlower class="ornament ornament--tr ornament--spin-rev" />
    <div class="container">
      <div class="footer__top">
        <div class="footer__brand">
          <a href="#home" class="footer__logo">
            <KbachFlower :size="30" />
            {{ profile.name }}
          </a>
          <p>{{ profile.role }} building fast, accessible products for the web.</p>
          <ul class="footer__socials" aria-label="Social profiles">
            <li v-for="s in socials" :key="s.label">
              <a :href="s.href" target="_blank" rel="noopener noreferrer" class="footer__social" :aria-label="s.label">
                <AppIcon :name="s.icon" :size="16" />
              </a>
            </li>
          </ul>
        </div>

        <nav class="footer__col" aria-label="Footer">
          <h4>Navigate</h4>
          <ul>
            <li v-for="link in navLinks" :key="link.id"><a :href="`#${link.id}`">{{ link.label }}</a></li>
          </ul>
        </nav>

        <div class="footer__col">
          <h4>Services</h4>
          <ul>
            <li v-for="s in services" :key="s">{{ s }}</li>
          </ul>
        </div>

        <div class="footer__col">
          <h4>Contact</h4>
          <ul>
            <li><a :href="`mailto:${profile.email}`">{{ profile.email }}</a></li>
            <li>{{ profile.location }}</li>
          </ul>
        </div>
      </div>

      <div class="footer__bottom">
        <p>© {{ year }} {{ profile.name }}. All rights reserved.</p>
        <p>Built with Nuxt &amp; Vue.</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { navLinks, profile, services, socials } from '#shared/portfolio'

const year = new Date().getFullYear()
</script>

<style scoped>
.footer { border-top: 1px solid var(--border); padding-top: 64px; }

.footer__top {
  display: grid;
  grid-template-columns: 1.6fr 1fr 1fr 1.2fr;
  gap: 40px;
  padding-bottom: 48px;
}

.footer__brand { display: flex; flex-direction: column; gap: 14px; }
.footer__brand p { font-size: 14.5px; max-width: 300px; }

.footer__logo { display: inline-flex; align-items: center; gap: 10px; font-weight: 600; color: var(--text); }


.footer__socials { display: flex; gap: 4px; margin-left: -8px; }

.footer__social {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-sm);
  color: var(--text-muted);
  transition: color var(--dur) var(--ease), background var(--dur) var(--ease);
}

.footer__social:hover { color: var(--text); background: var(--surface-hover); }

.footer__col h4 {
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 16px;
}

.footer__col ul { display: flex; flex-direction: column; gap: 10px; }
.footer__col li { font-size: 14.5px; color: var(--text-secondary); word-break: break-word; }
.footer__col a { transition: color var(--dur) var(--ease); }
.footer__col a:hover { color: var(--text); }

.footer__bottom {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  padding: 24px 0 32px;
  border-top: 1px solid var(--border);
}

.footer__bottom p { font-size: 13.5px; color: var(--text-muted); }

@media (max-width: 900px) {
  .footer__top { grid-template-columns: 1fr 1fr; }
  .footer__brand { grid-column: 1 / -1; }
}

@media (max-width: 520px) {
  .footer__top { grid-template-columns: 1fr; }
}
</style>
