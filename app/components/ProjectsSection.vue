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
        <li v-for="(project, i) in filtered" :key="project.id" v-reveal="(i % 3) * 80" class="card card--interactive project">
          <div class="project__cover" :data-category="project.category" aria-hidden="true">
            <span class="project__monogram">{{ monogram(project.title) }}</span>
            <span class="project__year">{{ project.year }}</span>
          </div>

          <div class="project__body">
            <p class="project__category">{{ project.category }}</p>
            <h3 class="project__title">{{ project.title }}</h3>
            <p class="project__summary">{{ project.summary }}</p>

            <dl class="project__role">
              <dt>Role</dt>
              <dd>{{ project.role }}</dd>
            </dl>

            <ul class="project__stack" aria-label="Technologies">
              <li v-for="tech in project.stack" :key="tech" class="tag">{{ tech }}</li>
            </ul>

            <div class="project__links">
              <a v-if="project.demo" :href="project.demo" target="_blank" rel="noopener noreferrer" class="link">
                Live demo <AppIcon name="arrow-up-right" :size="15" />
              </a>
              <a v-if="project.repo" :href="project.repo" target="_blank" rel="noopener noreferrer" class="link link--muted">
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
  gap: 2px;
  padding: 3px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
  box-shadow: var(--shadow-sm);
}

.projects__filter {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 32px;
  padding: 0 12px;
  border: 0;
  border-radius: 7px;
  background: transparent;
  color: var(--text-secondary);
  font-size: 13.5px;
  font-weight: 500;
  white-space: nowrap;
  transition: background var(--dur) var(--ease), color var(--dur) var(--ease);
}

.projects__filter:hover { color: var(--text); }
.projects__filter.is-active { background: var(--text); color: var(--bg); }

.projects__count {
  font-family: var(--font-mono);
  font-size: 11px;
  opacity: 0.65;
}

.projects__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}

.project { display: flex; flex-direction: column; overflow: hidden; }

.project__cover {
  --tint: var(--accent);
  position: relative;
  aspect-ratio: 16 / 9;
  display: grid;
  place-items: center;
  border-bottom: 1px solid var(--border);
  background:
    radial-gradient(70% 90% at 50% 110%, color-mix(in srgb, var(--tint) 22%, transparent), transparent 70%),
    linear-gradient(var(--grid-line) 1px, transparent 1px) 0 0 / 24px 24px,
    linear-gradient(90deg, var(--grid-line) 1px, transparent 1px) 0 0 / 24px 24px,
    var(--bg-subtle);
}

.project__cover[data-category='Frontend'] { --tint: #2563eb; }
.project__cover[data-category='Full-stack'] { --tint: #0d9488; }
.project__cover[data-category='Design'] { --tint: #7c3aed; }

.project__monogram {
  display: grid;
  place-items: center;
  width: 60px;
  height: 60px;
  border-radius: 14px;
  background: var(--surface);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-md);
  font-size: 19px;
  font-weight: 650;
  letter-spacing: -0.02em;
  color: var(--text);
  transition: transform 260ms var(--ease);
}

.project:hover .project__monogram { transform: translateY(-3px); }

.project__year {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 2px 8px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--surface);
  font-family: var(--font-mono);
  font-size: 11.5px;
  color: var(--text-muted);
}

.project__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 22px 24px 24px;
}

.project__category {
  font-size: 12.5px;
  font-weight: 500;
  color: var(--accent-text);
}

.project__title { font-size: 18px; letter-spacing: -0.015em; }
.project__summary { font-size: 14.5px; line-height: 1.65; }

.project__role { display: flex; gap: 6px; font-size: 13.5px; margin-top: 2px; }
.project__role dt { color: var(--text-muted); }
.project__role dd { color: var(--text-secondary); }

.project__stack { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }

.project__links {
  display: flex;
  gap: 20px;
  margin-top: auto;
  padding-top: 18px;
}

.project__stack + .project__links { margin-top: 18px; border-top: 1px solid var(--border); }
.link--muted { color: var(--text-secondary); }

/* Filter animation */
.list-move, .list-enter-active, .list-leave-active { transition: all 280ms var(--ease); }
.list-enter-from, .list-leave-to { opacity: 0; transform: scale(0.98); }
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
