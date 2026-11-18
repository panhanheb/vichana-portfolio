<template>
  <section id="skills" class="section">
    <div class="container">
      <SectionHeader
        eyebrow="Skills"
        title="Tools I use to ship."
        description="A pragmatic toolkit chosen for maintainability and speed — with depth in the Vue ecosystem."
      />

      <div class="skills">
        <article v-for="(group, i) in skillGroups" :key="group.name" v-reveal="i * 80" class="card skills__group">
          <header class="skills__head">
            <span class="skills__icon"><AppIcon :name="icons[i % icons.length]!" :size="18" /></span>
            <h3>{{ group.name }}</h3>
            <p>{{ group.description }}</p>
          </header>
          <ul class="skills__list" :aria-label="`${group.name} skills`">
            <li v-for="item in group.items" :key="item" class="tag">{{ item }}</li>
          </ul>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { skillGroups } from '#shared/portfolio'

const icons = ['code', 'layers', 'sparkles']
</script>

<style scoped>
.skills {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}

.skills__group { padding: 28px; display: flex; flex-direction: column; gap: 24px; }

.skills__head { display: flex; flex-direction: column; gap: 6px; }

.skills__icon {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  margin-bottom: 12px;
  border-radius: var(--radius);
  background: var(--accent-soft);
  color: var(--accent-text);
}

.skills__head h3 { font-size: 17px; }
.skills__head p { font-size: 14.5px; }

.skills__list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding-top: 20px;
  border-top: 1px solid var(--border);
}

.skills__list .tag { height: 30px; padding: 0 12px; font-size: 13.5px; color: var(--text); }

@media (max-width: 960px) {
  .skills { grid-template-columns: 1fr; }
}
</style>
