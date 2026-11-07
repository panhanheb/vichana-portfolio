/**
 * v-spotlight — a soft glow that follows the cursor across a card, with a small hover lift.
 * Flat (no 3D). Only runs on devices with a mouse and when reduced motion is off.
 */
type SpotlightEl = HTMLElement & { __spotlight?: { move: (e: PointerEvent) => void; leave: () => void } }

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive<SpotlightEl>('spotlight', {
    getSSRProps: () => ({}),
    mounted(el) {
      const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (!fine || reduced) return

      let frame = 0
      el.classList.add('spotlight')

      const move = (e: PointerEvent) => {
        cancelAnimationFrame(frame)
        frame = requestAnimationFrame(() => {
          const r = el.getBoundingClientRect()
          el.style.setProperty('--mx', `${e.clientX - r.left}px`)
          el.style.setProperty('--my', `${e.clientY - r.top}px`)
          el.classList.add('spotlight--active')
        })
      }

      const leave = () => {
        cancelAnimationFrame(frame)
        el.classList.remove('spotlight--active')
      }

      el.addEventListener('pointermove', move)
      el.addEventListener('pointerleave', leave)
      el.__spotlight = { move, leave }
    },
    beforeUnmount(el) {
      if (!el.__spotlight) return
      el.removeEventListener('pointermove', el.__spotlight.move)
      el.removeEventListener('pointerleave', el.__spotlight.leave)
    },
  })
})
