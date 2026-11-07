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
            <span class="skills__index">0{{ i + 1 }}</span>
            <h3>{{ group.name }}</h3>
            <p>{{ group.description }}</p>
          </header>
          <ul class="skills__list">
            <li v-for="item in group.items" :key="item">
              <AppIcon name="check" :size="16" class="skills__check" />
              {{ item }}
            </li>
          </ul>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { skillGroups } from '#shared/portfolio'
</script>

<style scoped>
.skills {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}

.skills__group { padding: 28px; display: flex; flex-direction: column; gap: 24px; }

.skills__head { display: flex; flex-direction: column; gap: 6px; padding-bottom: 20px; border-bottom: 1px solid var(--border); }

.skills__index {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--accent);
  margin-bottom: 6px;
}

.skills__head h3 { font-size: 18px; }
.skills__head p { font-size: 14.5px; }

.skills__list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 16px;
}

.skills__list li {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14.5px;
  color: var(--text);
}

.skills__check { color: var(--accent); flex-shrink: 0; }

@media (max-width: 960px) {
  .skills { grid-template-columns: 1fr; }
  .skills__list { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); }
}
</style>
