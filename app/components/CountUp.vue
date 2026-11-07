<template>
  <span ref="el">{{ display }}</span>
</template>

<script setup lang="ts">
/**
 * Counts a number up from 0 when it scrolls into view, e.g. "50+" → 0, 1, 2 … 50+.
 * Renders the final value on the server so it's correct without JavaScript.
 */
const props = withDefaults(defineProps<{ value: string; duration?: number }>(), { duration: 1600 })

const match = props.value.match(/^(\D*)(\d+)(.*)$/)
const display = ref(props.value)
const el = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null
let frame = 0

onMounted(() => {
  if (!match || !el.value || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const [, prefix, num, suffix] = match
  const target = Number(num)
  display.value = `${prefix}0${suffix}`

  const run = () => {
    const start = performance.now()
    const step = (now: number) => {
      const t = Math.min((now - start) / props.duration, 1)
      const eased = 1 - Math.pow(1 - t, 3) // easeOutCubic
      display.value = `${prefix}${Math.round(target * eased)}${suffix}`
      if (t < 1) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
  }

  observer = new IntersectionObserver(([entry]) => {
    if (entry?.isIntersecting) { run(); observer?.disconnect() }
  }, { threshold: 0.5 })
  observer.observe(el.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  cancelAnimationFrame(frame)
})
</script>
