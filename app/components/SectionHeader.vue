<template>
  <header v-reveal class="section-header" :class="{ 'section-header--center': center }">
    <span class="eyebrow"><KhmerFlower :size="16" />{{ eyebrow }}</span>
    <h2 class="section-header__title">{{ title }}</h2>
    <p v-if="description" class="section-header__desc">{{ description }}</p>
  </header>
</template>

<script setup lang="ts">
defineProps<{ eyebrow: string; title: string; description?: string; center?: boolean }>()
</script>

<style scoped>
.section-header {
  max-width: 640px;
  margin-bottom: 56px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-header--center {
  margin-inline: auto;
  text-align: center;
  align-items: center;
}

.section-header__title {
  font-size: clamp(28px, 4vw, 40px);
}

.section-header__desc {
  font-size: 17px;
  line-height: 1.7;
}

@media (max-width: 768px) {
  .section-header { margin-bottom: 40px; }
}
</style>
