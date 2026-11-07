<template>
  <div class="scroll-progress" aria-hidden="true">
    <div class="scroll-progress__bar" :style="{ transform: `scaleX(${progress})` }"></div>
  </div>
</template>

<script setup lang="ts">
/** Thin bar at the top of the page showing how far the visitor has scrolled. */
const progress = ref(0)
let frame = 0

const update = () => {
  frame = 0
  const max = document.documentElement.scrollHeight - window.innerHeight
  progress.value = max > 0 ? Math.min(window.scrollY / max, 1) : 0
}
const onScroll = () => { if (!frame) frame = requestAnimationFrame(update) }

onMounted(() => {
  update()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(frame)
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
})
</script>

<style scoped>
.scroll-progress {
  position: fixed;
  inset: 0 0 auto 0;
  height: 3px;
  z-index: 1100;
  pointer-events: none;
}

.scroll-progress__bar {
  height: 100%;
  transform-origin: 0 50%;
  background: linear-gradient(90deg, var(--accent), var(--accent-2));
  box-shadow: 0 0 10px color-mix(in srgb, var(--accent) 60%, transparent);
}
</style>
