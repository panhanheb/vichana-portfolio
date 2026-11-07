<template>
  <div v-if="enabled" ref="layer" class="flower-trail" aria-hidden="true"></div>
</template>

<script setup lang="ts">
/**
 * Bursts of Rumduol (three-petal) flowers, fired on demand by other components
 * (e.g. hovering the hero profile) with
 *      window.dispatchEvent(new CustomEvent('flower-burst', { detail: { x, y, count?, spread? } }))
 * Desktop (mouse) only; disabled under prefers-reduced-motion.
 * The flower image is the shared --rumduol variable in main.css.
 */

interface FlowerBurstDetail { x: number; y: number; count?: number; spread?: number }

const MAX_ALIVE = 48

const layer = ref<HTMLElement | null>(null)
const enabled = ref(false)

let alive = 0

const rand = (min: number, max: number) => min + Math.random() * (max - min)

const spawn = (x: number, y: number, dx: number, dy: number, duration: number, size: number) => {
  if (!layer.value || alive >= MAX_ALIVE) return
  const el = document.createElement('span')
  el.className = 'flower-trail__item'
  el.style.cssText = `left:${x}px;top:${y}px;width:${size}px;height:${size}px`
  layer.value.appendChild(el)
  alive++

  const spin = rand(-260, 260)
  el.animate(
    [
      { transform: 'translate(-50%, -50%) scale(0.2) rotate(0deg)', opacity: 0 },
      { transform: `translate(calc(-50% + ${dx * 0.25}px), calc(-50% + ${dy * 0.25}px)) scale(1) rotate(${spin * 0.3}deg)`, opacity: 1, offset: 0.2 },
      { transform: `translate(calc(-50% + ${dx * 0.7}px), calc(-50% + ${dy * 0.7}px)) scale(0.95) rotate(${spin * 0.7}deg)`, opacity: 0.9, offset: 0.65 },
      { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0.7) rotate(${spin}deg)`, opacity: 0 },
    ],
    { duration, easing: 'cubic-bezier(0.2, 0.7, 0.3, 1)' },
  ).onfinish = () => { el.remove(); alive-- }
}

const burst = (x: number, y: number, count = 9, spread = 1) => {
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + rand(-0.2, 0.2)
    const dist = rand(80, 140) * spread
    spawn(x, y, Math.cos(angle) * dist, Math.sin(angle) * dist, rand(800, 1100) * Math.sqrt(spread), rand(20, 30))
  }
}

const onBurst = (e: Event) => {
  const d = (e as CustomEvent<FlowerBurstDetail>).detail
  if (d) burst(d.x, d.y, d.count, d.spread)
}

onMounted(() => {
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!fine || reduced) return
  enabled.value = true
  window.addEventListener('flower-burst', onBurst)
})

onBeforeUnmount(() => {
  window.removeEventListener('flower-burst', onBurst)
})
</script>

<style>
/* Not scoped: items are created with JS */
.flower-trail {
  position: fixed;
  inset: 0;
  z-index: 1200; /* above content and navbar, below nothing interactive (pointer-events: none) */
  pointer-events: none;
  overflow: hidden;
}

.flower-trail__item {
  position: absolute;
  background: var(--rumduol) center / contain no-repeat;
  filter: drop-shadow(0 0 6px rgba(246, 220, 156, 0.7)) drop-shadow(0 2px 3px rgba(40, 12, 6, 0.5));
  will-change: transform, opacity;
}
</style>
