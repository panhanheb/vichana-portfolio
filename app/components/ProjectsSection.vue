<template>
  <section id="projects" class="section section--alt">
    <div class="container">
      <div class="projects__top">
        <SectionHeader
          eyebrow="Selected work"
          title="Projects I've designed and built."
          description="A selection of client and personal work across frontend, full-stack and design systems."
        />

        <div class="projects__filters" role="group" aria-label="Filter projects by category">
          <button
            v-for="f in filters"
            :key="f.value"
            type="button"
            class="projects__filter"
            :class="{ 'is-active': active === f.value }"
            :aria-pressed="active === f.value"
            @click="active = f.value"
          >
            {{ f.label }}
            <span class="projects__count">{{ f.count }}</span>
          </button>
        </div>
      </div>

      <TransitionGroup tag="ul" name="list" class="projects__grid" aria-live="polite">
        <li v-for="project in filtered" :key="project.id" class="card card--interactive project">
          <div class="project__cover" :data-category="project.category" aria-hidden="true">
            <span class="project__monogram">{{ monogram(project.title) }}</span>
          </div>

          <div class="project__body">
            <div class="project__meta">
              <span>{{ project.category }}</span>
              <span aria-hidden="true">·</span>
              <span>{{ project.year }}</span>
            </div>
            <h3 class="project__title">{{ project.title }}</h3>
            <p class="project__summary">{{ project.summary }}</p>
            <p class="project__role"><span>Role</span> {{ project.role }}</p>

            <ul class="project__stack" aria-label="Technologies">
              <li v-for="tech in project.stack" :key="tech" class="tag">{{ tech }}</li>
            </ul>

            <div class="project__links">
              <a v-if="project.demo" :href="project.demo" target="_blank" rel="noopener noreferrer" class="link">
                Live demo <AppIcon name="arrow-up-right" :size="15" />
              </a>
              <a v-if="project.repo" :href="project.repo" target="_blank" rel="noopener noreferrer" class="link">
                <AppIcon name="github" :size="15" /> Source
              </a>
            </div>
          </div>
        </li>
      </TransitionGroup>
    </div>
  </section>
</template>

<script setup lang="ts">
import { projects } from '#shared/portfolio'

type Filter = 'All' | (typeof projects)[number]['category']

const categories = [...new Set(projects.map(p => p.category))]
const filters = computed(() => [
  { value: 'All' as Filter, label: 'All', count: projects.length },
  ...categories.map(c => ({ value: c as Filter, label: c, count: projects.filter(p => p.category === c).length })),
])

const active = ref<Filter>('All')
const filtered = computed(() => active.value === 'All' ? projects : projects.filter(p => p.category === active.value))

const monogram = (title: string) =>
  title.split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase()
</script>

<style scoped>
.projects__top {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
  margin-bottom: 40px;
}

.projects__top :deep(.section-header) { margin-bottom: 0; }

.projects__filters {
  display: inline-flex;
  gap: 4px;
  padding: 4px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
}

.projects__filter {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 34px;
  padding: 0 12px;
  border: 0;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background var(--dur) var(--ease), color var(--dur) var(--ease);
}

.projects__filter:hover { color: var(--text); }
.projects__filter.is-active { background: var(--text); color: var(--bg); }

.projects__count {
  font-family: var(--font-mono);
  font-size: 11px;
  opacity: 0.7;
}

.projects__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}

.project { display: flex; flex-direction: column; overflow: hidden; }

.project__cover {
  --hue: 350;
  position: relative;
  aspect-ratio: 16 / 9;
  display: grid;
  place-items: center;
  border-bottom: 1px solid var(--border);
  background:
    radial-gradient(circle at 25% 20%, hsl(var(--hue) 80% 60% / 0.18), transparent 55%),
    radial-gradient(circle at 80% 90%, hsl(calc(var(--hue) + 40) 70% 60% / 0.14), transparent 50%),
    var(--bg-subtle);
}

.project__cover[data-category='Frontend'] { --hue: 215; }
.project__cover[data-category='Full-stack'] { --hue: 350; }
.project__cover[data-category='Design'] { --hue: 270; }

.project__cover::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(var(--border-strong) 1px, transparent 1px);
  background-size: 18px 18px;
  opacity: 0.5;
  mask-image: linear-gradient(to bottom, #000, transparent);
  -webkit-mask-image: linear-gradient(to bottom, #000, transparent);
}

.project__monogram {
  position: relative;
  display: grid;
  place-items: center;
  width: 64px;
  height: 64px;
  border-radius: var(--radius-lg);
  background: var(--surface);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-md);
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--text);
  transition: transform 300ms var(--ease);
}

.project:hover .project__monogram { transform: scale(1.06); }

.project__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 22px 24px 24px;
}

.project__meta {
  display: flex;
  gap: 6px;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--text-muted);
}

.project__title { font-size: 18px; }
.project__summary { font-size: 14.5px; line-height: 1.65; }

.project__role { font-size: 13.5px; color: var(--text-secondary); }
.project__role span { color: var(--text-muted); margin-right: 4px; }

.project__stack { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px; }

.project__links {
  display: flex;
  gap: 20px;
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid var(--border);
}

/* Filter animation */
.list-move, .list-enter-active, .list-leave-active { transition: all 300ms var(--ease); }
.list-enter-from, .list-leave-to { opacity: 0; transform: scale(0.97); }
.list-leave-active { position: absolute; visibility: hidden; }

@media (max-width: 1024px) {
  .projects__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (max-width: 640px) {
  .projects__grid { grid-template-columns: 1fr; }
  .projects__filters { width: 100%; overflow-x: auto; }
  .projects__filter { flex: 1; justify-content: center; }
}
</style>
