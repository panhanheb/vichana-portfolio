/**
 * v-reveal — fades an element up when it scrolls into view.
 *
 *   v-reveal            fade up
 *   v-reveal="120"      with a delay in ms (use for staggering lists)
 *
 * Content stays visible without JS (SSR) and for elements already on screen,
 * and the effect is disabled under prefers-reduced-motion (see main.css).
 */
const DURATION = 600 // keep in sync with .reveal in main.css

export default defineNuxtPlugin((nuxtApp) => {
  let observer: IntersectionObserver | null = null

  const finish = (el: HTMLElement) => {
    el.classList.add('is-visible')
    observer?.unobserve(el)
    // When done, drop the reveal styles so the element's own transitions (hover effects) work normally.
    const delay = parseInt(el.style.transitionDelay) || 0
    setTimeout(() => {
      el.classList.remove('reveal', 'is-visible')
      el.style.transitionDelay = ''
    }, DURATION + delay + 50)
  }

  const getObserver = () => {
    observer ??= new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && finish(e.target as HTMLElement)),
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )
    return observer
  }

  nuxtApp.vueApp.directive<HTMLElement, number | undefined>('reveal', {
    getSSRProps: () => ({}),
    mounted(el, binding) {
      if (el.getBoundingClientRect().top < window.innerHeight) return // already on screen
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      el.classList.add('reveal')
      if (binding.value) el.style.transitionDelay = `${binding.value}ms`
      getObserver().observe(el)
    },
    beforeUnmount(el) {
      observer?.unobserve(el)
    },
  })
})
