<template>
  <section class="scroller" aria-label="Technologies I work with">
    <div class="scroller__track">
      <!-- Rendered twice for a seamless loop; the copy is hidden from screen readers. -->
      <ul v-for="copy in 2" :key="copy" class="scroller__list" :aria-hidden="copy === 2 ? 'true' : undefined">
        <li v-for="item in items" :key="item" class="scroller__item">
          <span class="scroller__dot" aria-hidden="true"></span>
          {{ item }}
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
import { skillGroups } from '#shared/portfolio'

const items = [...new Set(skillGroups.flatMap(g => g.items))]
</script>

<style scoped>
.scroller {
  overflow: hidden;
  padding: 22px 0;
  border-block: 1px solid var(--border);
  background: var(--bg-subtle);
  mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent);
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent);
}

.scroller__track {
  display: flex;
  width: max-content;
  animation: scroll-x 40s linear infinite;
}

.scroller:hover .scroller__track { animation-play-state: paused; }

.scroller__list { display: flex; flex-shrink: 0; }

.scroller__item {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 0 28px;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-secondary);
  white-space: nowrap;
  transition: color var(--dur) var(--ease);
}

.scroller__item:hover { color: var(--accent); }

.scroller__dot { width: 7px; height: 7px; background: var(--gold); transform: rotate(45deg); }

@keyframes scroll-x {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

/* Reduced motion: no auto-scroll; swipe instead */
@media (prefers-reduced-motion: reduce) {
  .scroller { overflow-x: auto; mask-image: none; -webkit-mask-image: none; }
  .scroller__track { animation: none; }
  .scroller__list:last-child { display: none; }
}
</style>
