<template>
  <div v-if="enabled" ref="el" class="cursor-glow" :class="{ 'is-on': visible }" aria-hidden="true"></div>
</template>

<script setup lang="ts">
/** Soft accent-coloured light that smoothly follows the mouse (desktop only). */
const el = ref<HTMLElement | null>(null)
const enabled = ref(false)
const visible = ref(false)

let x = 0, y = 0, cx = 0, cy = 0, frame = 0

const loop = () => {
  cx += (x - cx) * 0.12 // ease toward the pointer
  cy += (y - cy) * 0.12
  if (el.value) el.value.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`
  frame = requestAnimationFrame(loop)
}

const onMove = (e: PointerEvent) => {
  x = e.clientX
  y = e.clientY
  if (!visible.value) { cx = x; cy = y; visible.value = true }
}
const onLeave = () => { visible.value = false }

onMounted(() => {
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!fine || reduced) return
  enabled.value = true
  window.addEventListener('pointermove', onMove, { passive: true })
  document.documentElement.addEventListener('pointerleave', onLeave)
  frame = requestAnimationFrame(loop)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(frame)
  window.removeEventListener('pointermove', onMove)
  document.documentElement.removeEventListener('pointerleave', onLeave)
})
</script>

<style scoped>
.cursor-glow {
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1; /* behind page content */
  width: 520px;
  height: 520px;
  border-radius: 50%;
  pointer-events: none;
  background: radial-gradient(circle, color-mix(in srgb, var(--accent) 10%, transparent), transparent 65%);
  opacity: 0;
  transition: opacity 400ms ease;
}

.cursor-glow.is-on { opacity: 1; }
</style>
