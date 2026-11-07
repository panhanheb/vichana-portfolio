<template>
  <canvas v-if="enabled" ref="canvas" class="neon-cursor" aria-hidden="true"></canvas>
</template>

<script setup lang="ts">
/**
 * Neon cursor trail — a glowing gold ribbon that follows the mouse.
 * Own canvas-2D implementation (no three.js). Draws only while there is a trail to show,
 * so it costs nothing when the mouse is still. Mouse devices only; off under reduced motion.
 */
interface Point { x: number; y: number; t: number }

const TRAIL_MS = 420 // how long a point stays in the trail
const HEAD_WIDTH = 7 // core width at the head (px)
const FOLLOW = 0.35 // spring factor: how quickly the head catches the pointer

const canvas = ref<HTMLCanvasElement | null>(null)
const enabled = ref(false)

let ctx: CanvasRenderingContext2D | null = null
let dpr = 1
let frame = 0
let running = false
let tx = 0, ty = 0 // pointer target
let hx = 0, hy = 0 // smoothed head
let vx = 0, vy = 0 // head velocity
let hasPointer = false
const points: Point[] = []

const PALETTES = {
  dark: { glow: 'rgba(255, 150, 50, 0.16)', mid: 'rgba(246, 194, 91, 0.55)', core: 'rgba(255, 246, 220, 1)', blend: 'lighter' as GlobalCompositeOperation },
  light: { glow: 'rgba(201, 120, 30, 0.12)', mid: 'rgba(176, 112, 24, 0.45)', core: 'rgba(122, 74, 16, 0.95)', blend: 'source-over' as GlobalCompositeOperation },
}

const resize = () => {
  const c = canvas.value
  if (!c) return
  dpr = Math.min(window.devicePixelRatio || 1, 2)
  c.width = Math.round(window.innerWidth * dpr)
  c.height = Math.round(window.innerHeight * dpr)
  ctx = c.getContext('2d')
  ctx?.setTransform(dpr, 0, 0, dpr, 0, 0)
}

/** Draws the trail as tapered segments along a smoothed curve, in three passes (glow → mid → core). */
const draw = (now: number) => {
  if (!ctx) return
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
  if (points.length < 2) return

  const theme = document.documentElement.dataset.theme === 'light' ? PALETTES.light : PALETTES.dark
  ctx.globalCompositeOperation = theme.blend
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  const passes: [string, number][] = [[theme.glow, 4.2], [theme.mid, 2], [theme.core, 1]]
  for (const [color, scale] of passes) {
    ctx.strokeStyle = color
    for (let i = 1; i < points.length; i++) {
      const p0 = points[i - 1]!
      const p1 = points[i]!
      const age = (now - p1.t) / TRAIL_MS // 0 at head → 1 at tail
      const along = i / (points.length - 1) // 0 at tail → 1 at head
      const w = HEAD_WIDTH * scale * Math.max(0.08, along * (1 - age * 0.6))
      if (w < 0.3) continue
      // Curve through midpoints for a smooth ribbon
      const prev = points[i - 2] ?? p0
      ctx.lineWidth = w
      ctx.beginPath()
      ctx.moveTo((prev.x + p0.x) / 2, (prev.y + p0.y) / 2)
      ctx.quadraticCurveTo(p0.x, p0.y, (p0.x + p1.x) / 2, (p0.y + p1.y) / 2)
      ctx.stroke()
    }
  }
  ctx.globalCompositeOperation = 'source-over'
}

const tick = (now: number) => {
  // Spring the head toward the pointer for a fluid, slightly lagging ribbon.
  vx = (vx + (tx - hx) * FOLLOW) * 0.55
  vy = (vy + (ty - hy) * FOLLOW) * 0.55
  hx += vx
  hy += vy

  const last = points[points.length - 1]
  if (hasPointer && (!last || Math.hypot(hx - last.x, hy - last.y) > 0.8)) points.push({ x: hx, y: hy, t: now })

  while (points.length && now - points[0]!.t > TRAIL_MS) points.shift()

  draw(now)

  if (points.length || Math.hypot(tx - hx, ty - hy) > 0.5) {
    frame = requestAnimationFrame(tick)
  } else {
    running = false // idle: stop the loop until the mouse moves again
  }
}

const start = () => {
  if (running) return
  running = true
  frame = requestAnimationFrame(tick)
}

const onMove = (e: PointerEvent) => {
  if (!hasPointer) { hx = tx = e.clientX; hy = ty = e.clientY; vx = vy = 0 }
  tx = e.clientX
  ty = e.clientY
  hasPointer = true
  start()
}

const onLeave = () => { hasPointer = false }

onMounted(async () => {
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!fine || reduced) return
  enabled.value = true
  await nextTick()
  resize()
  window.addEventListener('resize', resize)
  window.addEventListener('pointermove', onMove, { passive: true })
  document.documentElement.addEventListener('pointerleave', onLeave)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(frame)
  window.removeEventListener('resize', resize)
  window.removeEventListener('pointermove', onMove)
  document.documentElement.removeEventListener('pointerleave', onLeave)
})
</script>

<style scoped>
.neon-cursor {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1150; /* above content & navbar, below the flower trail */
  pointer-events: none;
}
</style>
