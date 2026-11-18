<template>
  <section id="about" class="section section--alt">
    <div class="container about">
      <div class="about__intro">
        <SectionHeader
          eyebrow="About"
          title="Engineering-minded, design-literate."
        />
        <div v-reveal class="about__copy">
          <p>
            I'm a frontend developer based in {{ profile.location }}. Over the past few years I've
            partnered with startups, agencies and independent clients to design and ship products
            end-to-end — from the first Figma frame to production deployment.
          </p>
          <p>
            My focus is the layer users actually touch: component architecture, state management,
            responsive layouts and the small interaction details that make software feel trustworthy.
            I write typed, tested, maintainable code and communicate clearly along the way.
          </p>
          <a href="#contact" class="link">
            Start a conversation
            <AppIcon name="arrow-right" :size="16" />
          </a>
        </div>
      </div>

      <ul class="about__principles">
        <li v-for="(item, i) in principleItems" :key="item.title" v-reveal="i * 80" class="about__principle">
          <span class="about__icon"><AppIcon :name="item.icon" :size="18" /></span>
          <div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.text }}</p>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
import { principles, profile } from '#shared/portfolio'

const icons = ['layers', 'gauge', 'accessibility']
const principleItems = principles.map((p, i) => ({ ...p, icon: icons[i % icons.length]! }))
</script>

<style scoped>
.about {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
  gap: 80px;
  align-items: start;
}

.about__intro :deep(.section-header) { margin-bottom: 24px; }

.about__copy {
  display: flex;
  flex-direction: column;
  gap: 18px;
  font-size: 16.5px;
  line-height: 1.75;
}

.about__copy .link { margin-top: 6px; }

.about__principles {
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: var(--surface);
  box-shadow: var(--shadow-sm);
}

.about__principle {
  display: flex;
  gap: 16px;
  padding: 24px;
}

.about__principle + .about__principle { border-top: 1px solid var(--border); }

.about__icon {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  background: var(--bg-subtle);
  color: var(--accent-text);
  flex-shrink: 0;
}

.about__principle h3 { font-size: 16px; margin-bottom: 4px; }
.about__principle p { font-size: 15px; line-height: 1.6; }

@media (max-width: 900px) {
  .about { grid-template-columns: 1fr; gap: 40px; }
}
</style>
