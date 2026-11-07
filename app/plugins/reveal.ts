/**
 * v-reveal — fades an element in when it scrolls into view.
 * Content is fully visible without JS (SSR) and for elements already on screen,
 * and the effect is disabled under prefers-reduced-motion (see main.css).
 */
export default defineNuxtPlugin((nuxtApp) => {
  let observer: IntersectionObserver | null = null

  const getObserver = () => {
    if (!observer) {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible')
              observer!.unobserve(entry.target)
            }
          }
        },
        { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
      )
    }
    return observer
  }

  nuxtApp.vueApp.directive<HTMLElement, number | undefined>('reveal', {
    getSSRProps: () => ({}),
    mounted(el, binding) {
      const rect = el.getBoundingClientRect()
      if (rect.top < window.innerHeight) return // already visible: don't hide it
      el.classList.add('reveal')
      if (binding.value) el.style.transitionDelay = `${binding.value}ms`
      getObserver().observe(el)
    },
    beforeUnmount(el) {
      observer?.unobserve(el)
    },
  })
})
